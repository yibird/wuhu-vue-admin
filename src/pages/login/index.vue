<template>
  <div
    :class="[
      'relative min-h-screen min-h-[100dvh] w-full flex overflow-hidden bg-page text-main transition-colors duration-300 max-xl:(items-stretch justify-center)',
      { 'flex-row': placement === 'right' },
      { 'flex-row-reverse': placement === 'left' },
    ]"
  >
    <Logo />
    <ActionBar @change="changePlacement" />
    <Banner
      :placement="placement"
      title-key="login.banner.title"
      description-key="login.banner.description"
    />
    <div
      :class="[
        'page-container flex-center min-h-screen min-h-[100vh] w-full shrink-0 overflow-y-auto bg-container px-24 sm:px-48 xl:(w-520 xl:px-60 py-48)',
        placement === 'right' && 'xl:b-l-1-[border-secondary]',
        placement === 'left' && 'xl:b-r-1-[border-secondary]',
        {
          'xl:(m-auto xl:min-h-0 xl:max-h-[calc(100vh-64px)] xl:rounded-8 border border-secondary)':
            placement === 'center',
        },
      ]"
    >
      <div class="page-enter page-enter--2 w-full h-600 max-w-400">
        <div class="mb-24">
          <h1 class="text-2xl font-800 leading-10 text-main">
            {{ $t('login.title') }}
          </h1>
          <p class="mt-8 text-base leading-6 text-placeholder">
            {{ $t('login.description') }}
          </p>
        </div>
        <a-tabs
          v-model:active-key="loginType"
          size="large"
          animated
          :items="items"
        >
          <template #contentRender="{ item }">
            <component
              :is="item.content"
              :loading="loginLoading"
              @submit="onSubmit"
            />
          </template>
        </a-tabs>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Logo from './components/logo.vue'
import Banner from './components/banner.vue'
import ActionBar from './components/action-bar/index.vue'
import AccountLogin from './components/account-login.vue'
import { useI18n } from 'vue-i18n'
import { message, notification } from 'antdv-next'
import { useRoute } from 'vue-router'
import { useAuth } from '@/hooks'
import { getSafeRedirect, useGo } from '@/router'
import { isApiError } from '@/errors'

import type { Placement } from './components/types'
import type { LoginRequest } from '@/apis'

const { t } = useI18n()
const { to } = useGo()
const route = useRoute()
const { accountLogin, mobileLogin, loading: loginLoading } = useAuth()

const placement = ref<Placement>('right')
const loginType = ref('account')

const items = computed(() => [
  {
    key: 'account',
    label: t('login.accountLogin'),
    content: AccountLogin,
  },
  {
    key: 'mobile',
    label: t('login.mobileLogin'),
    content: defineAsyncComponent(
      () => import('./components/mobile-login.vue')
    ),
  },
  {
    key: 'qrcode',
    label: t('login.qrcodeLogin'),
    content: defineAsyncComponent(
      () => import('./components/qrcode-login.vue')
    ),
  },
])
const changePlacement = (value: Placement) => {
  placement.value = value
}
const onSubmit = async (credentials: LoginRequest) => {
  if (loginLoading.value) return
  try {
    const success =
      credentials.loginType === 'account'
        ? await accountLogin(credentials)
        : await mobileLogin(credentials)
    if (!success) return
    notification.info({
      title: t('login.success'),
      placement: 'topRight',
    })
    setTimeout(async () => {
      await to(getSafeRedirect(route.query.redirect), true)
    }, 200)
  } catch (error) {
    if (isApiError(error)) return
    message.error(error instanceof Error ? error.message : t('login.error'))
  }
}
</script>
<style scoped>
.page-container {
  background-image:
    radial-gradient(
      circle at 18% 10%,
      rgb(var(--w-color-primary) / 10%),
      transparent 34%
    ),
    radial-gradient(
      circle at 82% 86%,
      rgb(var(--w-color-primary) / 7%),
      transparent 40%
    );
}
</style>
