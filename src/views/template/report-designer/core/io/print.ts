/**
 * 通过隐藏 iframe 调用浏览器打印
 * @param html 完整 HTML 文档
 */
export function printHtml(html: string) {
  if (typeof document === 'undefined') return

  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = '0'
  iframe.setAttribute('aria-hidden', 'true')
  document.body.appendChild(iframe)

  const frameWindow = iframe.contentWindow
  const frameDocument = iframe.contentDocument
  if (!frameWindow || !frameDocument) {
    iframe.remove()
    return
  }

  frameDocument.open()
  frameDocument.write(html)
  frameDocument.close()

  const cleanup = () => {
    window.setTimeout(() => iframe.remove(), 500)
  }

  frameWindow.addEventListener('afterprint', cleanup, { once: true })
  window.setTimeout(() => {
    try {
      frameWindow.focus()
      frameWindow.print()
    } finally {
      window.setTimeout(cleanup, 30000)
    }
  }, 120)
}
