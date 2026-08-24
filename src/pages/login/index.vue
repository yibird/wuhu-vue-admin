<template>
  <div
    :class="[
      'relative isolate min-h-screen min-h-[100dvh] w-full flex overflow-hidden bg-page text-main transition-colors duration-motion-slow max-xl:items-stretch max-xl:justify-center motion-reduce:transition-none',
      { 'flex-row': placement === 'right' },
      { 'flex-row-reverse': placement === 'left' },
    ]"
    :aria-busy="loginLoading"
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
        'relative z-1 box-border min-h-screen min-h-[100dvh] w-full shrink-0 overflow-y-auto border-color-2 bg-container px-24 pb-40 pt-104 flex items-center justify-center sm:px-48 xl:w-520 xl:px-60 xl:py-48',
        placement === 'right' && 'xl:border-l-1 xl:border-l-solid',
        placement === 'left' && 'xl:border-r-1 xl:border-r-solid',
        {
          'xl:m-auto xl:min-h-0 xl:max-h-[calc(100vh-64px)] xl:rounded-8 xl:border-1 xl:border-solid xl:shadow-all-lg':
            placement === 'center',
        },
      ]"
    >
      <div class="page-enter page-enter--2 w-full max-w-400">
        <div class="mb-24">
          <h1
            class="m-0 text-2xl font-semibold leading-10 text-main transition-colors duration-motion-base motion-reduce:transition-none"
          >
            {{ $t('login.title') }}
          </h1>
          <p class="mb-0 mt-8 text-sm leading-6 text-regular">
            {{ $t('login.description') }}
          </p>
        </div>
        <a-tabs
          v-model:active-key="activeLoginType"
          size="large"
          :animated="{ inkBar: true, tabPane: true }"
          :items="items"
          :classes="{
            header: 'mb-24!',
            indicator: 'h-3!',
            tab: 'px-2! pb-12! text-sm!',
          }"
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
import {
  Logo,
  Banner,
  ActionBar,
  AccountLogin,
  MobileLogin,
  QrcodeLogin,
  type Placement,
} from './components'
import { useI18n } from 'vue-i18n'
import { message } from 'antdv-next'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables'
import { getSafeRedirect, useGo } from '@/router'

import type { LoginRequest } from '@/apis'

const { t } = useI18n()
const { to } = useGo()
const route = useRoute()
const { login, loginLoading } = useAuth()

const placement = ref<Placement>('right')
const activeLoginType = ref('account')

const loginComponents = {
  account: markRaw(AccountLogin),
  mobile: markRaw(MobileLogin),
  qrcode: markRaw(QrcodeLogin),
}
const items = computed(() => [
  {
    key: 'account',
    label: t('login.accountLogin'),
    content: loginComponents.account,
  },
  {
    key: 'mobile',
    label: t('login.mobileLogin'),
    content: loginComponents.mobile,
  },
  {
    key: 'qrcode',
    label: t('login.qrcodeLogin'),
    content: loginComponents.qrcode,
  },
])
const changePlacement = (value: Placement) => {
  placement.value = value
}
const onSubmit = async (credentials: LoginRequest) => {
  if (loginLoading.value) return

  try {
    await login(credentials)
    message.success(t('login.success'))
    await to(getSafeRedirect(route.query.redirect), true)
  } catch (error) {
    message.error(error instanceof Error ? error.message : t('login.error'))
  }
}
</script>
