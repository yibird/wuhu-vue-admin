<template>
  <button
    type="button"
    class="group mr-6 h-34 items-center rounded-full border-0 bg-active px-12 cursor-pointer outline-none transition-[background-color,box-shadow,transform] duration-200 ease-[var(--w-motion-ease-enter)] md:flex hover:(bg-hover shadow-sm) focus-visible:(ring-2 ring-primary/24) active:(scale-98 translate-y-0 shadow-none) motion-reduce:(transform-none transition-none) max-md:hidden"
    @click="onClick"
    @pointerenter="preload"
    @focus="preload"
    role="search"
  >
    <Icon
      name="i-lucide:search"
      :size="18"
      class="transition-transform duration-200 ease-[var(--w-motion-ease-enter)] group-hover:scale-110 group-active:scale-96 motion-reduce:transform-none"
    />
    <div
      class="h-full w-120 flex items-center truncate px-10 text-sm text-secondary transition-colors group-hover:text-main"
    >
      请输入搜索内容
    </div>
    <kbd
      class="truncate rounded-2 bg-active p-4 text-xs text-muted transition-colors select-none group-hover:text-main"
    >
      Ctrl K
    </kbd>
  </button>
</template>

<script lang="ts" setup>
import { preloadSearchModal } from '@/layouts/config'
import { useGlobalSearch } from '@/layouts/config/hooks'

const { openSearch } = useGlobalSearch()

const preload = () => {
  void preloadSearchModal()
}

const onClick = () => {
  openSearch()
}
</script>
