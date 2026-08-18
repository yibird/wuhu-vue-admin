<template>
  <a-drawer
    v-model:open="open"
    placement="right"
    :size="450"
    :styles="drawerStyles"
    :destroy-on-hidden="false"
    :focusable="{ trap: false }"
    @after-open-change="onOpenChange"
  >
    <template #title>
      <div class="min-w-0 flex items-center gap-10">
        <span
          class="size-36 shrink-0 flex items-center justify-center rounded-8 border-1 border-primary/15 border-solid bg-primary/10 text-primary transition-colors duration-motion-base"
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

    <div class="h-full flex flex-col pb-20 pt-12 gap-12 overflow-hidden">
      <a-segmented
        v-model:value="activeSection"
        :options="sectionOptions"
        size="large"
        block
        class="mx-10"
      >
        <template #iconRender="{ value }">
          <Icon :name="getIcon(value)" :size="15" aria-hidden="true" />
        </template>
      </a-segmented>
      <main
        class="flex-1 px-16 pt-4 overflow-x-hidden overflow-y-auto"
        role="tabpanel"
      >
        <Transition name="slide-right" mode="out-in">
          <component :is="component" :key="activeSection" />
        </Transition>
      </main>
    </div>

    <input
      ref="importInput"
      type="file"
      accept="application/json,.json"
      class="hidden"
      @change="onUploadChange"
    />

    <template #footer>
      <div class="grid grid-cols-3 gap-8 max-sm:grid-cols-1">
        <a-button
          v-for="action in actions"
          :key="action.label"
          :type="action.type"
          :danger="action.danger"
          class="w-full"
          @click="action.action"
        >
          <template #icon><Icon :name="action.icon" :size="14" /></template>
          {{ action.label }}
        </a-button>
      </div>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, shallowRef, useTemplateRef } from 'vue'
import { useConfig } from './composables'
import { useGlobalShortcuts } from './composables'
import type { SettingEmit } from './types'

const open = defineModel<boolean>('open', { default: false })
const emits = defineEmits<SettingEmit>()
const importInput = useTemplateRef<HTMLInputElement>('importInput')

useGlobalShortcuts()

const drawerStyles = {
  header: {
    padding: '16px',
    borderBottom: '1px solid rgb(var(--w-border-color-1))',
    backgroundColor: 'rgb(var(--w-bg-container))',
  },
  body: {
    padding: 0,
    backgroundColor: 'rgb(var(--w-bg-page))',
    overflowY: 'hidden',
  },
  footer: {
    padding: '10px 16px',
    borderTop: '1px solid rgb(var(--w-border-color-1))',
    backgroundColor: 'rgb(var(--w-bg-container))',
  },
}

const sections = [
  {
    label: '外观',
    value: 'appearance',
    iconName: 'i-lucide:palette',
    component: () => import('./appearance/index.vue'),
  },
  {
    label: '布局',
    value: 'layout',
    iconName: 'i-lucide:panels-top-left',
    component: () => import('./layout/index.vue'),
  },
  {
    label: '快捷键',
    value: 'shortcutKeys',
    iconName: 'i-lucide:command',
    component: () => import('./shortcutKeys/index.vue'),
  },
  {
    label: '通用',
    value: 'general',
    iconName: 'i-lucide:sliders-horizontal',
    component: () => import('./general/index.vue'),
  },
] as const

type SectionKey = (typeof sections)[number]['value']
const sectionOptions = sections.map(({ label, value }) => ({ label, value }))

const activeSection = shallowRef<SectionKey>('appearance')
const { copyConfig, parseConfig, resetConfig } = useConfig()

const actions = [
  {
    label: '复制配置',
    icon: 'i-lucide:copy',
    action: copyConfig,
  },
  {
    label: '导入配置',
    icon: 'i-lucide:upload',
    action: onUploadConfig,
    type: 'primary',
  },
  {
    label: '重置',
    icon: 'i-lucide:rotate-ccw',
    action: resetConfig,
    type: 'primary',
    danger: true,
  },
]

const activeSectionMeta = computed(() => {
  return (
    sections.find((section) => section.value === activeSection.value) ??
    sections[0]
  )
})

const component = computed(() => {
  return defineAsyncComponent(activeSectionMeta.value.component)
})

function getIcon(value: string | number) {
  return (
    sections.find((section) => section.value === value)?.iconName ??
    'i-lucide:circle-help'
  )
}

function onUploadConfig() {
  importInput.value?.click()
}

function onUploadChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  parseConfig(file)
}

function onOpenChange(isOpen: boolean) {
  if (!isOpen) emits('close')
}
</script>
