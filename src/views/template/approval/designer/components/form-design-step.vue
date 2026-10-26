<template>
  <section
    class="form-designer h-full min-h-560 grid grid-cols-[250px_minmax(0,1fr)_300px] overflow-hidden rounded-10 b-1-regular bg-container max-[1200px]:grid-cols-[220px_minmax(0,1fr)_260px]"
  >
    <!-- 左侧组件面板 -->
    <aside class="min-h-0 flex flex-col b-r-1-regular bg-container">
      <div class="flex-none b-b-1-regular p-10">
        <a-input-search
          v-model:value="search"
          allow-clear
          placeholder="搜索组件"
          size="small"
        />
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto p-10">
        <section v-for="group in filteredGroups" :key="group.key" class="mb-12">
          <h3 class="mb-7 mt-0 text-11px text-tertiary font-600">
            {{ group.label }}
          </h3>
          <div class="grid grid-cols-2 gap-6">
            <button
              v-for="item in group.items"
              :key="`${group.key}-${item.label}`"
              type="button"
              draggable="true"
              class="h-34 flex cursor-grab items-center gap-6 rounded-5 b-1-muted bg-container px-7 text-left text-xs text-regular transition-colors hover:(border-primary/40 bg-primary/6 text-primary) active:cursor-grabbing"
              @click="addFromPalette(item)"
              @dragstart="onPaletteDragStart(item)"
              @dragend="endDrag"
            >
              <Icon :name="item.icon" :size="14" class="shrink-0" />
              <span class="truncate">{{ item.label }}</span>
            </button>
          </div>
        </section>

        <a-empty
          v-if="filteredGroups.length === 0"
          description="没有匹配的组件"
        />
      </div>
    </aside>

    <!-- 中间画布 -->
    <div class="min-h-0 flex flex-col overflow-hidden">
      <div class="flex flex-none items-center gap-7 b-b-1-regular px-10 py-6">
        <span class="text-xs text-secondary">表单</span>
        <Icon name="i-lucide:chevron-right" :size="12" class="text-tertiary" />
        <span class="text-xs text-main">
          {{
            selectedField ? fieldTypeLabels[selectedField.type] : '未选择组件'
          }}
        </span>

        <div class="ml-auto flex items-center gap-2">
          <a-button
            size="small"
            type="text"
            :disabled="history.length === 0"
            title="撤销"
            @click="undo"
          >
            <template #icon
              ><Icon name="i-lucide:undo-2" :size="15"
            /></template>
          </a-button>
          <a-button
            size="small"
            type="text"
            :disabled="future.length === 0"
            title="重做"
            @click="redo"
          >
            <template #icon
              ><Icon name="i-lucide:redo-2" :size="15"
            /></template>
          </a-button>
          <a-button
            size="small"
            type="text"
            :disabled="!selectedField"
            title="复制字段"
            @click="duplicateSelected"
          >
            <template #icon><Icon name="i-lucide:copy" :size="15" /></template>
          </a-button>
          <a-button
            danger
            size="small"
            type="text"
            :disabled="!selectedField"
            title="删除字段"
            @click="removeSelected"
          >
            <template #icon
              ><Icon name="i-lucide:trash-2" :size="15"
            /></template>
          </a-button>

          <span class="mx-4 h-16 w-1px bg-border" />
          <a-button size="small" type="text" title="缩小" @click="zoomOut">
            <template #icon><Icon name="i-lucide:minus" :size="14" /></template>
          </a-button>
          <span class="w-38 text-center text-11px text-secondary tabular-nums">
            {{ zoomLabel }}
          </span>
          <a-button size="small" type="text" title="放大" @click="zoomIn">
            <template #icon><Icon name="i-lucide:plus" :size="14" /></template>
          </a-button>
          <a-button
            size="small"
            type="text"
            title="恢复 100%"
            @click="resetZoom"
          >
            <template #icon>
              <Icon name="i-lucide:maximize-2" :size="14" />
            </template>
          </a-button>
        </div>
      </div>

      <div
        class="form-designer-canvas relative min-h-0 flex-1 overflow-auto p-16"
        :class="{ 'is-drag-active': dragActive }"
        @click.self="selectField(-1)"
        @dragover.prevent
        @drop="onCanvasDrop"
      >
        <div
          v-if="dragActive"
          class="pointer-events-none absolute left-1/2 top-10 z-20 -translate-x-1/2 rounded-full bg-primary px-12 py-5 text-11px text-white shadow-all"
        >
          松开以添加组件或调整顺序
        </div>

        <div
          class="mx-auto w-full max-w-860 origin-top transition-transform duration-200"
          :style="{ transform: `scale(${zoom})` }"
          @click.self="selectField(-1)"
        >
          <div
            class="rounded-8 b-1-regular bg-container p-20 shadow-sm"
            @click.self="selectField(-1)"
          >
            <div
              v-if="fields.length === 0"
              class="lc-form-empty"
              @click="selectField(-1)"
            >
              <span
                class="size-44 flex items-center justify-center rounded-10 bg-primary/8 text-primary"
              >
                <Icon name="i-lucide:layout-template" :size="22" />
              </span>
              <strong class="mt-6 text-sm text-main font-600">
                拖拽左侧组件到画布
              </strong>
              <span class="text-xs text-secondary">
                也可以直接点击组件快速添加
              </span>
            </div>

            <div v-else class="grid grid-cols-2 gap-x-14 gap-y-8">
              <div
                v-for="(field, index) in fields"
                :key="field.key"
                class="group relative"
                :class="[
                  field.width === 'half' ? 'col-span-1' : 'col-span-2',
                  selectedIndex === index ? 'z-10' : '',
                ]"
                @click.stop="selectField(index)"
                @dragover.prevent
                @drop.stop="onRowDrop(index)"
              >
                <div
                  v-if="selectedIndex === index"
                  class="absolute -top-32 left-0 z-20 flex items-center gap-2 rounded-6 b-1-primary bg-container px-4 py-3 shadow-sm"
                >
                  <span
                    class="flex cursor-grab items-center px-6 text-secondary active:cursor-grabbing"
                    draggable="true"
                    title="拖拽排序"
                    @dragstart.stop="onFieldDragStart(index)"
                    @dragend="endDrag"
                  >
                    <Icon name="i-lucide:grip-vertical" :size="16" />
                  </span>
                  <button
                    type="button"
                    class="field-tool-btn"
                    title="上移"
                    :disabled="index === 0"
                    @click.stop="moveField(index, -1)"
                  >
                    <Icon name="i-lucide:arrow-up" :size="16" />
                  </button>
                  <button
                    type="button"
                    class="field-tool-btn"
                    title="下移"
                    :disabled="index === fields.length - 1"
                    @click.stop="moveField(index, 1)"
                  >
                    <Icon name="i-lucide:arrow-down" :size="16" />
                  </button>
                  <button
                    type="button"
                    class="field-tool-btn"
                    title="复制"
                    @click.stop="duplicateField(index)"
                  >
                    <Icon name="i-lucide:copy" :size="16" />
                  </button>
                  <button
                    type="button"
                    class="field-tool-btn text-error"
                    title="删除"
                    @click.stop="removeField(index)"
                  >
                    <Icon name="i-lucide:trash-2" :size="16" />
                  </button>
                </div>

                <div
                  class="rounded-5 p-5 transition-[border-color,box-shadow,background-color]"
                  :class="
                    selectedIndex === index
                      ? 'border-1 border-primary border-solid bg-primary/4 ring-2 ring-primary/12'
                      : 'border-1 border-transparent border-solid hover:bg-hover/60'
                  "
                >
                  <a-divider v-if="field.type === 'divider'" class="my-4!">
                    {{ field.label }}
                  </a-divider>

                  <div v-else class="flex items-start gap-10">
                    <span
                      class="w-90 flex-none pt-5 text-right text-xs text-secondary leading-18px"
                    >
                      <span v-if="field.required" class="mr-2 text-error"
                        >*</span
                      >
                      {{ field.label }}
                    </span>
                    <div class="pointer-events-none min-w-0 flex-1">
                      <a-input
                        v-if="
                          field.type === 'text' ||
                          field.type === 'user' ||
                          field.type === 'department'
                        "
                        disabled
                        :placeholder="field.placeholder || '请输入'"
                      />
                      <a-textarea
                        v-else-if="field.type === 'textarea'"
                        disabled
                        :auto-size="{ minRows: 2, maxRows: 4 }"
                        :placeholder="field.placeholder || '请输入'"
                      />
                      <a-input-number
                        v-else-if="
                          field.type === 'number' || field.type === 'money'
                        "
                        class="w-full"
                        disabled
                        :placeholder="field.placeholder || '请输入'"
                      />
                      <a-select
                        v-else-if="field.type === 'select'"
                        class="w-full"
                        disabled
                        :mode="field.multiple ? 'multiple' : undefined"
                        :options="optionOptions(field)"
                        :placeholder="field.placeholder || '请选择'"
                      />
                      <a-radio-group
                        v-else-if="field.type === 'radio'"
                        disabled
                        :options="optionOptions(field)"
                      />
                      <a-checkbox-group
                        v-else-if="field.type === 'checkbox'"
                        disabled
                        :options="optionOptions(field)"
                      />
                      <a-cascader
                        v-else-if="field.type === 'cascader'"
                        class="w-full"
                        disabled
                        :options="optionOptions(field)"
                        :placeholder="field.placeholder || '请选择'"
                      />
                      <a-date-picker
                        v-else-if="field.type === 'date'"
                        class="w-full"
                        disabled
                        :placeholder="field.placeholder || '请选择日期'"
                      />
                      <a-date-picker
                        v-else-if="field.type === 'datetime'"
                        class="w-full"
                        disabled
                        show-time
                        :placeholder="field.placeholder || '请选择日期时间'"
                      />
                      <a-time-picker
                        v-else-if="field.type === 'time'"
                        class="w-full"
                        disabled
                        :placeholder="field.placeholder || '请选择时间'"
                      />
                      <a-switch v-else-if="field.type === 'switch'" disabled />
                      <a-slider v-else-if="field.type === 'slider'" disabled />
                      <span
                        v-else-if="field.type === 'color'"
                        class="size-28 inline-block rounded-4 b-1-regular"
                        :style="{
                          backgroundColor: field.defaultValue || '#1677ff',
                        }"
                      />
                      <div
                        v-else-if="
                          field.type === 'uploadFile' ||
                          field.type === 'uploadImage'
                        "
                        class="h-76 flex flex-col items-center justify-center gap-4 rounded-6 b-dashed-1-regular bg-fill/50 text-secondary"
                      >
                        <Icon name="i-lucide:upload-cloud" :size="18" />
                        <span class="text-11px">
                          {{
                            field.type === 'uploadImage'
                              ? '上传图片'
                              : '上传文件'
                          }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧属性面板 -->
    <aside class="min-h-0 flex flex-col b-l-1-regular bg-container">
      <div class="flex-none b-b-1-regular px-12 py-10">
        <h3 class="m-0 text-sm text-main font-700">
          {{ selectedField ? fieldTypeLabels[selectedField.type] : '表单属性' }}
        </h3>
        <p class="m-0 mt-2 text-xs text-secondary">
          {{
            selectedField
              ? `字段标识：${selectedField.key}`
              : `共 ${fields.length} 个字段`
          }}
        </p>
      </div>

      <div v-if="selectedField" class="min-h-0 flex-1 overflow-y-auto p-12">
        <a-segmented
          v-model:value="activeTab"
          block
          class="mb-12"
          :options="tabOptions"
        />

        <template v-if="activeTab === 'props'">
          <label class="block text-xs text-secondary">
            数据字段
            <a-input
              class="mt-6"
              :value="selectedField.key"
              @update:value="
                (value: string) =>
                  updateSelected({ key: sanitizeKey(String(value)) })
              "
            />
          </label>

          <label class="mt-10 block text-xs text-secondary">
            标题
            <a-input
              class="mt-6"
              :value="selectedField.label"
              @update:value="
                (value: string) => updateSelected({ label: String(value) })
              "
            />
          </label>

          <template v-if="supportsPlaceholder(selectedField.type)">
            <label class="mt-10 block text-xs text-secondary">
              占位内容
              <a-input
                class="mt-6"
                :value="selectedField.placeholder"
                @update:value="
                  (value: string) =>
                    updateSelected({ placeholder: String(value) })
                "
              />
            </label>
          </template>

          <label class="mt-10 block text-xs text-secondary">
            默认值
            <a-input
              class="mt-6"
              :value="selectedField.defaultValue"
              @update:value="
                (value: string) =>
                  updateSelected({ defaultValue: String(value) })
              "
            />
          </label>

          <div
            v-if="supportsMultiple(selectedField.type)"
            class="mt-10 flex items-center justify-between gap-8 text-xs text-secondary"
          >
            可多选
            <a-switch
              :checked="selectedField.multiple"
              @update:checked="
                (checked: boolean) => updateSelected({ multiple: checked })
              "
            />
          </div>

          <div
            class="mt-8 flex items-center justify-between gap-8 text-xs text-secondary"
          >
            可清空
            <a-switch
              :checked="selectedField.clearable"
              @update:checked="
                (checked: boolean) => updateSelected({ clearable: checked })
              "
            />
          </div>

          <div
            class="mt-8 flex items-center justify-between gap-8 text-xs text-secondary"
          >
            禁用
            <a-switch
              :checked="selectedField.disabled"
              @update:checked="
                (checked: boolean) => updateSelected({ disabled: checked })
              "
            />
          </div>

          <div
            class="mt-8 flex items-center justify-between gap-8 text-xs text-secondary"
          >
            隐藏
            <a-switch
              :checked="selectedField.hidden"
              @update:checked="
                (checked: boolean) => updateSelected({ hidden: checked })
              "
            />
          </div>

          <div
            v-if="supportsOptions(selectedField.type)"
            class="mt-14 rounded-7 bg-fill p-10"
          >
            <div class="mb-8 flex items-center justify-between gap-8">
              <strong class="text-xs text-main">选项管理</strong>
              <a-button size="small" type="link" @click="addOption">
                添加选项
              </a-button>
            </div>
            <div class="grid gap-6">
              <div
                v-for="(option, optionIndex) in selectedField.options ?? []"
                :key="optionIndex"
                class="flex items-center gap-4 rounded-4 transition-opacity"
                :class="
                  dragOptionIndex === optionIndex ? 'opacity-50' : 'opacity-100'
                "
                @dragover.prevent
                @drop.stop="onOptionDrop(optionIndex)"
              >
                <span
                  class="shrink-0 px-2 text-tertiary cursor-grab active:cursor-grabbing"
                  draggable="true"
                  title="拖拽排序"
                  @dragstart.stop="onOptionDragStart(optionIndex)"
                  @dragend="endOptionDrag"
                >
                  <Icon name="i-lucide:grip-vertical" :size="16" />
                </span>
                <a-input
                  :value="option"
                  @update:value="
                    (value: string) => updateOption(optionIndex, String(value))
                  "
                />
                <button
                  type="button"
                  class="field-tool-btn"
                  :disabled="optionIndex === 0"
                  @click="moveOption(optionIndex, -1)"
                >
                  <Icon name="i-lucide:arrow-up" :size="12" />
                </button>
                <button
                  type="button"
                  class="field-tool-btn"
                  :disabled="
                    optionIndex === (selectedField.options?.length ?? 0) - 1
                  "
                  @click="moveOption(optionIndex, 1)"
                >
                  <Icon name="i-lucide:arrow-down" :size="12" />
                </button>
                <button
                  type="button"
                  class="field-tool-btn text-error"
                  @click="removeOption(optionIndex)"
                >
                  <Icon name="i-lucide:trash-2" :size="12" />
                </button>
              </div>
            </div>
          </div>
        </template>

        <template v-else-if="activeTab === 'style'">
          <label class="block text-xs text-secondary">
            字段宽度
            <a-select
              class="mt-6 w-full"
              :options="widthOptions"
              :value="selectedField.width ?? 'full'"
              @change="
                (value: unknown) =>
                  updateSelected({
                    width: value as ApprovalFormField['width'],
                  })
              "
            />
          </label>

          <div
            class="mt-12 flex items-center justify-between gap-8 text-xs text-secondary"
          >
            必填
            <a-switch
              :checked="selectedField.required"
              @update:checked="
                (checked: boolean) => updateSelected({ required: checked })
              "
            />
          </div>
        </template>

        <div v-else class="rounded-7 bg-fill p-12 text-xs text-secondary">
          表单字段暂不支持事件配置。
        </div>
      </div>

      <div v-else class="p-18 text-center text-xs text-secondary">
        选择画布中的字段以编辑属性
      </div>
    </aside>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@/components/icon'
import type {
  ApprovalFormField,
  ApprovalFormFieldType,
  ApprovalWorkflowSchema,
} from '@/components/approval-designer'

interface PaletteItem {
  type: ApprovalFormFieldType
  label: string
  icon: string
  preset?: string
  placeholder?: string
  options?: string[]
}

interface PaletteGroup {
  key: string
  label: string
  items: PaletteItem[]
}

const props = defineProps<{
  schema: ApprovalWorkflowSchema
}>()

const emits = defineEmits<{
  'update:schema': [schema: ApprovalWorkflowSchema]
}>()

const fieldTypeLabels: Record<ApprovalFormFieldType, string> = {
  text: '输入框',
  textarea: '文本域',
  number: '数字输入框',
  money: '金额输入框',
  date: '日期选择器',
  datetime: '日期时间',
  time: '时间选择器',
  user: '人员',
  department: '部门',
  select: '选择框',
  radio: '单选框',
  checkbox: '复选框',
  cascader: '级联选择器',
  switch: '开关',
  slider: '滑块',
  color: '颜色选择器',
  uploadFile: '上传文件',
  uploadImage: '上传图片',
  divider: '分割线',
}

const paletteGroups: PaletteGroup[] = [
  {
    key: 'form',
    label: '表单',
    items: [
      { type: 'text', label: '输入框', icon: 'i-lucide:input' },
      { type: 'textarea', label: '文本域', icon: 'i-lucide:text' },
      { type: 'number', label: '数字输入框', icon: 'i-lucide:hash' },
      { type: 'radio', label: '单选框', icon: 'i-lucide:circle-dot' },
      { type: 'checkbox', label: '复选框', icon: 'i-lucide:list-checks' },
      { type: 'select', label: '选择框', icon: 'i-lucide:list-filter' },
      { type: 'cascader', label: '级联选择器', icon: 'i-lucide:git-branch' },
      { type: 'date', label: '日期选择器', icon: 'i-lucide:calendar' },
      { type: 'time', label: '时间选择器', icon: 'i-lucide:clock-3' },
      { type: 'uploadFile', label: '上传文件', icon: 'i-lucide:upload' },
      { type: 'uploadImage', label: '上传图片', icon: 'i-lucide:image-up' },
      { type: 'switch', label: '开关', icon: 'i-lucide:toggle-right' },
      { type: 'slider', label: '滑块', icon: 'i-lucide:sliders-horizontal' },
      { type: 'color', label: '颜色选择器', icon: 'i-lucide:palette' },
    ],
  },
  {
    key: 'layout',
    label: '布局',
    items: [{ type: 'divider', label: '分割线', icon: 'i-lucide:minus' }],
  },
  {
    key: 'preset',
    label: '预设',
    items: [
      {
        type: 'text',
        label: '邮箱',
        icon: 'i-lucide:mail',
        preset: 'email',
        placeholder: '请输入邮箱地址',
      },
      {
        type: 'text',
        label: '手机号',
        icon: 'i-lucide:smartphone',
        preset: 'phone',
        placeholder: '请输入手机号',
      },
      {
        type: 'text',
        label: '网页地址',
        icon: 'i-lucide:link',
        preset: 'url',
        placeholder: '请输入网页地址',
      },
      {
        type: 'text',
        label: '身份证号',
        icon: 'i-lucide:contact',
        preset: 'idcard',
        placeholder: '请输入身份证号',
      },
      { type: 'user', label: '人员', icon: 'i-lucide:user-round' },
      { type: 'department', label: '部门', icon: 'i-lucide:building-2' },
      {
        type: 'text',
        label: '角色',
        icon: 'i-lucide:shield-check',
        preset: 'role',
        placeholder: '请选择角色',
      },
      {
        type: 'select',
        label: '字典',
        icon: 'i-lucide:book-open',
        preset: 'dict',
        options: ['选项一', '选项二'],
      },
    ],
  },
]

const tabOptions = [
  { label: '属性', value: 'props' },
  { label: '样式', value: 'style' },
  { label: '事件', value: 'events' },
]

const widthOptions = [
  { label: '整行', value: 'full' },
  { label: '半行', value: 'half' },
]

const search = shallowRef('')
const selectedIndex = shallowRef(-1)
const activeTab = shallowRef<'props' | 'style' | 'events'>('props')
const zoom = shallowRef(1)
const history = shallowRef<ApprovalFormField[][]>([])
const future = shallowRef<ApprovalFormField[][]>([])
const dragPaletteItem = shallowRef<PaletteItem | null>(null)
const dragFieldIndex = shallowRef<number | null>(null)
const dragActive = shallowRef(false)
const dragOptionIndex = shallowRef<number | null>(null)

const fields = computed(() => props.schema.formFields)
const selectedField = computed(() => fields.value[selectedIndex.value])
const zoomLabel = computed(() => `${Math.round(zoom.value * 100)}%`)

const filteredGroups = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  return paletteGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => !keyword || item.label.toLowerCase().includes(keyword)
      ),
    }))
    .filter((group) => group.items.length > 0)
})

watch(
  () => fields.value.length,
  (length) => {
    if (length === 0) selectedIndex.value = -1
    else if (selectedIndex.value >= length) selectedIndex.value = length - 1
  }
)

function cloneFields(source: readonly ApprovalFormField[]) {
  return source.map((field) => ({
    ...field,
    options: field.options ? [...field.options] : undefined,
  }))
}

function emitFields(nextFields: ApprovalFormField[], recordHistory = true) {
  if (recordHistory) {
    history.value = [...history.value.slice(-49), cloneFields(fields.value)]
    future.value = []
  }
  emits('update:schema', { ...props.schema, formFields: nextFields })
}

function createFieldKey(type: ApprovalFormFieldType) {
  let index = 1
  while (fields.value.some((field) => field.key === `${type}_${index}`)) {
    index += 1
  }
  return `${type}_${index}`
}

function defaultOptions(type: ApprovalFormFieldType) {
  if (
    type === 'select' ||
    type === 'radio' ||
    type === 'checkbox' ||
    type === 'cascader'
  ) {
    return ['选项一', '选项二']
  }
  return undefined
}

function createField(item: PaletteItem): ApprovalFormField {
  return {
    key: createFieldKey(item.type),
    label: item.label,
    type: item.type,
    required: false,
    width: 'full',
    placeholder: item.placeholder,
    options: item.options ?? defaultOptions(item.type),
    multiple: false,
    clearable: true,
    disabled: false,
    hidden: false,
    preset: item.preset,
  }
}

function addField(field: ApprovalFormField, insertIndex = fields.value.length) {
  const next = [...fields.value]
  next.splice(insertIndex, 0, field)
  emitFields(next)
  selectedIndex.value = insertIndex
  activeTab.value = 'props'
}

function addFromPalette(item: PaletteItem) {
  addField(createField(item))
}

function selectField(index: number) {
  selectedIndex.value = index
  if (index >= 0) activeTab.value = 'props'
}

function updateSelected(patch: Partial<ApprovalFormField>) {
  if (!selectedField.value) return
  emitFields(
    fields.value.map((field, index) =>
      index === selectedIndex.value ? { ...field, ...patch } : field
    )
  )
}

function duplicateField(index: number) {
  const source = fields.value[index]
  if (!source) return
  const copy: ApprovalFormField = {
    ...source,
    key: createFieldKey(source.type),
    label: `${source.label} 副本`,
    options: source.options ? [...source.options] : undefined,
  }
  addField(copy, index + 1)
}

function duplicateSelected() {
  if (selectedIndex.value < 0) return
  duplicateField(selectedIndex.value)
}

function removeField(index: number) {
  const next = fields.value.filter((_, current) => current !== index)
  emitFields(next)
  selectedIndex.value = Math.min(index, next.length - 1)
}

function removeSelected() {
  if (selectedIndex.value < 0) return
  removeField(selectedIndex.value)
}

function moveField(index: number, offset: -1 | 1) {
  const target = index + offset
  if (target < 0 || target >= fields.value.length) return
  const next = [...fields.value]
  ;[next[index], next[target]] = [next[target], next[index]]
  emitFields(next)
  selectedIndex.value = target
}

function updateOption(index: number, value: string) {
  if (!selectedField.value) return
  const options = [...(selectedField.value.options ?? [])]
  options[index] = value
  updateSelected({ options })
}

function addOption() {
  if (!selectedField.value) return
  const options = [...(selectedField.value.options ?? [])]
  options.push(`选项${options.length + 1}`)
  updateSelected({ options })
}

function removeOption(index: number) {
  if (!selectedField.value) return
  updateSelected({
    options: (selectedField.value.options ?? []).filter(
      (_, current) => current !== index
    ),
  })
}

function onOptionDragStart(index: number) {
  dragOptionIndex.value = index
}

function endOptionDrag() {
  dragOptionIndex.value = null
}

function onOptionDrop(index: number) {
  const source = dragOptionIndex.value
  dragOptionIndex.value = null
  if (source === null || source === index || !selectedField.value) return

  const options = [...(selectedField.value.options ?? [])]
  const [moved] = options.splice(source, 1)
  options.splice(Math.min(index, options.length), 0, moved)
  updateSelected({ options })
}

function moveOption(index: number, offset: -1 | 1) {
  if (!selectedField.value) return
  const target = index + offset
  const options = [...(selectedField.value.options ?? [])]
  if (target < 0 || target >= options.length) return
  ;[options[index], options[target]] = [options[target], options[index]]
  updateSelected({ options })
}

function optionOptions(field: ApprovalFormField) {
  return (field.options ?? []).map((option) => ({
    label: option,
    value: option,
  }))
}

function supportsPlaceholder(type: ApprovalFormFieldType) {
  return ![
    'switch',
    'slider',
    'color',
    'divider',
    'uploadFile',
    'uploadImage',
  ].includes(type)
}

function supportsMultiple(type: ApprovalFormFieldType) {
  return type === 'select' || type === 'cascader'
}

function supportsOptions(type: ApprovalFormFieldType) {
  return (
    type === 'select' ||
    type === 'radio' ||
    type === 'checkbox' ||
    type === 'cascader'
  )
}

function sanitizeKey(value: string) {
  return value.replace(/[^\w]/g, '_')
}

function undo() {
  const previous = history.value.at(-1)
  if (!previous) return
  future.value = [...future.value, cloneFields(fields.value)]
  history.value = history.value.slice(0, -1)
  emitFields(cloneFields(previous), false)
  selectedIndex.value = -1
}

function redo() {
  const next = future.value.at(-1)
  if (!next) return
  history.value = [...history.value, cloneFields(fields.value)]
  future.value = future.value.slice(0, -1)
  emitFields(cloneFields(next), false)
  selectedIndex.value = -1
}

function zoomIn() {
  zoom.value = Math.min(1.5, Math.round((zoom.value + 0.1) * 10) / 10)
}

function zoomOut() {
  zoom.value = Math.max(0.5, Math.round((zoom.value - 0.1) * 10) / 10)
}

function resetZoom() {
  zoom.value = 1
}

function isEditableTarget(target: EventTarget | null) {
  return (
    target instanceof Element &&
    !!target.closest('input, textarea, select, [contenteditable="true"]')
  )
}

function handleKeydown(event: KeyboardEvent) {
  if (isEditableTarget(event.target)) return

  const withModifier = event.ctrlKey || event.metaKey
  if (withModifier && event.key.toLowerCase() === 'z') {
    event.preventDefault()
    if (event.shiftKey) redo()
    else undo()
    return
  }
  if (withModifier && event.key.toLowerCase() === 'y') {
    event.preventDefault()
    redo()
    return
  }
  if (
    (event.key === 'Delete' || event.key === 'Backspace') &&
    selectedIndex.value >= 0
  ) {
    event.preventDefault()
    removeSelected()
    return
  }
  if (event.key === 'Escape') {
    selectedIndex.value = -1
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))

function onPaletteDragStart(item: PaletteItem) {
  dragPaletteItem.value = item
  dragFieldIndex.value = null
  dragActive.value = true
}

function onFieldDragStart(index: number) {
  dragFieldIndex.value = index
  dragPaletteItem.value = null
  dragActive.value = true
}

function endDrag() {
  dragActive.value = false
  dragPaletteItem.value = null
  dragFieldIndex.value = null
}

function onRowDrop(index: number) {
  if (dragPaletteItem.value) {
    addField(createField(dragPaletteItem.value), index)
  } else if (dragFieldIndex.value !== null) {
    const sourceIndex = dragFieldIndex.value
    if (sourceIndex !== index) {
      const next = [...fields.value]
      const [moved] = next.splice(sourceIndex, 1)
      // 向下拖拽时插入到目标行之后，保证可以拖到列表最后一位
      next.splice(Math.min(index, next.length), 0, moved)
      emitFields(next)
      selectedIndex.value = Math.min(index, next.length - 1)
    }
  }
  endDrag()
}

function onCanvasDrop() {
  if (dragPaletteItem.value) {
    addFromPalette(dragPaletteItem.value)
  }
  endDrag()
}
</script>

<style scoped>
.form-designer-canvas {
  background-color: rgb(var(--w-bg-page));
  background-image: radial-gradient(
    rgb(var(--w-border-regular) / 70%) 1px,
    transparent 1px
  );
  background-size: 16px 16px;
  transition:
    background-color 0.16s ease,
    box-shadow 0.16s ease;
}

.form-designer-canvas.is-drag-active {
  background-color: rgb(var(--w-color-primary) / 3%);
  box-shadow: inset 0 0 0 2px rgb(var(--w-color-primary) / 28%);
}

.lc-form-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 320px;
  background: rgb(var(--w-bg-fill) / 45%);
  border: 1px dashed rgb(var(--w-border-main));
  border-radius: 10px;
  transition:
    border-color 0.16s ease,
    background-color 0.16s ease,
    color 0.16s ease;
}

.is-drag-active .lc-form-empty {
  background: rgb(var(--w-color-primary) / 5%);
  border-color: rgb(var(--w-color-primary) / 45%);
}

.field-tool-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  color: rgb(var(--w-text-secondary));
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 4px;
  transition:
    background-color 0.16s ease,
    color 0.16s ease;
}

.field-tool-btn:hover:not(:disabled) {
  color: rgb(var(--w-color-primary));
  background: rgb(var(--w-bg-hover));
}

.field-tool-btn:disabled {
  cursor: not-allowed;
  opacity: 0.35;
}
</style>
