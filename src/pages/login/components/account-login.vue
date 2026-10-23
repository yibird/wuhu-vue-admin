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
    <a-form-item class="group" name="account" :label="$t('login.accountLabel')">
      <a-input
        v-model:value="formData.account"
        :allow-clear="{ tabIndex: -1 }"
        autofocus
        autocomplete="username"
        data-testid="login-account"
        :maxlength="64"
        size="large"
        :placeholder="$t('login.inputAccount')"
      >
        <template #prefix>
          <Icon
            name="i-lucide:shield-user"
            :size="18"
            tabindex="-1"
            class="text-secondary transition-colors group-focus-within:text-primary"
          />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item
      class="group"
      name="password"
      :label="$t('login.passwordLabel')"
    >
      <a-input-password
        v-model:value="formData.password"
        :allow-clear="{ tabIndex: -1 }"
        autocomplete="current-password"
        data-testid="login-password"
        :maxlength="128"
        size="large"
        :placeholder="$t('login.inputPassword')"
        @press-enter="submitForm"
      >
        <template #prefix>
          <Icon
            name="i-lucide:lock-keyhole"
            :size="18"
            class="text-secondary transition-[color,transform] duration-motion-base group-focus-within:text-primary"
          />
        </template>
      </a-input-password>
    </a-form-item>
    <div
      class="min-h-32 flex items-center justify-between gap-12 text-sm mb-10"
    >
      <a-checkbox v-model:checked="rememberAccount">
        {{ $t('login.rememberMe') }}
      </a-checkbox>
      <a
        class="cursor-pointer text-link transition-[color,text-decoration-color] hover:(text-primary underline underline-offset-4)"
      >
        {{ $t('login.forgetPassword') }}
      </a>
    </div>
    <a-button
      type="primary"
      size="large"
      block
      html-type="submit"
      class="h-44! font-medium transition-[transform,box-shadow,filter] duration-motion-base hover:(-translate-y-1 brightness-105) active:(translate-y-0 shadow-none brightness-100)"
      data-testid="login-submit"
      :loading="loading"
      :disabled="loading"
      >{{ $t('login.submit') }}</a-button
    >
    <LoginMode />
  </a-form>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LoginMode from './login-mode.vue'
import type { FormInstance } from 'antdv-next'
import type { LoginEmits, LoginFormProps } from './types'

const emits = defineEmits<LoginEmits>()
const props = withDefaults(defineProps<LoginFormProps>(), { loading: false })
const { t } = useI18n()

const formRef = useTemplateRef<FormInstance>('formRef')
const rememberedAccountKey = 'wuhu:login:remembered-account'

const formData = reactive({
  account: '',
  password: '',
})
const rememberAccount = shallowRef(false)
const rules = computed(() => ({
  account: [
    {
      required: true,
      message: t('login.inputAccount'),
      trigger: ['blur'],
    },
  ],
  password: [
    {
      required: true,
      message: t('login.inputPassword'),
      trigger: ['blur'],
    },
  ],
}))

const submitForm = () => {
  if (!props.loading) formRef.value?.submit()
}

const onSubmit = () => {
  try {
    if (rememberAccount.value) {
      localStorage.setItem(rememberedAccountKey, formData.account.trim())
    } else {
      localStorage.removeItem(rememberedAccountKey)
    }
  } catch {
    // Storage may be unavailable in privacy mode; login should still proceed.
  }

  emits('submit', {
    loginType: 'account',
    account: formData.account.trim(),
    password: formData.password,
  })
}

onMounted(() => {
  try {
    const account = localStorage.getItem(rememberedAccountKey)
    if (!account) return
    formData.account = account
    rememberAccount.value = true
  } catch {}
})
</script>
