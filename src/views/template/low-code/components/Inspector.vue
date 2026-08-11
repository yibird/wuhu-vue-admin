<template>
  <aside
    data-low-code-inspector
    class="min-h-0 min-w-0 grid grid-rows-[minmax(0,1fr)_auto] overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container shadow-[var(--w-shadow-elevated)]"
  >
    <Scrollbar class="min-h-0">
      <section class="border-0 border-b-1 border-color-2 border-b-solid p-14">
        <div class="flex items-start justify-between gap-10">
          <div class="min-w-0">
            <div class="text-sm text-main font-700">属性面板</div>
            <div class="mt-3 text-xs text-secondary">
              {{
                node ? '调整选中组件的内容和布局' : '页面结构、版本和选择状态'
              }}
            </div>
          </div>
          <span
            class="size-34 inline-flex shrink-0 items-center justify-center rounded-8 icon-primary-soft"
          >
            <Icon
              :name="
                node ? 'i-lucide:sliders-horizontal' : 'i-lucide:panel-right'
              "
              :size="17"
            />
          </span>
        </div>
      </section>

      <section v-if="node" class="grid gap-12 p-14">
        <label class="grid gap-6">
          <span class="text-xs text-muted">组件标题</span>
          <a-input
            :value="node.title"
            @change="
              updateNode({ title: ($event.target as HTMLInputElement).value })
            "
          />
        </label>
        <label class="grid gap-6">
          <span class="text-xs text-muted">说明文案</span>
          <a-textarea
            :value="node.description"
            :rows="4"
            @change="
              updateNode({
                description: ($event.target as HTMLTextAreaElement).value,
              })
            "
          />
        </label>
        <label class="grid gap-6">
          <span class="text-xs text-muted">布局密度</span>
          <a-segmented
            :value="node.style.density"
            :options="densityOptions"
            class="low-code-inspector-segmented"
            @change="updateDensity"
          />
        </label>
        <label class="grid gap-6">
          <span class="text-xs text-muted">栅格跨度</span>
          <a-select
            :value="node.style.gridColumn ?? 12"
            :options="gridColumnOptions"
            @change="updateGridColumn"
          />
        </label>
        <label class="grid gap-6">
          <span class="text-xs text-muted">语义色</span>
          <a-segmented
            :value="node.style.tone"
            :options="toneOptions"
            class="low-code-inspector-segmented"
            @change="updateTone"
          />
        </label>
        <section
          class="grid gap-10 rounded-8 border-1 border-color-2 border-solid bg-fill-quaternary p-12"
        >
          <div>
            <div class="text-xs text-main font-700">控件属性</div>
            <div class="mt-3 text-11px text-muted">
              根据 JSONSchema type 自动渲染当前控件配置。
            </div>
          </div>
          <ControlConfig :node="node" @update="updateNode" />
        </section>
        <a-button danger block @click="$emit('remove')"> 删除组件 </a-button>
      </section>

      <section v-else class="grid content-start gap-12 p-14">
        <div
          class="rounded-8 border-1 border-color-2 border-solid bg-fill-quaternary p-12"
        >
          <div class="flex items-center gap-10">
            <span
              class="size-40 inline-flex items-center justify-center rounded-8 bg-container text-primary shadow-sm"
            >
              <Icon
                :name="
                  selectedCount > 1
                    ? 'i-lucide:copy-check'
                    : 'i-lucide:mouse-pointer-2'
                "
                :size="20"
              />
            </span>
            <div class="min-w-0">
              <div class="text-sm text-main font-700">
                {{
                  selectedCount > 1
                    ? `已选中 ${selectedCount} 个组件`
                    : '未选中组件'
                }}
              </div>
              <div class="mt-3 text-xs text-secondary">
                {{
                  selectedCount > 1
                    ? '可通过画布操作条批量复制或删除。'
                    : '点击画布组件后可编辑属性。'
                }}
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-8">
          <div
            class="rounded-8 border-1 border-color-2 border-solid bg-container p-10"
          >
            <div class="text-20px text-main font-800">{{ componentCount }}</div>
            <div class="mt-3 text-xs text-muted">组件数量</div>
          </div>
          <div
            class="rounded-8 border-1 border-color-2 border-solid bg-container p-10"
          >
            <div class="text-20px text-main font-800">{{ historyLength }}</div>
            <div class="mt-3 text-xs text-muted">历史记录</div>
          </div>
        </div>

        <div
          class="rounded-8 border-1 border-color-2 border-solid bg-container p-12"
        >
          <div class="flex items-center justify-between gap-10">
            <div>
              <div class="text-sm text-main font-700">版本管理</div>
              <div class="mt-3 text-xs text-secondary">
                已保存 {{ versions.length }} 个版本
              </div>
            </div>
            <a-button size="small" @click="$emit('open-versions')">
              查看
            </a-button>
          </div>
          <a-button block class="mt-10" @click="$emit('save-version')">
            <template #icon>
              <Icon name="i-lucide:save" />
            </template>
            保存当前版本
          </a-button>
        </div>
      </section>
    </Scrollbar>
  </aside>
</template>

<script setup lang="ts">
import ControlConfig from './controls/ControlConfig.vue'
import type {
  DesignerNode,
  DesignerNodeDensity,
  DesignerNodeUpdate,
  DesignerNodeTone,
  DesignerVersion,
} from '../types'

defineProps<{
  componentCount: number
  historyLength: number
  node?: DesignerNode
  selectedCount: number
  versions: DesignerVersion[]
}>()

const emit = defineEmits<{
  'open-versions': []
  remove: []
  'save-version': []
  update: [update: DesignerNodeUpdate]
}>()

const densityOptions = [
  { label: '紧凑', value: 'compact' },
  { label: '舒适', value: 'comfortable' },
  { label: '宽松', value: 'spacious' },
]

const toneOptions = [
  { label: '默认', value: 'neutral' },
  { label: '主题', value: 'primary' },
  { label: '成功', value: 'success' },
  { label: '提醒', value: 'warning' },
]

const gridColumnOptions = [3, 4, 6, 8, 12].map((value) => ({
  label: `${value} / 12`,
  value,
}))

function updateNode(update: DesignerNodeUpdate) {
  emit('update', update)
}

function updateDensity(value: string | number) {
  emit('update', {
    style: { density: value as DesignerNodeDensity },
  })
}

function updateTone(value: string | number) {
  emit('update', {
    style: { tone: value as DesignerNodeTone },
  })
}

function updateGridColumn(value: string | number) {
  emit('update', {
    style: { gridColumn: Number(value) },
  })
}
</script>

<style scoped>
.low-code-inspector-segmented {
  justify-self: start;
  width: max-content;
  max-width: 100%;
}

.low-code-inspector-segmented :deep(.ant-segmented-item-label) {
  min-height: 28px;
  padding-inline: 10px;
  line-height: 28px;
}
</style>
