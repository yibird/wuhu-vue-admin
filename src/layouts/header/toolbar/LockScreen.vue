<template>
  <button
    type="button"
    class="w-layout-toolbar-item max-sm:hidden"
    data-motion="tilt"
    @click="lock"
  >
    <Icon name="i-lucide:lock" :size="20" />
  </button>
</template>
<script lang="ts" setup>
import { useLockScreen } from '@/layouts/config/composables'

const { lock } = useLockScreen()
</script>
