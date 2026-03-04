<template>
  <div
    :class="[
      'relative full flex max-xl:justify-center max-xl:items-center',
      { 'flex-row': placement === 'right' },
      { 'flex-row-reverse': placement === 'left' },
    ]"
    style="
      background: linear-gradient(
        154deg,
        #07070915 30%,
        hsl(var(--primary, 24.24 100% 50%) / 30%) 48%,
        #07070915 64%
      );
    "
  >
    <Logo />
    <Toolbar @placement="(value) => (placement = value)" />
    <Banner :placement="placement" />
    <div
      :class="[
        'w-500 px-50 py-30 flex items-center justify-center bg-white box-border z-1 max-xl:(w-500 rounded-4)',
        {
          'm-auto py-30 min-w-500 w-500 rounded-4 overflow-hidden shadow-md':
            placement === 'center',
        },
      ]"
    >
      <div class="w-full">
        <div class="mb-20">
          <h2 class="text-lg leading-12">{{ $t('login.title') }}</h2>
        </div>
        <n-tabs type="segment" size="large" default-value="account" animated>
          <n-tab-pane
            v-for="item in items"
            :key="item.name"
            :name="item.name"
            :tab="$t(item.title)"
          >
            <component :is="item.component" @success="onSuccess" />
          </n-tab-pane>
        </n-tabs>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useMessage, useNotification } from 'naive-ui'
import {
  Logo,
  Toolbar,
  Banner,
  AccountLogin,
  MobileLogin,
  QrcodeLogin,
} from './components'
import { useI18n } from 'vue-i18n'
import { useGo } from '@/router'

const placement = ref('right')

const items = [
  {
    name: 'account',
    title: 'login.accountLogin',
    component: AccountLogin,
  },
  {
    name: 'mobile',
    title: 'login.mobileLogin',
    component: MobileLogin,
  },
  {
    name: 'qrcode',
    title: 'login.scanLogin',
    component: QrcodeLogin,
  },
]
const { t } = useI18n()
const message = useMessage()
const notification = useNotification()
const { to } = useGo()
const onSuccess = () => {
  message.success(t('login.success'))
  to('/')
  setTimeout(() => {
    notification.success({
      title: t('login.success'),
      duration: 5000,
    })
  }, 500)
}
</script>
