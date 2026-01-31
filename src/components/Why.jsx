import React from 'react'

export default function Why(){
  return (
    <section id="why" className="why">
      <div className="container why-inner">
        <div className="why-media">
          <img src="/src/assets/bottle.svg" className="bottle" alt="Silhouette bottle of Mua'dz Parfume"/>
        </div>
        <div className="why-copy">
          <h2>Kenapa Mua'dz Parfume?</h2>
          <p className="lead">Setiap botol Mua'dz adalah komposisi karakter — bukan sekadar aroma. Kami meramu bahan premium untuk menciptakan wewangian yang berbicara tentang siapa Anda.</p>

          <ul>
            <li><strong>Karakter Unik</strong> — Aroma signature yang berbeda dari parfum massa, dibuat untuk meninggalkan jejak ingatan.</li>
            <li><strong>Tahan Lama</strong> — Formulasi premium yang menjaga aroma tetap hadir sepanjang hari.</li>
            <li><strong>Eksklusif & Berkelas</strong> — Visual dan kemasan yang mewakili kelas yang Anda pilih.</li>
          </ul>

          <p>Bayangkan aroma yang membuka percakapan — itulah tujuan kami. Pilih karakter, klik tombol, dan biarkan orang lain bertanya apa yang Anda pakai.</p>

          <a className="cta" href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent("Saya tertarik memesan Mua'dz Parfume — bantu saya memilih karakter")}`} target="_blank" rel="noreferrer">Temukan Karaktermu</a>
        </div>
      </div>
    </section>
  )
}
