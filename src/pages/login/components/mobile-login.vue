<template>
  <n-form ref="formRef" label-placement="left" :model="formData" :rules="rules">
    <n-form-item path="mobile">
      <n-input
        v-model:value="formData.mobile"
        size="large"
        clearable
        :maxlength="11"
        :placeholder="$t('login.inputMobile')"
      >
        <template #prefix>
          <Icon name="i-lucide:shield-user" :size="18" color="#666" />
        </template>
      </n-input>
    </n-form-item>
    <n-form-item path="code">
      <div class="flex gap-20">
        <n-input-otp block size="large" v-model:value="formData.code" />
        <n-button size="large" attr-type="button">
          {{ $t('login.sendCode') }}
        </n-button>
      </div>
    </n-form-item>
    <n-button
      type="primary"
      size="large"
      block
      class="mt-20"
      @click="onSubmit"
      >{{ $t('login.submit') }}</n-button
    >
  </n-form>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { validateCode, validateMobile } from '@/utils'
import type { FormInst } from 'naive-ui'
import type { LoginEmits } from './types'

const { t } = useI18n()
const emits = defineEmits<LoginEmits>()
const formRef = ref<FormInst | null>(null)
const formData = ref({
  mobile: '',
  code: [],
})
const rules = {
  mobile: [
    {
      required: true,
      message: t('login.inputMobile'),
      trigger: 'blur',
    },
    {
      validator: validateMobile(t('common.validate.mobileFormatMessage')),
      trigger: 'blur',
    },
  ],
  code: {
    required: true,
    message: t('login.inputCode'),
    validator: validateCode({ message: t('login.inputCode') }),
  },
}

const onSubmit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      emits('success')
      return
    }
  })
}
</script>
