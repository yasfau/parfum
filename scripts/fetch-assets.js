import { createClient } from 'contentful'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// helper to load .env like earlier scripts
const projectRoot = process.cwd()
const dotenvPath = path.resolve(projectRoot, '.env')
if (fs.existsSync(dotenvPath)){
  const raw = fs.readFileSync(dotenvPath, 'utf8')
  raw.split(/\r?\n/).forEach(line => {
    const m = line.match(/^\s*([^=]+)=(.*)$/)
    if(m){
      const k = m[1].trim();
      const v = m[2].trim();
      if(!process.env[k]) process.env[k]=v
    }
  })
}

const SPACE = process.env.VITE_CONTENTFUL_SPACE_ID
const TOKEN = process.env.VITE_CONTENTFUL_ACCESS_TOKEN
const CONTENT_TYPE = process.env.VITE_CONTENTFUL_CONTENT_TYPE || 'parfumes'

if(!SPACE || !TOKEN){
  console.error('Contentful credentials missing in environment. Please set VITE_CONTENTFUL_SPACE_ID and VITE_CONTENTFUL_ACCESS_TOKEN')
  process.exit(1)
}

const client = createClient({ space: SPACE, accessToken: TOKEN })

async function downloadAndWrite(url, baseName, outDir){
  const res = await fetch(url)
  if(!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  const contentType = (res.headers.get('content-type') || '').toLowerCase()
  const buffer = await res.arrayBuffer()

  // determine extension from content-type or from url path
  let ext = ''
  if(contentType.includes('svg')) ext = '.svg'
  else if(contentType.includes('png')) ext = '.png'
  else if(contentType.includes('jpeg') || contentType.includes('jpg')) ext = '.jpg'
  else if(contentType.includes('webp')) ext = '.webp'
  else if(contentType.includes('gif')) ext = '.gif'

  if(!ext){
    try{
      const pathname = new URL(url).pathname
      ext = path.extname(pathname).split('?')[0]
    }catch(e){
      ext = ''
    }
  }
  if(!ext) ext = '.jpg'

  const filename = `${baseName}${ext}`
  const dest = path.join(outDir, filename)
  fs.writeFileSync(dest, Buffer.from(buffer))
  return filename
}

async function run(){
  const outDir = path.resolve(projectRoot, 'public', 'products')
  if(!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

  // placeholder svg
  const placeholder = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="#222" rx="12" /><text x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" fill="#bbb" font-size="22">No Image</text></svg>`
  fs.writeFileSync(path.join(outDir, 'placeholder.svg'), placeholder)

  const manifest = {}

  const res = await client.getEntries({ content_type: CONTENT_TYPE, select: 'sys.id,fields.image' })
  console.log('Found', res.total, 'entries')
  for(const item of res.items){
    const id = item.sys && item.sys.id ? item.sys.id : null
    if(!id) continue
    const f = item.fields || {}
    if(!f.image){
      console.log(`No image for ${id}, skipping`)
      continue
    }

    // get url robustly
    let url = null
    if(f.image && typeof f.image === 'object'){
      if(f.image.fields && f.image.fields.file && f.image.fields.file.url) url = f.image.fields.file.url
      else if(f.image.url) url = f.image.url
      else if(f.image.sys && f.image.sys.type === 'Asset' && f.image.fields && f.image.fields.file && f.image.fields.file.url) url = f.image.fields.file.url
    } else if(f.image && typeof f.image === 'string'){
      url = f.image
    }

    if(!url){
      console.log(`Could not find usable url for ${id}`)
      continue
    }

    // normalize patterns like //host, plain http(s), or relative paths; strip surrounding quotes
    url = String(url).trim().replace(/^['"]|['"]$/g, '')
    if(url.startsWith('//')) url = 'https:' + url
    else if(url.startsWith('/')) url = 'https://images.ctfassets.net' + url
    else if(!/^https?:\/\//i.test(url)) url = 'https://' + url

    try{
      console.log(`Downloading ${url} for ${id}`)
      const filename = await downloadAndWrite(url, id, outDir)
      manifest[id] = `/products/${filename}`
    }catch(err){
      console.error('Failed to download', url, err.message)
    }
  }

  // write src/data/productImages.js for runtime import
  const imagesModulePath = path.resolve(projectRoot, 'src', 'data')
  if(!fs.existsSync(imagesModulePath)) fs.mkdirSync(imagesModulePath, { recursive: true })
  const exportContent = 'const productImages = ' + JSON.stringify(manifest, null, 2) + '\n\nexport default productImages\n'
  fs.writeFileSync(path.join(imagesModulePath, 'productImages.js'), exportContent)

  console.log('Done. Manifest entries:', Object.keys(manifest).length)
}

run().catch(err => { console.error(err); process.exit(1) })
