<template>
  <a-drawer
    :open="open"
    title="物料中心"
    :width="720"
    :body-style="{ padding: 0 }"
    @close="emit('close')"
  >
    <div class="grid h-full grid-rows-[auto_minmax(0,1fr)]">
      <div
        class="flex gap-4 border-0 border-b-1 border-color-2 border-b-solid px-14 py-10"
      >
        <button
          class="lc-material-tab"
          :class="{ 'is-active': activeTab === 'list' }"
          type="button"
          @click="activeTab = 'list'"
        >
          已注册物料
          <span class="lc-material-tab__count">{{ registryItems.length }}</span>
        </button>
        <button
          class="lc-material-tab"
          :class="{ 'is-active': activeTab === 'register' }"
          type="button"
          @click="activeTab = 'register'"
        >
          注册远程物料
        </button>
      </div>

      <Scrollbar class="min-h-0">
        <div v-if="activeTab === 'list'" class="grid gap-8 p-14">
          <div class="text-xs text-secondary">
            物料中心负责发布 / 版本 / 下架 / 分类 / Bundle 地址与 Component
            Definition；Runtime 按注册信息加载 Bundle 并渲染。
          </div>
          <div
            v-for="item in registryItems"
            :key="item.definition.type"
            class="lc-material-card"
          >
            <span
              class="size-34 inline-flex shrink-0 items-center justify-center rounded-8 icon-primary-soft"
            >
              <Icon :name="item.definition.icon ?? 'i-lucide:box'" :size="17" />
            </span>
            <div class="min-w-0 flex-1">
              <div class="flex-y-center gap-6">
                <span class="text-xs text-main font-600">
                  {{ item.definition.title }}
                </span>
                <span class="text-11px text-muted">{{
                  item.definition.type
                }}</span>
                <span
                  class="rounded-4 px-4 text-10px"
                  :class="
                    item.bundle
                      ? 'bg-warning/10 text-warning'
                      : 'bg-primary/8 text-primary'
                  "
                >
                  {{ item.bundle ? '远程物料' : '内置组件' }}
                </span>
              </div>
              <div class="mt-2 truncate text-11px text-muted">
                {{
                  item.bundle
                    ? `${item.bundle.format} · ${item.bundle.url}`
                    : item.definition.description
                }}
              </div>
            </div>
            <div class="flex shrink-0 items-center gap-6">
              <span
                class="rounded-4 px-6 py-2 text-11px"
                :class="statusClass(item.status)"
              >
                {{ statusLabel(item.status) }}
              </span>
              <a-button
                v-if="item.bundle"
                @click="loadMaterial(item.definition.type)"
              >
                加载测试
              </a-button>
              <a-button
                v-if="item.bundle"
                danger
                type="text"
                @click="unregister(item.definition.type)"
              >
                下架
              </a-button>
            </div>
          </div>
        </div>

        <div v-else class="grid gap-10 p-14">
          <div class="grid grid-cols-2 gap-8">
            <label class="lc-field">
              <span>组件类型 *</span>
              <a-input v-model:value="form.type" placeholder="WeatherCard" />
            </label>
            <label class="lc-field">
              <span>物料名称 *</span>
              <a-input v-model:value="form.name" placeholder="天气卡片" />
            </label>
            <label class="lc-field">
              <span>分类</span>
              <a-input v-model:value="form.category" placeholder="物料" />
            </label>
            <label class="lc-field">
              <span>版本</span>
              <a-input v-model:value="form.version" placeholder="1.0.0" />
            </label>
            <label class="lc-field">
              <span>图标</span>
              <a-input
                v-model:value="form.icon"
                placeholder="i-lucide:cloud-sun"
              />
            </label>
            <label class="lc-field">
              <span>Bundle 格式</span>
              <a-select
                v-model:value="form.format"
                :options="[
                  { label: 'global（运行时桥注册）', value: 'global' },
                  { label: 'ESM（import 加载）', value: 'esm' },
                ]"
              />
            </label>
          </div>
          <label class="lc-field">
            <span>Bundle URL *</span>
            <a-input
              v-model:value="form.url"
              placeholder="/materials/weather-card/1.0.0/index.js"
            />
          </label>
          <div class="grid grid-cols-2 gap-8">
            <label class="lc-field">
              <span>Integrity（可选）</span>
              <a-input
                v-model:value="form.integrity"
                placeholder="sha384-..."
              />
            </label>
            <label class="lc-field">
              <span>样式地址（逗号分隔）</span>
              <a-input v-model:value="form.styles" />
            </label>
          </div>
          <label class="lc-field">
            <span>属性定义（PropField[]）</span>
            <a-textarea
              v-model:value="form.props"
              :rows="5"
              class="font-mono text-11px"
            />
          </label>
          <label class="lc-field">
            <span>事件定义（EventField[]）</span>
            <a-textarea
              v-model:value="form.events"
              :rows="3"
              class="font-mono text-11px"
            />
          </label>
          <div class="flex justify-end gap-8">
            <a-button @click="fillSample">填入示例</a-button>
            <a-button type="primary" @click="register"> 注册并加载 </a-button>
          </div>
        </div>
      </Scrollbar>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { message } from 'antdv-next'
import { computed, reactive, ref } from 'vue'
import { Icon, Scrollbar } from '@/components'
import { saveMaterials } from '../core/persistence'
import { componentRegistry } from '../core/registry'
import { useDesignerContext } from '../composables'
import type {
  EventField,
  MaterialSchema,
  PropField,
} from '../core/schema/types'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const designer = useDesignerContext()
const activeTab = ref<'list' | 'register'>('list')

const form = reactive({
  type: '',
  name: '',
  category: '物料',
  version: '1.0.0',
  icon: 'i-lucide:box',
  format: 'global' as 'global' | 'esm',
  url: '',
  integrity: '',
  styles: '',
  props: '[\n  { "key": "city", "label": "城市", "type": "text" }\n]',
  events: '[]',
})

const registryItems = computed(() => componentRegistry.list())

function statusLabel(status: string) {
  if (status === 'ready') return '已就绪'
  if (status === 'loading') return '等待加载'
  return '加载失败'
}

function statusClass(status: string) {
  if (status === 'ready') return 'bg-success/10 text-success'
  if (status === 'loading') return 'bg-warning/10 text-warning'
  return 'bg-error/10 text-error'
}

function fillSample() {
  form.type = 'WeatherCard'
  form.name = '天气卡片'
  form.category = '物料'
  form.icon = 'i-lucide:cloud-sun'
  form.url = '/materials/weather-card/1.0.0/index.js'
  form.format = 'global'
}

function buildMaterial(): MaterialSchema | undefined {
  const type = form.type.trim()
  const name = form.name.trim()
  const url = form.url.trim()
  if (!type || !name || !url) {
    message.warning('请填写组件类型、名称与 Bundle 地址')
    return undefined
  }
  let props: PropField[] = []
  let events: EventField[] = []
  try {
    props = JSON.parse(form.props) as PropField[]
    events = JSON.parse(form.events) as EventField[]
  } catch {
    message.error('属性/事件定义 JSON 格式不正确')
    return undefined
  }
  return {
    id: `material-${type}`,
    type,
    name,
    version: form.version,
    description: `${name}（远程物料）`,
    icon: form.icon,
    category: form.category || '物料',
    definition: {
      type,
      title: name,
      description: `${name}（远程物料）`,
      category: form.category || '物料',
      icon: form.icon,
      kind: 2,
      version: form.version,
      props: Array.isArray(props) ? props : [],
      events: Array.isArray(events) ? events : [],
      defaultProps: {},
      defaultStyle: { width: '100%' },
    },
    bundle: {
      url,
      format: form.format,
      version: form.version,
      integrity: form.integrity.trim() || undefined,
      styles: form.styles
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    },
  }
}

function serializeRemoteMaterials(): MaterialSchema[] {
  return registryItems.value
    .filter((item) => item.bundle)
    .map((item) => ({
      id: `material-${item.definition.type}`,
      type: item.definition.type,
      name: item.definition.title,
      version: item.bundle?.version ?? '1.0.0',
      description: item.definition.description,
      icon: item.definition.icon,
      category: item.definition.category,
      definition: item.definition,
      bundle: item.bundle as MaterialSchema['bundle'],
    }))
}

async function register() {
  const material = buildMaterial()
  if (!material) return
  componentRegistry.registerMaterial(material)
  saveMaterials(serializeRemoteMaterials())
  try {
    await componentRegistry.resolveComponent(material.type)
    message.success(`物料 ${material.name} 注册并加载成功`)
  } catch (error) {
    message.error(
      `物料已注册，但加载失败：${error instanceof Error ? error.message : '未知错误'}`
    )
  }
  activeTab.value = 'list'
}

async function loadMaterial(type: string) {
  try {
    await componentRegistry.resolveComponent(type)
    message.success(`${type} 加载成功`)
  } catch (error) {
    message.error(
      `加载失败：${error instanceof Error ? error.message : '未知错误'}`
    )
  }
}

function unregister(type: string) {
  componentRegistry.unregister(type)
  saveMaterials(serializeRemoteMaterials())
  designer.markDirty()
  message.success(`已下架物料 ${type}`)
}
</script>

<style scoped lang="less">
.lc-material-tab {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  padding: 5px 10px;
  font-size: 12px;
  color: rgb(var(--w-text-secondary));
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 6px;

  &:hover {
    color: rgb(var(--w-color-primary));
  }

  &.is-active {
    color: rgb(var(--w-color-primary));
    background: rgb(var(--w-bg-primary) / 8%);
  }

  &__count {
    font-size: 10px;
    color: rgb(var(--w-text-muted));
  }
}

.lc-material-card {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px;
  background: rgb(var(--w-bg-container));
  border: 1px solid rgb(var(--w-border-color-2));
  border-radius: 8px;
}

.lc-field {
  display: grid;
  gap: 4px;

  & > span:first-child {
    font-size: 11px;
    color: rgb(var(--w-text-secondary));
  }
}
</style>
