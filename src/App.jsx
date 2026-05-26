import { useState, useEffect } from 'react'
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
    const path = window.location.pathname
    const params = new URLSearchParams(window.location.search)

    if (path === '/about') return 'about'
    if (path === '/dashboard') return 'dashboard'
    if (params.get('code')) return 'receive'
    return 'home'
  })

  useEffect(() => {
    const onPopState = () => {
      const path = window.location.pathname
      const params = new URLSearchParams(window.location.search)

      if (path === '/about') {
        setView('about')
      } else if (path === '/dashboard') {
        setView('dashboard')
      } else if (params.get('code')) {
        setView('receive')
      } else {
        setView('home')
      }
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  function navigate(view, extra) {
    let url
    switch (view) {
      case 'about':
        url = '/about'
        break
      case 'dashboard':
        url = '/dashboard'
        break
      case 'receive': {
        const code = extra?.code || new URLSearchParams(window.location.search).get('code') || ''
        url = `/?code=${code}`
        break
      }
      default:
        url = '/'
    }
    window.history.pushState({ view }, '', url)
    setView(view)
  }

  if (view === 'dashboard') {
    return <Dashboard onLogout={() => navigate('home')} />
  }

  if (view === 'receive') {
    const codeFromUrl = new URLSearchParams(window.location.search).get('code') || ''
    return <ReceiveFlow initialCode={codeFromUrl} onClose={() => navigate('home')} />
  }

  if (view === 'about') {
    return (
      <>
        <Nav onStart={() => navigate('dashboard')} onAbout={() => navigate('about')} onHome={() => navigate('home')} />
        <About />
      </>
    )
  }

  return (
    <>
      <Nav onStart={() => navigate('dashboard')} onAbout={() => navigate('about')} onHome={() => navigate('home')} />
      <Hero onStart={() => navigate('dashboard')} onReceive={(code) => navigate('receive', { code })} />
      <HowItWorks />
      <PhilosophyBanner />
      <CtaFooter onStart={() => navigate('dashboard')} />
    </>
  )
}

export default App
