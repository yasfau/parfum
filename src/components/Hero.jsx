import React from 'react'

export default function Hero(){
  return (
    <section id="home" className="hero">
      <div className="container">
        <h1 className="hero-title">
          <span className="title-text">Mua'dz Parfume</span>
          <span className="title-deco" aria-hidden="true">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="sparkle" aria-hidden="true">
              <g fill="none" fillRule="evenodd">
                <path d="M12 2l1.8 3.6L17 7l-3 .6L12 11l-2-3.4L7 7l3.2-1.4L12 2z" fill="#D4AF37" opacity="0.98"/>
                <circle cx="19" cy="5" r="1.6" fill="#F8E9B6" opacity="0.95"/>
              </g>
            </svg>
          </span>
        </h1>
        <p>Parfum berkarakter — aroma unik yang menegaskan kepribadian Anda.</p>
        <a className="cta" href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent("Saya tertarik membeli Mua'dz Parfume")}`} target="_blank" rel="noreferrer">Beli Sekarang</a>
      </div>
    </section>
  )
}
