import { useEffect, useState } from 'react'

export function useDevice() {
  const [device, setDevice] = useState('desktop')

  useEffect(() => {
    const check = () => {
      const isMobile = window.innerWidth < 768 || 'ontouchstart' in window
      setDevice(isMobile ? 'mobile' : 'desktop')
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return device
}
