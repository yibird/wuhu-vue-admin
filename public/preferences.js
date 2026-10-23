;(function () {
  try {
    const raw = localStorage.getItem('wuhu-vue-admin:app')
    if (!raw) return
    const config = JSON.parse(raw)
    const appConfig = config?.app
    if (!appConfig || typeof appConfig !== 'object') return
    const root = document.documentElement
    const { themeColor, themeMode, font } = appConfig
    if (typeof themeColor === 'string' && themeColor) {
      root.style.setProperty('--w-color-primary', themeColor)
    }
    root.dataset.theme = themeMode === 'dark' ? 'dark' : 'light'

    if (font && typeof font === 'object') {
      if (font.family) {
        root.dataset.font = font.family
      }
      if (font.stack) {
        root.style.setProperty('--w-font-family', font.stack)
      }
      if (font.weight) {
        root.style.setProperty('--w-font-weight', String(font.weight))
      }
      if (font.letterSpacing) {
        root.style.setProperty('--w-letter-spacing', font.letterSpacing)
      }
      const style = document.createElement('style')
      style.textContent =
        '.v-loader-mask{font-family:var(--w-font-family);font-weight:var(--w-font-weight);letter-spacing:var(--w-letter-spacing)}'
      document.head.appendChild(style)
    }
  } catch (e) {
    console.log('error:', e)
  }
})()
