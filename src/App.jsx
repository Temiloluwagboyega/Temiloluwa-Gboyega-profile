import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Work from './components/Work'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <div id="top">
      <Header />
      <main>
        <Hero />
        <About />
        <Experience />
        <Work />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
