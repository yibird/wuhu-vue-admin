import type { IMenu } from '#/config'
import { dashboardMenus } from './menus/dashboard'
import { componentsMenus } from './menus/components'
import { sysMenus } from './menus/sys'
import { projectMenus } from './menus/project'
import { templateMenus } from './menus/template'
import { approvalMenus } from './menus/approval'
import { aiPlatformMenus } from './menus/ai-platform'
import { externalMenus } from './menus/external'

export const menus: IMenu[] = [
  ...dashboardMenus,
  ...componentsMenus,
  ...sysMenus,
  ...projectMenus,
  ...templateMenus,
  ...approvalMenus,
  ...aiPlatformMenus,
  ...externalMenus,
]
