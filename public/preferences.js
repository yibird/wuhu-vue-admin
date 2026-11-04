;(function () {
  try {
    // 与 src/config/fonts.ts 中 fontOptions[0] 保持一致,
    // 用于首次访问(无持久化状态)时让 loading 和应用使用同一套字体
    const DEFAULT_FONT = {
      family: 'outfit',
      stack:
        "'Outfit', 'Outfit Fallback', 'Noto Sans SC', -apple-system, 'BlinkMacSystemFont', 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Arial', sans-serif",
      weight: 400,
      letterSpacing: '0',
    }
    const DEFAULT_THEME_COLOR = '22 119 255'

    const root = document.documentElement
    let appConfig = {}

    try {
      const raw = localStorage.getItem('wuhu-vue-admin:app')
      const config = raw ? JSON.parse(raw) : null
      if (config && config.app && typeof config.app === 'object') {
        appConfig = config.app
      }
    } catch (error) {
      console.log('error:', error)
    }

    const themeColor =
      typeof appConfig.themeColor === 'string' && appConfig.themeColor
        ? appConfig.themeColor
        : DEFAULT_THEME_COLOR
    const systemDark =
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-color-scheme: dark)').matches
    const themeMode =
      appConfig.themeMode === 'dark' ||
      (appConfig.themeMode === 'auto' && systemDark)
        ? 'dark'
        : 'light'

    root.style.setProperty('--w-color-primary', themeColor)
    root.style.colorScheme = themeMode
    root.dataset.theme = themeMode

    const font =
      appConfig.font && typeof appConfig.font === 'object'
        ? appConfig.font
        : DEFAULT_FONT

    root.dataset.font = font.family || DEFAULT_FONT.family
    root.style.setProperty('--w-font-family', font.stack || DEFAULT_FONT.stack)
    root.style.setProperty(
      '--w-font-weight',
      String(font.weight ?? DEFAULT_FONT.weight)
    )
    root.style.setProperty(
      '--w-letter-spacing',
      font.letterSpacing ?? DEFAULT_FONT.letterSpacing
    )

    // 首屏 loading 在应用挂载前渲染,需要提前使用主题字体
    const style = document.createElement('style')
    style.textContent =
      '.v-loader-mask{font-family:var(--w-font-family);font-weight:var(--w-font-weight);letter-spacing:var(--w-letter-spacing)}'
    document.head.appendChild(style)
  } catch (e) {
    console.log('error:', e)
  }
})()
