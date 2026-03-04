<template>
  <div class="popover">
    <slot name="trigger" />
    <slot />
  </div>
</template>
<script lang="ts" setup>
  const show = ref(false)
  const popover = ref<HTMLDivElement>()
  const position = reactive({ left: '0px', top: '0px' })
</script>

<style lang="css" scoped>
  .popover {
    position: absolute;
    background-color: #fff;
    border-radius: 2px;
    z-index: 2000;
    box-shadow:
      0 3px 6px -4px rgba(0, 0, 0, 0.12),
      0 6px 16px 0 rgba(0, 0, 0, 0.08),
      0 9px 28px 8px rgba(0, 0, 0, 0.05);
  }
</style>
