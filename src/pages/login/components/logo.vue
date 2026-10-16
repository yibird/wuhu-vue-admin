<template>
  <div
    class="page-enter page-enter--2 absolute left-16 top-16 z-10 min-w-0 flex items-center gap-10 sm:left-20 sm:top-20"
  >
    <img
      v-if="appLogo"
      :alt="appName"
      class="size-48 shrink-0 select-none"
      :height="48"
      :width="48"
      :src="appLogo"
    />
    <GradientText
      class="max-w-180 truncate text-xl font-600"
      direction="100deg"
      :colors="logoColors"
    >
      {{ appName }}
    </GradientText>
  </div>
</template>

<script setup lang="ts">
import { ThemeMode } from '@/constants'
import { useTheme } from '@/theme'
import { useAppStore } from '@/store'
import { GradientText } from '@/components'

const { app } = useAppStore()
const appName = computed(() => app.value.name)
const appLogo = computed(() => app.value.logo)

const { themeMode } = useTheme()

const logoColors = computed(() =>
  themeMode.value === ThemeMode.Dark
    ? ['#9b8cff 0%', '#4ca0ff 48%', '#2dd4bf 100%']
    : ['#6d5dfc 0%', '#1677ff 48%', '#00a88f 100%']
)
</script>
