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
    <button
      type="button"
      class="button ml-10 size-26 rounded-4 hover:bg-hover"
      @click="$emit('download')"
    >
      <Icon name="i-lucide:download" :size="14" />
    </button>
  </div>
</template>

<script setup lang="ts">
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
