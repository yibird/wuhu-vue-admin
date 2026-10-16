<script setup lang="ts">
import type {
  ExportFormat,
  ExportOption,
  ReportDensity,
  ReportSettings,
  ReportTheme,
} from '../types'

defineProps<{
  exportOptions: ExportOption[]
  settings: ReportSettings
}>()

const emit = defineEmits<{
  export: [format: ExportFormat]
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

function updateTheme(value: string) {
  emit('updateSettings', { theme: value as ReportTheme })
}

function updateDensity(value: string) {
  emit('updateSettings', { density: value as ReportDensity })
}
</script>

<template>
  <section class="property-panel">
    <div class="property-panel__head">
      <Icon name="i-lucide:sliders-horizontal" :size="18" />
      <h2>模板属性</h2>
    </div>

    <div class="property-panel__body">
      <div class="property-group">
        <h3>基础信息</h3>
        <label class="property-field">
          <span>报表标题</span>
          <a-input
            :value="settings.title"
            size="small"
            @update:value="emit('updateSettings', { title: String($event) })"
          />
        </label>
        <label class="property-field">
          <span>副标题</span>
          <a-input
            :value="settings.subtitle"
            size="small"
            @update:value="emit('updateSettings', { subtitle: String($event) })"
          />
        </label>
        <div class="property-panel__inline">
          <label class="property-field">
            <span>文件名</span>
            <a-input
              :value="settings.fileName"
              size="small"
              @update:value="
                emit('updateSettings', { fileName: String($event) })
              "
            />
          </label>
          <label class="property-field">
            <span>Sheet</span>
            <a-input
              :value="settings.sheetName"
              size="small"
              @update:value="
                emit('updateSettings', { sheetName: String($event) })
              "
            />
          </label>
        </div>
      </div>

      <div class="property-group">
        <h3>显示样式</h3>
        <label class="property-field">
          <span>主题</span>
          <a-segmented
            :options="themeOptions"
            :value="settings.theme"
            @change="updateTheme(String($event))"
          />
        </label>
        <label class="property-field">
          <span>密度</span>
          <a-segmented
            :options="densityOptions"
            :value="settings.density"
            @change="updateDensity(String($event))"
          />
        </label>

        <div class="property-switches">
          <label>
            <a-switch
              :checked="settings.showIndex"
              size="small"
              @change="emit('updateSettings', { showIndex: Boolean($event) })"
            />
            <span>序号列</span>
          </label>
          <label>
            <a-switch
              :checked="settings.showSummary"
              size="small"
              @change="emit('updateSettings', { showSummary: Boolean($event) })"
            />
            <span>汇总卡</span>
          </label>
          <label>
            <a-switch
              :checked="settings.showFooter"
              size="small"
              @change="emit('updateSettings', { showFooter: Boolean($event) })"
            />
            <span>页脚</span>
          </label>
        </div>

        <label class="property-field">
          <span>页脚水印</span>
          <a-input
            :value="settings.watermark"
            size="small"
            @update:value="
              emit('updateSettings', { watermark: String($event) })
            "
          />
        </label>
      </div>

      <div class="property-group">
        <h3>预览与导出</h3>
        <label class="property-field">
          <span>预览行数</span>
          <a-input-number
            :max="500"
            :min="10"
            :value="settings.previewLimit"
            size="small"
            @update:value="
              emit('updateSettings', { previewLimit: Number($event) || 50 })
            "
          />
        </label>

        <div class="property-export">
          <article v-for="option in exportOptions" :key="option.format">
            <div>
              <Icon :name="option.icon" :size="18" />
              <strong>{{ option.label }}</strong>
            </div>
            <p>{{ option.description }}</p>
            <a-button block size="small" @click="emit('export', option.format)">
              导出 {{ option.label }}
            </a-button>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">
.property-panel {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  min-height: 0;
  overflow: hidden;
  background: rgb(var(--w-bg-container));
  border: 1px solid rgb(var(--w-border-color-2));
  border-radius: 8px;
}

.property-panel__head {
  display: flex;
  gap: 8px;
  align-items: center;
  min-height: 44px;
  padding: 0 12px;
  color: #0f766e;
  border-bottom: 1px solid rgb(var(--w-border-color-1));
}

.property-panel__head h2 {
  margin: 0;
  font-size: 15px;
  color: rgb(var(--w-text-color));
}

.property-panel__body {
  display: grid;
  gap: 12px;
  align-content: start;
  min-height: 0;
  padding: 12px;
  overflow: auto;
}

.property-group {
  display: grid;
  gap: 10px;
  min-width: 0;
  padding: 12px;
  background: rgb(var(--w-bg-page));
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 8px;
}

.property-group h3 {
  margin: 0;
  font-size: 14px;
  color: rgb(var(--w-text-color));
}

.property-panel__inline {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.property-field {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.property-field > span {
  font-size: 12px;
  font-weight: 700;
  color: rgb(var(--w-text-color-3));
}

.property-switches {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.property-switches label {
  display: flex;
  gap: 6px;
  align-items: center;
  min-width: 0;
  font-size: 12px;
  color: rgb(var(--w-text-color-2));
}

.property-export {
  display: grid;
  gap: 8px;
}

.property-export article {
  min-width: 0;
  padding: 10px;
  background: rgb(var(--w-bg-container));
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 8px;
}

.property-export article > div {
  display: flex;
  gap: 7px;
  align-items: center;
  color: #0f766e;
}

.property-export strong {
  font-size: 13px;
  color: rgb(var(--w-text-color));
}

.property-export p {
  margin: 7px 0 9px;
  font-size: 12px;
  line-height: 1.55;
  color: rgb(var(--w-text-color-2));
}
</style>
