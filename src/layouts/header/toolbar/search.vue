<template>
  <button
    type="button"
    class="w-layout-search-trigger group mr-6 h-34 hidden items-center rounded-full border-0 bg-fill-6 px-12 cursor-pointer outline-none transition-[background-color,box-shadow,transform] duration-180 ease-out md:flex hover:(bg-hover shadow-all-sm) focus-visible:shadow-[0_0_0_2px_rgb(var(--w-color-primary)_/_24%)] active:(scale-98 translate-y-0 shadow-none) motion-reduce:(transform-none transition-none)"
    @click="onClick"
  >
    <Icon
      name="i-lucide:search"
      :size="18"
      class="transition-transform duration-180 ease-out group-hover:scale-110 group-active:scale-96 motion-reduce:transform-none"
    />
    <div
      class="h-full w-120 flex items-center truncate px-10 text-sm text-secondary transition-colors group-hover:text-main"
    >
      请输入搜索内容
    </div>
    <kbd
      class="truncate rounded-2 bg-fill-8 p-4 text-xs text-muted transition-colors select-none group-hover:text-main"
    >
      Ctrl K
    </kbd>
  </button>
</template>

<script lang="ts" setup>
import { useGlobalSearch } from '@/layouts/config/composables'
const { openSearch } = useGlobalSearch()

const onClick = () => {
  openSearch()
}
</script>
