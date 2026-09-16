<script setup lang="ts">
import { message, type FormInstance } from 'antdv-next'
import {
  createDeptApi,
  getDeptPageListApi,
  getDeptRecordApi,
  updateDeptApi,
  type CreateDeptReq,
  type DeptResp,
} from '@/apis'
import { DeptPicker, type DeptPickerOption } from '@/features'

interface Props {
  id?: string
}

const props = defineProps<Props>()
const open = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{
  success: []
}>()

const formRef = shallowRef<FormInstance>()
const submitting = shallowRef(false)
const detailLoading = shallowRef(false)
const optionsLoading = shallowRef(false)
const parentOptions = shallowRef<DeptPickerOption[]>([])
const form = reactive<CreateDeptReq>(createDefaultForm())
const isEdit = computed(() => Boolean(props.id))
const entityName = computed(() => (form.type === 2 ? '岗位' : '部门'))
const title = computed(
  () => `${isEdit.value ? '编辑' : '新建'}${entityName.value}`
)

const rules = {
  name: [
    { required: true, whitespace: true, message: '请输入部门名称' },
    { max: 50, message: '部门名称不能超过 50 个字符' },
  ],
  code: [{ required: true, whitespace: true, message: '请输入部门编码' }],
  parentId: [{ required: true, message: '请选择上级部门' }],
}

watch([open, () => props.id], async ([value]) => {
  if (!value) return
  Object.assign(form, createDefaultForm())
  await Promise.all([
    loadParentOptions(),
    props.id ? loadDept(props.id) : Promise.resolve(),
  ])
  await nextTick()
  formRef.value?.clearValidate()
})

function createDefaultForm(): CreateDeptReq {
  return {
    parentId: '0',
    name: '',
    code: '',
    type: 1,
    leader: '',
    phone: '',
    email: '',
    remark: '',
  }
}

function toTreeOptions(items: DeptResp[]): DeptPickerOption[] {
  const options = new Map<string, DeptPickerOption>()
  const roots: DeptPickerOption[] = []

  items.forEach((item) => {
    options.set(item.id, {
      title: item.name,
      value: item.id,
      code: item.code,
      children: [],
    })
  })

  items.forEach((item) => {
    const option = options.get(item.id)
    if (!option) return
    const parent = options.get(item.parentId)
    if (parent) parent.children?.push(option)
    else roots.push(option)
  })

  return roots
}

async function loadParentOptions() {
  optionsLoading.value = true
  try {
    const response = await getDeptPageListApi({
      pageNum: 1,
      pageSize: 1000,
      type: 1,
    })
    parentOptions.value = toTreeOptions(response.data?.list ?? [])
  } catch {
    // 业务错误已由请求层统一提示，这里仅停止填充选项
  } finally {
    optionsLoading.value = false
  }
}

async function loadDept(id: string) {
  detailLoading.value = true
  try {
    const response = await getDeptRecordApi({ id })
    if (!response.data) {
      open.value = false
      return
    }

    Object.assign(form, {
      parentId: response.data.parentId,
      name: response.data.name,
      code: response.data.code,
      type: response.data.type,
      leader: response.data.leader,
      phone: response.data.phone,
      email: response.data.email,
      remark: response.data.remark ?? '',
    })
  } catch {
    // 业务错误已由请求层统一提示，这里仅关闭弹窗
    open.value = false
  } finally {
    detailLoading.value = false
  }
}

function isValidationError(error: unknown) {
  return typeof error === 'object' && error !== null && 'errorFields' in error
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
  } catch (error: unknown) {
    if (isValidationError(error)) return
    throw error
  }

  submitting.value = true
  try {
    const payload: CreateDeptReq = {
      ...form,
      name: form.name.trim(),
      code: form.code.trim(),
      leader: form.leader.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      remark: form.remark?.trim() || undefined,
    }
    if (props.id) {
      await updateDeptApi({ id: props.id, ...payload })
    } else {
      await createDeptApi(payload)
    }

    message.success(`${entityName.value}${isEdit.value ? '编辑' : '新建'}成功`)
    open.value = false
    emit('success')
  } catch {
    // 业务错误已由请求层统一提示，保持弹窗打开便于重试
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <a-modal v-model:open="open" destroy-on-hidden :title="title" :width="680">
    <a-form
      ref="formRef"
      :disabled="detailLoading"
      :label-col="{ flex: '88px' }"
      :model="form"
      :rules="rules"
      :wrapper-col="{ flex: '1 1 0' }"
      layout="horizontal"
    >
      <div class="grid grid-cols-1 gap-x-16 sm:grid-cols-2">
        <a-form-item label="部门名称" name="name">
          <a-input
            v-model:value="form.name"
            allow-clear
            placeholder="请输入部门名称"
          />
        </a-form-item>
        <a-form-item label="部门编码" name="code">
          <a-input
            v-model:value="form.code"
            allow-clear
            placeholder="请输入部门编码"
          />
        </a-form-item>
        <a-form-item label="上级部门" name="parentId">
          <DeptPicker
            v-model:value="form.parentId"
            :loading="optionsLoading"
            :options="parentOptions"
            placeholder="请选择上级部门"
          />
        </a-form-item>
        <a-form-item label="负责人" name="leader">
          <a-input
            v-model:value="form.leader"
            allow-clear
            placeholder="请输入负责人"
          />
        </a-form-item>
        <a-form-item label="联系电话" name="phone">
          <a-input
            v-model:value="form.phone"
            allow-clear
            placeholder="请输入联系电话"
          />
        </a-form-item>
        <a-form-item class="sm:col-span-2" label="联系邮箱" name="email">
          <a-input
            v-model:value="form.email"
            allow-clear
            placeholder="请输入联系邮箱"
          />
        </a-form-item>
      </div>
      <a-form-item label="备注" name="remark">
        <a-textarea
          v-model:value="form.remark"
          allow-clear
          :auto-size="{ minRows: 2, maxRows: 4 }"
          :maxlength="200"
          placeholder="选填，用于内部说明"
          show-count
        />
      </a-form-item>
    </a-form>

    <template #footer>
      <div class="flex justify-end gap-8">
        <a-button :disabled="submitting" @click="open = false">取消</a-button>
        <a-button
          :disabled="detailLoading"
          :loading="submitting"
          type="primary"
          @click="handleSubmit"
        >
          {{ isEdit ? '保存' : '新建' }}
        </a-button>
      </div>
    </template>
  </a-modal>
</template>
