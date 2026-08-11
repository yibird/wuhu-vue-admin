<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import StructureTreeTitle from './StructureTreeTitle.vue'
import type { DesignerComponentType, DesignerNode } from '../types'

interface PageTemplate {
  id: string
  title: string
  desc: string
  icon: string
  components: DesignerComponentType[]
}

interface StructureTreeNode {
  children?: StructureTreeNode[]
  index?: number
  key: string
  node?: DesignerNode
  nodeCount: number
  selectable?: boolean
  title: string
  type: 'component' | 'page'
}

const props = defineProps<{
  embedded?: boolean
  nodes: DesignerNode[]
  selectedIds: string[]
}>()

const emit = defineEmits<{
  addFavorite: [type: DesignerComponentType]
  applyTemplate: [components: DesignerComponentType[]]
  duplicate: [id: string]
  moveDown: [id: string]
  moveUp: [id: string]
  remove: [id: string]
  select: [id: string]
}>()

const activeKey = shallowRef('layers')
const pageRootKey = 'low-code-page-root'
const expandedKeys = shallowRef<(number | string)[]>([pageRootKey])

const selectedIdSet = computed(() => new Set(props.selectedIds))
const selectedTreeKeys = computed(() => props.selectedIds)

function createTreeNode(
  node: DesignerNode,
  index: number,
  siblingCount: number
): StructureTreeNode {
  return {
    children: node.children?.map((child, childIndex) =>
      createTreeNode(child, childIndex, node.children?.length ?? 0)
    ),
    index,
    key: node.id,
    node,
    nodeCount: siblingCount,
    title: node.title,
    type: 'component',
  }
}

const treeData = computed<StructureTreeNode[]>(() => [
  {
    children: props.nodes.map((node, index) =>
      createTreeNode(node, index, props.nodes.length)
    ),
    key: pageRootKey,
    nodeCount: props.nodes.length,
    selectable: false,
    title: 'Low Code Page',
    type: 'page',
  },
])

const treeNodeMap = computed(() => {
  const entries: Array<[string, StructureTreeNode]> = []

  function collect(items: StructureTreeNode[]) {
    items.forEach((item) => {
      entries.push([item.key, item])
      if (item.children?.length) collect(item.children)
    })
  }

  collect(treeData.value)
  return new Map(entries)
})

function resolveTreeNode(data: StructureTreeNode) {
  return treeNodeMap.value.get(String(data.key)) ?? data
}

function isTreeNodeSelected(data: StructureTreeNode) {
  const node = resolveTreeNode(data).node
  return !!node && selectedIdSet.value.has(node.id)
}

function handleTreeSelect(keys: (number | string)[]) {
  const key = String(keys[0] ?? '')
  if (!key || key === pageRootKey) return
  emit('select', key)
}

function handleTreeExpand(keys: (number | string)[]) {
  expandedKeys.value = keys
}

const pageTemplates: PageTemplate[] = [
  {
    id: 'ops-dashboard',
    title: '运营看板',
    desc: '首屏、指标、趋势、提醒',
    icon: 'i-lucide:layout-dashboard',
    components: ['hero', 'stats', 'chart', 'notice'],
  },
  {
    id: 'lead-form',
    title: '线索采集页',
    desc: '表单、说明、列表跟进',
    icon: 'i-lucide:clipboard-list',
    components: ['hero', 'form', 'table'],
  },
  {
    id: 'data-report',
    title: '数据报告页',
    desc: '指标、图表、表格组合',
    icon: 'i-lucide:chart-no-axes-combined',
    components: ['stats', 'chart', 'dataTable', 'notice'],
  },
]

const favoriteComponents: Array<{
  type: DesignerComponentType
  title: string
  icon: string
}> = [
  { type: 'card', title: '信息卡片', icon: 'i-lucide:square-stack' },
  { type: 'chart', title: '趋势图表', icon: 'i-lucide:chart-column' },
  { type: 'form', title: '业务表单', icon: 'i-lucide:file-pen-line' },
  { type: 'notice', title: '提醒模块', icon: 'i-lucide:bell-dot' },
]
</script>

<template>
  <section
    class="designer-structure-panel"
    :class="{ 'designer-structure-panel--embedded': embedded }"
  >
    <header v-if="!embedded" class="designer-structure-panel__header">
      <div>
        <span>Structure</span>
        <h3>页面结构</h3>
      </div>
      <strong>{{ nodes.length }}</strong>
    </header>

    <a-tabs v-model:active-key="activeKey" size="small">
      <a-tab-pane key="layers" tab="图层">
        <div class="designer-structure-panel__layers">
          <a-tree
            v-if="nodes.length"
            :expanded-keys="expandedKeys"
            :selected-keys="selectedTreeKeys"
            :tree-data="treeData"
            block-node
            class="designer-structure-panel__tree"
            show-line
            @expand="handleTreeExpand"
            @select="handleTreeSelect"
          >
            <template #titleRender="treeNode">
              <StructureTreeTitle
                :index="resolveTreeNode(treeNode).index"
                :node="resolveTreeNode(treeNode).node"
                :node-count="resolveTreeNode(treeNode).nodeCount"
                :selected="isTreeNodeSelected(treeNode)"
                :title="resolveTreeNode(treeNode).title"
                :type="resolveTreeNode(treeNode).type"
                @duplicate="emit('duplicate', $event)"
                @move-down="emit('moveDown', $event)"
                @move-up="emit('moveUp', $event)"
                @remove="emit('remove', $event)"
              />
            </template>
          </a-tree>

          <a-empty v-if="!nodes.length" description="暂无组件" />
        </div>
      </a-tab-pane>

      <a-tab-pane key="templates" tab="模板">
        <div class="designer-structure-panel__cards">
          <button
            v-for="template in pageTemplates"
            :key="template.id"
            type="button"
            @click="emit('applyTemplate', template.components)"
          >
            <Icon :name="template.icon" :size="18" />
            <span>
              <strong>{{ template.title }}</strong>
              <small>{{ template.desc }}</small>
            </span>
          </button>
        </div>
      </a-tab-pane>

      <a-tab-pane key="favorites" tab="收藏">
        <div class="designer-structure-panel__cards">
          <button
            v-for="item in favoriteComponents"
            :key="item.type"
            type="button"
            @click="emit('addFavorite', item.type)"
          >
            <Icon :name="item.icon" :size="18" />
            <span>
              <strong>{{ item.title }}</strong>
              <small>添加到当前画布</small>
            </span>
          </button>
        </div>
      </a-tab-pane>
    </a-tabs>
  </section>
</template>

<style scoped lang="less">
.designer-structure-panel {
  min-height: 0;
  overflow: hidden;
  background: rgb(var(--w-bg-container));
  border: 1px solid rgb(var(--w-border-color-2));
  border-radius: 8px;
}

.designer-structure-panel--embedded {
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  height: 100%;
  background: transparent;
  border: 0;
  border-radius: 0;
}

.designer-structure-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid rgb(var(--w-border-color-1));
}

.designer-structure-panel__header span {
  display: block;
  font-size: 11px;
  font-weight: 800;
  color: rgb(var(--w-text-color-3));
  text-transform: uppercase;
}

.designer-structure-panel__header h3 {
  margin: 2px 0 0;
  font-size: 15px;
  color: rgb(var(--w-text-color));
}

.designer-structure-panel__header strong {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  color: rgb(var(--w-color-primary));
  background: rgb(var(--w-color-primary) / 10%);
  border-radius: 6px;
}

.designer-structure-panel :deep(.ant-tabs-nav) {
  padding: 0 12px;
  margin: 0;
}

.designer-structure-panel--embedded :deep(.ant-tabs) {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  height: 100%;
  min-height: 0;
}

.designer-structure-panel--embedded :deep(.ant-tabs-content-holder),
.designer-structure-panel--embedded :deep(.ant-tabs-content),
.designer-structure-panel--embedded :deep(.ant-tabs-tabpane) {
  height: 100%;
  min-height: 0;
}

.designer-structure-panel__layers,
.designer-structure-panel__cards {
  display: grid;
  grid-auto-rows: max-content;
  gap: 8px;
  align-content: start;
  max-height: 310px;
  padding: 10px;
  overflow: auto;
}

.designer-structure-panel--embedded .designer-structure-panel__layers,
.designer-structure-panel--embedded .designer-structure-panel__cards {
  height: 100%;
  max-height: none;
}

.designer-structure-panel__tree {
  min-width: 0;
}

.designer-structure-panel__tree :deep(.ant-tree-list-holder-inner) {
  gap: 3px;
}

.designer-structure-panel__tree :deep(.ant-tree-treenode) {
  align-items: center;
  width: 100%;
  padding: 0;
}

.designer-structure-panel__tree :deep(.ant-tree-switcher) {
  align-self: center;
  width: 20px;
  line-height: 40px;
}

.designer-structure-panel__tree :deep(.ant-tree-node-content-wrapper) {
  min-width: 0;
  padding: 0;
  background: transparent;
}

.designer-structure-panel__tree :deep(.ant-tree-node-content-wrapper:hover),
.designer-structure-panel__tree
  :deep(.ant-tree-node-content-wrapper.ant-tree-node-selected) {
  background: transparent;
}

.designer-structure-panel__cards button {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  min-width: 0;
  padding: 10px;
  text-align: left;
  cursor: pointer;
  background: rgb(var(--w-bg-page));
  border: 1px solid rgb(var(--w-border-color-1));
  border-radius: 8px;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.designer-structure-panel__cards button:hover {
  background: rgb(var(--w-color-primary) / 8%);
  border-color: rgb(var(--w-color-primary) / 32%);
}

.designer-structure-panel__cards span {
  min-width: 0;
}

.designer-structure-panel__cards strong {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgb(var(--w-text-color));
  white-space: nowrap;
}

.designer-structure-panel__cards small {
  display: block;
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  color: rgb(var(--w-text-color-3));
  white-space: nowrap;
}
</style>
