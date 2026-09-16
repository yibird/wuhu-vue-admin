<script setup lang="ts">
import { message, type FormInstance } from 'antdv-next'
import {
  createUserApi,
  getDeptPageListApi,
  getRolePageListApi,
  getUserRecordApi,
  updateUserApi,
  type CreateUserReq,
  type DeptResp,
  type RoleResp,
} from '@/apis'
import {
  DeptPicker,
  RolePicker,
  type DeptPickerOption,
  type RolePickerOption,
} from '@/features'

interface Props {
  id?: string
}

interface PostOption {
  label: string
  value: string
  deptId: string
  code: string
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
const deptOptions = shallowRef<DeptPickerOption[]>([])
const postOptions = shallowRef<PostOption[]>([])
const roleOptions = shallowRef<RolePickerOption[]>([])
const form = reactive<CreateUserReq>(createDefaultForm())
const isEdit = computed(() => Boolean(props.id))
const title = computed(() => (isEdit.value ? '编辑用户' : '新建用户'))
const availablePostOptions = computed(() =>
  postOptions.value.filter((item) => item.deptId === form.deptId)
)

const sexOptions = [
  { label: '男', value: 0 },
  { label: '女', value: 1 },
  { label: '未知', value: 2 },
]
const educationOptions = [
  { label: '高中', value: 0 },
  { label: '大专', value: 1 },
  { label: '本科', value: 2 },
  { label: '硕士', value: 3 },
  { label: '博士', value: 4 },
]
const workExperienceOptions = [
  { label: '无', value: 0 },
  { label: '1 年', value: 1 },
  { label: '2 年', value: 2 },
  { label: '3 年', value: 3 },
  { label: '4 年', value: 4 },
  { label: '5 年以上', value: 5 },
]
const maritalStatusOptions = [
  { label: '未婚', value: 0 },
  { label: '已婚', value: 1 },
  { label: '离异', value: 2 },
  { label: '丧偶', value: 3 },
]
const sourceOptions = [
  { label: '注册', value: 0 },
  { label: '导入', value: 1 },
  { label: '第三方登录', value: 2 },
]

const rules = {
  username: [
    { required: true, whitespace: true, message: '请输入登录账号' },
    { min: 3, max: 30, message: '登录账号长度为 3-30 个字符' },
  ],
  nickname: [{ required: true, whitespace: true, message: '请输入用户昵称' }],
  realname: [{ required: true, whitespace: true, message: '请输入真实姓名' }],
  deptId: [{ required: true, message: '请选择所属部门' }],
  postId: [{ required: true, message: '请选择岗位' }],
  roleId: [{ required: true, message: '请选择角色' }],
  phone: [{ required: true, message: '请输入手机号' }],
  email: [{ type: 'email', message: '请输入正确的邮箱地址' }],
  wechat: [{ max: 50, message: '微信号不能超过 50 个字符' }],
}

watch([open, () => props.id], async ([value]) => {
  if (!value) return
  Object.assign(form, createDefaultForm())
  await Promise.all([
    loadPickerOptions(),
    props.id ? loadUser(props.id) : Promise.resolve(),
  ])
  await nextTick()
  formRef.value?.clearValidate()
})

function createDefaultForm(): CreateUserReq {
  return {
    username: '',
    nickname: '',
    realname: '',
    sex: 2,
    age: 18,
    phone: '',
    wechat: '',
    email: '',
    address: '',
    education: 2,
    work_experience: 0,
    marital_status: 0,
    source: 0,
    deptId: '',
    postId: '',
    roleId: '',
    birthday: undefined,
    small_avatar: undefined,
    big_avatar: undefined,
    remark: '',
  }
}

function toDeptOptions(items: DeptResp[]): DeptPickerOption[] {
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

async function loadPickerOptions() {
  optionsLoading.value = true
  try {
    const [roleResponse, deptResponse, postResponse] = await Promise.all([
      getRolePageListApi({ pageNum: 1, pageSize: 1000 }),
      getDeptPageListApi({ pageNum: 1, pageSize: 1000, type: 1 }),
      getDeptPageListApi({ pageNum: 1, pageSize: 1000, type: 2 }),
    ])
    roleOptions.value = (roleResponse.data?.list ?? []).map(
      (item: RoleResp) => ({
        label: item.roleName,
        value: item.id,
        description: item.remark,
      })
    )
    deptOptions.value = toDeptOptions(deptResponse.data?.list ?? [])
    postOptions.value = (postResponse.data?.list ?? []).map((item) => ({
      label: item.name,
      value: item.id,
      deptId: item.parentId,
      code: item.code,
    }))
  } catch {
    // 业务错误已由请求层统一提示，这里仅停止填充选项
  } finally {
    optionsLoading.value = false
  }
}

async function loadUser(id: string) {
  detailLoading.value = true
  try {
    const response = await getUserRecordApi({ id })
    if (!response.data) {
      open.value = false
      return
    }

    Object.assign(form, {
      username: response.data.username,
      nickname: response.data.nickname,
      realname: response.data.realname,
      sex: response.data.sex,
      age: response.data.age,
      phone: response.data.phone,
      wechat: response.data.wechat,
      email: response.data.email,
      address: response.data.address,
      education: response.data.education,
      work_experience: response.data.work_experience,
      marital_status: response.data.marital_status,
      source: response.data.source,
      deptId: response.data.deptId ?? '',
      postId: response.data.postId ?? '',
      roleId: response.data.roleId ?? '',
      birthday: response.data.birthday,
      small_avatar: response.data.small_avatar,
      big_avatar: response.data.big_avatar,
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

function onDeptChange(value?: string) {
  form.deptId = value ?? ''
  form.postId = ''
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
    const payload: CreateUserReq = {
      ...form,
      username: form.username.trim(),
      nickname: form.nickname.trim(),
      realname: form.realname.trim(),
      phone: form.phone.trim(),
      wechat: form.wechat.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      remark: form.remark?.trim() || undefined,
    }
    if (props.id) {
      await updateUserApi({ id: props.id, ...payload })
    } else {
      await createUserApi(payload)
    }

    message.success(`用户${isEdit.value ? '编辑' : '新建'}成功`)
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
  <a-modal v-model:open="open" destroy-on-hidden :title="title" :width="760">
    <div class="max-h-[70vh] overflow-y-auto px-10">
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
          <a-form-item label="登录账号" name="username">
            <a-input
              v-model:value="form.username"
              allow-clear
              placeholder="请输入登录账号"
            />
          </a-form-item>
          <a-form-item label="用户昵称" name="nickname">
            <a-input
              v-model:value="form.nickname"
              allow-clear
              placeholder="请输入用户昵称"
            />
          </a-form-item>
          <a-form-item label="真实姓名" name="realname">
            <a-input
              v-model:value="form.realname"
              allow-clear
              placeholder="请输入真实姓名"
            />
          </a-form-item>
          <a-form-item label="微信号" name="wechat">
            <a-input
              v-model:value="form.wechat"
              allow-clear
              placeholder="请输入微信号"
            />
          </a-form-item>
          <a-form-item label="所属部门" name="deptId">
            <DeptPicker
              :value="form.deptId"
              :loading="optionsLoading"
              :options="deptOptions"
              @update:value="onDeptChange"
            />
          </a-form-item>
          <a-form-item label="岗位" name="postId">
            <a-select
              v-model:value="form.postId"
              allow-clear
              class="w-full"
              :disabled="!form.deptId"
              :loading="optionsLoading"
              option-filter-prop="label"
              :options="availablePostOptions"
              :placeholder="form.deptId ? '请选择岗位' : '请先选择部门'"
              show-search
            >
              <template #optionRender="{ option }">
                <div class="flex items-center gap-8">
                  <span
                    class="size-26 shrink-0 flex-center rounded-4 bg-primary-tint text-primary"
                  >
                    <Icon name="i-lucide:briefcase-business" :size="14" />
                  </span>
                  <span class="min-w-0 flex-1 truncate text-main">
                    {{ option.data.label }}
                  </span>
                  <span class="shrink-0 text-xs text-tertiary">
                    {{ option.data.code }}
                  </span>
                </div>
              </template>
            </a-select>
          </a-form-item>
          <a-form-item label="角色" name="roleId">
            <RolePicker
              v-model:value="form.roleId"
              :loading="optionsLoading"
              :options="roleOptions"
            />
          </a-form-item>
          <a-form-item label="性别" name="sex">
            <a-select
              v-model:value="form.sex"
              class="w-full"
              :options="sexOptions"
            />
          </a-form-item>
          <a-form-item label="年龄" name="age">
            <a-input-number
              v-model:value="form.age"
              class="w-full"
              :max="120"
              :min="1"
            />
          </a-form-item>
          <a-form-item label="手机号" name="phone">
            <a-input
              v-model:value="form.phone"
              allow-clear
              placeholder="请输入手机号"
            />
          </a-form-item>
          <a-form-item label="邮箱" name="email">
            <a-input
              v-model:value="form.email"
              allow-clear
              placeholder="请输入邮箱"
            />
          </a-form-item>
          <a-form-item label="生日" name="birthday">
            <a-date-picker
              v-model:value="form.birthday"
              allow-clear
              class="w-full"
              placeholder="请选择生日"
              value-format="YYYY-MM-DD"
            />
          </a-form-item>
          <a-form-item label="学历" name="education">
            <a-select
              v-model:value="form.education"
              class="w-full"
              :options="educationOptions"
            />
          </a-form-item>
          <a-form-item label="工作经验" name="work_experience">
            <a-select
              v-model:value="form.work_experience"
              class="w-full"
              :options="workExperienceOptions"
            />
          </a-form-item>
          <a-form-item label="婚姻状态" name="marital_status">
            <a-select
              v-model:value="form.marital_status"
              class="w-full"
              :options="maritalStatusOptions"
            />
          </a-form-item>
          <a-form-item label="用户来源" name="source">
            <a-select
              v-model:value="form.source"
              class="w-full"
              :options="sourceOptions"
            />
          </a-form-item>
          <a-form-item class="sm:col-span-2" label="地址" name="address">
            <a-input
              v-model:value="form.address"
              allow-clear
              placeholder="请输入地址"
            />
          </a-form-item>
        </div>
        <a-form-item class="!mb-0" label="备注" name="remark">
          <a-textarea
            v-model:value="form.remark"
            :auto-size="{ minRows: 2, maxRows: 4 }"
            :maxlength="200"
            placeholder="选填，用于内部说明"
            show-count
          />
        </a-form-item>
      </a-form>
    </div>

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
