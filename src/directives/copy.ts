import { useMessage } from 'naive-ui'

const message = useMessage()
export const copy = {
  mounted(el: HTMLElement, { value }: any) {
    el.style.cursor = 'pointer'
    el.onclick = () => {
      if (!value) return
      navigator.clipboard.writeText(value).then(() => {
        message.success('复制成功')
      })
    }
  },
  updated(el: HTMLElement, { value }: any) {
    el.onclick = () => {
      navigator.clipboard.writeText(value).then(() => {
        message.success('复制成功')
      })
    }
  },
}
