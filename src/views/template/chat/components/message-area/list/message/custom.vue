<template>
  <div class="text-sm">
    {{ content }}
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Custom' })
interface Props {
  content: string
}

defineProps<Props>()
</script>
