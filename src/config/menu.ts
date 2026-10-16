import type { IMenu } from '#/config'
import { dashboardMenus } from './menus/dashboard'
import { componentsMenus } from './menus/components'
import { sysMenus } from './menus/sys'
import { templateMenus } from './menus/template'
import { aiPlatformMenus } from './menus/ai-platform'
import { externalMenus } from './menus/external'

export const menus: IMenu[] = [
  ...dashboardMenus,
  ...componentsMenus,
  ...sysMenus,
  ...templateMenus,
  ...aiPlatformMenus,
  ...externalMenus,
]
