import { imagetools } from 'vite-imagetools'

export function imageOptimizerPlugin() {
  return imagetools({
    defaultDirectives: (url) => {
      const directives = new URLSearchParams()
      /**
       * 默认输出 WebP
       * 手动指定 format 时保留用户配置
       */
      if (!url.searchParams.has('format')) {
        directives.set('format', 'webp')
      }
      /**
       * 默认质量 80
       * 手动指定 quality 时保留用户配置
       */
      if (!url.searchParams.has('quality')) {
        directives.set('quality', '80')
      }

      /**
       * 默认移除图片 metadata
       */
      directives.set('remove', 'true')
      return directives
    },
  })
}
