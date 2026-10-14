<template>
  <div class="text-30 leading-none">
    {{ content }}
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Emoji' })
interface Props {
  content: string
}

defineProps<Props>()
</script>
