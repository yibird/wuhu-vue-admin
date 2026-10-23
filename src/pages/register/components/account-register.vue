<template>
  <a-form
    ref="formRef"
    layout="vertical"
    :model="formData"
    :rules="rules"
    :disabled="loading"
    :required-mark="false"
    :scroll-to-first-error="{ focus: true }"
    @finish="onSubmit"
  >
    <a-form-item name="account" :label="t('register.account')">
      <a-input
        v-model:value="formData.account"
        size="large"
        :placeholder="$t('register.inputAccount')"
        :allow-clear="{ tabIndex: -1 }"
        autofocus
      >
        <template #prefix>
          <Icon name="i-lucide:shield-user" :size="18" class="text-secondary" />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item name="password" :label="t('register.password')">
      <a-input-password
        v-model:value="formData.password"
        :allow-clear="{ tabIndex: -1 }"
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
    <a-form-item name="confirmPassword" :label="t('register.confirmPassword')">
      <a-input-password
        v-model:value="formData.confirmPassword"
        autocomplete="new-password"
        size="large"
        :allow-clear="{ tabIndex: -1 }"
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
    <div class="flex flex-col gap-12">
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
      <a-button type="link" @click="to('/login')">{{
        $t('register.toLogin')
      }}</a-button>
    </div>
  </a-form>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useGo } from '@/router'

import type { FormInstance, RuleObject } from 'antdv-next'
import type { RegisterEmits, RegisterFormProps } from './types'

const emits = defineEmits<RegisterEmits>()
const props = withDefaults(defineProps<RegisterFormProps>(), { loading: false })
const { t } = useI18n()
const { to } = useGo()
const formRef = useTemplateRef<FormInstance>('formRef')

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
      formRef.value?.validateFields(['confirmPassword'])
    }
  }
)
</script>
