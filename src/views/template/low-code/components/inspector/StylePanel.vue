<template>
  <div class="grid gap-12">
    <div
      v-if="nodes.length > 1"
      class="rounded-6 bg-primary/6 px-8 py-6 text-xs text-primary"
    >
      已选中 {{ nodes.length }} 个组件，以下修改将批量生效
    </div>

    <section class="grid gap-8">
      <div class="flex-between-center">
        <span class="text-base text-main font-600">生效范围</span>
        <a-segmented
          :value="scope"
          :options="scopeOptions"
          @change="scope = String($event) as StyleScope"
        />
      </div>
      <div v-if="scope !== 'base'" class="text-xs text-muted">
        断点样式会在
        {{ scope === 'tablet' ? '平板' : '移动端' }} 预览时覆盖基础样式
      </div>
    </section>

    <section class="grid gap-8">
      <div class="text-base text-main font-600">布局</div>
      <label v-if="single" class="lc-style-row">
        <span>布局模式</span>
        <a-select
          :value="baseStyle.layout as never"
          :options="layoutOptions"
          @change="setStyle({ layout: $event as never })"
        />
      </label>
      <label v-if="single" class="lc-style-row">
        <span>主轴方向</span>
        <a-select
          :value="baseStyle.direction as never"
          :options="directionOptions"
          allow-clear
          @change="setStyle({ direction: ($event as never) ?? undefined })"
        />
      </label>
      <label v-if="single" class="lc-style-row">
        <span>主轴对齐</span>
        <a-select
          :value="baseStyle.justify as never"
          :options="justifyOptions"
          allow-clear
          @change="setStyle({ justify: ($event as never) ?? undefined })"
        />
      </label>
      <label v-if="single" class="lc-style-row">
        <span>交叉轴对齐</span>
        <a-select
          :value="baseStyle.align as never"
          :options="alignOptions"
          allow-clear
          @change="setStyle({ align: ($event as never) ?? undefined })"
        />
      </label>
      <label v-if="single" class="lc-style-row">
        <span>列数</span>
        <a-input-number
          :value="numberOf('columns')"
          :min="1"
          :max="12"
          class="w-full"
          @change="setNumber('columns', $event)"
        />
      </label>
      <label class="lc-style-row">
        <span>间距</span>
        <a-input-number
          :value="numberOf('gap')"
          :min="0"
          class="w-full"
          @change="setNumber('gap', $event)"
        />
      </label>
      <label v-if="single" class="lc-style-row">
        <span>栅格跨度</span>
        <a-input-number
          :value="numberOf('span')"
          :min="1"
          class="w-full"
          @change="setNumber('span', $event)"
        />
      </label>
      <label v-if="single" class="lc-style-row is-switch">
        <span>换行</span>
        <a-switch
          :checked="!!baseStyle.wrap"
          @change="setStyle({ wrap: Boolean($event) })"
        />
      </label>
    </section>

    <section class="grid gap-8">
      <div class="text-base text-main font-600">尺寸与间距</div>
      <div class="grid grid-cols-2 gap-6">
        <label class="lc-style-cell">
          <span>宽度</span>
          <a-input
            :value="textOf('width')"
            placeholder="auto / 100% / 240"
            @change="setText('width', $event)"
          />
        </label>
        <label class="lc-style-cell">
          <span>高度</span>
          <a-input
            :value="textOf('height')"
            placeholder="auto / 100% / 120"
            @change="setText('height', $event)"
          />
        </label>
        <label class="lc-style-cell">
          <span>最小宽度</span>
          <a-input
            :value="textOf('minWidth')"
            @change="setText('minWidth', $event)"
          />
        </label>
        <label class="lc-style-cell">
          <span>最小高度</span>
          <a-input
            :value="textOf('minHeight')"
            @change="setText('minHeight', $event)"
          />
        </label>
      </div>
      <label class="lc-style-row">
        <span>内边距</span>
        <a-input
          :value="textOf('padding')"
          placeholder="12px / 8px 16px"
          @change="setText('padding', $event)"
        />
      </label>
      <label class="lc-style-row">
        <span>外边距</span>
        <a-input
          :value="textOf('margin')"
          @change="setText('margin', $event)"
        />
      </label>
    </section>

    <section class="grid gap-8">
      <div class="text-base text-main font-600">外观</div>
      <div class="grid grid-cols-2 gap-6">
        <label class="lc-style-cell">
          <span>背景</span>
          <span class="flex-y-center gap-4">
            <input
              class="size-24 shrink-0 cursor-pointer rounded-4 border-1 border-color-2 border-solid bg-transparent p-0"
              type="color"
              :value="colorOf('background')"
              @input="setColor('background', $event)"
            />
            <a-input
              :value="textOf('background')"
              @change="setText('background', $event)"
            />
          </span>
        </label>
        <label class="lc-style-cell">
          <span>文字颜色</span>
          <span class="flex-y-center gap-4">
            <input
              class="size-24 shrink-0 cursor-pointer rounded-4 border-1 border-color-2 border-solid bg-transparent p-0"
              type="color"
              :value="colorOf('color')"
              @input="setColor('color', $event)"
            />
            <a-input
              :value="textOf('color')"
              @change="setText('color', $event)"
            />
          </span>
        </label>
        <label class="lc-style-cell">
          <span>字号</span>
          <a-input-number
            :value="numberOf('fontSize')"
            :min="8"
            :max="120"
            class="w-full"
            @change="setNumber('fontSize', $event)"
          />
        </label>
        <label class="lc-style-cell">
          <span>圆角</span>
          <a-input-number
            :value="numberOf('borderRadius')"
            :min="0"
            class="w-full"
            @change="setNumber('borderRadius', $event)"
          />
        </label>
        <label class="lc-style-cell">
          <span>边框宽度</span>
          <a-input-number
            :value="numberOf('borderWidth')"
            :min="0"
            class="w-full"
            @change="setNumber('borderWidth', $event)"
          />
        </label>
        <label class="lc-style-cell">
          <span>边框颜色</span>
          <a-input
            :value="textOf('borderColor')"
            @change="setText('borderColor', $event)"
          />
        </label>
        <label class="lc-style-cell">
          <span>不透明度</span>
          <a-input-number
            :value="numberOf('opacity')"
            :min="0"
            :max="1"
            :step="0.1"
            class="w-full"
            @change="setNumber('opacity', $event)"
          />
        </label>
        <label class="lc-style-cell">
          <span>文本对齐</span>
          <a-select
            :value="baseStyle.textAlign as never"
            :options="textAlignOptions"
            allow-clear
            @change="setStyle({ textAlign: ($event as never) ?? undefined })"
          />
        </label>
        <label class="lc-style-cell">
          <span>字重</span>
          <a-select
            :value="baseStyle.fontWeight as never"
            :options="fontWeightOptions"
            allow-clear
            @change="setStyle({ fontWeight: ($event as never) ?? undefined })"
          />
        </label>
        <label class="lc-style-cell">
          <span>溢出</span>
          <a-select
            :value="baseStyle.overflow as never"
            :options="overflowOptions"
            allow-clear
            @change="setStyle({ overflow: ($event as never) ?? undefined })"
          />
        </label>
      </div>
      <label class="lc-style-row">
        <span>阴影</span>
        <a-input
          :value="textOf('shadow')"
          placeholder="0 8px 24px rgb(15 23 42 / 12%)"
          @change="setText('shadow', $event)"
        />
      </label>
    </section>

    <section v-if="single" class="grid gap-8">
      <div class="text-base text-main font-600">定位（自由布局）</div>
      <label class="lc-style-row">
        <span>定位方式</span>
        <a-select
          :value="baseStyle.position as never"
          :options="positionOptions"
          allow-clear
          @change="setStyle({ position: ($event as never) ?? undefined })"
        />
      </label>
      <div class="grid grid-cols-3 gap-6">
        <label class="lc-style-cell">
          <span>X</span>
          <a-input-number
            :value="numberOf('left')"
            class="w-full"
            @change="setNumber('left', $event)"
          />
        </label>
        <label class="lc-style-cell">
          <span>Y</span>
          <a-input-number
            :value="numberOf('top')"
            class="w-full"
            @change="setNumber('top', $event)"
          />
        </label>
        <label class="lc-style-cell">
          <span>层级</span>
          <a-input-number
            :value="numberOf('zIndex')"
            class="w-full"
            @change="setNumber('zIndex', $event)"
          />
        </label>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDesignerContext } from '../../composables'
import type { ComponentSchema, StyleSchema } from '../../core/schema/types'

type StyleScope = 'base' | 'tablet' | 'mobile'

const props = defineProps<{ nodes: ComponentSchema[] }>()
const designer = useDesignerContext()
const scope = ref<StyleScope>('base')

const single = computed(() => props.nodes.length === 1)
const primary = computed(() => props.nodes[props.nodes.length - 1])

const baseStyle = computed<StyleSchema>(() => {
  const style = primary.value?.style ?? {}
  if (scope.value === 'base') return style
  return { ...style, ...style.responsive?.[scope.value] }
})

const scopeOptions = computed(() => {
  const device = designer.previewDevice.value
  return [
    { label: '基础', value: 'base' },
    { label: '平板', value: 'tablet' },
    { label: '移动端', value: 'mobile' },
  ].map((item) => ({
    ...item,
    label:
      item.value === 'base'
        ? '基础'
        : `${item.label}${device === item.value ? '（当前）' : ''}`,
  }))
})

const layoutOptions = [
  { label: '流式 Block', value: 'block' },
  { label: '弹性 Flex', value: 'flex' },
  { label: '栅格 Grid', value: 'grid' },
  { label: '自由布局', value: 'free' },
]
const directionOptions = [
  { label: '横向', value: 'row' },
  { label: '纵向', value: 'column' },
]
const justifyOptions = [
  { label: '起始', value: 'start' },
  { label: '居中', value: 'center' },
  { label: '末尾', value: 'end' },
  { label: '两端', value: 'between' },
  { label: '环绕', value: 'around' },
  { label: '均分', value: 'evenly' },
]
const alignOptions = [
  { label: '起始', value: 'start' },
  { label: '居中', value: 'center' },
  { label: '末尾', value: 'end' },
  { label: '拉伸', value: 'stretch' },
]
const textAlignOptions = [
  { label: '左', value: 'left' },
  { label: '中', value: 'center' },
  { label: '右', value: 'right' },
]
const fontWeightOptions = [
  { label: '常规', value: 400 },
  { label: '中粗', value: 500 },
  { label: '加粗', value: 600 },
  { label: '特粗', value: 700 },
]
const overflowOptions = [
  { label: '可见', value: 'visible' },
  { label: '隐藏', value: 'hidden' },
  { label: '滚动', value: 'auto' },
]
const positionOptions = [
  { label: 'static', value: 'static' },
  { label: 'relative', value: 'relative' },
  { label: 'absolute', value: 'absolute' },
]

function textOf(key: keyof StyleSchema) {
  const value = baseStyle.value[key]
  return value === undefined || value === null ? '' : String(value)
}

function numberOf(key: keyof StyleSchema) {
  const value = baseStyle.value[key]
  return typeof value === 'number' ? value : undefined
}

function colorOf(key: keyof StyleSchema) {
  const value = String(baseStyle.value[key] ?? '')
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#ffffff'
}

function setStyle(patch: Partial<StyleSchema>) {
  if (scope.value === 'base') {
    if (single.value) {
      designer.updateStyle(primary.value.id, patch)
    } else {
      designer.updateNodes(
        props.nodes.map((node) => node.id),
        { style: patch },
        '批量修改样式'
      )
    }
    return
  }
  const node = primary.value
  const current = node.style?.responsive ?? {}
  const nextResponsive = {
    ...current,
    [scope.value]: { ...current[scope.value], ...patch },
  }
  designer.updateNode(
    node.id,
    { style: { responsive: nextResponsive } },
    { label: '修改断点样式' }
  )
}

function setText(key: keyof StyleSchema, event: Event) {
  const value = (event.target as HTMLInputElement).value.trim()
  setStyle({ [key]: value === '' ? undefined : value } as Partial<StyleSchema>)
}

function setNumber(key: keyof StyleSchema, value: number | null) {
  setStyle({
    [key]: value === null ? undefined : value,
  } as Partial<StyleSchema>)
}

function setColor(key: keyof StyleSchema, event: Event) {
  setStyle({
    [key]: (event.target as HTMLInputElement).value,
  } as Partial<StyleSchema>)
}
</script>

<style scoped lang="less">
.lc-style-row {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;

  & > span:first-child {
    flex: none;
    width: 84px;
    font-size: 14px;
    color: rgb(var(--w-text-secondary));
  }

  & > :last-child {
    flex: 1;
    min-width: 0;
  }

  /* switch 不参与拉伸 */
  &.is-switch > :last-child {
    flex: none;
    margin-left: auto;
  }
}

.lc-style-cell {
  display: grid;
  gap: 6px;

  & > span:first-child {
    font-size: 14px;
    color: rgb(var(--w-text-secondary));
  }
}
</style>
