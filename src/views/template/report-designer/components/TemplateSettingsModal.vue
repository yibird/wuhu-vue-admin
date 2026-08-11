<script setup lang="ts">
import type {
  PermissionMode,
  ReportDensity,
  ReportOrientation,
  ReportPaperSize,
  ReportSettings,
  ReportTemplateType,
  ReportTheme,
} from '../types'

defineProps<{
  open: boolean
  settings: ReportSettings
}>()

const emit = defineEmits<{
  'update:open': [open: boolean]
  updateSettings: [patch: Partial<ReportSettings>]
}>()

const themeOptions = [
  { label: '默认', value: 'default' },
  { label: '墨色', value: 'ink' },
  { label: '青绿', value: 'teal' },
  { label: '琥珀', value: 'amber' },
  { label: '钢蓝', value: 'steel' },
]

const densityOptions = [
  { label: '紧凑', value: 'compact' },
  { label: '标准', value: 'standard' },
  { label: '舒展', value: 'comfortable' },
]

const templateTypeOptions = [
  { label: '明细表', value: 'detail' },
  { label: '汇总表', value: 'summary' },
  { label: '分组报表', value: 'group' },
  { label: '主从报表', value: 'masterDetail' },
  { label: '标签打印', value: 'label' },
  { label: '出库单', value: 'delivery' },
  { label: '入库单', value: 'inbound' },
  { label: '发票', value: 'invoice' },
  { label: '对账单', value: 'statement' },
  { label: 'BI 报表', value: 'bi' },
  { label: '财务报表', value: 'finance' },
]

const paperSizeOptions = [
  { label: 'A4', value: 'A4' },
  { label: 'A5', value: 'A5' },
  { label: 'Letter', value: 'Letter' },
  { label: '标签纸 100x150', value: 'label100x150' },
]

const orientationOptions = [
  { label: '纵向', value: 'portrait' },
  { label: '横向', value: 'landscape' },
]

const permissionModeOptions = [
  { label: '继承菜单权限', value: 'inherit' },
  { label: '模板级权限', value: 'template' },
  { label: '仅创建者', value: 'private' },
]

function updateTheme(value: string) {
  emit('updateSettings', { theme: value as ReportTheme })
}

function updateDensity(value: string) {
  emit('updateSettings', { density: value as ReportDensity })
}

function updateTemplateType(value: string) {
  emit('updateSettings', { templateType: value as ReportTemplateType })
}

function updatePaperSize(value: string) {
  emit('updateSettings', { paperSize: value as ReportPaperSize })
}

function updateOrientation(value: string) {
  emit('updateSettings', { orientation: value as ReportOrientation })
}

function updatePermissionMode(value: string) {
  emit('updateSettings', { permissionMode: value as PermissionMode })
}
</script>

<template>
  <a-modal
    :open="open"
    :width="760"
    cancel-text="关闭"
    class="report-template-settings-modal"
    destroy-on-hidden
    ok-text="完成"
    title="模板设置"
    @cancel="emit('update:open', false)"
    @ok="emit('update:open', false)"
    @update:open="emit('update:open', $event)"
  >
    <div class="grid gap-12px">
      <section
        class="grid gap-12px rounded-8px border-1 border-color-2 border-solid bg-page p-12px"
      >
        <div class="flex items-center gap-8px">
          <Icon name="i-lucide:file-text" :size="18" class="text-info" />
          <h3 class="m-0 text-15px text-primary font-700">基础信息</h3>
        </div>

        <label class="grid gap-6px">
          <span class="text-12px text-tertiary font-700">报表标题</span>
          <a-input
            :value="settings.title"
            @update:value="emit('updateSettings', { title: String($event) })"
          />
        </label>

        <label class="grid gap-6px">
          <span class="text-12px text-tertiary font-700">副标题</span>
          <a-input
            :value="settings.subtitle"
            @update:value="emit('updateSettings', { subtitle: String($event) })"
          />
        </label>

        <div class="grid grid-cols-1 gap-10px md:grid-cols-2">
          <label class="grid gap-6px">
            <span class="text-12px text-tertiary font-700">报表类型</span>
            <a-select
              :options="templateTypeOptions"
              :value="settings.templateType"
              @update:value="updateTemplateType(String($event))"
            />
          </label>
          <label class="grid gap-6px">
            <span class="text-12px text-tertiary font-700">文件名</span>
            <a-input
              :value="settings.fileName"
              @update:value="
                emit('updateSettings', { fileName: String($event) })
              "
            />
          </label>
          <label class="grid gap-6px">
            <span class="text-12px text-tertiary font-700">Sheet</span>
            <a-input
              :value="settings.sheetName"
              @update:value="
                emit('updateSettings', { sheetName: String($event) })
              "
            />
          </label>
        </div>
      </section>

      <section
        class="grid gap-12px rounded-8px border-1 border-color-2 border-solid bg-page p-12px"
      >
        <div class="flex items-center gap-8px">
          <Icon name="i-lucide:palette" :size="18" class="text-info" />
          <h3 class="m-0 text-15px text-primary font-700">显示样式</h3>
        </div>

        <label class="grid gap-6px">
          <span class="text-12px text-tertiary font-700">主题</span>
          <a-segmented
            :options="themeOptions"
            :value="settings.theme"
            @change="updateTheme(String($event))"
          />
        </label>

        <label class="grid gap-6px">
          <span class="text-12px text-tertiary font-700">密度</span>
          <a-segmented
            :options="densityOptions"
            :value="settings.density"
            @change="updateDensity(String($event))"
          />
        </label>

        <div class="grid grid-cols-1 gap-8px md:grid-cols-3">
          <label
            class="flex items-center gap-8px rounded-8px border-1 border-color-1 border-solid bg-container px-10px py-9px"
          >
            <a-switch
              :checked="settings.showIndex"
              @change="emit('updateSettings', { showIndex: Boolean($event) })"
            />
            <span class="text-13px text-secondary">序号列</span>
          </label>
          <label
            class="flex items-center gap-8px rounded-8px border-1 border-color-1 border-solid bg-container px-10px py-9px"
          >
            <a-switch
              :checked="settings.showSummary"
              @change="emit('updateSettings', { showSummary: Boolean($event) })"
            />
            <span class="text-13px text-secondary">汇总卡</span>
          </label>
          <label
            class="flex items-center gap-8px rounded-8px border-1 border-color-1 border-solid bg-container px-10px py-9px"
          >
            <a-switch
              :checked="settings.showFooter"
              @change="emit('updateSettings', { showFooter: Boolean($event) })"
            />
            <span class="text-13px text-secondary">页脚</span>
          </label>
        </div>

        <div class="grid grid-cols-1 gap-10px md:grid-cols-[1fr_180px]">
          <label class="grid gap-6px">
            <span class="text-12px text-tertiary font-700">页脚水印</span>
            <a-input
              :value="settings.watermark"
              @update:value="
                emit('updateSettings', { watermark: String($event) })
              "
            />
          </label>
          <label class="grid gap-6px">
            <span class="text-12px text-tertiary font-700">预览行数</span>
            <a-input-number
              class="w-full"
              :max="500"
              :min="10"
              :value="settings.previewLimit"
              @update:value="
                emit('updateSettings', { previewLimit: Number($event) || 50 })
              "
            />
          </label>
        </div>
      </section>

      <section
        class="grid gap-12px rounded-8px border-1 border-color-2 border-solid bg-page p-12px"
      >
        <div class="flex items-center gap-8px">
          <Icon name="i-lucide:printer" :size="18" class="text-info" />
          <h3 class="m-0 text-15px text-primary font-700">打印分页</h3>
        </div>

        <div class="grid grid-cols-1 gap-10px md:grid-cols-2">
          <label class="grid gap-6px">
            <span class="text-12px text-tertiary font-700">纸张</span>
            <a-select
              :options="paperSizeOptions"
              :value="settings.paperSize"
              @update:value="updatePaperSize(String($event))"
            />
          </label>
          <label class="grid gap-6px">
            <span class="text-12px text-tertiary font-700">方向</span>
            <a-segmented
              :options="orientationOptions"
              :value="settings.orientation"
              @change="updateOrientation(String($event))"
            />
          </label>
        </div>

        <div class="grid grid-cols-2 gap-10px md:grid-cols-4">
          <label class="grid gap-6px">
            <span class="text-12px text-tertiary font-700">上边距 mm</span>
            <a-input-number
              class="w-full"
              :max="50"
              :min="0"
              :value="settings.marginTop"
              @update:value="
                emit('updateSettings', { marginTop: Number($event) || 0 })
              "
            />
          </label>
          <label class="grid gap-6px">
            <span class="text-12px text-tertiary font-700">右边距 mm</span>
            <a-input-number
              class="w-full"
              :max="50"
              :min="0"
              :value="settings.marginRight"
              @update:value="
                emit('updateSettings', { marginRight: Number($event) || 0 })
              "
            />
          </label>
          <label class="grid gap-6px">
            <span class="text-12px text-tertiary font-700">下边距 mm</span>
            <a-input-number
              class="w-full"
              :max="50"
              :min="0"
              :value="settings.marginBottom"
              @update:value="
                emit('updateSettings', { marginBottom: Number($event) || 0 })
              "
            />
          </label>
          <label class="grid gap-6px">
            <span class="text-12px text-tertiary font-700">左边距 mm</span>
            <a-input-number
              class="w-full"
              :max="50"
              :min="0"
              :value="settings.marginLeft"
              @update:value="
                emit('updateSettings', { marginLeft: Number($event) || 0 })
              "
            />
          </label>
        </div>

        <div class="grid grid-cols-1 gap-10px md:grid-cols-2">
          <label class="grid gap-6px">
            <span class="text-12px text-tertiary font-700">页眉</span>
            <a-input
              :value="settings.pageHeader"
              @update:value="
                emit('updateSettings', { pageHeader: String($event) })
              "
            />
          </label>
          <label class="grid gap-6px">
            <span class="text-12px text-tertiary font-700">页脚</span>
            <a-input
              :value="settings.pageFooter"
              @update:value="
                emit('updateSettings', { pageFooter: String($event) })
              "
            />
          </label>
        </div>

        <label
          class="flex items-center gap-8px rounded-8px border-1 border-color-1 border-solid bg-container px-10px py-9px"
        >
          <a-switch
            :checked="settings.repeatTableHeader"
            @change="
              emit('updateSettings', { repeatTableHeader: Boolean($event) })
            "
          />
          <span class="text-13px text-secondary">分页时重复表头</span>
        </label>
      </section>

      <section
        class="grid gap-12px rounded-8px border-1 border-color-2 border-solid bg-page p-12px"
      >
        <div class="flex items-center gap-8px">
          <Icon name="i-lucide:shield-check" :size="18" class="text-info" />
          <h3 class="m-0 text-15px text-primary font-700">权限与性能</h3>
        </div>

        <label class="grid gap-6px">
          <span class="text-12px text-tertiary font-700">权限模式</span>
          <a-select
            :options="permissionModeOptions"
            :value="settings.permissionMode"
            @update:value="updatePermissionMode(String($event))"
          />
        </label>

        <div class="grid grid-cols-1 gap-10px md:grid-cols-2">
          <label class="grid gap-6px">
            <span class="text-12px text-tertiary font-700">异步导出阈值</span>
            <a-input-number
              class="w-full"
              :min="1000"
              :step="10000"
              :value="settings.asyncExportThreshold"
              @update:value="
                emit('updateSettings', {
                  asyncExportThreshold: Number($event) || 100000,
                })
              "
            />
          </label>
          <label class="grid gap-6px">
            <span class="text-12px text-tertiary font-700">流式导出阈值</span>
            <a-input-number
              class="w-full"
              :min="10000"
              :step="100000"
              :value="settings.streamExportThreshold"
              @update:value="
                emit('updateSettings', {
                  streamExportThreshold: Number($event) || 1000000,
                })
              "
            />
          </label>
        </div>
      </section>
    </div>
  </a-modal>
</template>
