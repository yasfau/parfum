import { createClient } from 'contentful'
import fs from 'fs'
import path from 'path'

// Load .env file from project root if env vars are missing
const dotenvPath = path.resolve(process.cwd(), '.env')
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

const client = createClient({
  space: process.env.VITE_CONTENTFUL_SPACE_ID,
  accessToken: process.env.VITE_CONTENTFUL_ACCESS_TOKEN,
})

try{
  const res = await client.getEntries({
    content_type: process.env.VITE_CONTENTFUL_CONTENT_TYPE,
    select: 'fields.name,fields.description,fields.price,fields.category,fields.image,fields.featured',
  })
  console.log('Total items:', res.total)
  res.items.forEach((it, idx) => {
    console.log(`--- Item ${idx + 1} ---`)
    const f = it.fields || {}
    console.log('name:', f.name)
    console.log('price:', f.price)
    console.log('category:', f.category)
    console.log('featured:', f.featured)
    // safe image detection
    let img = 'no image'
    if(f.image){
      if(f.image.fields && f.image.fields.file && f.image.fields.file.url) img = `https:${f.image.fields.file.url}`
      else if(f.image.sys && f.image.sys.type === 'Asset' && f.image.url) img = `https:${f.image.url}`
      else if(f.image.url) img = `https:${f.image.url}`
      else img = JSON.stringify(f.image).slice(0,200)
    }
    console.log('image:', img)

    // description type and preview
    const desc = f.description
    console.log('description type:', typeof desc)
    if(desc && typeof desc === 'object'){
      console.log('description preview:', JSON.stringify(desc).slice(0,300))
    } else {
      console.log('description preview:', String(desc))
    }
  })
}catch(err){
  console.error('ERROR', err.message || err)
  process.exit(1)
}
