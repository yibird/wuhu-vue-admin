import { parseRgbColor } from '../../utils/color.ts'

import type { ProjectConfig } from '#/config'

const themeModes = ['dark', 'light', 'auto'] as const
const locales = ['zh_CN', 'en'] as const
const menuModes = ['vertical', 'horizontal', 'mix', 'split'] as const
const siderThemes = ['dark', 'light'] as const
const headerWidgets = [
  'search',
  'taskCenter',
  'downloadCenter',
  'noteBook',
  'theme',
  'notice',
  'translate',
  'fullScreen',
  'lockPage',
  'setting',
  'ai',
] as const
const tabThemes = ['card', 'block', 'google'] as const
const loadingAnimations = ['beat', 'orbit', 'pulse', 'bars', 'ring'] as const
const RGB_CHANNELS_PATTERN = /^\s*\d+\s*,\s*\d+\s*,\s*\d+\s*$/

const CONFIG_SCHEMA_VERSION = 1

type RecordValue = Record<string, unknown>

const configKeys = [
  'sider',
  'header',
  'tab',
  'footer',
  'animation',
  'lockscreen',
  'app',
  'copyright',
  'shortcutKey',
] as const satisfies ReadonlyArray<keyof ProjectConfig>

function isRecord(value: unknown): value is RecordValue {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function assertRecord(
  value: unknown,
  label: string
): asserts value is RecordValue {
  if (!isRecord(value)) throw new Error(`${label} must be an object`)
}

function assertKnownKeys(
  value: RecordValue,
  keys: readonly string[],
  label: string
) {
  for (const key of Object.keys(value)) {
    if (!keys.includes(key)) throw new Error(`${label}.${key} is not supported`)
  }
}

function assertBoolean(
  value: unknown,
  label: string
): asserts value is boolean {
  if (typeof value !== 'boolean') throw new Error(`${label} must be boolean`)
}

function assertString(
  value: unknown,
  label: string,
  maxLength = 2048
): asserts value is string {
  if (typeof value !== 'string' || value.length > maxLength) {
    throw new Error(
      `${label} must be a string with at most ${maxLength} characters`
    )
  }
}

function assertNumber(
  value: unknown,
  label: string,
  min: number,
  max: number,
  integer = false
): asserts value is number {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value < min ||
    value > max ||
    (integer && !Number.isInteger(value))
  ) {
    throw new Error(`${label} is outside the supported range`)
  }
}

function assertEnum<T extends string>(
  value: unknown,
  label: string,
  values: readonly T[]
): asserts value is T {
  if (typeof value !== 'string' || !values.includes(value as T)) {
    throw new Error(`${label} is not supported`)
  }
}

function assertStringArray(
  value: unknown,
  label: string,
  values: readonly string[],
  maxLength = 20
): asserts value is string[] {
  if (!Array.isArray(value) || value.length > maxLength) {
    throw new Error(`${label} must be a short array`)
  }
  value.forEach((item, index) => assertEnum(item, `${label}[${index}]`, values))
}

function validateSection(
  source: unknown,
  target: RecordValue,
  label: string,
  validate: (source: RecordValue) => void
) {
  assertRecord(source, label)
  assertKnownKeys(source, Object.keys(target), label)
  validate(source)
}

function validateSider(source: RecordValue) {
  if ('show' in source) assertBoolean(source.show, 'sider.show')
  if ('theme' in source) assertEnum(source.theme, 'sider.theme', siderThemes)
  if ('fixed' in source) assertBoolean(source.fixed, 'sider.fixed')
  if ('width' in source) assertNumber(source.width, 'sider.width', 120, 480)
  if ('collapsed' in source) assertBoolean(source.collapsed, 'sider.collapsed')
  if ('collapsedWidth' in source)
    assertNumber(source.collapsedWidth, 'sider.collapsedWidth', 40, 120)
  for (const key of ['showLogo', 'showSearch', 'showAdvancedNav'] as const) {
    if (key in source) assertBoolean(source[key], `sider.${key}`)
  }
}

function validateHeader(source: RecordValue) {
  for (const key of [
    'show',
    'fixed',
    'showBreadcrumb',
    'showBreadCrumbIcon',
  ] as const) {
    if (key in source) assertBoolean(source[key], `header.${key}`)
  }
  if ('widgets' in source) {
    assertStringArray(source.widgets, 'header.widgets', headerWidgets)
  }
}

function validateTab(source: RecordValue) {
  for (const key of [
    'show',
    'showIcon',
    'enableDrag',
    'enablePersist',
  ] as const) {
    if (key in source) assertBoolean(source[key], `tab.${key}`)
  }
  if ('theme' in source) assertEnum(source.theme, 'tab.theme', tabThemes)
}

function validateFooter(source: RecordValue) {
  for (const key of ['show', 'fixed'] as const) {
    if (key in source) assertBoolean(source[key], `footer.${key}`)
  }
}

function validateAnimation(source: RecordValue) {
  if ('enableProgressBar' in source)
    assertBoolean(source.enableProgressBar, 'animation.enableProgressBar')
  if ('enablePageLoading' in source)
    assertBoolean(source.enablePageLoading, 'animation.enablePageLoading')
  if ('loadingAnimation' in source) {
    assertEnum(
      source.loadingAnimation,
      'animation.loadingAnimation',
      loadingAnimations
    )
  }
  if ('pageAnimation' in source)
    assertEnum(source.pageAnimation, 'animation.pageAnimation', [
      'fade',
      'slide-left',
    ])
}

function validateApp(source: RecordValue) {
  if ('name' in source) assertString(source.name, 'app.name', 100)
  if ('logo' in source) assertString(source.logo, 'app.logo', 2048)
  if ('themeMode' in source)
    assertEnum(source.themeMode, 'app.themeMode', themeModes)
  if ('themeColor' in source) {
    assertString(source.themeColor, 'app.themeColor', 32)
    if (
      !RGB_CHANNELS_PATTERN.test(source.themeColor) ||
      !parseRgbColor(source.themeColor)
    ) {
      throw new Error('app.themeColor is not a valid RGB color')
    }
  }
  if ('locale' in source) assertEnum(source.locale, 'app.locale', locales)
  if ('menuMode' in source)
    assertEnum(source.menuMode, 'app.menuMode', menuModes)
  for (const key of ['pageCache', 'showWatermark', 'checkUpdate'] as const) {
    if (key in source) assertBoolean(source[key], `app.${key}`)
  }
  if ('pageCacheMax' in source)
    assertNumber(source.pageCacheMax, 'app.pageCacheMax', 0, 50, true)
  if ('borderRadius' in source)
    assertNumber(source.borderRadius, 'app.borderRadius', 0, 20)
  for (const key of ['colourWeakness', 'greyMode'] as const) {
    if (key in source) assertBoolean(source[key], `app.${key}`)
  }
}

function validateCopyright(source: RecordValue) {
  if ('show' in source) assertBoolean(source.show, 'copyright.show')
  for (const key of [
    'companyName',
    'companyUrl',
    'date',
    'icpNo',
    'icpUrl',
  ] as const) {
    if (key in source) assertString(source[key], `copyright.${key}`, 2048)
  }
}

function validateShortcutKey(source: RecordValue) {
  for (const key of ['enabled', 'search', 'logout', 'lockScreen'] as const) {
    if (key in source) assertBoolean(source[key], `shortcutKey.${key}`)
  }
}

export function parseProjectConfig(value: unknown, current: ProjectConfig) {
  assertRecord(value, 'config')
  const version = value.schemaVersion
  if (
    version !== undefined &&
    (typeof version !== 'number' ||
      !Number.isInteger(version) ||
      version > CONFIG_SCHEMA_VERSION)
  ) {
    throw new Error('unsupported config schema version')
  }

  const source = isRecord(value.config) ? value.config : value
  assertKnownKeys(source, configKeys, 'config')
  if (!configKeys.some((key) => key in source))
    throw new Error('config is empty')

  const next: ProjectConfig = {
    ...current,
    sider: { ...current.sider },
    header: { ...current.header, widgets: [...current.header.widgets] },
    tab: { ...current.tab },
    footer: { ...current.footer },
    animation: { ...current.animation },
    lockscreen: { ...current.lockscreen },
    app: { ...current.app },
    copyright: { ...current.copyright },
    shortcutKey: { ...current.shortcutKey },
  }

  const validators: Record<keyof ProjectConfig, (source: RecordValue) => void> =
    {
      sider: validateSider,
      header: validateHeader,
      tab: validateTab,
      footer: validateFooter,
      animation: validateAnimation,
      lockscreen: (section) => assertKnownKeys(section, [], 'lockscreen'),
      app: validateApp,
      copyright: validateCopyright,
      shortcutKey: validateShortcutKey,
    }

  for (const key of configKeys) {
    if (!(key in source)) continue
    validateSection(
      source[key],
      next[key] as unknown as RecordValue,
      key,
      validators[key]
    )
    Object.assign(next[key], source[key])
  }

  return next
}

export { CONFIG_SCHEMA_VERSION }
