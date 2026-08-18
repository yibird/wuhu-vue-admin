import Components from 'unplugin-vue-components/vite'
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver'

const defaultComponentModules: Record<string, string> = {
  AAlert: 'alert',
  AApp: 'app',
  AAvatar: 'avatar',
  ABadge: 'badge',
  ABreadcrumb: 'breadcrumb',
  AButton: 'button',
  ACard: 'card',
  ACheckbox: 'checkbox',
  AColorPicker: 'color-picker',
  AConfigProvider: 'config-provider',
  ADatePicker: 'date-picker',
  ADescriptions: 'descriptions',
  ADivider: 'divider',
  ADrawer: 'drawer',
  ADropdown: 'dropdown',
  AEmpty: 'empty',
  AForm: 'form',
  AImage: 'image',
  AInput: 'input',
  AInputNumber: 'input-number',
  ALayout: 'layout',
  AMenu: 'menu',
  AModal: 'modal',
  APagination: 'pagination',
  APopconfirm: 'popconfirm',
  APopover: 'popover',
  AProgress: 'progress',
  ARadio: 'radio',
  ARate: 'rate',
  ARow: 'grid/row',
  ACol: 'grid/col',
  ASegmented: 'segmented',
  ASelect: 'select',
  ASkeleton: 'skeleton',
  ASlider: 'slider',
  ASpace: 'space',
  ASpin: 'spin',
  ASwitch: 'switch',
  ATable: 'table',
  ATabs: 'tabs',
  ATag: 'tag',
  ATimeline: 'timeline',
  ATooltip: 'tooltip',
  ATree: 'tree',
  AUpload: 'upload',
  AWatermark: 'watermark',
}

const namedComponentModules: Record<string, { module: string; name: string }> =
  {
    AAvatarGroup: { module: 'avatar', name: 'AvatarGroup' },
    ABreadcrumbItem: { module: 'breadcrumb', name: 'BreadcrumbItem' },
    ACheckboxGroup: { module: 'checkbox', name: 'CheckboxGroup' },
    ADescriptionsItem: {
      module: 'descriptions',
      name: 'DescriptionsItem',
    },
    AFormItem: { module: 'form', name: 'FormItem' },
    AInputOtp: { module: 'input', name: 'InputOTP' },
    AInputPassword: { module: 'input', name: 'InputPassword' },
    AInputSearch: { module: 'input', name: 'InputSearch' },
    ALayoutContent: { module: 'layout', name: 'LayoutContent' },
    ALayoutFooter: { module: 'layout', name: 'LayoutFooter' },
    ALayoutHeader: { module: 'layout', name: 'LayoutHeader' },
    ALayoutSider: { module: 'layout', name: 'LayoutSider' },
    ARadioButton: { module: 'radio', name: 'RadioButton' },
    ARadioGroup: { module: 'radio', name: 'RadioGroup' },
    ASelectOption: { module: 'select', name: 'SelectOption' },
    ASkeletonAvatar: { module: 'skeleton', name: 'SkeletonAvatar' },
    ASkeletonButton: { module: 'skeleton', name: 'SkeletonButton' },
    ASkeletonInput: { module: 'skeleton', name: 'SkeletonInput' },
    ATabPane: { module: 'tabs', name: 'TabPane' },
    ATextarea: { module: 'input', name: 'TextArea' },
    ATimelineItem: { module: 'timeline', name: 'TimelineItem' },
  }

function AntdvNextSubpathResolver() {
  const resolveModulePath = (module: string) => {
    const suffix = module.startsWith('grid/') ? '' : '/index'
    return `antdv-next/dist/${module}${suffix}`
  }

  return {
    type: 'component' as const,
    resolve(name: string) {
      const defaultModule = defaultComponentModules[name]
      if (defaultModule) {
        return {
          name: 'default',
          from: resolveModulePath(defaultModule),
        }
      }

      const namedModule = namedComponentModules[name]
      if (!namedModule) return

      return {
        name: namedModule.name,
        from: resolveModulePath(namedModule.module),
      }
    },
  }
}

export function componentsPlugin(options: { generateDts: boolean }) {
  return Components({
    resolvers: [AntdvNextSubpathResolver(), AntdvNextResolver()],
    dirs: [],
    directoryAsNamespace: false,
    dts: options.generateDts,
    // dirs: ['src/components'],
    // extensions: ['vue', 'ts', 'tsx'],
    // deep: true,
    // dts: 'src/components.d.ts',
    // // globs: ['src/components/*.vue', 'src/components/*/index.vue'],
    // directoryAsNamespace: true,
  })
}
