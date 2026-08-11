<script setup lang="ts">
import { computed } from 'vue'
import type {
  ReportField,
  ReportRow,
  ReportSettings,
  ReportSummary,
} from '../types'

const props = withDefaults(
  defineProps<{
    fields: ReportField[]
    formatCell: (value: unknown, field: ReportField, row?: ReportRow) => string
    previewRows: ReportRow[]
    rowCount: number
    settings: ReportSettings
    stats: Array<{ label: string; value: string }>
    summaries: ReportSummary[]
    viewMode?: 'table' | 'chart'
    warning: string
  }>(),
  {
    viewMode: 'table',
  }
)

const numericFieldTypes = new Set(['number', 'currency', 'percent'])

const chartField = computed(() => {
  return (
    props.fields.find((field) => numericFieldTypes.has(field.type)) ??
    props.fields[0]
  )
})

const labelField = computed(() => {
  return (
    props.fields.find((field) => field.type === 'string' && field.enabled) ??
    props.fields[0]
  )
})

const chartItems = computed(() => {
  const field = chartField.value
  if (!field) return []

  return props.previewRows.slice(0, 8).map((row, index) => {
    const rawValue = row[field.key]
    const numericValue =
      typeof rawValue === 'number'
        ? rawValue
        : Number(String(rawValue ?? '').replaceAll(',', ''))

    return {
      index,
      label: String(
        row[labelField.value?.key ?? field.key] ?? `Row ${index + 1}`
      ),
      value: Number.isFinite(numericValue) ? Math.abs(numericValue) : index + 1,
      valueText: props.formatCell(rawValue, field, row),
    }
  })
})

const maxChartValue = computed(() => {
  return Math.max(...chartItems.value.map((item) => item.value), 1)
})

function getRowKey(row: ReportRow, index: number) {
  const firstField = props.fields[0]
  const value = firstField ? row[firstField.key] : undefined
  return `${String(value ?? 'row')}-${index}`
}
</script>

<template>
  <section
    class="designer-canvas"
    :class="[
      `designer-canvas--${settings.theme}`,
      `designer-canvas--${settings.density}`,
    ]"
  >
    <div class="designer-canvas__top">
      <div>
        <span>Live Preview</span>
        <h2>{{ settings.title }}</h2>
        <p>{{ settings.subtitle }}</p>
      </div>
      <div class="designer-canvas__stats">
        <article v-for="stat in stats" :key="stat.label">
          <span>{{ stat.label }}</span>
          <strong>{{ stat.value }}</strong>
        </article>
      </div>
    </div>

    <div v-if="summaries.length" class="designer-canvas__summary">
      <article v-for="summary in summaries" :key="summary.key">
        <span>{{ summary.label }}</span>
        <strong>{{ summary.value }}</strong>
      </article>
    </div>

    <div v-if="warning" class="designer-canvas__warning">
      <Icon name="i-lucide:triangle-alert" :size="16" />
      <span>{{ warning }}</span>
    </div>

    <div v-if="viewMode === 'table'" class="designer-canvas__table-wrap">
      <table class="designer-canvas__table">
        <thead>
          <tr>
            <th v-if="settings.showIndex" class="designer-canvas__index">
              序号
            </th>
            <th
              v-for="field in fields"
              :key="field.key"
              :style="{ textAlign: field.align, width: `${field.width}px` }"
            >
              {{ field.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, rowIndex) in previewRows"
            :key="getRowKey(row, rowIndex)"
          >
            <td v-if="settings.showIndex" class="designer-canvas__index">
              {{ rowIndex + 1 }}
            </td>
            <td
              v-for="field in fields"
              :key="field.key"
              :style="{ textAlign: field.align, width: `${field.width}px` }"
            >
              {{ formatCell(row[field.key], field, row) }}
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!previewRows.length" class="designer-canvas__empty">
        <Icon name="i-lucide:table" :size="28" />
        <span>暂无数据</span>
      </div>
    </div>

    <div v-else class="designer-canvas__chart-wrap">
      <div class="designer-canvas__chart-head">
        <div>
          <span>Chart View</span>
          <strong>{{ chartField?.label ?? '无可视化字段' }}</strong>
        </div>
        <small>展示前 {{ chartItems.length }} 条预览数据</small>
      </div>

      <div v-if="chartItems.length" class="designer-canvas__chart">
        <div
          v-for="item in chartItems"
          :key="`${item.label}-${item.index}`"
          class="designer-canvas__bar-row"
        >
          <span class="designer-canvas__bar-label">{{ item.label }}</span>
          <div class="designer-canvas__bar-track">
            <i
              class="designer-canvas__bar"
              :style="{
                width: `${Math.max(8, (item.value / maxChartValue) * 100)}%`,
              }"
            ></i>
          </div>
          <strong>{{ item.valueText }}</strong>
        </div>
      </div>

      <div v-else class="designer-canvas__empty">
        <Icon name="i-lucide:chart-no-axes-combined" :size="28" />
        <span>暂无可视化数据</span>
      </div>
    </div>

    <footer v-if="settings.showFooter" class="designer-canvas__footer">
      <span>{{ settings.watermark }}</span>
      <span
        >{{ settings.paperSize }} ·
        {{ settings.orientation === 'portrait' ? '纵向' : '横向' }}</span
      >
      <span>预览 {{ previewRows.length }} / {{ rowCount }} 行</span>
    </footer>
  </section>
</template>

<style scoped lang="less">
.designer-canvas {
  --designer-accent: #0f766e;
  --designer-header-bg: var(--designer-accent);
  --designer-header-text: #fff;

  display: grid;
  grid-template-rows: auto auto auto minmax(0, 1fr) auto;
  min-height: 0;
  overflow: hidden;
  background: rgb(var(--w-bg-container));
  border: 1px solid rgb(var(--w-border-color-2));
  border-radius: 8px;
}

.designer-canvas__top {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.5fr);
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid rgb(var(--w-border-color-1));
}

.designer-canvas__top span {
  display: block;
  font-size: 12px;
  font-weight: 800;
  color: var(--designer-accent);
}

.designer-canvas__top h2 {
  margin: 4px 0 0;
  font-size: 22px;
  line-height: 1.25;
  color: rgb(var(--w-text-color));
}

.designer-canvas__top p {
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: rgb(var(--w-text-color-2));
}

.designer-canvas__stats,
.designer-canvas__summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.designer-canvas__stats article,
.designer-canvas__summary article {
  min-width: 0;
  padding: 10px;
  background: rgb(var(--w-bg-page));
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 8px;
}

.designer-canvas__stats strong,
.designer-canvas__summary strong {
  display: block;
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 18px;
  line-height: 1.15;
  color: rgb(var(--w-text-color));
  white-space: nowrap;
}

.designer-canvas__summary {
  padding: 12px 16px;
}

.designer-canvas__summary article {
  border-top: 3px solid var(--designer-accent);
}

.designer-canvas__warning {
  display: flex;
  gap: 8px;
  align-items: center;
  min-height: 36px;
  padding: 0 16px;
  font-size: 12px;
  color: #92400e;
  background: rgb(245 158 11 / 10%);
  border-top: 1px solid rgb(245 158 11 / 18%);
  border-bottom: 1px solid rgb(245 158 11 / 18%);
}

.designer-canvas__table-wrap {
  position: relative;
  min-height: 0;
  overflow: auto;
}

.designer-canvas__chart-wrap {
  position: relative;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  min-height: 0;
  padding: 16px;
  overflow: hidden;
}

.designer-canvas__chart-head {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: 12px;
}

.designer-canvas__chart-head span {
  display: block;
  font-size: 12px;
  font-weight: 800;
  color: var(--designer-accent);
}

.designer-canvas__chart-head strong {
  display: block;
  margin-top: 4px;
  font-size: 18px;
  color: rgb(var(--w-text-color));
}

.designer-canvas__chart-head small {
  color: rgb(var(--w-text-color-3));
}

.designer-canvas__chart {
  display: grid;
  gap: 12px;
  align-content: start;
  min-height: 0;
  overflow: auto;
}

.designer-canvas__bar-row {
  display: grid;
  grid-template-columns: minmax(110px, 0.28fr) minmax(160px, 1fr) minmax(
      86px,
      auto
    );
  gap: 10px;
  align-items: center;
  min-width: 0;
}

.designer-canvas__bar-label {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  color: rgb(var(--w-text-color-2));
  white-space: nowrap;
}

.designer-canvas__bar-track {
  height: 12px;
  overflow: hidden;
  background: rgb(var(--w-bg-page));
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 999px;
}

.designer-canvas__bar {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--designer-accent), rgb(20 184 166));
  border-radius: inherit;
}

.designer-canvas__bar-row strong {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  color: rgb(var(--w-text-color));
  text-align: right;
  white-space: nowrap;
}

.designer-canvas__table {
  min-width: 100%;
  border-spacing: 0;
  border-collapse: separate;
}

.designer-canvas__table th,
.designer-canvas__table td {
  min-width: 80px;
  padding: var(--designer-cell-padding);
  font-size: 13px;
  line-height: 1.45;
  vertical-align: middle;
  white-space: nowrap;
  border-right: 1px solid rgb(var(--w-border-color-1));
  border-bottom: 1px solid rgb(var(--w-border-color-1));
}

.designer-canvas__table th {
  position: sticky;
  top: 0;
  z-index: 1;
  font-weight: 800;
  color: var(--designer-header-text);
  background: var(--designer-header-bg);
}

.designer-canvas__table td {
  color: rgb(var(--w-text-color-2));
  background: rgb(var(--w-bg-container));
}

.designer-canvas__table tbody tr:nth-child(even) td {
  background: rgb(var(--w-bg-page));
}

.designer-canvas__index {
  width: 64px;
  min-width: 64px;
  text-align: center;
}

.designer-canvas__empty {
  position: absolute;
  inset: 0;
  display: grid;
  gap: 8px;
  place-content: center;
  color: rgb(var(--w-text-color-3));
}

.designer-canvas__footer {
  display: flex;
  gap: 10px;
  justify-content: space-between;
  min-height: 38px;
  padding: 0 16px;
  font-size: 12px;
  line-height: 38px;
  color: rgb(var(--w-text-color-3));
  border-top: 1px solid rgb(var(--w-border-color-1));
}

.designer-canvas--default {
  --designer-accent: #64748b;
  --designer-header-bg: transparent;
  --designer-header-text: rgb(var(--w-text-color));
}

.designer-canvas--ink {
  --designer-accent: #111827;
}

.designer-canvas--teal {
  --designer-accent: #0f766e;
}

.designer-canvas--amber {
  --designer-accent: #b45309;
}

.designer-canvas--steel {
  --designer-accent: #2563eb;
}

.designer-canvas--compact {
  --designer-cell-padding: 6px 8px;
}

.designer-canvas--standard {
  --designer-cell-padding: 9px 10px;
}

.designer-canvas--comfortable {
  --designer-cell-padding: 12px 12px;
}

@media (width <= 960px) {
  .designer-canvas__top,
  .designer-canvas__stats,
  .designer-canvas__summary {
    grid-template-columns: 1fr;
  }
}
</style>
