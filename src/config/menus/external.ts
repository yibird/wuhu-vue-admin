import type { IMenu } from '#/config'

export const externalMenus: IMenu[] = [
  {
    id: '9',
    title: '外部链接',
    type: 1,
    rootId: '0',
    parentId: '0',
    level: '9',
    icon: 'i-lucide:external-link',
    children: [
      {
        id: '91',
        title: 'Trae AI',
        type: 2,
        rootId: '9',
        parentId: '9',
        level: '9-91',
        icon: 'i-lucide:globe',
        path: 'https://www.trae.ai',
        isExternal: true,
      },
      {
        id: '92',
        title: 'Ant Design Vue',
        type: 2,
        rootId: '9',
        parentId: '9',
        level: '9-92',
        icon: 'i-lucide:component',
        path: 'https://antdv.com',
        isExternal: true,
      },
      {
        id: '93',
        title: 'Ant Design Vue Next',
        type: 2,
        rootId: '9',
        parentId: '9',
        level: '9-93',
        icon: 'i-lucide:github',
        path: 'https://www.antdv-next.com/index-cn',
        isExternal: true,
      },
    ],
  },
]
