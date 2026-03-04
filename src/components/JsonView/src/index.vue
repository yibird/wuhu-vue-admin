<template>
  <div class="p-10" :class="{ 'border-1 border-solid border-[#eee] rounded-2': bordered }">
    <Icon
      v-if="showCopy"
      name="i-lucide:copy"
      :size="18"
      class="float-right ml-10 cursor-pointer"
      @click="onCopy"
    />
    <vue-json-pretty
      v-bind="restProps"
      v-on="$attrs"
      showIcon
      v-model:data="data"
      v-model:selectedValue="selectedValue"
    />
  </div>
</template>
<script lang="ts" setup>
  import VueJsonPretty from 'vue-json-pretty'
  import 'vue-json-pretty/lib/styles.css'
  import type { JsonViewProps, JsonViewEmits } from './types'
  import { useClipboard } from '@vueuse/core'
  import { useMessage } from 'naive-ui'
  defineOptions({ inheritAttrs: false })

  const data = defineModel<JsonViewProps['data']>('data', {
    type: Object,
    default: () => {}
  })
  const selectedValue = defineModel<string | Array<string>>('selectedValue')
  const {
    bordered = true,
    showCopy = true,
    showIcon = true,
    ...restProps
  } = defineProps<JsonViewProps>()
  const emits = defineEmits<JsonViewEmits>()

  const message = useMessage()
  const { copy, isSupported } = useClipboard()
  const onCopy = () => {
    if (!isSupported) return
    copy(JSON.stringify(data.value))
      .then(() => {
        message.success('复制成功')
        emits('copy', data.value)
      })
      .catch((err) => {
        message.error('复制失败:' + err.message)
      })
  }
</script>
