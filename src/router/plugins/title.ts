import { useTitle as useVueTitle } from '@vueuse/core'
import type { RouterPlugin } from './types'
import type { RouteLocationNormalized } from 'vue-router'
import type { IRouteMeta } from '../types'

/**
 * Title Plugin Options
 */
export interface TitlePluginOptions {
  /** Default title to show when route has no title */
  defaultTitle?: string
  /** Title suffix appended to all titles */
  titleSuffix?: string
  /** Separator between title and suffix */
  separator?: string
}

/**
 * Create title plugin
 * Updates page title based on route meta.title
 */
export function createTitlePlugin(options: TitlePluginOptions = {}): RouterPlugin {
  const {
    defaultTitle = '',
    titleSuffix = '',
    separator = ' - ',
  } = options

  /**
   * Get page title from route
   */
  function getPageTitle(to: RouteLocationNormalized): string | undefined {
    const meta = to.meta as IRouteMeta
    return meta?.title
  }

  /**
   * Build full title string
   */
  function buildTitle(pageTitle?: string): string {
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
        const title = buildTitle(pageTitle)
        if (title) {
          useVueTitle(title)
        }
      },
    },
  }
}

/** Default title plugin instance */
export const titlePlugin = createTitlePlugin()
