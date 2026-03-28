<template>
  <div class="text-sm leading-relaxed">
    {{ content }}
  </div>
</template>

<script setup lang="ts">
interface Props {
  content: string
}

defineProps<Props>()
</script>
