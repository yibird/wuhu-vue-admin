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
      name="account"
      :label="$t('login.accountLabel')"
    >
      <a-input
        v-model:value="formData.account"
        allow-clear
        autofocus
        autocomplete="username"
        data-testid="login-account"
        :maxlength="64"
        size="large"
        :placeholder="$t('login.inputAccount')"
        class="transition-[border-color,box-shadow,background-color] duration-180 hover:border-primary/45 focus-within:shadow-[0_0_0_3px_rgb(var(--w-color-primary)_/_12%)] motion-reduce:transition-none"
        @press-enter="submitForm"
      >
        <template #prefix>
          <Icon
            name="i-lucide:shield-user"
            :size="18"
            class="text-secondary transition-[color,transform] duration-180 group-focus-within:(text-primary translate-x-1) motion-reduce:transition-none"
          />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item
      class="group mb-12!"
      name="password"
      :label="$t('login.passwordLabel')"
    >
      <a-input-password
        v-model:value="formData.password"
        autocomplete="current-password"
        data-testid="login-password"
        :maxlength="128"
        size="large"
        :placeholder="$t('login.inputPassword')"
        class="transition-[border-color,box-shadow,background-color] duration-180 hover:border-primary/45 focus-within:shadow-[0_0_0_3px_rgb(var(--w-color-primary)_/_12%)] motion-reduce:transition-none"
        @press-enter="submitForm"
      >
        <template #prefix>
          <Icon
            name="i-lucide:lock-keyhole"
            :size="18"
            class="text-secondary transition-[color,transform] duration-180 group-focus-within:(text-primary translate-x-1) motion-reduce:transition-none"
          />
        </template>
      </a-input-password>
    </a-form-item>
    <div class="min-h-32 flex items-center justify-between gap-12 text-sm">
      <a-checkbox v-model:checked="rememberAccount">
        {{ $t('login.rememberMe') }}
      </a-checkbox>
      <a
        class="cursor-pointer text-link transition-[color,text-decoration-color] hover:(text-primary underline underline-offset-4)"
      >
        {{ $t('login.forgetPassword') }}
      </a>
    </div>
    <div class="mt-20 flex flex-col gap-18">
      <a-button
        type="primary"
        size="large"
        block
        html-type="submit"
        class="h-44! font-medium transition-[transform,box-shadow,filter] duration-200 hover:(-translate-y-1 shadow-[0_10px_22px_rgb(var(--w-color-primary)_/_22%)] brightness-105) active:(translate-y-0 shadow-none brightness-100) motion-reduce:(transform-none transition-none)"
        data-testid="login-submit"
        :loading="loading"
        :disabled="loading"
        >{{ $t('login.submit') }}</a-button
      >
      <div class="pt-2">
        <a-divider class="my-12! text-xs! text-secondary! font-normal!">{{
          $t('login.loginMode')
        }}</a-divider>
        <div class="flex justify-center gap-12">
          <a-tooltip
            v-for="item in items"
            :key="item.value"
            :title="item.label"
            placement="bottom"
          >
            <a-button
              shape="circle"
              html-type="button"
              :aria-label="item.label"
              class="size-38! border-color-2! bg-container! outline-none! transition-[background-color,transform,box-shadow,border-color] duration-180 hover:(-translate-y-1 border-primary! bg-hover! shadow-all-sm) focus-visible:shadow-[0_0_0_2px_rgb(var(--w-color-primary)_/_24%)] active:translate-y-0 motion-reduce:(transform-none transition-none)"
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

      <div class="flex items-center justify-center gap-4 text-sm text-regular">
        <span>{{ $t('login.noAccount') }}</span>
        <a-button
          type="link"
          html-type="button"
          class="h-auto! px-4! transition-[color,transform] duration-180 hover:(translate-x-1 text-primary!) active:translate-x-0 motion-reduce:(transform-none transition-none)"
          @click="to('/register')"
        >
          {{ $t('login.toRegister') }}
        </a-button>
      </div>
    </div>
  </a-form>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useGo } from '@/router'
import wechatIcon from '@/assets/svg/wechat.svg'
import qqIcon from '@/assets/svg/qq.svg'
import githubIcon from '@/assets/svg/github.svg'
import googleIcon from '@/assets/svg/google.svg'
import type { FormInstance } from 'antdv-next'
import type { LoginEmits, LoginFormProps } from './types'

const emits = defineEmits<LoginEmits>()
const props = withDefaults(defineProps<LoginFormProps>(), { loading: false })
const { t } = useI18n()
const { to } = useGo()
const formRef = useTemplateRef<FormInstance>('formRef')
const rememberedAccountKey = 'wuhu:login:remembered-account'
const items = computed(() => [
  {
    label: t('login.wechat'),
    value: 'wechat',
    icon: wechatIcon,
  },
  {
    label: t('login.qq'),
    value: 'qq',
    icon: qqIcon,
  },
  {
    label: t('login.github'),
    value: 'github',
    icon: githubIcon,
  },
  {
    label: t('login.google'),
    value: 'google',
    icon: googleIcon,
  },
])

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
  } catch {
    // Ignore unavailable storage and keep the form usable.
  }
})
</script>
