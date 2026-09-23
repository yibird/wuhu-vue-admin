import { useTitle } from '@vueuse/core'
import type { RouterPlugin } from './types'
import type { RouteLocationNormalized } from 'vue-router'
import type { IRouteMeta } from '../types'

/**
 * Title Plugin Options
 */
export interface TitlePluginOptions {
  /**
   * 默认标题
   */
  defaultTitle?: string
  /**
   * 标题后缀
   */
  titleSuffix?: string
  /**
   * 标题分隔符
   */
  separator?: string
}

/**
 * 从路由元数据中获取页面标题
 */
function getPageTitle(to: RouteLocationNormalized): string | undefined {
  const meta = to.meta as IRouteMeta
  return meta?.title
}

/**
 * Create title plugin
 * Updates page title based on route meta.title
 */
export function createTitlePlugin(
  options: TitlePluginOptions = {}
): RouterPlugin {
  const { defaultTitle = '', titleSuffix = '', separator = ' - ' } = options

  /**
   * Build full title string
   */
  function getTitle(pageTitle?: string): string {
    const parts: string[] = []
    if (pageTitle) {
      parts.push(pageTitle)
    }
    if (defaultTitle) {
      parts.push(defaultTitle)
    }
    let title = parts.join(separator)
    if (titleSuffix && title) {
      title += separator + titleSuffix
    } else if (titleSuffix) {
      title = titleSuffix
    }
    return title || defaultTitle
  }

  return {
    name: 'title',
    hooks: {
      onBeforeEach(to) {
        const pageTitle = getPageTitle(to)
        const title = getTitle(pageTitle)
        if (title) {
          useTitle(title)
        }
      },
    },
  }
}

export const titlePlugin = createTitlePlugin()
