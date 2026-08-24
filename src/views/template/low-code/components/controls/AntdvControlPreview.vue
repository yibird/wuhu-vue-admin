<script setup lang="ts">
import type { DesignerNode, DesignerOption } from '../../types'

const props = defineProps<{
  node: DesignerNode
}>()

const rawProps = computed(() => props.node.props as Record<string, unknown>)

function textProp(key: string, fallback = '') {
  const value = rawProps.value[key]
  return typeof value === 'string' ? value : fallback
}

function numberProp(key: string, fallback: number) {
  const value = rawProps.value[key]
  return typeof value === 'number' ? value : fallback
}

function booleanProp(key: string, fallback = false) {
  const value = rawProps.value[key]
  return typeof value === 'boolean' ? value : fallback
}

function unknownProp(key: string) {
  return rawProps.value[key]
}

function optionsProp() {
  const value = rawProps.value.options
  return Array.isArray(value)
    ? (value.filter(
        (item): item is DesignerOption =>
          typeof item === 'object' &&
          item !== null &&
          'label' in item &&
          'value' in item
      ) ?? [])
    : []
}

const tableColumns = computed(() => {
  const value = rawProps.value.columns
  return Array.isArray(value) ? value : []
})

const tableRows = computed(() => {
  const value = rawProps.value.rows
  return Array.isArray(value) ? value : []
})
</script>

<template>
  <div class="grid gap-10">
    <div>
      <h3 class="m-0 text-base text-main font-700">{{ node.title }}</h3>
      <p class="m-0 mt-4 text-xs text-secondary">{{ node.description }}</p>
    </div>

    <a-input
      v-if="node.type === 'input'"
      :allow-clear="booleanProp('allowClear', true)"
      :placeholder="textProp('placeholder', '请输入内容')"
      :value="textProp('value')"
    >
      <template v-if="textProp('prefixIcon')" #prefix>
        <Icon :name="textProp('prefixIcon')" class="text-muted" />
      </template>
    </a-input>

    <a-textarea
      v-else-if="node.type === 'textarea'"
      :placeholder="textProp('placeholder', '请输入备注')"
      :rows="numberProp('rows', 4)"
      :value="textProp('value')"
    />

    <a-input-number
      v-else-if="node.type === 'inputNumber'"
      class="w-full"
      :max="numberProp('max', 999)"
      :min="numberProp('min', 0)"
      :prefix="textProp('prefix')"
      :step="numberProp('step', 1)"
      :value="numberProp('value', 0)"
    />

    <a-select
      v-else-if="node.type === 'select'"
      class="w-full"
      :mode="
        textProp('mode', 'default') === 'default' ? undefined : textProp('mode')
      "
      :options="optionsProp()"
      :placeholder="textProp('placeholder', '请选择')"
      :value="unknownProp('value')"
    />

    <a-radio-group
      v-else-if="node.type === 'radioGroup'"
      :button-style="textProp('buttonStyle', 'solid')"
      :option-type="textProp('optionType', 'button')"
      :options="optionsProp()"
      :value="unknownProp('value')"
    />

    <a-checkbox
      v-else-if="node.type === 'checkbox'"
      :checked="booleanProp('checked', false)"
    >
      {{ textProp('label', '复选项') }}
    </a-checkbox>

    <div v-else-if="node.type === 'switch'" class="flex items-center gap-10">
      <a-switch
        :checked="booleanProp('checked', false)"
        :checked-children="textProp('checkedText', '开')"
        :un-checked-children="textProp('uncheckedText', '关')"
      />
      <span class="text-sm text-secondary">即时生效</span>
    </div>

    <a-slider
      v-else-if="node.type === 'slider'"
      :max="numberProp('max', 100)"
      :min="numberProp('min', 0)"
      :step="numberProp('step', 1)"
      :value="numberProp('value', 0)"
    />

    <a-rate
      v-else-if="node.type === 'rate'"
      :allow-half="booleanProp('allowHalf', true)"
      :count="numberProp('count', 5)"
      :value="numberProp('value', 0)"
    />

    <a-date-picker
      v-else-if="node.type === 'datePicker'"
      class="w-full"
      :picker="textProp('picker', 'date')"
      :placeholder="textProp('placeholder', '选择日期')"
    />

    <a-image
      v-else-if="node.type === 'image'"
      :alt="textProp('alt', node.title)"
      :height="numberProp('height', 140)"
      :preview="booleanProp('preview', true)"
      :src="textProp('src')"
      :width="numberProp('width', 240)"
    />

    <a-button
      v-else-if="node.type === 'button'"
      :block="booleanProp('block', false)"
      :danger="booleanProp('danger', false)"
      :type="textProp('type', 'primary')"
    >
      {{ textProp('label', '提交') }}
    </a-button>

    <a-card v-else-if="node.type === 'card'" :title="node.title" size="small">
      <p class="m-0 text-sm text-regular leading-22px">
        {{ textProp('content', node.description) }}
      </p>
      <div
        class="mt-10 min-h-48 flex items-center justify-center rounded-6 border-1 border-dashed border-color-2 bg-fill-quaternary p-8"
      >
        <span class="text-11px text-placeholder">子组件将显示在此处</span>
      </div>
      <template #extra>
        <a class="text-primary">{{ textProp('extra', '详情') }}</a>
      </template>
    </a-card>

    <a-alert
      v-else-if="node.type === 'alert'"
      :message="textProp('message', node.title)"
      :show-icon="booleanProp('showIcon', true)"
      :type="textProp('type', 'info')"
    />

    <a-progress
      v-else-if="node.type === 'progress'"
      :percent="numberProp('percent', 0)"
      :status="textProp('status', 'normal')"
    />

    <a-tag v-else-if="node.type === 'tag'" :color="textProp('color', 'blue')">
      {{ textProp('label', node.title) }}
    </a-tag>

    <a-table
      v-else
      :columns="tableColumns"
      :data-source="tableRows"
      :pagination="false"
      size="small"
    />
  </div>
</template>
