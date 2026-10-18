<template>
  <a-drawer
    :open="open"
    :size="520"
    :styles="{ body: { padding: 0 } }"
    title="管理分组流程"
    @close="open = false"
  >
    <div class="h-full min-h-0 flex flex-col">
      <div class="shrink-0 border-b-1 border-color-2 border-b-solid p-12">
        <div class="mb-8 flex items-center justify-between gap-8">
          <span class="min-w-0 truncate text-sm text-main font-700">
            {{ group?.name ?? '流程分组' }}
          </span>
          <span class="shrink-0 text-xs text-secondary">
            已选 {{ selectedIds.size }} 个
          </span>
        </div>
        <a-input-search
          v-model:value="keyword"
          allow-clear
          placeholder="搜索流程名称或编码"
        />
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto p-12">
        <a-spin :spinning="loading">
          <a-empty
            v-if="!loading && !filteredDefinitions.length"
            description="暂无可分配的审批流程"
          />
          <div v-else class="grid gap-6">
            <label
              v-for="item in filteredDefinitions"
              :key="item.id"
              class="flex items-start gap-10 rounded-7 border-1 border-solid px-10 py-9 transition-colors"
              :class="
                selectedIds.has(item.id)
                  ? 'border-primary/30 bg-primary/5'
                  : 'border-color-2 bg-container hover:bg-hover'
              "
              :title="disabledReason(item)"
            >
              <a-checkbox
                :checked="selectedIds.has(item.id)"
                :disabled="!!disabledReason(item)"
                class="mt-2"
                @change="
                  toggle(item.id, ($event.target as HTMLInputElement).checked)
                "
              />
              <span class="min-w-0 flex-1">
                <span class="flex flex-wrap items-center gap-6">
                  <span class="truncate text-xs text-main font-600">
                    {{ item.name }}
                  </span>
                  <a-tag :bordered="false" :color="stateMeta[item.state].color">
                    {{ stateMeta[item.state].label }}
                  </a-tag>
                </span>
                <span class="mt-3 block truncate text-11px text-secondary">
                  {{ item.code }} · {{ item.categoryName }}
                  <template v-if="disabledReason(item)">
                    · {{ disabledReason(item) }}
                  </template>
                </span>
              </span>
            </label>
          </div>
        </a-spin>
      </div>

      <footer
        class="shrink-0 flex items-center justify-end gap-8 border-t-1 border-color-2 border-t-solid p-12"
      >
        <a-button @click="open = false">取消</a-button>
        <a-button type="primary" :loading="saving" @click="handleSave">
          保存
        </a-button>
      </footer>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { message } from 'antdv-next'
import {
  getApprovalDefinitionPageListApi,
  getApprovalGroupPageListApi,
  updateApprovalGroupApi,
} from '@/apis'
import { definitionStateMeta } from '../../shared'
import type { ApprovalDefinitionResp, ApprovalGroupResp } from '@/apis'

const props = defineProps<{
  /**
   * @desc 当前分组
   */
  group?: ApprovalGroupResp
}>()

const open = defineModel<boolean>('open', { required: true })

const emits = defineEmits<{
  /**
   * @desc 分组流程保存成功
   */
  success: []
}>()

const stateMeta = definitionStateMeta
const keyword = shallowRef('')
const loading = shallowRef(false)
const saving = shallowRef(false)
const definitions = shallowRef<ApprovalDefinitionResp[]>([])
const groups = shallowRef<ApprovalGroupResp[]>([])
const selectedIds = shallowRef(new Set<string>())

const otherGroupMap = computed(() => {
  const map = new Map<string, string>()
  groups.value.forEach((group) => {
    if (group.id === props.group?.id) return
    group.definitionIds.forEach((id) => map.set(id, group.name))
  })
  return map
})

const filteredDefinitions = computed(() => {
  const text = keyword.value.trim().toLowerCase()
  if (!text) return definitions.value
  return definitions.value.filter(
    (item) =>
      item.name.toLowerCase().includes(text) ||
      item.code.toLowerCase().includes(text)
  )
})

watch(open, (isOpen) => {
  if (!isOpen) return
  void loadData()
})

async function loadData() {
  loading.value = true
  try {
    const [definitionResponse, groupResponse] = await Promise.all([
      getApprovalDefinitionPageListApi({ current: 1, pageSize: 500 }),
      getApprovalGroupPageListApi({ current: 1, pageSize: 500 }),
    ])
    definitions.value = definitionResponse.data?.list ?? []
    groups.value = groupResponse.data?.list ?? []
    selectedIds.value = new Set(props.group?.definitionIds ?? [])
    keyword.value = ''
  } catch {
    // 业务错误已由请求层统一提示
  } finally {
    loading.value = false
  }
}

function disabledReason(item: ApprovalDefinitionResp) {
  const groupName = otherGroupMap.value.get(item.id)
  return groupName ? `已归入「${groupName}」` : ''
}

function toggle(id: string, checked: boolean) {
  const item = definitions.value.find((definition) => definition.id === id)
  if (!item || disabledReason(item)) return

  const next = new Set(selectedIds.value)
  if (checked) next.add(id)
  else next.delete(id)
  selectedIds.value = next
}

async function handleSave() {
  if (!props.group) return
  saving.value = true
  try {
    await updateApprovalGroupApi({
      id: props.group.id,
      definitionIds: [...selectedIds.value],
    })
    message.success('分组流程已更新')
    emits('success')
    open.value = false
  } catch {
    // 业务错误已由请求层统一提示
  } finally {
    saving.value = false
  }
}
</script>
