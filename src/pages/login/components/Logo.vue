<template>
  <div
    class="page-enter page-enter--2 absolute left-16 top-16 z-10 min-w-0 flex items-center gap-10 sm:left-20 sm:top-20"
  >
    <img
      :alt="appName"
      class="size-48 shrink-0 select-none"
      :height="48"
      :width="48"
      :src="logo"
    />
    <span
      class="max-w-180 truncate bg-clip-text text-xl text-transparent font-600 [background-image:linear-gradient(100deg,#6d5dfc_0%,#1677ff_48%,#00a88f_100%)] dark:[background-image:linear-gradient(100deg,#9b8cff_0%,#4ca0ff_48%,#2dd4bf_100%)]"
    >
      {{ appName }}
    </span>
  </div>
</template>

<script setup lang="ts">
import logo from '@/assets/svg/logo.svg'

const appName = import.meta.env.VITE_APP_NAME
</script>
