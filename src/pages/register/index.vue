<template>
  <div
    :class="[
      'login relative isolate min-h-screen min-h-[100dvh] w-full flex overflow-hidden bg-page text-main transition-colors duration-motion-slow max-xl:items-stretch max-xl:justify-center motion-reduce:transition-none',
      { 'flex-row': placement === 'right' },
      { 'flex-row-reverse': placement === 'left' },
    ]"
  >
    <Logo />
    <ActionBar @change="changePlacement" />
    <Banner
      :placement="placement"
      title-key="register.banner.title"
      description-key="register.banner.description"
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
            {{ $t('register.title') }}
          </h1>
          <p class="mb-0 mt-8 text-sm leading-6 text-regular">
            {{ $t('register.description') }}
          </p>
        </div>
        <a-tabs
          size="large"
          :items="items"
          :classes="{ header: 'mb-24!', indicator: 'h-3!' }"
        >
          <template #contentRender="{ item }">
            <component
              :is="item.content"
              :loading="registering"
              @success="onSuccess"
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
  ActionBar,
  Banner,
  AccountRegister,
  MobileRegister,
  type Placement,
} from './components'
import { useI18n } from 'vue-i18n'
import { message } from 'antdv-next'
import { useGo } from '@/router'

const { t } = useI18n()
const { to } = useGo()

const placement = shallowRef<Placement>('right')
const registering = shallowRef(false)

const items = computed(() => [
  {
    key: 'account',
    label: t('register.accountLogin'),
    content: AccountRegister,
  },
  {
    key: 'mobile',
    label: t('register.mobileLogin'),
    content: MobileRegister,
  },
])

const changePlacement = (value: Placement) => {
  placement.value = value
}

const onSuccess = async () => {
  if (registering.value) return

  registering.value = true
  try {
    message.success(t('register.success'))
    await to('/login', true)
  } finally {
    registering.value = false
  }
}
</script>
