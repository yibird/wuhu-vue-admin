import type { IMenu } from '#/config'
import { dashboardMenus } from './dashboard'
import { componentsMenus } from './components'
import { sysMenus } from './sys'
import { projectMenus } from './project'
import { templateMenus } from './template'
import { approvalMenus } from './approval'
import { aiPlatformMenus } from './ai-platform'
import { externalMenus } from './external'

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
