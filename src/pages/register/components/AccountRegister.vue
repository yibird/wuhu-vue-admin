<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useGo } from '@/router'
import wechatIcon from '@/assets/svg/wechat.svg'
import qqIcon from '@/assets/svg/qq.svg'
import githubIcon from '@/assets/svg/github.svg'
import googleIcon from '@/assets/svg/google.svg'
import type { FormInstance, RuleObject } from 'antdv-next'
import type { RegisterEmits, RegisterFormProps } from './types'

const emits = defineEmits<RegisterEmits>()
const props = withDefaults(defineProps<RegisterFormProps>(), { loading: false })
const { t } = useI18n()
const { to } = useGo()
const formRef = useTemplateRef<FormInstance>('formRef')

const items = computed(() => [
  {
    label: t('register.wechat'),
    value: 'wechat',
    icon: wechatIcon,
  },
  {
    label: t('register.qq'),
    value: 'qq',
    icon: qqIcon,
  },
  {
    label: t('register.github'),
    value: 'github',
    icon: githubIcon,
  },
  {
    label: t('register.google'),
    value: 'google',
    icon: googleIcon,
  },
])

const formData = reactive({
  account: '',
  password: '',
  confirmPassword: '',
})

const validateConfirmPassword = async (_rule: RuleObject, value: string) => {
  if (!value || value === formData.password) return Promise.resolve()
  return Promise.reject(new Error(t('register.passwordMismatch')))
}

const rules = computed(() => ({
  account: [
    {
      required: true,
      message: t('register.inputAccount'),
      trigger: ['blur'],
    },
  ],
  password: [
    {
      required: true,
      message: t('register.inputPassword'),
      trigger: ['blur'],
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: t('register.inputConfirmPassword'),
      trigger: ['blur'],
    },
    {
      validator: validateConfirmPassword,
      trigger: ['change', 'blur'],
    },
  ],
}))

const submitForm = () => {
  if (!props.loading) formRef.value?.submit()
}

const onSubmit = () => {
  emits('success')
}

watch(
  () => formData.password,
  () => {
    if (formData.confirmPassword) {
      void formRef.value?.validateFields(['confirmPassword'])
    }
  }
)
</script>

<template>
  <a-form
    ref="formRef"
    :disabled="loading"
    :model="formData"
    :rules="rules"
    :scroll-to-first-error="{ focus: true }"
    @finish="onSubmit"
  >
    <a-form-item name="account">
      <a-input
        v-model:value="formData.account"
        size="large"
        :placeholder="$t('register.inputAccount')"
      >
        <template #prefix>
          <Icon name="i-lucide:shield-user" :size="18" class="text-secondary" />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item name="password">
      <a-input-password
        v-model:value="formData.password"
        autocomplete="new-password"
        size="large"
        :placeholder="$t('register.inputPassword')"
      >
        <template #prefix>
          <Icon
            name="i-lucide:lock-keyhole"
            :size="18"
            class="text-secondary"
          />
        </template>
      </a-input-password>
    </a-form-item>
    <a-form-item name="confirmPassword">
      <a-input-password
        v-model:value="formData.confirmPassword"
        autocomplete="new-password"
        size="large"
        :placeholder="$t('register.inputConfirmPassword')"
        @press-enter.prevent="submitForm"
      >
        <template #prefix>
          <Icon
            name="i-lucide:shield-check"
            :size="18"
            class="text-secondary"
          />
        </template>
      </a-input-password>
    </a-form-item>
    <div class="flex flex-col gap-15">
      <a-button
        type="primary"
        size="large"
        block
        html-type="submit"
        class="mt-20"
        :loading="loading"
        :disabled="loading"
        >{{ $t('register.submit') }}</a-button
      >
      <div>
        <a-divider class="text-sm! text-secondary! font-normal!">{{
          $t('register.mode')
        }}</a-divider>
        <div class="flex justify-center gap-10">
          <a-tooltip
            v-for="item in items"
            :key="item.value"
            :title="item.label"
          >
            <a-button
              shape="circle"
              html-type="button"
              :aria-label="item.label"
              class="size-38! border-color-2! bg-container! outline-none! transition-[background-color,transform,box-shadow,border-color] duration-motion-base hover:(-translate-y-1 border-primary! bg-hover! shadow-all-sm) focus-visible:shadow-[0_0_0_2px_rgb(var(--w-color-primary)_/_24%)] active:translate-y-0 motion-reduce:(transform-none transition-none)"
            >
              <img
                :src="item.icon"
                :alt="item.label"
                class="size-20"
                :class="{ 'dark:invert': item.value === 'github' }"
              />
            </a-button>
          </a-tooltip>
        </div>
      </div>
      <div class="text-center">
        <a-button type="link" html-type="button" @click="to('/login')">{{
          $t('register.toLogin')
        }}</a-button>
      </div>
    </div>
  </a-form>
</template>
