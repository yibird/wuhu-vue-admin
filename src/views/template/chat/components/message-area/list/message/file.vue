<template>
  <div class="flex items-center gap-8">
    <Icon name="i-lucide:file" :size="20" />
    <div>
      <div class="text-sm font-500">
        {{ fileName }}
      </div>
      <div v-if="fileSize" class="text-xs text-regular">
        {{ fileSize }}
      </div>
    </div>
    <button class="p-4 hover:bg-[#000]/10 rounded-4 ml-10" @click="$emit('download')">
      <Icon name="i-lucide:download" :size="14" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  content: string
  fileSize?: string
}

const props = withDefaults(defineProps<Props>(), {
  fileSize: '',
})

defineEmits<{
  download: []
}>()

const fileName = computed(() => {
  const parts = props.content.split('/')
  return parts[parts.length - 1] || '文件'
})
</script>
