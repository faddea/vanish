import { useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import PhilosophyBanner from './components/PhilosophyBanner'
import CtaFooter from './components/CtaFooter'
import Dashboard from './components/Dashboard'
import ReceiveFlow from './components/ReceiveFlow'
import About from './components/About'
import './App.css'

function App() {
  const [view, setView] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('code') ? 'receive' : 'home'
  })

  if (view === 'dashboard') {
    return <Dashboard onLogout={() => setView('home')} />
  }

  if (view === 'receive') {
    const codeFromUrl = new URLSearchParams(window.location.search).get('code') || ''
    return <ReceiveFlow initialCode={codeFromUrl} onClose={() => setView('home')} />
  }

  if (view === 'about') {
    return (
      <>
        <Nav onStart={() => setView('dashboard')} onAbout={() => setView('about')} />
        <About />
      </>
    )
  }

  return (
    <>
      <Nav onStart={() => setView('dashboard')} onAbout={() => setView('about')} />
      <Hero onStart={() => setView('dashboard')} onReceive={() => setView('receive')} />
      <HowItWorks />
      <PhilosophyBanner />
      <CtaFooter onStart={() => setView('dashboard')} />
    </>
  )
}

export default App
