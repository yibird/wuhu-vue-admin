<template>
  <a-form
    layout="vertical"
    :disabled="loading"
    :required-mark="false"
    :model="formData"
    :rules="rules"
    :scroll-to-first-error="{ focus: true }"
    @finish="onSubmit"
  >
    <a-form-item name="mobile" :label="t('register.mobile')">
      <a-input
        v-model:value="formData.mobile"
        v-input-tab-out
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
import { validateCode, validateMobile } from '@/utils'
import type { RegisterEmits, RegisterFormProps } from './types'

const emits = defineEmits<RegisterEmits>()
const props = withDefaults(defineProps<RegisterFormProps>(), { loading: false })

const { t } = useI18n()
const { to } = useGo()

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
