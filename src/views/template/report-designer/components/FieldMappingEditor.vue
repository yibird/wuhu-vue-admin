<script setup lang="ts">
import type {
  FieldMappingMode,
  ReportField,
  ReportFieldMappingItem,
} from '../types'

const props = defineProps<{
  field: ReportField
}>()

const emit = defineEmits<{
  updateField: [patch: Partial<ReportField>]
}>()

const modeOptions = [
  { label: '内部字典', value: 'manual' },
  { label: '映射源', value: 'source' },
]

const mappingItems = computed(() => props.field.mappingItems ?? [])
const mappingMode = computed(() => props.field.mappingMode ?? 'manual')

function updateMappingEnabled(value: boolean) {
  emit('updateField', {
    mappingEnabled: value,
    mappingItems:
      value && !mappingItems.value.length
        ? [
            { key: '1', label: '开启' },
            { key: '0', label: '关闭' },
          ]
        : mappingItems.value,
    mappingKeyField: props.field.mappingKeyField || 'value',
    mappingLabelField: props.field.mappingLabelField || 'label',
    mappingMode: props.field.mappingMode ?? 'manual',
  })
}

function updateMappingMode(value: string) {
  emit('updateField', { mappingMode: value as FieldMappingMode })
}

function addMappingItem() {
  emit('updateField', {
    mappingItems: [...mappingItems.value, { key: '', label: '' }],
  })
}

function updateMappingItem(
  index: number,
  patch: Partial<ReportFieldMappingItem>
) {
  emit('updateField', {
    mappingItems: mappingItems.value.map((item, itemIndex) => {
      return itemIndex === index ? { ...item, ...patch } : item
    }),
  })
}

function removeMappingItem(index: number) {
  emit('updateField', {
    mappingItems: mappingItems.value.filter(
      (_, itemIndex) => itemIndex !== index
    ),
  })
}
</script>

<template>
  <div class="mapping-editor">
    <div class="mapping-editor__head">
      <span>
        <Icon name="i-lucide:git-branch" :size="14" />
        值映射
      </span>
      <a-switch
        :checked="!!field.mappingEnabled"
        size="small"
        @change="updateMappingEnabled(Boolean($event))"
      />
    </div>

    <div v-if="field.mappingEnabled" class="mapping-editor__body">
      <a-segmented
        :options="modeOptions"
        :value="mappingMode"
        @change="updateMappingMode(String($event))"
      />

      <div v-if="mappingMode === 'manual'" class="mapping-editor__manual">
        <div
          v-for="(item, index) in mappingItems"
          :key="`${field.key}-mapping-${index}`"
          class="mapping-editor__row"
        >
          <a-input
            :value="item.key"
            placeholder="映射 key"
            @update:value="updateMappingItem(index, { key: String($event) })"
          />
          <a-input
            :value="item.label"
            placeholder="映射 label"
            @update:value="updateMappingItem(index, { label: String($event) })"
          />
          <a-button danger size="small" @click="removeMappingItem(index)">
            <template #icon>
              <Icon name="i-lucide:x" />
            </template>
          </a-button>
        </div>

        <a-button block size="small" @click="addMappingItem">
          <template #icon>
            <Icon name="i-lucide:plus" />
          </template>
          添加映射
        </a-button>
      </div>

      <div v-if="mappingMode === 'source'" class="mapping-editor__source">
        <div class="mapping-editor__source-fields">
          <label>
            <span>映射 key</span>
            <a-input
              :value="field.mappingKeyField || 'value'"
              placeholder="映射 key 字段"
              @update:value="
                emit('updateField', { mappingKeyField: String($event) })
              "
            />
          </label>
          <label>
            <span>映射 label</span>
            <a-input
              :value="field.mappingLabelField || 'label'"
              placeholder="映射 label 字段"
              @update:value="
                emit('updateField', { mappingLabelField: String($event) })
              "
            />
          </label>
        </div>

        <a-textarea
          :auto-size="{ minRows: 3, maxRows: 6 }"
          :value="field.mappingSource"
          placeholder='[{"value":1,"label":"开启"}]'
          @update:value="emit('updateField', { mappingSource: String($event) })"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.mapping-editor {
  display: grid;
  gap: 8px;
  min-width: 0;
  padding-top: 10px;
  margin-top: 10px;
  border-top: 1px dashed rgb(var(--w-border-color-2));
}

.mapping-editor__head {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
}

.mapping-editor__head span {
  display: inline-flex;
  gap: 5px;
  align-items: center;
  font-size: 12px;
  font-weight: 800;
  color: rgb(var(--w-text-color-2));
}

.mapping-editor__body,
.mapping-editor__manual,
.mapping-editor__source {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.mapping-editor__row {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1fr) auto;
  gap: 6px;
  min-width: 0;
}

.mapping-editor__source-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.mapping-editor__source-fields label {
  display: grid;
  gap: 5px;
  min-width: 0;
}

.mapping-editor__source-fields span {
  font-size: 12px;
  font-weight: 700;
  color: rgb(var(--w-text-color-3));
}

@media (width <= 640px) {
  .mapping-editor__row,
  .mapping-editor__source-fields {
    grid-template-columns: 1fr;
  }
}
</style>
