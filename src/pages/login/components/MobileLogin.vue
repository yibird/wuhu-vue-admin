<template>
  <a-form
    ref="formRef"
    layout="vertical"
    :disabled="loading"
    :model="formData"
    :required-mark="false"
    :rules="rules"
    :scroll-to-first-error="{ focus: true }"
    @finish="onSubmit"
  >
    <a-form-item
      class="group mb-18!"
      name="mobile"
      :label="$t('login.mobileLabel')"
    >
      <a-input
        ref="mobileInputRef"
        v-model:value="formData.mobile"
        autocomplete="tel"
        inputmode="numeric"
        size="large"
        allow-clear
        :maxlength="11"
        :placeholder="$t('login.inputMobile')"
        @clear="formData.mobile = ''"
      >
        <template #prefix>
          <Icon
            name="i-lucide:shield-user"
            :size="18"
            tabindex="-1"
            class="text-secondary transition-all group-focus-within:text-primary"
          />
        </template>
        <template #clearIcon>
          <ClearIcon />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item class="mb-12!" name="code" :label="$t('login.codeLabel')">
      <div class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-12">
        <a-input-otp
          v-model:value="formData.code"
          :length="6"
          size="large"
          @press-enter="submitForm"
        />
        <a-button
          size="large"
          html-type="button"
          class="shrink-0 transition-[border-color,box-shadow,transform] duration-motion-base hover:(-translate-y-1 border-primary! shadow-all-sm) active:translate-y-0 motion-reduce:(transform-none transition-none)"
        >
          {{ $t('login.sendCode') }}
        </a-button>
      </div>
    </a-form-item>
    <a-button
      type="primary"
      size="large"
      block
      html-type="submit"
      class="mt-20 h-44! font-medium transition-[transform,box-shadow,filter] duration-motion-base hover:(-translate-y-1 shadow-[0_10px_22px_rgb(var(--w-color-primary)_/_22%)] brightness-105) active:(translate-y-0 shadow-none brightness-100) motion-reduce:(transform-none transition-none)"
      :loading="loading"
      :disabled="loading"
      >{{ $t('login.submit') }}</a-button
    >
  </a-form>
</template>
<script setup lang="ts">
import { nextTick, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { validateCode, validateMobile } from '@/utils'
import type { FormInstance } from 'antdv-next'
import type { ComponentPublicInstance } from 'vue'
import ClearIcon from './ClearIcon.vue'
import type { LoginEmits, LoginFormProps } from './types'

const emits = defineEmits<LoginEmits>()
const props = withDefaults(defineProps<LoginFormProps>(), { loading: false })
const { t } = useI18n()
const formRef = useTemplateRef<FormInstance>('formRef')
const mobileInputRef = useTemplateRef<ComponentPublicInstance>('mobileInputRef')

const formData = reactive({
  mobile: '',
  code: '',
})
const rules = computed(() => ({
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
  code: [
    {
      required: true,
      message: t('login.inputCode'),
      validator: validateCode({ message: t('login.inputCode') }),
    },
  ],
}))

const submitForm = () => {
  if (!props.loading) formRef.value?.submit()
}

const onSubmit = () => {
  emits('submit', {
    loginType: 'mobile',
    mobile: formData.mobile.trim(),
    code: formData.code,
  })
}

const removeClearButtonFromTabOrder = () => {
  const clearButton = mobileInputRef.value?.$el?.querySelector(
    '.ant-input-clear-icon'
  ) as HTMLButtonElement | null | undefined
  clearButton?.setAttribute('tabindex', '-1')
}

onMounted(() => {
  void nextTick(removeClearButtonFromTabOrder)
})

watch(
  () => formData.mobile,
  () => void nextTick(removeClearButtonFromTabOrder)
)
</script>
