<template>
  <div
    class="p-10"
    :class="{ 'rounded-2 border-1 border-color-2 border-solid': bordered }"
  >
    <a-tooltip v-if="showCopy" title="复制 JSON">
      <a-button
        class="float-right ml-10"
        type="text"
        size="small"
        aria-label="复制 JSON"
        :disabled="!isSupported"
        @click.stop="onCopy"
      >
        <template #icon>
          <Icon name="i-lucide:copy" :size="18" />
        </template>
      </a-button>
    </a-tooltip>
    <vue-json-pretty
      v-bind="restProps"
      :show-icon="showIcon"
      v-model:data="data"
      v-model:selected-value="selectedValue"
      @node-click="emits('nodeClick', $event)"
      @node-mouseover="emits('nodeMouseover', $event)"
      @brackets-click="onBracketsClick"
      @icon-click="onIconClick"
      @selected-change="onSelectedChange"
    />
  </div>
</template>
<script lang="ts" setup>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import type { JsonSelectedValue, JsonViewEmits, JsonViewProps } from './types'
import type { NodeDataType } from 'vue-json-pretty/types/components/TreeNode'
import { useClipboard } from '@vueuse/core'
import { message } from 'antdv-next'
defineOptions({ inheritAttrs: false })

const data = defineModel<JsonViewProps['data']>('data', {
  default: () => ({}),
})
const selectedValue = defineModel<JsonSelectedValue>('selectedValue')
const {
  bordered = true,
  showCopy = true,
  showIcon = true,
  ...restProps
} = defineProps<JsonViewProps>()
const emits = defineEmits<JsonViewEmits>()

const { copy, isSupported } = useClipboard()

function onBracketsClick(collapsed: boolean, node: NodeDataType) {
  emits('bracketsClick', collapsed, node)
}

function onIconClick(collapsed: boolean, node: NodeDataType) {
  emits('iconClick', collapsed, node)
}

function onSelectedChange(
  newValue: JsonSelectedValue,
  oldValue: JsonSelectedValue
) {
  emits('selectedChange', newValue, oldValue)
}

async function onCopy() {
  if (!isSupported.value) {
    message.warning('当前环境不支持剪贴板操作')
    return
  }

  try {
    await copy(JSON.stringify(data.value, null, 2))
    message.success('复制成功')
    emits('copy', data.value)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    message.error(`复制失败：${errorMessage}`)
  }
}
</script>
