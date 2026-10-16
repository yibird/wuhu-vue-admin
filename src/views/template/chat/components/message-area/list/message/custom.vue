<template>
  <div class="text-sm">
    {{ content }}
  </div>
</template>

<script setup lang="ts">
interface Props {
  content: string
}

defineProps<Props>()
</script>
