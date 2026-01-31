import React, { useState } from 'react'

export default function Nav(){
  const [open, setOpen] = useState(false)
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container nav-inner">
        <a className="brand" href="#home">Mua'dz</a>

        <button className={`nav-toggle ${open ? 'open' : ''}`} aria-controls="site-nav" aria-expanded={open} onClick={()=>setOpen(v=>!v)} aria-label="Toggle navigation">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <ul id="site-nav" className={`nav-links ${open ? 'show' : ''}`} onClick={()=>setOpen(false)}>
          <li><a href="#home">Home</a></li>
          <li><a href="#why">Why</a></li>
          <li><a href="#products">Products</a></li>
          <li><a href="#contact">Consult</a></li>
        </ul>
      </div>
    </nav>
  )
}
