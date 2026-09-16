<script setup lang="ts">
import { message, type FormInstance } from 'antdv-next'
import {
  createRoleApi,
  getRoleRecordApi,
  updateRoleApi,
  type CreateRoleReq,
} from '@/apis'

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
const form = reactive<CreateRoleReq>(createDefaultForm())
const isEdit = computed(() => Boolean(props.id))
const title = computed(() => (isEdit.value ? '编辑角色' : '新建角色'))

const dataScopeOptions = [
  { label: '全部数据权限', value: 0 },
  { label: '本部门及以下数据权限', value: 1 },
  { label: '本部门数据权限', value: 2 },
  { label: '仅本人数据权限', value: 3 },
]

const rules = {
  roleName: [
    { required: true, whitespace: true, message: '请输入角色名称' },
    { max: 30, message: '角色名称不能超过 30 个字符' },
  ],
  dataScope: [{ required: true, message: '请选择数据权限' }],
}

watch([open, () => props.id], async ([value]) => {
  if (!value) return
  Object.assign(form, createDefaultForm())
  if (props.id) await loadRole(props.id)
  await nextTick()
  formRef.value?.clearValidate()
})

function createDefaultForm(): CreateRoleReq {
  return {
    roleName: '',
    dataScope: 1,
    remark: '',
  }
}

async function loadRole(id: string) {
  detailLoading.value = true
  try {
    const response = await getRoleRecordApi({ id })
    if (!response.data) {
      open.value = false
      return
    }

    Object.assign(form, {
      roleName: response.data.roleName,
      dataScope: response.data.dataScope,
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
    const payload: CreateRoleReq = {
      ...form,
      roleName: form.roleName.trim(),
      remark: form.remark?.trim() || undefined,
    }
    if (props.id) {
      await updateRoleApi({ id: props.id, ...payload })
    } else {
      await createRoleApi(payload)
    }

    message.success(`角色${isEdit.value ? '编辑' : '新建'}成功`)
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
  <a-modal v-model:open="open" destroy-on-hidden :title="title" :width="520">
    <a-form
      ref="formRef"
      :disabled="detailLoading"
      :label-col="{ flex: '88px' }"
      :model="form"
      :rules="rules"
      :wrapper-col="{ flex: '1 1 0' }"
      layout="horizontal"
      class="py-10"
    >
      <a-form-item label="角色名称" name="roleName">
        <a-input
          v-model:value="form.roleName"
          allow-clear
          :maxlength="30"
          placeholder="请输入角色名称"
          show-count
        />
      </a-form-item>

      <a-form-item label="数据权限" name="dataScope">
        <a-select
          v-model:value="form.dataScope"
          class="w-full"
          :options="dataScopeOptions"
          placeholder="请选择数据权限"
        />
      </a-form-item>

      <a-form-item label="备注" name="remark">
        <a-textarea
          v-model:value="form.remark"
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
