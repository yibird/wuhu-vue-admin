<template>
  <WView :full="true" :padding="false" class="bg-page">
    <div
      class="h-full min-h-full w-full overflow-x-hidden overflow-y-auto p-16 md:p-20"
    >
      <section
        class="mx-auto max-w-1280 rounded-8 b-1-muted bg-container p-16 shadow-sm md:p-20"
      >
        <header
          class="mb-16 flex flex-wrap items-start justify-between gap-12 b-b-1-muted pb-14"
        >
          <div class="min-w-0">
            <h1 class="m-0 text-xl text-main font-600">FormPlus</h1>
            <p class="mb-0 mt-6 text-sm leading-22 text-secondary">
              schema
              驱动表单：查询/填写双模式、校验、联动、异步数据源、查询折叠与控件注册。
            </p>
          </div>
          <a-tag color="blue">src/components/form-plus</a-tag>
        </header>

        <div class="grid gap-16">
          <a-card title="查询表单:栅格 + 展开/收缩" size="small">
            <FormPlus
              :schemas="querySchemas"
              :grid="{ cols: 3, xGap: 16, yGap: 8 }"
              :collapse="{ visibleCount: 3 }"
              :label-width="90"
              @submit="handleQuerySubmit"
            />
            <div class="mt-10 text-xs text-secondary">
              提交值：{{ JSON.stringify(queryResult) }}
            </div>
          </a-card>

          <a-card title="填写表单:校验 + 联动 + 异步选项" size="small">
            <FormPlus
              ref="editFormRef"
              :schemas="editSchemas"
              v-model:model="formModel"
              mode="edit"
              :grid="{ cols: 2, xGap: 16, yGap: 8 }"
              :rules="formRules"
              :label-width="96"
              @submit="handleCreate"
              @change="handleChange"
            />
            <div class="mt-10 flex flex-wrap items-center gap-8">
              <a-button size="small" @click="checkOptionsState">
                检查选项状态
              </a-button>
              <a-button
                size="small"
                @click="editFormRef?.validate().catch(() => undefined)"
              >
                校验
              </a-button>
              <a-button size="small" @click="editFormRef?.reset()"
                >重置</a-button
              >
              <a-button
                size="small"
                :loading="submitting"
                @click="editFormRef?.submit()"
              >
                提交
              </a-button>
              <span class="text-xs text-secondary">
                当前值：{{ JSON.stringify(formModel) }}
              </span>
            </div>
          </a-card>

          <a-card title="useForm:实例方法与提交状态" size="small">
            <FormPlus ref="useFormRef" v-bind="formProps" />
            <div class="mt-10 flex flex-wrap items-center gap-8">
              <a-button size="small" @click="fillByUseForm"
                >写入字段值</a-button
              >
              <a-button size="small" @click="validateByUseForm">校验</a-button>
              <a-button
                size="small"
                :loading="useFormSubmitting"
                @click="useFormRef?.submit()"
              >
                提交
              </a-button>
              <a-button size="small" @click="useFormRef?.reset()"
                >重置</a-button
              >
            </div>
          </a-card>

          <a-card title="行为日志" size="small">
            <div v-if="actionLog.length === 0" class="text-xs text-secondary">
              暂无日志,试试切换「类型」、提交表单或展开知识库下拉。
            </div>
            <ul v-else class="m-0 list-none p-0 text-xs text-secondary">
              <li v-for="log in actionLog" :key="log" class="py-3">
                {{ log }}
              </li>
            </ul>
          </a-card>
        </div>
      </section>
    </div>
  </WView>
</template>

<script setup lang="ts">
import {
  FormPlus,
  registerFormComponent,
  useForm,
} from '@/components/form-plus'
import type {
  FormPlusContext,
  FormPlusInstance,
  FormPlusModel,
  FormPlusProps,
} from '@/components/form-plus'
import { IconSelector, type IconSelectorProps } from '@/components/icon-picker'
import type { Rule } from 'antdv-next'

declare module '@/components/form-plus' {
  interface FormPlusComponentPropsMap {
    iconSelector: IconSelectorProps
  }
}

registerFormComponent('iconSelector', IconSelector)

/** 模拟接口:技能字典 */
function fetchSkillOptions() {
  return new Promise<Array<{ label: string; value: string }>>((resolve) => {
    setTimeout(
      () =>
        resolve([
          { label: '联网搜索', value: 'web-search' },
          { label: '代码执行', value: 'code-runner' },
          { label: '文档解析', value: 'doc-parser' },
        ]),
      300
    )
  })
}

/** 模拟接口:知识库字典(懒加载) */
function fetchKnowledgeOptions() {
  return new Promise<Array<{ label: string; value: string }>>((resolve) => {
    setTimeout(
      () =>
        resolve([
          { label: '产品能力手册', value: 'product' },
          { label: '经营指标口径库', value: 'bi-metrics' },
          { label: '客服 FAQ', value: 'faq' },
        ]),
      400
    )
  })
}

const channelOptions = [
  { label: '官网', value: 'site' },
  { label: '应用市场', value: 'store' },
  { label: '合作渠道', value: 'partner' },
]

const actionLog = shallowRef<string[]>([])

function pushLog(text: string) {
  actionLog.value = [
    `${new Date().toLocaleTimeString()} ${text}`,
    ...actionLog.value,
  ].slice(0, 6)
}

/* ---------------- 查询表单:栅格 + 折叠 ---------------- */

const querySchemas = shallowRef<FormPlusProps['schemas']>([
  {
    component: 'input',
    field: 'keyword',
    label: '关键词',
    componentProps: { allowClear: true, placeholder: '请输入关键词' },
  },
  {
    component: 'select',
    field: 'channel',
    label: '渠道',
    componentProps: {
      allowClear: true,
      options: channelOptions,
      placeholder: '请选择渠道',
    },
  },
  {
    component: 'datePicker',
    field: 'startAt',
    label: '开始时间',
    componentProps: { placeholder: '选择日期' },
  },
  {
    component: 'inputNumber',
    field: 'minAmount',
    label: '最小金额',
    componentProps: { min: 0, placeholder: '请输入金额' },
  },
  {
    component: 'switch',
    field: 'onlyMine',
    label: '仅看我负责',
    componentProps: { checkedChildren: '是', unCheckedChildren: '否' },
  },
])

const queryResult = shallowRef<FormPlusModel>({})

function handleQuerySubmit(values: FormPlusModel) {
  queryResult.value = values
  pushLog(`查询: ${JSON.stringify(values)}`)
}

/* ---------------- 编辑表单:校验 + 联动 + 选项批量/懒加载 ---------------- */

function createDefaultForm(): FormPlusModel {
  return {
    name: '',
    category: 'assistant',
    owner: '',
    skills: [],
    knowledgeBase: undefined,
    icon: '',
  }
}

const formModel = shallowRef<FormPlusModel>(createDefaultForm())

const formRules: Record<string, Rule[]> = {
  name: [
    { required: true, whitespace: true, message: '请输入 Agent 名称' },
    { min: 2, max: 20, message: '名称长度为 2-20 个字符' },
  ],
}

const editSchemas = shallowRef<FormPlusProps['schemas']>([
  {
    component: 'input',
    field: 'name',
    label: 'Agent 名称',
    componentProps: { allowClear: true, placeholder: '请输入 2-20 个字符' },
  },
  {
    component: 'radioGroup',
    field: 'category',
    label: '类型',
    componentProps: {
      options: [
        { label: '对话助手', value: 'assistant' },
        { label: '自动化流程', value: 'workflow' },
        { label: '外部接入', value: 'external' },
      ],
    },
  },
  {
    component: 'input',
    field: 'owner',
    label: '负责人',
    componentProps: { placeholder: '选择外部接入时必填' },
    // 联动:类型为 external 时显示并必填,其它类型时隐藏并清空
    deps: ['category'],
    linkage(ctx: FormPlusContext) {
      const isExternal = ctx.getValue('category') === 'external'
      ctx.setVisible('owner', isExternal)
      ctx.setSchema('owner', {
        required: isExternal,
        rules: isExternal
          ? [{ required: true, whitespace: true, message: '请输入负责人' }]
          : [],
      })
      if (!isExternal) ctx.setValue('owner', '')
      ctx.clearValidate('owner')
      pushLog(
        `联动执行:类型=${ctx.getValue('category')},负责人可见=${isExternal}`
      )
    },
  },
  {
    component: 'select',
    field: 'skills',
    label: '技能',
    componentProps: {
      mode: 'multiple',
      placeholder: '批量加载的技能',
      allowClear: true,
    },
    getOptions: () => fetchSkillOptions(),
  },
  {
    component: 'select',
    field: 'knowledgeBase',
    label: '知识库',
    componentProps: { placeholder: '展开下拉时才加载', allowClear: true },
    getOptions: () => fetchKnowledgeOptions(),
    lazy: true,
  },
  {
    component: 'iconSelector',
    field: 'icon',
    label: '图标',
    componentProps: { placeholder: '选择图标(自定义注册控件)' },
  },
])

function handleCreate(values: FormPlusModel) {
  pushLog(`提交: ${JSON.stringify(values)}`)
}

const editFormRef = useTemplateRef<FormPlusInstance>('editFormRef')

/**
 * 打印字段选项状态:用于观察「批量加载」与「懒加载」的差异
 */
function checkOptionsState() {
  const form = editFormRef.value
  if (!form) return

  for (const field of ['skills', 'knowledgeBase']) {
    const state = form.getOptionsState(field)
    pushLog(
      `选项状态 ${field}: 已加载=${state.loaded} 数量=${state.options.length} 加载中=${state.loading}`
    )
  }
}

function handleChange(field: string, value: unknown) {
  pushLog(`change: ${field} = ${String(value)}`)
}

const submitting = shallowRef(false)

async function handleOnFinish(values: FormPlusModel) {
  submitting.value = true
  await new Promise((resolve) => setTimeout(resolve, 400))
  submitting.value = false
  pushLog(`useForm onFinish: ${JSON.stringify(values)}`)
}

const {
  formProps,
  formRef: useFormRef,
  submitting: useFormSubmitting,
} = useForm({
  schemas: editSchemas,
  initialValues: createDefaultForm(),
  rules: formRules,
  labelWidth: 96,
  grid: { cols: 2, xGap: 16, yGap: 8 },
  onFinish: handleOnFinish,
})

function fillByUseForm() {
  useFormRef.value?.setFieldsValue({
    name: '智能客服助手',
    category: 'assistant',
    skills: ['web-search'],
  })
  pushLog('useForm: 已通过实例写入字段值')
}

async function validateByUseForm() {
  try {
    await useFormRef.value?.validate()
    pushLog('useForm: 校验通过')
  } catch {
    pushLog('useForm: 校验未通过(看行内错误)')
  }
}
</script>
