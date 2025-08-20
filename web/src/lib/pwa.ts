export function registerServiceWorker() {
  if (typeof window === 'undefined') return
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(reg => {
          console.log('Service worker registered.', reg)
        })
        .catch(err => {
          console.warn('Service worker registration failed:', err)
        })
    })
  }
}
