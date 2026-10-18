<template>
  <a-modal
    :open="open"
    title="添加数据集"
    ok-text="创建"
    cancel-text="取消"
    destroy-on-hidden
    @update:open="(value: boolean) => emits('update:open', value)"
    @ok="submit"
  >
    <a-form layout="vertical" class="pt-6">
      <a-form-item label="数据集名称" required>
        <a-input v-model:value="name" placeholder="例如：销售订单" />
      </a-form-item>

      <a-segmented
        v-model:value="mode"
        block
        :options="modeOptions"
        class="mb-12"
      />

      <template v-if="mode === 'json'">
        <a-form-item label="JSON 对象数组" required>
          <a-textarea
            v-model:value="json"
            class="font-mono"
            :auto-size="{ minRows: 9, maxRows: 16 }"
            placeholder='[{"orderNo":"SO-001","amount":1200}]'
          />
        </a-form-item>
        <a-button type="link" @click="fillSample"> 填入示例 </a-button>
      </template>

      <template v-else>
        <a-form-item label="REST 地址" required>
          <a-input
            v-model:value="url"
            placeholder="https://api.example.com/orders"
          />
        </a-form-item>
        <p class="m-0 text-xs text-secondary">
          接口需返回 JSON 对象数组；跨域请求受目标服务 CORS 配置限制。
        </p>
      </template>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    open: boolean
  }>(),
  {}
)

const emits = defineEmits<{
  'update:open': [value: boolean]
  'create-json': [payload: { name: string; json: string }]
  'create-rest': [payload: { name: string; url: string }]
}>()

const mode = shallowRef<'json' | 'rest'>('json')
const modeOptions = [
  { label: '粘贴 JSON', value: 'json' },
  { label: 'REST GET', value: 'rest' },
]
const name = shallowRef('')
const json = shallowRef('')
const url = shallowRef('')

watch(
  () => props.open,
  (open) => {
    if (!open) return
    name.value = ''
    json.value = ''
    url.value = ''
    mode.value = 'json'
  }
)

function fillSample() {
  json.value = JSON.stringify(
    [
      { orderNo: 'SO-001', region: '华东', amount: 1200 },
      { orderNo: 'SO-002', region: '华南', amount: 860 },
    ],
    null,
    2
  )
}

function submit() {
  const datasetName = name.value.trim()
  if (!datasetName) return
  if (mode.value === 'json') {
    if (!json.value.trim()) return
    emits('create-json', { name: datasetName, json: json.value })
  } else {
    if (!url.value.trim()) return
    emits('create-rest', { name: datasetName, url: url.value.trim() })
  }
  emits('update:open', false)
}
</script>
