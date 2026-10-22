<template>
  <div
    :class="[
      'relative isolate min-h-screen min-h-[100dvh] w-full flex overflow-hidden bg-page text-main transition-colors duration-motion-slow max-xl:items-stretch max-xl:justify-center motion-reduce:transition-none',
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
        'relative z-1 box-border min-h-screen min-h-[100dvh] w-full shrink-0 overflow-y-auto border-color-1 bg-container px-24 pb-40 pt-104 flex items-center justify-center sm:px-48 xl:w-520 xl:px-60 xl:py-48',
        placement === 'right' && 'xl:border-l-1 xl:border-l-solid',
        placement === 'left' && 'xl:border-r-1 xl:border-r-solid',
        {
          'xl:m-auto xl:min-h-0 xl:max-h-[calc(100vh-64px)] xl:rounded-8 xl:border-1 xl:border-solid xl:shadow-all-lg':
            placement === 'center',
        },
      ]"
    >
      <div class="page-enter page-enter--2 w-full h-600 max-w-400">
        <div class="mb-24">
          <h1 class="m-0 text-2xl font-800 leading-10 text-main">
            {{ $t('login.title') }}
          </h1>
          <p class="text-regular font-600">
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
import { isApiError } from '@/utils'

import type { Placement } from './components/types'
import type { LoginRequest } from '@/apis'

const { t } = useI18n()
const { to } = useGo()
const route = useRoute()
const { login, loginLoading } = useAuth()

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
    await login(credentials)
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
