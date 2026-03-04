<template>
  <div v-if="show" class="relative flex-1 max-xl:hidden">
    <div class="absolute inset-0 full">
      <div class="login-bg absolute inset-0 full blur-100"></div>
      <div
        class="absolute inset-0 full flex flex-col items-center justify-center"
      >
        <img class="w-400" :src="LoginBannerImage" />
        <div class="text-lg">{{ $t('login.banner.title') }}</div>
        <div class="mt-10 text-base text-regular">
          {{ $t('login.banner.description') }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import LoginBannerImage from '@/assets/svg/login-banner.svg'

const { placement } = defineProps<{ placement: string }>()

const show = computed(() => {
  return ['left', 'right'].includes(placement)
})
</script>
<style lang="less" scoped>
.login-bg {
  background: linear-gradient(
    154deg,
    #07070915 30%,
    hsl(var(--primary, 24.24 100% 50%) / 30%) 48%,
    #07070915 64%
  );
}
</style>
