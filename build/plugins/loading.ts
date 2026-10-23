import { appLoading } from '@starweave-lab/vite-plugin-loading'

export function loadingPlugin() {
  return appLoading({
    type: 'beat',
    title: 'Wuhu admin',
    themeColor: 'rgb(var(--w-color-primary, 22 119 255))',
    maskBackground: true,
  })
}
