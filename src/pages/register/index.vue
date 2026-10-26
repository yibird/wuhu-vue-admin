<template>
  <div
    :class="[
      'login relative isolate min-h-screen min-h-[100dvh] w-full flex overflow-hidden bg-page text-main transition-colors duration-300 max-xl:(items-stretch justify-center)',
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
        'page-container flex-center min-h-screen min-h-[100vh] w-full shrink-0 bg-container px-24 sm:px-48 xl:(w-520 xl:px-60 py-48)',
        placement === 'right' && 'xl:b-l-1-[border-secondary]',
        placement === 'left' && 'xl:b-r-1-[border-secondary]',
        {
          'xl:(m-auto xl:min-h-0 xl:max-h-[calc(100vh-64px)] xl:rounded-8 border border-secondary)':
            placement === 'center',
        },
      ]"
    >
      <div class="page-enter page-enter--2 w-full max-w-400">
        <div class="mb-24">
          <h1
            class="m-0 text-2xl font-semibold leading-10 text-main transition-colors duration-200"
          >
            {{ $t('register.title') }}
          </h1>
          <p class="mt-8 text-base leading-6 text-placeholder">
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
import { useI18n } from 'vue-i18n'
import { message } from 'antdv-next'
import { AccountRegister, MobileRegister, type Placement } from './components'
import { Logo, ActionBar, Banner } from '../login/components'
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
