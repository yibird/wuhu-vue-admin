<template>
  <div class="min-h-0 min-w-0 flex flex-col overflow-hidden">
    <!-- 无选中：页面设置 -->
    <template v-if="!nodes.length">
      <div
        class="shrink-0 border-0 border-b-1 border-color-2 border-b-solid px-14 py-10"
      >
        <div class="text-base text-main font-700">页面设置</div>
        <div class="mt-4 text-sm text-secondary">
          选择画布组件后编辑其属性、事件与样式
        </div>
      </div>
      <Scrollbar class="min-h-0 flex-1">
        <div class="p-14">
          <PageSettingsPanel />
        </div>
      </Scrollbar>
    </template>

    <!-- 多选 -->
    <template v-else-if="nodes.length > 1">
      <div
        class="shrink-0 border-0 border-b-1 border-color-2 border-b-solid px-14 py-10"
      >
        <div class="text-base text-main font-700">
          已选中 {{ nodes.length }} 个组件
        </div>
        <div class="mt-4 text-sm text-secondary">
          支持批量样式调整、批量复制、删除与容器包裹
        </div>
      </div>
      <div class="shrink-0 flex flex-wrap gap-6 px-14 py-10">
        <a-button @click="designer.duplicateSelected()">
          <Icon name="i-lucide:copy" :size="12" class="mr-4" /> 复制
        </a-button>
        <a-button @click="designer.wrapInContainer(ids, 'Flex')">
          <Icon name="i-lucide:box" :size="12" class="mr-4" /> 包裹
        </a-button>
        <a-button danger @click="designer.removeSelected()">
          <Icon name="i-lucide:trash-2" :size="12" class="mr-4" /> 删除
        </a-button>
      </div>
      <Scrollbar class="min-h-0 flex-1">
        <div class="p-14">
          <StylePanel :nodes="nodes" />
        </div>
      </Scrollbar>
    </template>

    <!-- 单选 -->
    <template v-else>
      <div
        class="shrink-0 border-0 border-b-1 border-color-2 border-b-solid px-14 py-10"
      >
        <div class="flex-y-center gap-10">
          <span
            class="size-30 inline-flex shrink-0 items-center justify-center rounded-7 icon-primary-soft"
          >
            <Icon :name="definition?.icon ?? 'i-lucide:box'" :size="16" />
          </span>
          <span class="min-w-0 truncate text-sm text-main font-600">
            {{ definition?.title ?? node.type }}
          </span>
        </div>
        <div class="mt-10 flex gap-4">
          <button
            v-for="item in tabs"
            :key="item.key"
            class="lc-inspector-tab"
            :class="{ 'is-active': activeTab === item.key }"
            type="button"
            @click="activeTab = item.key"
          >
            {{ item.label }}
          </button>
        </div>
      </div>

      <Scrollbar class="min-h-0 flex-1">
        <div class="p-14">
          <template v-if="activeTab === 'props'">
            <div
              v-if="definition?.tips?.length"
              class="mb-14 grid gap-6 rounded-6 bg-warning/8 px-10 py-8"
            >
              <span
                v-for="tip in definition.tips"
                :key="tip"
                class="inline-flex-y-center gap-6 text-xs text-warning"
              >
                <Icon name="i-lucide:info" :size="12" />
                {{ tip }}
              </span>
            </div>
            <div
              v-for="group in propGroups"
              :key="group.name"
              class="mb-16 grid gap-12"
            >
              <div class="text-base text-main font-600">{{ group.name }}</div>
              <FieldControl
                v-for="field in group.fields"
                :key="field.key"
                :node="node"
                :field="field"
              />
            </div>
            <div v-if="!definition?.props.length" class="text-sm text-muted">
              该组件没有可配置属性
            </div>
          </template>

          <template v-else-if="activeTab === 'data'">
            <div class="grid gap-16">
              <label class="grid gap-6">
                <span
                  class="inline-flex-y-center gap-6 text-base text-secondary"
                >
                  显示条件
                  <a-tooltip
                    title="表达式为真时显示，例如 user.role === 'admin'"
                  >
                    <Icon
                      name="i-lucide:help-circle"
                      :size="12"
                      class="text-muted"
                    />
                  </a-tooltip>
                </span>
                <a-input
                  :value="node.visible ?? ''"
                  placeholder="留空表示始终显示"
                  @change="updateExpression('visible', $event)"
                />
                <span v-if="visibleError" class="text-xs text-error">
                  {{ visibleError }}
                </span>
              </label>
              <label class="grid gap-6">
                <span class="text-base text-secondary">禁用条件</span>
                <a-input
                  :value="node.disabled ?? ''"
                  placeholder="留空表示始终可用"
                  @change="updateExpression('disabled', $event)"
                />
                <span v-if="disabledError" class="text-xs text-error">
                  {{ disabledError }}
                </span>
              </label>

              <div class="grid gap-8">
                <div class="text-base text-main font-600">数据绑定</div>
                <div v-if="bindingEntries.length" class="grid gap-8">
                  <div
                    v-for="[key, expression] in bindingEntries"
                    :key="key"
                    class="rounded-6 border-1 border-color-2 border-solid bg-fill-quaternary p-10"
                  >
                    <div class="flex-between-center">
                      <span class="text-xs text-main">{{ key }}</span>
                      <button
                        class="span-button text-muted hover:text-error"
                        type="button"
                        @click="designer.setBinding(node.id, key, undefined)"
                      >
                        <Icon name="i-lucide:x" :size="12" />
                      </button>
                    </div>
                    <a-input
                      :value="expression"
                      class="mt-6"
                      @change="
                        designer.setBinding(
                          node.id,
                          key,
                          ($event.target as HTMLInputElement).value
                        )
                      "
                    />
                  </div>
                </div>
                <div v-else class="text-xs text-muted">
                  暂无绑定，可在「属性」面板点击 fx 图标为属性绑定表达式
                </div>
              </div>
            </div>
          </template>

          <EventsPanel v-else-if="activeTab === 'events'" :node="node" />

          <StylePanel v-else :nodes="nodes" />
        </div>
      </Scrollbar>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon, Scrollbar } from '@/components'
import { validateExpression } from '../../core/expression'
import { componentRegistry } from '../../core/registry'
import { useDesignerContext } from '../../composables'
import EventsPanel from './EventsPanel.vue'
import FieldControl from './FieldControl.vue'
import PageSettingsPanel from './PageSettingsPanel.vue'
import StylePanel from './StylePanel.vue'
import type { ComponentSchema, PropField } from '../../core/schema/types'

type InspectorTab = 'props' | 'data' | 'events' | 'style'

const designer = useDesignerContext()
const activeTab = ref<InspectorTab>('props')
const visibleError = ref('')
const disabledError = ref('')

const tabs: { key: InspectorTab; label: string }[] = [
  { key: 'props', label: '属性' },
  { key: 'data', label: '数据' },
  { key: 'events', label: '事件' },
  { key: 'style', label: '样式' },
]

const nodes = computed(() => designer.selectedNodes.value)
const ids = computed(() => nodes.value.map((node) => node.id))
const node = computed<ComponentSchema>(
  () => nodes.value[nodes.value.length - 1]
)
const definition = computed(() =>
  componentRegistry.getDefinition(node.value.type)
)

const propGroups = computed(() => {
  const groups = new Map<string, PropField[]>()
  for (const field of definition.value?.props ?? []) {
    const name = field.group ?? '属性'
    const list = groups.get(name) ?? []
    list.push(field)
    groups.set(name, list)
  }
  return [...groups.entries()].map(([name, fields]) => ({ name, fields }))
})

const bindingEntries = computed(() =>
  Object.entries(node.value.bindings ?? {}).filter(
    (entry): entry is [string, string] => !!entry[1]
  )
)

function updateExpression(key: 'visible' | 'disabled', event: Event) {
  const expression = (event.target as HTMLInputElement).value.trim()
  if (expression) {
    const result = validateExpression(expression)
    if (key === 'visible') {
      visibleError.value = result.valid ? '' : (result.error ?? '表达式无效')
    } else {
      disabledError.value = result.valid ? '' : (result.error ?? '表达式无效')
    }
    if (!result.valid) return
  } else if (key === 'visible') {
    visibleError.value = ''
  } else {
    disabledError.value = ''
  }
  designer.updateNode(
    node.value.id,
    { [key]: expression || undefined },
    { label: '修改条件', mergeKey: `condition:${key}:${node.value.id}` }
  )
}
</script>

<style scoped lang="less">
.lc-inspector-tab {
  flex: 1;
  padding: 9px 4px;
  font-size: 14px;
  color: rgb(var(--w-text-secondary));
  cursor: pointer;
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;

  &:hover {
    color: rgb(var(--w-color-primary));
  }

  &.is-active {
    color: rgb(var(--w-color-primary));
    border-bottom-color: rgb(var(--w-color-primary));
  }
}
</style>
