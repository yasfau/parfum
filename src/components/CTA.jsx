import React from 'react'

export default function CTA(){
  const wa = import.meta.env.VITE_WHATSAPP_NUMBER || ''
  const message = encodeURIComponent("Saya ingin konsultasi memilih parfum Mua'dz — bisa bantu?")

  return (
    <section id="contact" className="contact-cta">
      <div className="container contact-inner">
        <div className="contact-media" aria-hidden>
          <img src="/src/assets/whatsapp-chat.svg" alt="Chat illustration" />
        </div>
        <div className="contact-copy">
          <h2>Butuh Saran Wewangian?</h2>
          <p className="lead">Konsultasi singkat gratis — beri tahu mood atau karakter yang Anda inginkan, kami rekomendasikan parfum yang paling cocok untuk Anda.</p>

          <div className="contact-actions">
            <a className="cta" href={`https://wa.me/${wa}?text=${message}`} target="_blank" rel="noreferrer">Konsultasi via WhatsApp</a>
            <a className="secondary" href="#products">Lihat Produk</a>
          </div>

          <p className="small">Atau tinggalkan pesan singkat — tim kami akan membalas secepatnya. Nomor: <strong>{wa}</strong></p>
        </div>
      </div>
    </section>
  )
}
