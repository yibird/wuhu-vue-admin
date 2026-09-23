<template>
  <div
    class="group h-54 flex items-center overflow-hidden border-b-1 border-color-2 border-b-solid bg-container px-14 outline-none transition-[border-color,background-color] duration-motion-base"
  >
    <span
      class="size-30 flex shrink-0 items-center justify-center rounded-6 bg-fill-4 text-muted transition-colors duration-motion-base"
    >
      <Icon name="i-lucide:search" :size="17" />
    </span>
    <input
      ref="inputRef"
      v-model="value"
      aria-label="搜索菜单"
      autocomplete="off"
      data-testid="search-modal-input"
      placeholder="请输入搜索内容"
      spellcheck="false"
      class="h-full min-w-0 flex-1 border-0 bg-transparent px-10 py-0 text-sm text-main outline-none placeholder:text-placeholder"
    />
    <button
      v-if="showClear"
      type="button"
      aria-label="清除搜索内容"
      class="size-28 flex shrink-0 cursor-pointer items-center justify-center rounded-5 border-0 bg-transparent p-0 text-muted transition-colors hover:(bg-hover text-main)"
      @mousedown.prevent
      @click="onClear"
    >
      <Icon name="i-lucide:x" :size="16" />
    </button>
  </div>
</template>

<script setup lang="ts">
const value = defineModel<string>({ default: '' })
const inputRef = ref<HTMLInputElement | null>(null)
const showClear = computed(() => value.value?.trim().length > 0)

const onClear = () => {
  value.value = ''
  inputRef.value?.focus()
}

defineExpose({
  focus: () => inputRef.value?.focus(),
})
</script>
