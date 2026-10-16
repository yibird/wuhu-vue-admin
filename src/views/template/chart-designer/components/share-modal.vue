<script setup lang="ts">
defineProps<{
  url: string
}>()

const open = defineModel<boolean>('open', { required: true })

defineEmits<{
  copy: []
}>()
</script>

<template>
  <a-modal v-model:open="open" :footer="null" title="分享大屏" width="620px">
    <div class="grid gap-12">
      <p class="m-0 text-13px text-secondary">
        当前版本会编码到分享链接中，适合临时协作和评审；生产环境可替换为后端发布地址。
      </p>
      <div class="grid grid-cols-[minmax(0,1fr)_auto] gap-8">
        <input
          class="h-34 min-w-0 rounded-7 border-1 border-color-2 border-solid bg-fill px-10 text-12px text-primary outline-none"
          readonly
          :value="url"
        />
        <a-button type="primary" @click="$emit('copy')">
          <template #icon>
            <Icon name="i-lucide:copy" :size="15" />
          </template>
          复制
        </a-button>
      </div>
    </div>
  </a-modal>
</template>
