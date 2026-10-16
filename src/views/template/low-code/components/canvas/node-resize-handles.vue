<template>
  <div
    v-for="handle in handles"
    :key="handle"
    class="lc-resize-handle"
    :class="`is-${handle}`"
    :data-canvas-ui="true"
    :data-resize-handle="handle"
  />
</template>

<script setup lang="ts">
const handles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as const
</script>

<style scoped lang="less">
.lc-resize-handle {
  position: absolute;
  z-index: 19;
  width: 8px;
  height: 8px;
  background: rgb(var(--w-bg-elevated));
  border: 1px solid rgb(var(--w-color-primary));
  border-radius: 2px;

  &.is-nw {
    top: -4px;
    left: -4px;
    cursor: nwse-resize;
  }

  &.is-n {
    top: -4px;
    left: 50%;
    cursor: ns-resize;
    transform: translateX(-50%);
  }

  &.is-ne {
    top: -4px;
    right: -4px;
    cursor: nesw-resize;
  }

  &.is-e {
    top: 50%;
    right: -4px;
    cursor: ew-resize;
    transform: translateY(-50%);
  }

  &.is-se {
    right: -4px;
    bottom: -4px;
    cursor: nwse-resize;
  }

  &.is-s {
    bottom: -4px;
    left: 50%;
    cursor: ns-resize;
    transform: translateX(-50%);
  }

  &.is-sw {
    bottom: -4px;
    left: -4px;
    cursor: nesw-resize;
  }

  &.is-w {
    top: 50%;
    left: -4px;
    cursor: ew-resize;
    transform: translateY(-50%);
  }
}
</style>
