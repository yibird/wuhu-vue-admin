<script setup lang="ts">
import { message, Modal, type DrawerProps } from 'antdv-next'
import { useMediaQuery } from '@vueuse/core'
import {
  computed,
  defineAsyncComponent,
  shallowRef,
  useTemplateRef,
  type Component,
} from 'vue'
import { appStore } from '@/store'
import { useGlobalSearch } from '@/layouts/config/composables'
import { CONFIG_SCHEMA_VERSION, parseProjectConfig } from './config'
import type { SettingEmit } from './types'

const open = defineModel<boolean>('open', { default: false })
const emits = defineEmits<SettingEmit>()
const store = appStore()
const { searchVisible } = useGlobalSearch()
const importInput = useTemplateRef<HTMLInputElement>('importInput')
const isMobile = useMediaQuery('(max-width: 640px)')

type SectionKey = 'appearance' | 'layout' | 'shortcutKeys' | 'general'

const sections = [
  {
    label: '外观',
    value: 'appearance',
    path: './appearance/index.vue',
    icon: 'i-lucide:palette',
    description: '主题与色彩',
  },
  {
    label: '布局',
    value: 'layout',
    path: './layout/index.vue',
    icon: 'i-lucide:panels-top-left',
    description: '导航与区域',
  },
  {
    label: '快捷键',
    value: 'shortcutKeys',
    path: './shortcutKeys/index.vue',
    icon: 'i-lucide:command',
    description: '效率操作',
  },
  {
    label: '通用',
    value: 'general',
    path: './general/index.vue',
    icon: 'i-lucide:sliders-horizontal',
    description: '基础偏好',
  },
] as const

const activeSection = shallowRef<SectionKey>('appearance')
const activeSectionMeta = computed(
  () =>
    sections.find((item) => item.value === activeSection.value) ?? sections[0]
)
const drawerSize = computed(() => (isMobile.value ? 360 : 460))
const drawerFocusable = computed<NonNullable<DrawerProps['focusable']>>(() => ({
  trap: !searchVisible.value,
}))
const drawerClasses: DrawerProps['classes'] = {
  header:
    '!border-b-1 !border-color-1 !border-b-solid !bg-container !px-16 !py-16',
  body: '!bg-page !p-0',
  footer:
    '!border-t-1 !border-color-1 !border-t-solid !bg-container !px-16 !py-10',
}

const components = import.meta.glob<() => Promise<{ default: Component }>>(
  './**/index.vue'
)
const component = computed(() => {
  const loader = components[activeSectionMeta.value.path]
  return loader ? defineAsyncComponent(loader) : undefined
})

function getConfigSnapshot() {
  return JSON.stringify(
    { schemaVersion: CONFIG_SCHEMA_VERSION, config: store.$state },
    null,
    2
  )
}

async function copyConfig() {
  try {
    await navigator.clipboard.writeText(getConfigSnapshot())
    message.success('配置已复制到剪贴板')
  } catch {
    message.error('复制配置失败，请检查浏览器剪贴板权限')
  }
}

function triggerImport() {
  importInput.value?.click()
}

async function importConfig(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return

  try {
    const parsed: unknown = JSON.parse(await file.text())
    const nextConfig = parseProjectConfig(parsed, store.$state)
    store.$patch(nextConfig)

    message.success('配置导入成功')
  } catch {
    message.error('配置文件格式不正确，导入失败')
  }
}

function resetConfig() {
  Modal.confirm({
    title: '恢复默认设置？',
    content: '当前个性化设置将被恢复为默认值，此操作会立即生效。',
    okText: '恢复默认',
    cancelText: '取消',
    okType: 'danger',
    onOk: () => {
      store.$reset()
      message.success('已恢复默认设置')
    },
  })
}

function handleOpenChange(isOpen: boolean) {
  if (!isOpen) emits('close')
}
</script>

<template>
  <a-drawer
    v-model:open="open"
    :size="drawerSize"
    placement="right"
    :classes="drawerClasses"
    :destroy-on-hidden="false"
    :focusable="drawerFocusable"
    @after-open-change="handleOpenChange"
  >
    <template #title>
      <div class="min-w-0 flex items-center gap-10">
        <span
          class="size-36 shrink-0 flex items-center justify-center rounded-8 border-1 border-primary/15 border-solid bg-primary/10 text-primary transition-colors duration-180"
        >
          <Icon name="i-lucide:settings-2" :size="19" />
        </span>
        <div class="min-w-0">
          <div class="flex items-center gap-8">
            <span class="truncate text-base text-main font-700">项目设置</span>
            <span
              class="inline-flex items-center gap-5 whitespace-nowrap rounded-full bg-success-tint px-7 py-3 text-10px text-success font-600"
            >
              <i
                class="size-6 rounded-full bg-success shadow-[0_0_0_3px_rgb(var(--w-color-success)_/_12%)]"
                aria-hidden="true"
              />
              实时生效
            </span>
          </div>
          <span class="mt-3 block truncate text-xs text-secondary font-400">
            调整工作台的视觉与操作习惯
          </span>
        </div>
      </div>
    </template>

    <div class="min-h-full px-16 pb-20 pt-12">
      <section
        class="flex items-center justify-between rounded-8 border-1 border-primary/15 border-solid bg-primary/8 p-12 transition-[border-color,background-color] duration-180"
        aria-label="当前设置分类"
      >
        <div class="flex min-w-0 items-center gap-10">
          <span
            class="size-32 shrink-0 flex items-center justify-center rounded-7 bg-primary/12 text-primary transition-colors duration-180"
          >
            <Icon :name="activeSectionMeta.icon" :size="17" />
          </span>
          <div class="min-w-0">
            <div class="truncate text-sm text-main font-700">
              {{ activeSectionMeta.label }}设置
            </div>
            <div class="mt-2 truncate text-xs text-secondary">
              {{ activeSectionMeta.description }}
            </div>
          </div>
        </div>
        <Icon
          name="i-lucide:chevron-right"
          :size="16"
          class="shrink-0 text-muted"
        />
      </section>

      <nav
        class="mt-12 grid grid-cols-4 gap-5 rounded-8 border-1 border-color-1 border-solid bg-container p-5 shadow-[0_4px_14px_rgb(var(--w-shadow-color-1))]"
        aria-label="项目设置分类"
      >
        <button
          v-for="item in sections"
          :key="item.value"
          type="button"
          :class="[
            'min-w-0 flex cursor-pointer items-center justify-center gap-5 rounded-6 border-0 bg-transparent px-5 py-8 text-xs outline-none transition-[color,background-color,box-shadow,transform] duration-180 ease-out hover:(-translate-y-1 bg-hover text-main) focus-visible:shadow-[0_0_0_2px_rgb(var(--w-color-primary)_/_24%)] active:translate-y-0 motion-reduce:(transform-none transition-none)',
            activeSection === item.value
              ? 'bg-primary/10 text-primary shadow-[0_4px_12px_rgb(var(--w-color-primary)_/_10%)]'
              : 'text-secondary',
          ]"
          role="tab"
          :aria-selected="activeSection === item.value"
          @click="activeSection = item.value"
        >
          <Icon :name="item.icon" :size="16" />
          <span class="truncate">{{ item.label }}</span>
        </button>
      </nav>

      <main class="px-2 pt-4" role="tabpanel">
        <Transition
          mode="out-in"
          enter-active-class="transition-[opacity,transform] duration-180 ease-out motion-reduce:transition-none"
          enter-from-class="translate-y-6 opacity-0 motion-reduce:translate-y-0"
          leave-active-class="transition-[opacity,transform] duration-140 ease-in motion-reduce:transition-none"
          leave-to-class="-translate-y-4 opacity-0 motion-reduce:translate-y-0"
        >
          <component :is="component" :key="activeSection" />
        </Transition>
      </main>
    </div>

    <input
      ref="importInput"
      type="file"
      accept="application/json,.json"
      class="hidden"
      @change="importConfig"
    />

    <template #footer>
      <div class="grid grid-cols-3 gap-8 max-sm:grid-cols-1">
        <a-button class="w-full" @click="copyConfig">
          <template #icon><Icon name="i-lucide:copy" :size="14" /></template>
          复制配置
        </a-button>
        <a-button class="w-full" type="primary" @click="triggerImport">
          <template #icon><Icon name="i-lucide:upload" :size="14" /></template>
          导入配置
        </a-button>
        <a-button class="w-full" danger @click="resetConfig">
          <template #icon
            ><Icon name="i-lucide:rotate-ccw" :size="14"
          /></template>
          恢复默认
        </a-button>
      </div>
    </template>
  </a-drawer>
</template>
