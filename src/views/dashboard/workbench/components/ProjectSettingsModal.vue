<script setup lang="ts">
import message from 'antdv-next/dist/message/index'
import Modal from 'antdv-next/dist/modal/index'
import type { FormInstance, ModalProps } from 'antdv-next'
import { getProjectLogoOption, projectLogoOptions } from '../data'
import type {
  Project,
  ProjectSettingsMode,
  ProjectSettingsPayload,
} from './types'

const props = withDefaults(
  defineProps<{
    mode?: ProjectSettingsMode
    project?: Project | null
  }>(),
  {
    mode: 'create',
    project: null,
  }
)

const emit = defineEmits<{
  save: [payload: ProjectSettingsPayload]
}>()

const open = defineModel<boolean>('open', { default: false })
const formRef = shallowRef<FormInstance>()
const initialForm = shallowRef<ProjectSettingsPayload>()

const form = reactive<ProjectSettingsPayload>({
  logo: {
    icon: projectLogoOptions[0].icon,
    tone: projectLogoOptions[0].tone,
  },
  name: '',
  describe: '',
  master: '',
  dueAt: '',
  priority: 'medium',
  progress: 35,
  notify: true,
  autoReport: true,
  riskWatch: false,
})

const priorityOptions = [
  {
    label: '常规',
    value: 'low',
    icon: 'i-lucide:circle',
    class: 'bg-fill-tertiary text-secondary',
  },
  {
    label: '重点',
    value: 'medium',
    icon: 'i-lucide:circle-dot',
    class: 'bg-info-tint text-info',
  },
  {
    label: '高优',
    value: 'high',
    icon: 'i-lucide:flame',
    class: 'bg-warning-tint text-warning',
  },
  {
    label: '紧急',
    value: 'urgent',
    icon: 'i-lucide:siren',
    class: 'bg-error-tint text-error',
  },
] as const

const switchOptions = [
  {
    key: 'notify',
    title: '消息提醒',
    desc: '关键节点自动通知负责人',
    icon: 'i-lucide:bell-ring',
  },
  {
    key: 'autoReport',
    title: '周报同步',
    desc: '每周五生成项目进展摘要',
    icon: 'i-lucide:file-clock',
  },
  {
    key: 'riskWatch',
    title: '风险监控',
    desc: '延期或低进度时展示预警',
    icon: 'i-lucide:radar',
  },
] as const

const rules = {
  name: [
    { required: true, message: '请输入项目名称', trigger: 'blur' },
    { min: 2, message: '项目名称至少 2 个字符', trigger: 'blur' },
  ],
  describe: [{ required: true, message: '请输入项目说明', trigger: 'blur' }],
  master: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
  dueAt: [
    { required: true, message: '请输入截止日期', trigger: 'blur' },
    {
      pattern: /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
      message: '请使用 MM-DD 格式',
      trigger: 'blur',
    },
  ],
}

const modalClasses: ModalProps['classes'] = {
  body: 'max-h-[calc(100vh-150px)] overflow-y-auto overscroll-contain',
}

const modalTitle = computed(() =>
  props.mode === 'create' ? '新建项目设置' : '项目设置'
)

const selectedPriority = computed(
  () =>
    priorityOptions.find((item) => item.value === form.priority) ??
    priorityOptions[1]
)

const selectedLogo = computed(() => getProjectLogoOption(form.logo))

const isDirty = computed(() => {
  if (!initialForm.value) return false
  return JSON.stringify(getFormPayload()) !== JSON.stringify(initialForm.value)
})

const saveDisabled = computed(() => props.mode === 'edit' && !isDirty.value)

const saveStateText = computed(() => {
  if (isDirty.value) return '有未保存更改'
  return props.mode === 'create' ? '填写信息后创建项目' : '设置未发生变化'
})

const activeSwitchCount = computed(
  () => Number(form.notify) + Number(form.autoReport) + Number(form.riskWatch)
)

const progressStatus = computed(() => {
  if (form.progress >= 80) return '进度健康'
  if (form.progress >= 45) return '推进中'
  return form.riskWatch ? '需要关注' : '等待启动'
})

const previewName = computed(() => form.name.trim() || '未命名项目')
const previewDescribe = computed(
  () =>
    form.describe.trim() ||
    '补充项目目标、交付范围和关键收益后，团队会更容易对齐。'
)
const previewMaster = computed(() => form.master.trim() || '待分配负责人')

watch(
  () => [open.value, props.project, props.mode] as const,
  ([isOpen]) => {
    if (!isOpen) return
    resetForm()
  },
  { immediate: true }
)

function resetForm() {
  const project = props.project
  form.logo = {
    ...(project?.logo ?? {
      icon: projectLogoOptions[0].icon,
      tone: projectLogoOptions[0].tone,
    }),
  }
  form.name = project?.name ?? ''
  form.describe = project?.describe ?? ''
  form.master = project?.master?.replace(/^.*?：/, '') ?? ''
  form.dueAt = project?.dueAt ?? '06-30'
  form.priority = project?.statusClass.includes('error')
    ? 'urgent'
    : project?.statusClass.includes('warning')
      ? 'high'
      : project?.statusClass.includes('info')
        ? 'medium'
        : 'medium'
  form.progress = project?.progress ?? 35
  form.notify = true
  form.autoReport = props.mode === 'create'
  form.riskWatch = project?.statusClass.includes('error') ?? false
  initialForm.value = getFormPayload()
  nextTick(() => formRef.value?.clearValidate())
}

function getFormPayload(): ProjectSettingsPayload {
  return {
    ...form,
    logo: { ...form.logo },
  }
}

function restoreInitialForm() {
  if (!initialForm.value) return
  Object.assign(form, {
    ...initialForm.value,
    logo: { ...initialForm.value.logo },
  })
  formRef.value?.clearValidate()
}

function updateLogo(
  icon: string,
  tone: ProjectSettingsPayload['logo']['tone']
) {
  form.logo = { icon, tone }
}

function updatePriority(value: ProjectSettingsPayload['priority']) {
  form.priority = value
}

function updateSwitch(
  key: (typeof switchOptions)[number]['key'],
  value: boolean
) {
  form[key] = value
}

async function handleSave() {
  try {
    await formRef.value?.validate()
  } catch {
    message.warning('请先完善项目必填信息')
    return
  }

  const payload = getFormPayload()
  emit('save', payload)
  message.success(props.mode === 'create' ? '项目已创建' : '项目设置已保存')
  open.value = false
}

function handleCancel() {
  if (!isDirty.value) {
    open.value = false
    return
  }

  Modal.confirm({
    title: '放弃未保存更改？',
    content: '当前调整尚未保存，关闭后将恢复原来的项目设置。',
    okText: '放弃更改',
    okType: 'danger',
    cancelText: '继续编辑',
    onOk: () => {
      open.value = false
    },
  })
}
</script>

<template>
  <a-modal
    :open="open"
    centered
    :destroy-on-hidden="true"
    :classes="modalClasses"
    :width="920"
    @cancel="handleCancel"
  >
    <template #title>
      <div class="flex items-center gap-10">
        <span
          class="size-38 flex items-center justify-center rounded-8 icon-primary-soft"
        >
          <Icon name="i-lucide:folder-cog" :size="18" />
        </span>
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-8">
            <div class="text-lg text-main font-700">{{ modalTitle }}</div>
            <span
              class="rounded-full bg-fill-tertiary px-8 py-2 text-xs text-secondary font-500"
            >
              {{ props.mode === 'create' ? '创建模式' : '编辑模式' }}
            </span>
          </div>
          <div class="mt-2 text-xs text-secondary font-400">
            设置项目标识、交付信息和协作策略
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex flex-col gap-10 sm:flex-row sm:items-center">
        <div class="min-w-0 flex flex-1 items-center gap-8 text-xs">
          <Icon
            :name="isDirty ? 'i-lucide:circle-dot' : 'i-lucide:circle-check'"
            :size="14"
            :class="isDirty ? 'text-warning' : 'text-success'"
          />
          <span :class="isDirty ? 'text-main' : 'text-secondary'">
            {{ saveStateText }}
          </span>
          <a-button
            v-if="isDirty"
            type="link"
            size="small"
            class="!px-2"
            @click="restoreInitialForm"
          >
            恢复初始值
          </a-button>
        </div>
        <div class="flex justify-end gap-8">
          <a-button @click="handleCancel">取消</a-button>
          <a-button type="primary" :disabled="saveDisabled" @click="handleSave">
            <template #icon>
              <Icon name="i-lucide:save" :size="15" />
            </template>
            {{ props.mode === 'create' ? '创建项目' : '保存设置' }}
          </a-button>
        </div>
      </div>
    </template>

    <div class="grid gap-18 pt-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        class="min-w-0 space-y-16"
        layout="vertical"
      >
        <div
          class="border-b-1 border-b-solid border-color-2 pb-16 last:border-b-0 last:pb-0"
        >
          <div class="mb-12 flex items-start justify-between gap-12">
            <div>
              <div class="flex items-center gap-7 text-sm text-main font-700">
                <Icon name="i-lucide:shapes" :size="16" />
                项目标识
              </div>
              <div class="mt-3 text-xs text-secondary leading-18px">
                选择与项目领域匹配的图标和识别色
              </div>
            </div>
            <span class="text-xs text-secondary">{{ selectedLogo.label }}</span>
          </div>

          <div class="grid grid-cols-3 gap-8 sm:grid-cols-6">
            <button
              v-for="item in projectLogoOptions"
              :key="item.icon"
              type="button"
              class="group relative min-w-0 flex flex-col items-center gap-7 rounded-8 border-1 border-solid bg-container p-8 transition-[border-color,background-color,box-shadow,transform] duration-motion-base hover:(-translate-y-1 border-color-primary/60 bg-hover shadow-all-sm)"
              :class="
                form.logo.icon === item.icon
                  ? 'border-color-primary bg-primary/5 shadow-all-sm'
                  : 'border-color-2'
              "
              :aria-label="`选择${item.label}标识`"
              :aria-pressed="form.logo.icon === item.icon"
              @click="updateLogo(item.icon, item.tone)"
            >
              <span
                class="size-36 flex items-center justify-center rounded-8 border-1 border-solid transition-transform duration-motion-base group-hover:scale-105"
                :class="item.class"
              >
                <Icon :name="item.icon" :size="18" />
              </span>
              <span class="w-full truncate text-xs text-secondary">
                {{ item.label }}
              </span>
              <Icon
                v-if="form.logo.icon === item.icon"
                name="i-lucide:circle-check"
                :size="14"
                class="absolute right-5 top-5 text-primary"
              />
            </button>
          </div>
        </div>

        <div
          class="border-b-1 border-b-solid border-color-2 pb-16 last:border-b-0 last:pb-0"
        >
          <div class="mb-12 flex items-start justify-between gap-12">
            <div>
              <div class="flex items-center gap-7 text-sm text-main font-700">
                <Icon name="i-lucide:file-pen-line" :size="16" />
                基础信息
              </div>
              <div class="mt-3 text-xs text-secondary leading-18px">
                用清晰的目标和责任信息帮助团队快速理解项目
              </div>
            </div>
          </div>

          <div class="grid gap-12">
            <a-form-item class="!mb-0" label="项目名称" name="name">
              <a-input
                v-model:value="form.name"
                allow-clear
                placeholder="输入项目名称"
                :maxlength="30"
                show-count
              />
            </a-form-item>

            <a-form-item class="!mb-0" label="项目说明" name="describe">
              <a-textarea
                v-model:value="form.describe"
                placeholder="描述项目目标、交付范围和当前背景"
                :auto-size="{ minRows: 3, maxRows: 4 }"
                :maxlength="120"
                show-count
              />
            </a-form-item>

            <div class="grid gap-10 sm:grid-cols-2">
              <a-form-item class="!mb-0" label="负责人" name="master">
                <a-input
                  v-model:value="form.master"
                  allow-clear
                  placeholder="负责人姓名"
                />
              </a-form-item>
              <a-form-item class="!mb-0" label="截止日期" name="dueAt">
                <a-input
                  v-model:value="form.dueAt"
                  allow-clear
                  placeholder="例如 06-30"
                >
                  <template #prefix>
                    <Icon name="i-lucide:calendar-days" :size="14" />
                  </template>
                </a-input>
              </a-form-item>
            </div>
          </div>
        </div>

        <div
          class="border-b-1 border-b-solid border-color-2 pb-16 last:border-b-0 last:pb-0"
        >
          <div class="mb-12 flex items-start justify-between gap-12">
            <div>
              <div class="flex items-center gap-7 text-sm text-main font-700">
                <Icon name="i-lucide:gauge" :size="16" />
                推进状态
              </div>
              <div class="mt-3 text-xs text-secondary leading-18px">
                优先级和进度会共同决定项目卡片的状态表达
              </div>
            </div>
            <span class="text-xs text-secondary">{{ progressStatus }}</span>
          </div>

          <div class="space-y-12">
            <div class="grid gap-8 sm:grid-cols-4">
              <button
                v-for="item in priorityOptions"
                :key="item.value"
                type="button"
                class="w-full flex items-center gap-8 rounded-8 border-1 border-solid bg-container p-10 text-left cursor-pointer transition-[background-color,border-color,box-shadow,transform] duration-motion-base ease-motion-standard hover:(-translate-y-1 border-primary/36 bg-hover shadow-[0_8px_22px_rgb(0_0_0_/_8%)]) focus-visible:(-translate-y-1 border-primary/36 bg-hover shadow-[0_8px_22px_rgb(0_0_0_/_8%)] outline-2 outline-primary/35 outline-offset-2) active:translate-y-0 motion-reduce:(transform-none transition-none)"
                :class="
                  form.priority === item.value
                    ? 'border-primary shadow-all-sm'
                    : 'border-color-2'
                "
                :aria-pressed="form.priority === item.value"
                @click="updatePriority(item.value)"
              >
                <span
                  class="size-30 flex items-center justify-center rounded-7"
                  :class="item.class"
                >
                  <Icon :name="item.icon" :size="15" />
                </span>
                <span class="text-sm text-main font-600">{{ item.label }}</span>
              </button>
            </div>

            <div class="rounded-8 bg-fill-quaternary p-12">
              <div class="mb-8 flex items-center justify-between text-xs">
                <span class="text-secondary font-600">完成进度</span>
                <span class="text-main font-700">{{ form.progress }}%</span>
              </div>
              <a-slider v-model:value="form.progress" :min="0" :max="100" />
            </div>
          </div>
        </div>

        <div
          class="border-b-1 border-b-solid border-color-2 pb-16 last:border-b-0 last:pb-0"
        >
          <div class="mb-12 flex items-start justify-between gap-12">
            <div>
              <div class="flex items-center gap-7 text-sm text-main font-700">
                <Icon name="i-lucide:workflow" :size="16" />
                协作策略
              </div>
              <div class="mt-3 text-xs text-secondary leading-18px">
                按需开启提醒、周报和风险监控
              </div>
            </div>
            <span class="text-xs text-secondary">
              已开启 {{ activeSwitchCount }} 项
            </span>
          </div>

          <div class="grid gap-8 sm:grid-cols-3">
            <button
              v-for="item in switchOptions"
              :key="item.key"
              type="button"
              class="w-full box-border rounded-8 border-1 border-solid bg-container p-10 text-left cursor-pointer transition-[background-color,border-color,box-shadow,transform] duration-motion-base ease-motion-standard hover:(-translate-y-1 border-primary/36 bg-hover shadow-[0_8px_22px_rgb(0_0_0_/_8%)]) focus-visible:(-translate-y-1 border-primary/36 bg-hover shadow-[0_8px_22px_rgb(0_0_0_/_8%)] outline-2 outline-primary/35 outline-offset-2) active:translate-y-0 motion-reduce:(transform-none transition-none)"
              :class="
                form[item.key]
                  ? '-translate-y-1 border-primary/36 bg-primary/8 shadow-all-sm'
                  : 'border-color-2'
              "
              :aria-pressed="form[item.key]"
              @click="updateSwitch(item.key, !form[item.key])"
            >
              <span class="flex items-start justify-between gap-8">
                <span
                  class="size-30 flex items-center justify-center rounded-7 bg-fill-tertiary text-secondary"
                >
                  <Icon :name="item.icon" :size="15" />
                </span>
                <a-switch
                  size="small"
                  :checked="form[item.key]"
                  @click.stop
                  @change="updateSwitch(item.key, Boolean($event))"
                />
              </span>
              <span class="mt-9 block text-sm text-main font-600">
                {{ item.title }}
              </span>
              <span class="mt-4 block text-xs text-secondary leading-18px">
                {{ item.desc }}
              </span>
            </button>
          </div>
        </div>
      </a-form>

      <aside class="min-w-0">
        <div
          class="sticky top-0 overflow-hidden rounded-8 border-1 border-color-1 border-solid bg-container p-14 shadow-[0_14px_34px_rgb(var(--w-shadow-color)_/_12%)]"
        >
          <div class="mb-12 flex items-center gap-6 text-xs text-secondary">
            <Icon name="i-lucide:scan-eye" :size="14" />
            项目卡片实时预览
          </div>
          <div class="flex items-center justify-between gap-10">
            <span
              class="rounded-full px-8 py-3 text-xs font-600"
              :class="selectedPriority.class"
            >
              {{ selectedPriority.label }}
            </span>
            <span class="text-xs text-secondary"
              >{{ activeSwitchCount }} 项效果</span
            >
          </div>

          <div class="mt-18 flex items-center gap-10">
            <span
              class="size-52 flex shrink-0 items-center justify-center rounded-12 border-1 border-solid shadow-all-sm transition-[border-color,background-color,color,transform] duration-motion-base ease-motion-standard motion-reduce:transition-none"
              :class="selectedLogo.class"
            >
              <Transition
                mode="out-in"
                enter-active-class="transition-[opacity,transform] duration-motion-base ease-motion-standard motion-reduce:transition-none"
                leave-active-class="transition-[opacity,transform] duration-motion-base ease-motion-standard motion-reduce:transition-none"
                enter-from-class="-rotate-8 scale-75 opacity-0 motion-reduce:(rotate-0 scale-100)"
                leave-to-class="scale-75 rotate-8 opacity-0 motion-reduce:(scale-100 rotate-0)"
              >
                <Icon
                  :key="selectedLogo.icon"
                  :name="selectedLogo.icon"
                  :size="24"
                />
              </Transition>
            </span>
            <div class="min-w-0">
              <div class="truncate text-base text-main font-700">
                {{ previewName }}
              </div>
              <div class="mt-3 truncate text-xs text-secondary">
                {{ previewMaster }}
              </div>
            </div>
          </div>

          <p
            class="mb-0 mt-14 line-clamp-3 text-sm text-secondary leading-22px"
          >
            {{ previewDescribe }}
          </p>

          <div class="mt-16">
            <div class="mb-7 flex items-center justify-between text-xs">
              <span class="text-secondary">{{ progressStatus }}</span>
              <span class="text-main font-700">{{ form.progress }}%</span>
            </div>
            <a-progress
              :percent="form.progress"
              :show-info="false"
              :size="8"
              :status="
                form.riskWatch && form.progress < 45 ? 'exception' : 'active'
              "
            />
          </div>

          <div class="mt-14 grid grid-cols-2 gap-8 text-xs">
            <div
              class="min-w-0 flex items-center gap-5 rounded-6 bg-fill-1 p-8 text-secondary"
            >
              <Icon name="i-lucide:calendar-clock" :size="14" />
              {{ form.dueAt || '待定' }}
            </div>
            <div
              class="min-w-0 flex items-center gap-5 rounded-6 bg-fill-1 p-8 text-secondary"
            >
              <Icon name="i-lucide:bell-ring" :size="14" />
              {{ form.notify ? '已提醒' : '不提醒' }}
            </div>
          </div>
        </div>

        <div class="mt-12 border-t-1 border-color-2 border-t-solid pt-12">
          <div class="flex items-center gap-7 text-sm text-main font-700">
            <Icon name="i-lucide:badge-check" :size="15" class="text-primary" />
            设置影响
          </div>
          <div class="mt-9 space-y-8 text-xs text-secondary leading-18px">
            <div class="flex items-start gap-6">
              <Icon
                name="i-lucide:check"
                :size="13"
                class="mt-2 shrink-0 text-success"
              />
              Logo、名称和负责人会同步到项目卡片
            </div>
            <div class="flex items-start gap-6">
              <Icon
                name="i-lucide:check"
                :size="13"
                class="mt-2 shrink-0 text-success"
              />
              优先级和风险监控共同决定项目状态
            </div>
            <div class="flex items-start gap-6">
              <Icon
                name="i-lucide:check"
                :size="13"
                class="mt-2 shrink-0 text-success"
              />
              所有变更在保存前都可恢复
            </div>
          </div>
        </div>
      </aside>
    </div>
  </a-modal>
</template>
