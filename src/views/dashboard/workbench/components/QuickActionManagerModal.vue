<script setup lang="ts">
import { message } from 'antdv-next'
import type { WorkbenchAction } from './types'

const MAX_ACTIONS = 8

const props = defineProps<{
  actions: WorkbenchAction[]
}>()

const open = defineModel<boolean>('open', { default: false })
const selectedIds = defineModel<WorkbenchAction['id'][]>('selectedIds', {
  required: true,
})

const keyword = shallowRef('')

const filteredActions = computed(() => {
  const query = keyword.value.trim().toLocaleLowerCase()
  if (!query) return props.actions

  return props.actions.filter((item) =>
    (item.name + ' ' + item.desc).toLocaleLowerCase().includes(query)
  )
})

watch(open, (value) => {
  if (value) {
    keyword.value = ''
  }
})

function isSelected(id: WorkbenchAction['id']) {
  return selectedIds.value.includes(id)
}

function toggleAction(id: WorkbenchAction['id']) {
  if (isSelected(id)) {
    selectedIds.value = selectedIds.value.filter((item) => item !== id)
    return
  }

  if (selectedIds.value.length >= MAX_ACTIONS) {
    message.warning('最多添加 ' + MAX_ACTIONS + ' 个快捷入口')
    return
  }

  selectedIds.value = [...selectedIds.value, id]
}
</script>

<template>
  <a-modal
    :open="open"
    centered
    :destroy-on-hidden="true"
    :width="640"
    @cancel="open = false"
  >
    <template #title>
      <div class="flex items-center gap-10">
        <span
          class="size-38 flex items-center justify-center rounded-8 icon-primary-soft"
        >
          <Icon name="i-lucide:layout-grid" :size="18" />
        </span>
        <div>
          <div class="text-base text-main font-700">管理快捷入口</div>
          <div class="mt-2 text-xs text-secondary font-400">
            选择需要固定在工作台的常用操作
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-between gap-12">
        <span class="text-xs text-secondary">
          已添加 {{ selectedIds.length }} / {{ MAX_ACTIONS }}
        </span>
        <a-button type="primary" @click="open = false">完成</a-button>
      </div>
    </template>

    <div class="mt-10">
      <a-input
        v-model:value="keyword"
        allow-clear
        placeholder="搜索入口名称或功能"
      >
        <template #prefix>
          <Icon name="i-lucide:search" :size="15" class="text-muted" />
        </template>
      </a-input>

      <div class="max-h-420 min-h-240 py-10 overflow-y-auto">
        <div v-if="filteredActions.length" class="grid gap-8 sm:grid-cols-2">
          <div
            v-for="item in filteredActions"
            :key="item.id"
            class="group min-w-0 flex items-center gap-10 rounded-8 border-1 border-solid p-10 transition-all hover:(-translate-y-1 border-primary/35 bg-primary/6 shadow-all-sm)"
            :class="
              isSelected(item.id)
                ? 'border-primary/35 bg-primary/6'
                : 'border-color-2 bg-container'
            "
          >
            <span
              class="size-36 flex shrink-0 items-center justify-center rounded-8"
              :class="[item.tone, item.text]"
            >
              <Icon :name="item.icon" :size="18" />
            </span>

            <div class="min-w-0 flex-1">
              <div class="truncate text-sm text-main font-600">
                {{ item.name }}
              </div>
              <div class="mt-3 truncate text-xs text-secondary">
                {{ item.desc }}
              </div>
            </div>

            <a-button
              :type="isSelected(item.id) ? 'default' : 'primary'"
              size="small"
              :aria-label="
                (isSelected(item.id) ? '移除' : '添加') + item.name + '入口'
              "
              @click="toggleAction(item.id)"
            >
              <template #icon>
                <Icon
                  :name="
                    isSelected(item.id) ? 'i-lucide:minus' : 'i-lucide:plus'
                  "
                  :size="14"
                />
              </template>
              {{ isSelected(item.id) ? '移除' : '添加' }}
            </a-button>
          </div>
        </div>

        <a-empty v-else description="没有匹配的快捷入口" />
      </div>
    </div>
  </a-modal>
</template>
