<template>
  <a-modal
    :open="open"
    title="新建动作"
    :width="560"
    :destroy-on-close="true"
    @ok="submit"
    @cancel="emit('close')"
  >
    <div class="grid gap-12">
      <label class="grid gap-4">
        <span class="text-sm text-secondary">动作名称</span>
        <a-input v-model:value="name" placeholder="例如：提交成功后提示" />
      </label>
      <label class="grid gap-4">
        <span class="text-sm text-secondary">动作类型</span>
        <a-select
          v-model:value="type"
          :options="typeOptions"
          @change="onTypeChange"
        />
      </label>
      <div v-if="definition" class="grid gap-10">
        <span class="text-xs text-muted">{{ definition.description }}</span>
        <ActionValueControl
          v-for="param in definition.params"
          :key="param.key"
          :field="param"
          :value="params[param.key]"
          @update:value="params[param.key] = $event"
        />
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { actionRegistry } from '../../core/runtime'
import { createNodeId } from '../../core/schema'
import { useDesignerContext } from '../../composables'
import ActionValueControl from './ActionValueControl.vue'
import type { ValueSchema } from '../../core/schema/types'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  close: []
  created: [actionId: string]
}>()

const designer = useDesignerContext()
const name = ref('')
const type = ref('showMessage')
const params = ref<Record<string, ValueSchema>>({})

const typeOptions = computed(() =>
  actionRegistry.list().map((item) => ({
    label: item.label,
    value: item.type,
  }))
)
const definition = computed(() => actionRegistry.get(type.value))

function resetParams() {
  const next: Record<string, ValueSchema> = {}
  for (const param of definition.value?.params ?? []) {
    next[param.key] = {
      type: 'value',
      value: param.defaultValue ?? '',
    }
  }
  params.value = next
}

function onTypeChange() {
  resetParams()
}

watch(
  () => props.open,
  (open) => {
    if (!open) return
    name.value = ''
    type.value = actionRegistry.list()[0]?.type ?? 'showMessage'
    resetParams()
  }
)

function submit() {
  if (!definition.value) return
  const id = createNodeId('action')
  const actionName = name.value || definition.value.label
  designer.editSection('actions', '新增动作', (actions) => {
    actions.push({
      id,
      name: actionName,
      type: type.value,
      params: { ...params.value },
    })
  })
  emit('created', id)
  emit('close')
}
</script>
