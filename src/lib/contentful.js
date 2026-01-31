import { createClient } from 'contentful'

function makeClient(){
  const space = import.meta.env.VITE_CONTENTFUL_SPACE_ID
  const token = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN
  if(!space || !token){
    // Avoid throwing during module initialization; caller should handle empty result
    console.warn('Contentful credentials missing. Skipping fetch from Contentful.')
    return null
  }
  return createClient({ space, accessToken: token })
}

export async function getParfumes(){
  const client = makeClient()
  if(!client) return []
  const entries = await client.getEntries({
    content_type: import.meta.env.VITE_CONTENTFUL_CONTENT_TYPE,
    select: 'fields.name,fields.description,fields.price,fields.category,fields.image,fields.featured',
  })
  return entries.items || []
}
