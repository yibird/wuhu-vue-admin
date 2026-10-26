<template>
  <a-modal
    v-model:open="open"
    :footer="null"
    :width="1240"
    centered
    destroy-on-hidden
  >
    <template #title>
      <div class="flex flex-wrap items-center gap-12 pr-24">
        <span class="text-base text-main font-600">组织架构图</span>
        <span class="text-xs text-secondary font-400">
          {{ deptCount }} 个部门 · {{ postCount }} 个岗位
        </span>
      </div>
    </template>

    <div class="dept-org flex gap-12">
      <section
        ref="chartHostRef"
        class="dept-org-chart relative h-[calc(100vh-260px)] min-w-0 flex-1 overflow-hidden rounded-12 b-1-muted bg-secondary"
      >
        <div
          class="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center gap-8 p-12"
        >
          <div class="pointer-events-auto w-236">
            <a-input
              v-model:value="keyword"
              allow-clear
              placeholder="搜索部门 / 岗位 / 负责人"
            >
              <template #prefix>
                <Icon name="i-lucide:search" :size="14" />
              </template>
            </a-input>
          </div>
          <a-button class="pointer-events-auto" @click="toggleExpandAll">
            <template #icon>
              <Icon
                :name="
                  expandedAll
                    ? 'i-lucide:fold-vertical'
                    : 'i-lucide:unfold-vertical'
                "
                :size="14"
              />
            </template>
            {{ expandedAll ? '收起全部' : '展开全部' }}
          </a-button>
          <a-button class="pointer-events-auto" @click="resetChartView">
            <template #icon>
              <Icon name="i-lucide:maximize" :size="14" />
            </template>
            复位视图
          </a-button>
        </div>

        <div v-if="loading" class="h-full flex-center">
          <a-spin />
        </div>

        <div v-else-if="depts.length === 0" class="h-full flex-center">
          <a-empty description="暂无部门数据" />
        </div>

        <Vue3TreeOrg
          v-else
          ref="treeOrgRef"
          :click-delay="120"
          :collapsable="true"
          :data="tree"
          :filter-node-method="filterNodeMethod"
          :horizontal="false"
          :node-draggable="false"
          :props="TREE_KEYS"
          :scalable="true"
          :selected-key="selectedId"
          :tool-bar="TOOL_BAR"
          @on-node-click="handleNodeClick"
        >
          <template #default="{ node }">
            <OrgNode
              :code="node.$$data.code"
              :count="node.children?.length ?? 0"
              :leader="node.$$data.leader"
              :name="node.$$data.name"
              :root="node.$$data.id === ROOT_ID"
              :selected="node.$$data.id === selectedId"
              :type="node.$$data.type"
            />
          </template>
        </Vue3TreeOrg>

        <div
          class="pointer-events-none absolute bottom-12 left-12 z-20 flex flex-wrap items-center gap-10 text-xs text-secondary"
        >
          <span
            v-for="item in LEGEND"
            :key="item.label"
            class="flex items-center gap-4"
          >
            <span
              class="dept-org-accent size-8 flex-none rounded-full"
              :style="{ '--w-dept-node-accent': item.color }"
            />
            {{ item.label }}
          </span>
          <span class="hidden items-center gap-4 sm:flex">
            <Icon name="i-lucide:mouse-pointer-2" :size="12" />
            滚轮缩放 · 拖拽平移 · 点击查看详情
          </span>
        </div>
      </section>

      <Transition name="fade-slide-right">
        <aside
          v-if="selectedDept"
          class="flex w-236 flex-none flex-col b-1-muted rounded-12 bg-container p-14 shadow-sm"
        >
          <header class="flex items-start gap-8">
            <span
              class="dept-org-accent size-34 flex flex-none items-center justify-center rounded-8 text-white"
              :style="{ '--w-dept-node-accent': selectedAccent.color }"
            >
              <Icon :name="selectedAccent.icon" :size="18" />
            </span>
            <div class="min-w-0 flex-1">
              <div class="truncate text-sm text-main font-600">
                {{ selectedDept.name }}
              </div>
              <div class="mt-2 text-xs text-secondary">
                {{ selectedAccent.label }}
              </div>
            </div>
          </header>

          <dl class="mt-12 grid grid-cols-1 gap-8 text-xs">
            <div
              v-for="row in selectedRows"
              :key="row.label"
              class="flex items-start gap-8"
            >
              <dt class="w-56 flex-none text-secondary">{{ row.label }}</dt>
              <dd class="m-0 min-w-0 flex-1 break-all text-main">
                {{ row.value || '—' }}
              </dd>
            </div>
          </dl>

          <div class="mt-auto flex gap-8 pt-14">
            <a-button class="flex-1" size="small" @click="selectedId = ''">
              取消选中
            </a-button>
            <a-button
              class="flex-1"
              size="small"
              type="primary"
              @click="handleEdit"
            >
              编辑
            </a-button>
          </div>
        </aside>
      </Transition>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { Vue3TreeOrg } from 'vue3-tree-org'
import 'vue3-tree-org/lib/vue3-tree-org.css'
import { getDeptPageListApi, type SysDept, type DeptType } from '@/apis'
import { Icon } from '@/components/icon'
import { resolveDeptAccent } from '../data'
import OrgNode from './org-node.vue'

/** 虚拟根节点 ID:库要求单根,平铺数据中的多个顶级部门统一挂到它下面 */
const ROOT_ID = 'dept-org-root'

/** 图例:与节点卡片、详情面板共用同一套类型配色 */
const LEGEND = [resolveDeptAccent(1), resolveDeptAccent(2)]

/** 库的字段映射:本项目父节点字段为 parentId,必须显式指定 */
const TREE_KEYS = {
  id: 'id',
  pid: 'parentId',
  label: 'name',
  expand: 'expand',
  children: 'children',
} as const

/**
 * 库自带工具条:只保留缩放与还原
 *
 * 展开/收起全部改用自绘按钮(库的实现依赖 iconfont 字形),全屏与弹窗叠加体验冲突故关闭。
 */
const TOOL_BAR = {
  expand: false,
  scale: true,
  zoom: true,
  restore: true,
  fullscreen: false,
} as const

/** 树节点(平铺部门数据组装后的结构) */
interface OrgChartNode {
  /**
   * @desc 节点 ID
   */
  id: string
  /**
   * @desc 上级节点 ID
   */
  parentId: string
  /**
   * @desc 节点名称
   */
  name: string
  /**
   * @desc 节点编码
   */
  code: string
  /**
   * @desc 节点类型(1:部门,2:岗位)
   */
  type: DeptType
  /**
   * @desc 负责人
   */
  leader: string
  /**
   * @desc 联系电话
   */
  phone: string
  /**
   * @desc 联系邮箱
   */
  email: string
  /**
   * @desc 初始展开态
   *
   * 库只在数据重新规范化时按该字段播种展开集合,因此初始展开度必须由数据本身给出,
   * 不能依赖 defaultExpandLevel(重算时展开集合会被清空)。
   */
  expand: boolean
  /**
   * @desc 子节点
   */
  children: OrgChartNode[]
}

/**
 * 库通过 setup 返回值暴露的实例成员
 *
 * 库未提供 expose 类型,这里只声明实际用到的部分。
 */
interface TreeOrgExpose {
  /**
   * @desc 内部树元素,组件声明的 ref 在实例代理解包后为元素本身
   */
  readonly treeRef?: HTMLElement | Ref<HTMLElement | undefined>
  restoreOrgchart: () => void
  onDrag: (x: number, y: number) => void
  onDragStop: (x: number, y: number) => void
  expandChange: () => void
  filter: (value: unknown) => void
}

const open = defineModel<boolean>('open', { required: true })

const emits = defineEmits<{
  edit: [id: string]
}>()

const loading = shallowRef(false)
const depts = shallowRef<SysDept[]>([])
const keyword = shallowRef('')
const selectedId = shallowRef('')
const expandedAll = shallowRef(false)

const chartHostRef = useTemplateRef<HTMLElement>('chartHostRef')
const treeOrgRef = useTemplateRef<TreeOrgExpose>('treeOrgRef')

const tree = computed(() => buildOrgTree(depts.value))
const deptCount = computed(
  () => depts.value.filter((dept) => dept.type === 1).length
)
const postCount = computed(
  () => depts.value.filter((dept) => dept.type === 2).length
)
const selectedDept = computed(() =>
  depts.value.find((dept) => dept.id === selectedId.value)
)
const selectedAccent = computed(() =>
  resolveDeptAccent(selectedDept.value?.type ?? 1)
)
const parentName = computed(() => {
  const parent = depts.value.find(
    (dept) => dept.id === selectedDept.value?.parentId
  )
  return parent?.name ?? '顶级'
})
const childCount = computed(
  () => depts.value.filter((dept) => dept.parentId === selectedId.value).length
)
const selectedRows = computed(() => {
  const dept = selectedDept.value
  if (!dept) return []

  const isPost = dept.type === 2
  return [
    { label: isPost ? '岗位编码' : '部门编码', value: dept.code },
    { label: isPost ? '所属部门' : '上级部门', value: parentName.value },
    { label: '负责人', value: dept.leader },
    { label: '联系电话', value: dept.phone },
    { label: '联系邮箱', value: dept.email },
    { label: '直属下级', value: `${childCount.value} 个` },
  ]
})

watch(keyword, (value) => {
  treeOrgRef.value?.filter(value)
})

watch(open, async (value) => {
  if (!value) return

  keyword.value = ''
  selectedId.value = ''
  expandedAll.value = false
  await loadDepts()
  await nextTick()
  await resetChartView()
})

/**
 * 平铺部门数据组装为单棵树
 *
 * 上级不在结果集内的节点(如跨页取数遗漏)挂到虚拟根节点下,避免整棵子树丢失。
 * 展开态只给根节点,首屏呈现「根 + 各一级部门」;更深的层级由用户按需展开。
 */
function buildOrgTree(items: SysDept[]): OrgChartNode {
  const nodes = new Map<string, OrgChartNode>()

  items.forEach((item) => {
    nodes.set(item.id, {
      id: item.id,
      parentId: item.parentId,
      name: item.name,
      code: item.code,
      type: item.type,
      leader: item.leader,
      phone: item.phone,
      email: item.email,
      expand: false,
      children: [],
    })
  })

  const root: OrgChartNode = {
    id: ROOT_ID,
    parentId: '',
    name: '组织架构',
    code: '',
    type: 1,
    leader: '',
    phone: '',
    email: '',
    expand: true,
    children: [],
  }

  nodes.forEach((node) => {
    const parent = nodes.get(node.parentId) ?? root
    parent.children.push(node)
  })

  return root
}

/**
 * 库的节点过滤回调:返回 true 表示命中
 */
function filterNodeMethod(value: string, node: { $$data: OrgChartNode }) {
  const text = String(value ?? '')
    .trim()
    .toLowerCase()
  if (!text) return true

  const { name, code, leader } = node.$$data
  return [name, code, leader].some((field) =>
    String(field ?? '')
      .toLowerCase()
      .includes(text)
  )
}

function handleNodeClick(_event: MouseEvent, data: Record<string, unknown>) {
  // 虚拟根节点不参与选中,避免详情面板展示空数据
  const id = String(data.id ?? '')
  selectedId.value = id === ROOT_ID ? '' : id
}

function handleEdit() {
  const dept = selectedDept.value
  if (dept) emits('edit', dept.id)
}

/**
 * 展开/收起全部
 *
 * 整图尺寸会随之剧变,所以切换后复位视图,避免用户看到被裁掉一半的图。
 */
async function toggleExpandAll() {
  expandedAll.value = !expandedAll.value
  treeOrgRef.value?.expandChange()
  await nextTick()
  await resetChartView()
}

async function loadDepts() {
  loading.value = true
  try {
    const response = await getDeptPageListApi({ current: 1, pageSize: 1000 })
    depts.value = response.data?.list ?? []
  } catch {
    // 业务错误已由请求层统一提示,这里只保证不残留上一份数据
    depts.value = []
  } finally {
    loading.value = false
  }
}

/**
 * 复位视图:缩放回到 100% 并把整张图居中
 *
 * 不按视口比例缩小整图 —— 宽出视口数倍的组织树缩到 30% 后文字已不可读,
 * 需要看全貌时用右下角的缩放/拖拽自己调整。
 * 库的平移区间按容器尺寸夹取,所以必须等缩放回到 100% 渲染完成后再定位。
 */
async function resetChartView() {
  const instance = treeOrgRef.value
  const host = chartHostRef.value
  const element = resolveTreeElement(instance?.treeRef)
  if (!instance || !host || !element) return

  const hostWidth = host.clientWidth
  const hostHeight = host.clientHeight
  const treeWidth = element.clientWidth
  const treeHeight = element.clientHeight
  if (!hostWidth || !hostHeight || !treeWidth || !treeHeight) return

  instance.restoreOrgchart()
  await nextTick()

  // 缩放固定为 100%,容器内部坐标系与视口一致,直接按尺寸差居中
  const left = (hostWidth - treeWidth) / 2
  const top = (hostHeight - treeHeight) / 2
  instance.onDrag(left, top)
  instance.onDragStop(left, top)
}

function resolveTreeElement(value: TreeOrgExpose['treeRef']) {
  if (!value) return undefined
  return value instanceof HTMLElement ? value : value.value
}
</script>

<style lang="less">
@import '../token.less';

/**
 * vue3-tree-org 未暴露主题变量,只能按内部类名覆盖;统一下沉到 .dept-org-chart 命名空间,
 * 因此这里使用非 scoped 样式块,而不是在 scoped 中逐条 :deep()。
 */
.dept-org-chart {
  // 画布底色上叠一层顶部光晕,让整张图有纵深
  background-image: radial-gradient(
    72% 58% at 50% 0%,
    color-mix(
      in srgb,
      rgb(var(--w-color-primary)) var(--w-dept-canvas-glow-opacity),
      transparent
    ),
    transparent var(--w-dept-canvas-glow-stop)
  );

  .zm-tree-org {
    height: 100%;
    padding: 0;
    background: transparent;
  }

  // 节点视觉由 OrgNode 卡片提供,去掉库默认的圆角与投影
  .tree-org-node__content .tree-org-node__inner {
    border-radius: 0;
    box-shadow: none;
  }

  .tree-org-node__content .tree-org-node__text {
    padding: 0;
  }

  // 连接线跟随主题
  .tree-org-node::after,
  .tree-org-node:not(:first-child)::before,
  .tree-org-node:not(:last-child)::after,
  .tree-org-node__children::before,
  .collapsable .tree-org-node.collapsed .tree-org-node__content::after {
    border-color: rgb(var(--w-border-regular));
  }

  .tree-org-node__expand {
    color: rgb(var(--w-text-secondary));
    background-color: rgb(var(--w-bg-overlay));
    border-color: rgb(var(--w-border-regular));
    box-shadow: var(--w-shadow-button);
  }

  // 悬浮时填充主色渐变,与节点强调色块同一套语言
  .tree-org-node__expand:hover {
    color: #fff;
    background-image: linear-gradient(
      135deg,
      color-mix(in srgb, rgb(var(--w-color-primary)) 74%, #fff),
      rgb(var(--w-color-primary))
    );
    border-color: rgb(var(--w-color-primary));
    box-shadow: 0 4px 10px
      color-mix(
        in srgb,
        rgb(var(--w-color-primary)) var(--w-dept-node-accent-glow-opacity),
        transparent
      );
  }

  .tree-org-node__expand .tree-org-node__expand-btn::before,
  .tree-org-node__expand .tree-org-node__expand-btn::after {
    border-color: currentcolor;
  }

  .zm-tree-handle {
    right: 14px;
    bottom: 14px;
  }

  .zm-tree-handle .zm-tree-percent,
  .zm-tree-handle .zm-tree-handle-item {
    width: 34px;
    height: 30px;
    margin-bottom: 8px;
    line-height: 28px;
    color: rgb(var(--w-text-secondary));
    background-color: rgb(var(--w-bg-overlay));
    border: 1px solid rgb(var(--w-border-regular));
    border-radius: 8px;
  }

  .zm-tree-handle .zm-tree-handle-item:hover {
    color: #fff;
    background-image: linear-gradient(
      135deg,
      color-mix(in srgb, rgb(var(--w-color-primary)) 74%, #fff),
      rgb(var(--w-color-primary))
    );
    border-color: rgb(var(--w-color-primary));
  }

  .zm-tree-handle .zm-tree-handle-item .zm-tree-restore,
  .zm-tree-handle .zm-tree-handle-item .zm-tree-restore::after {
    border-color: rgb(var(--w-text-muted));
  }

  // 工具条悬浮后底色转为渐变,图标需要跟着翻白
  .zm-tree-handle .zm-tree-handle-item:hover .zm-tree-restore,
  .zm-tree-handle .zm-tree-handle-item:hover .zm-tree-restore::after {
    border-color: currentcolor;
  }
}
</style>
