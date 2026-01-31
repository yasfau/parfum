import React, { useEffect, useState } from 'react'
import { getParfumes } from '../lib/contentful'
import productImages from '../data/productImages'

export default function ProductList(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(()=>{
    let mounted = true
    getParfumes().then(res => {
      if(!mounted) return

      function richTextToPlain(node){
        if(node == null) return ''
        if(typeof node === 'string') return node
        if(Array.isArray(node)) return node.map(richTextToPlain).join(' ')
        if(node.nodeType === 'text') return node.value || ''
        if(node.content && Array.isArray(node.content)) return node.content.map(richTextToPlain).filter(Boolean).join(' ')
        return ''
      }

      const mapped = res.map(item => {
        const f = item.fields || {}
        let img = null

        function normalizeImageUrl(u){
          if(!u) return null
          let s = String(u).trim().replace(/^['\"]|['\"]$/g, '')
          if(s.startsWith('//')) return 'https:' + s
          if(s.startsWith('/')){
            if(s.startsWith('/images') || s.startsWith('/assets') || s.includes('ctfassets')) return 'https://images.ctfassets.net' + s
            return window.location.origin + s
          }
          if(/^https?:\/\//i.test(s)) return s
          return 'https://' + s
        }

        if(f.image){
          if(f.image.fields && f.image.fields.file && f.image.fields.file.url){
            img = normalizeImageUrl(f.image.fields.file.url)
          } else if(f.image.sys && f.image.sys.type === 'Asset' && f.image.url){
            img = normalizeImageUrl(f.image.url)
          } else if(typeof f.image === 'string'){
            img = normalizeImageUrl(f.image)
          }
        }
        const featured = f.featured === true || String(f.featured).toLowerCase() === 'yes'
        let desc = f.description || ''
        if(desc && typeof desc === 'object') desc = richTextToPlain(desc)

        const mappedLocal = (item.sys && item.sys.id && productImages[item.sys.id]) ? productImages[item.sys.id] : null
        const imageSrc = mappedLocal || img || '/products/placeholder.svg'
        const imageSourceType = mappedLocal ? 'local' : (img ? 'remote' : 'placeholder')

        return {
          id: item.sys && item.sys.id,
          name: f.name || '—',
          description: desc || '',
          price: f.price || '',
          category: f.category || '',
          featured,
          imageSrc,
          imageSourceType,
          mappedLocal,
        }
      })

      mapped.sort((a,b)=> (b.featured - a.featured) || String(a.name).localeCompare(b.name))

      setItems(mapped)
    }).catch(err => {
      console.error('Error fetching parfumes:', err)
    }).finally(()=> setLoading(false))
    return ()=> mounted=false
  },[])

  function formatPrice(v){
    if(v === undefined || v === null || v === '') return '—'
    const n = Number(v)
    if(Number.isNaN(n)) return String(v)
    return n.toLocaleString('id-ID')
  }

  return (
    <section id="products" className="product-list">
      <div className="container">
        <h2>Product List</h2>

        {loading && (
          <div className="grid">
            {Array.from({length:6}).map((_,i)=> (
              <div className="card skeleton" key={i} aria-hidden>
                <div className="media skeleton-rect"></div>
                <div className="card-body">
                  <div className="s-line" style={{width:'60%'}}></div>
                  <div className="s-line" style={{width:'80%',height:12,marginTop:8}}></div>
                  <div className="meta" style={{opacity:.6,marginTop:12}}>
                    <div className="s-badge" style={{width:60,height:18}}></div>
                    <div className="s-badge" style={{width:90,height:18}}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div className="grid">
            {items.map((p, i)=> (
              <article className={`card ${p.featured ? 'featured' : ''}`} key={p.id || i}>
                <div className="media">
                  <img loading="lazy" decoding="async" src={p.imageSrc} alt={p.name} onError={(e)=>{ if(e.currentTarget.src !== '/products/placeholder.svg') e.currentTarget.src = '/products/placeholder.svg' }} />
                </div>

                <div className="card-body">
                  <div className="head-row">
                    <h3>{p.name}</h3>
                    {p.featured && <span className="badge-featured" aria-hidden>Featured</span>}
                  </div>

                  <p className="desc">{p.description}</p>

                  <div className="meta">
                    <span className="price">Rp {formatPrice(p.price)}</span>
                    <span className="category">{p.category}</span>
                  </div>

                  <div className="actions">
                    <a className="btn-outline" href={`#`} onClick={(e)=>{e.preventDefault(); setSelected(p)}} aria-label={`Quick view ${p.name}`}>Quick View</a>
                    <a className="buy" href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Saya tertarik dengan produk ${p.name}`)}`} target="_blank" rel="noreferrer">Beli</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {selected && (
          <div className="modal" role="dialog" aria-modal="true">
            <div className="modal-content">
              <button className="modal-close" onClick={()=>setSelected(null)} aria-label="Close">×</button>
              <div className="modal-grid">
                <div className="modal-media"><img src={selected.imageSrc} alt={selected.name} /></div>
                <div className="modal-body">
                  <h3>{selected.name}</h3>
                  <p className="lead">Rp {formatPrice(selected.price)}</p>
                  <p>{selected.description}</p>
                  <a className="cta" href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Saya ingin memesan ${selected.name}`)}`} target="_blank" rel="noreferrer">Pesan via WhatsApp</a>
                </div>
              </div>
            </div>
            <div className="modal-backdrop" onClick={()=>setSelected(null)}></div>
          </div>
        )}

      </div>
    </section>
  )
}
