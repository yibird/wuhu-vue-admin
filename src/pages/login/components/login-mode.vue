<template>
  <div class="mt-20">
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
          <button
            :aria-label="item.label"
            class="button size-38 bg-container b-1-secondary rounded-4 transition-all duration-motion-base hover:(-translate-y-1 border-primary bg-hover shadow-all-sm)"
          >
            <img
              :src="item.icon"
              :alt="item.label"
              class="size-20"
              :class="{ 'dark:invert': item.value === 'github' }"
            />
          </button>
        </a-tooltip>
      </div>
    </div>

    <div
      class="mt-15 flex items-center justify-center gap-4 text-sm text-regular"
    >
      <span>{{ $t('login.noAccount') }}</span>
      <a-button
        type="link"
        html-type="button"
        class="h-auto! px-4! transition-[color,transform] duration-motion-base hover:(translate-x-1 text-primary!) active:translate-x-0 motion-reduce:(transform-none transition-none)"
        @click="to('/register')"
      >
        {{ $t('login.toRegister') }}
      </a-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useGo } from '@/router'
import wechatIcon from '@/assets/svg/wechat.svg'
import qqIcon from '@/assets/svg/qq.svg'
import githubIcon from '@/assets/svg/github.svg'
import googleIcon from '@/assets/svg/google.svg'

const { t } = useI18n()
const { to } = useGo()

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
</script>
