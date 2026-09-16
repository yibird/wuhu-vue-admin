<template>
  <a-modal
    :open="open"
    :footer="null"
    :width="'min(1440px, 94vw)'"
    :styles="{ body: { padding: 0 } }"
    title="运行预览"
    @cancel="emit('close')"
  >
    <div
      class="flex-y-center gap-10 border-0 border-b-1 border-color-2 border-b-solid px-16 py-12"
    >
      <span class="text-xs text-muted">
        使用真实 Runtime 解析 Schema，Mock 数据与表达式均按运行时执行
      </span>

      <div class="ml-auto flex-y-center gap-8">
        <a-select
          :value="designer.activePageId.value"
          class="w-140px"
          :options="pageOptions"
          @change="designer.setActivePage(String($event))"
        />
        <a-select
          :value="String(designer.previewUser.role)"
          class="w-130px"
          :options="roleOptions"
          @change="onRoleChange"
        />
        <a-select
          :value="designer.previewDevice.value"
          class="w-140px"
          :options="deviceOptions"
          @change="designer.setDevice($event as never)"
        />
        <a-button @click="refresh">
          <Icon name="i-lucide:refresh-cw" :size="13" class="mr-4" />
          刷新数据
        </a-button>
      </div>
    </div>

    <div class="max-h-[76vh] min-h-[320px] overflow-auto bg-page p-20">
      <div
        v-if="!allowed"
        class="mx-auto flex max-w-520px flex-col items-center gap-10 rounded-10 border-1 border-color-2 border-solid bg-container p-40"
      >
        <Icon name="i-lucide:shield-x" :size="32" class="text-error" />
        <div class="text-sm text-main font-600">当前角色无权访问该页面</div>
        <div class="text-xs text-secondary">
          可在「数据与逻辑 → 权限」中配置页面权限
        </div>
      </div>
      <a-config-provider
        v-else
        :theme="{ token: { colorPrimary: themeColor, fontSize: 15 } }"
      >
        <div
          class="mx-auto overflow-hidden rounded-10 border-1 border-color-2 border-solid bg-main shadow-elevated"
          :style="deviceStyle"
        >
          <SchemaRenderer
            :runtime="designer.runtime"
            :components="designer.activePage.value.components"
          />
        </div>
      </a-config-provider>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@/components'
import { formatRgbColor, hexToRgb } from '@/utils'
import { SchemaRenderer } from './runtime'
import { useDesignerContext } from '../composables'
import { DEVICE_PRESETS } from '../types'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const designer = useDesignerContext()

const pageOptions = computed(() =>
  designer.schema.pages.map((page) => ({
    label: page.name,
    value: page.id,
    disabled: !designer.runtime.canAccessPage(page.id),
  }))
)

const roleOptions = computed(() => {
  const roles = designer.schema.permissions?.roles ?? []
  const options = roles.map((role) => ({
    label: role.name,
    value: role.id,
  }))
  if (!options.some((item) => item.value === 'admin')) {
    options.unshift({ label: '管理员（全部权限）', value: 'admin' })
  }
  return options
})

const deviceOptions = computed(() =>
  DEVICE_PRESETS.map((preset) => ({
    label:
      preset.value === 'custom'
        ? '自定义'
        : `${preset.label} ${preset.width}×${preset.height}`,
    value: preset.value,
  }))
)

const allowed = computed(() =>
  designer.runtime.canAccessPage(designer.activePageId.value)
)

const themeColor = computed(() => {
  const color = designer.schema.theme?.primaryColor
  return /^#[0-9a-fA-F]{6}$/.test(color ?? '') ? (color as string) : '#1677ff'
})

const deviceStyle = computed(() => {
  const size = designer.deviceSize.value
  const rgb = hexToRgb(themeColor.value)
  return {
    width: `${size.width}px`,
    minHeight: `${Math.min(size.height, 900)}px`,
    '--w-color-primary':
      formatRgbColor(rgb ?? themeColor.value, ' ') ?? undefined,
  }
})

function onRoleChange(value: unknown) {
  designer.previewUser.role = String(value)
}

function refresh() {
  designer.runtime.refreshAutoQueries()
}
</script>
