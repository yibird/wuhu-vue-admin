<template>
  <div
    v-if="show"
    class="login-banner page-enter page-enter--1 relative min-w-0 flex-1 overflow-hidden max-xl:hidden"
  >
    <div
      class="absolute inset-0 box-border full flex flex-col items-center justify-center overflow-hidden px-48 py-64 text-center [background:radial-gradient(circle_at_18%_10%,rgb(var(--w-color-primary)_/_10%),transparent_34%),radial-gradient(circle_at_82%_86%,rgb(var(--w-color-primary)_/_7%),transparent_40%)]"
    >
      <img
        aria-hidden="true"
        alt=""
        class="h-auto w-full max-w-520 select-none object-contain [background:radial-gradient(ellipse_at_center,rgb(var(--w-color-primary)_/_22%),rgb(var(--w-color-primary)_/_12%)_36%,transparent_70%)] transition-[filter,transform] duration-500 ease-out hover:(-translate-y-2 scale-102) motion-reduce:(transform-none transition-none)"
        :src="LoginBannerImage"
      />
      <div class="mt-8 text-xl font-600 leading-8 text-main">
        {{ $t(titleKey) }}
      </div>
      <div class="mt-8 max-w-560 text-sm leading-6 text-regular">
        {{ $t(descriptionKey) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginBannerImage from '@/assets/svg/login-banner.svg'
import type { Placement } from './types'

const { placement } = defineProps<{
  placement: Placement
  titleKey: string
  descriptionKey: string
}>()

const show = computed(() => ['left', 'right'].includes(placement))
</script>
