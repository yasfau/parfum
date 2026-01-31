import './App.css'
import Hero from './components/Hero'
import Why from './components/Why'
import ProductList from './components/ProductList'
import CTA from './components/CTA'
import SocialProof from './components/SocialProof'
import Nav from './components/Nav'

function App() {
  return (
    <div id="root">
      <Nav />
      <Hero />

      <Why />

      <ProductList />

      <CTA />

      <SocialProof />

      <footer className="footer">
        <p>© {new Date().getFullYear()} Mua'dz Parfume</p>
      </footer>
    </div>
  )
}

export default App
