<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { validateCode, validateMobile } from '@/utils'
import type { RegisterEmits, RegisterFormProps } from './types'

const emits = defineEmits<RegisterEmits>()
const props = withDefaults(defineProps<RegisterFormProps>(), { loading: false })
const { t } = useI18n()

const formData = reactive({
  mobile: '',
  code: '',
})
const rules = computed(() => ({
  mobile: [
    {
      required: true,
      message: t('register.inputMobile'),
      trigger: 'blur',
    },
    {
      validator: validateMobile(t('common.validate.mobileFormatMessage')),
      trigger: 'blur',
    },
  ],
  code: [
    {
      required: true,
      message: t('register.inputCode'),
      validator: validateCode({ message: t('register.inputCode') }),
    },
  ],
}))

const onSubmit = () => {
  emits('success')
}
</script>

<template>
  <a-form
    :disabled="loading"
    :model="formData"
    :rules="rules"
    :scroll-to-first-error="{ focus: true }"
    @finish="onSubmit"
  >
    <a-form-item name="mobile">
      <a-input
        v-model:value="formData.mobile"
        size="large"
        allow-clear
        :maxlength="11"
        :placeholder="$t('register.inputMobile')"
      >
        <template #prefix>
          <Icon name="i-lucide:shield-user" :size="18" class="text-secondary" />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item name="code">
      <div class="flex gap-20">
        <a-input-otp size="large" v-model:value="formData.code" />
        <a-button size="large" html-type="button">
          {{ $t('register.sendCode') }}
        </a-button>
      </div>
    </a-form-item>
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
  </a-form>
</template>
