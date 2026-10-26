<template>
  <a-modal
    :open="open"
    :footer="null"
    :width="440"
    centered
    title="分享消息"
    @update:open="emits('update:open', $event)"
  >
    <div class="flex flex-col gap-16">
      <div
        v-if="chatTitle || content"
        class="rounded-8 b-1-muted bg-secondary px-12 py-10"
      >
        <div v-if="chatTitle" class="truncate text-xs text-secondary">
          {{ chatTitle }}
        </div>
        <div v-if="content" class="mt-4 line-clamp-3 text-sm text-main">
          {{ content }}
        </div>
      </div>

      <div>
        <div class="mb-8 text-sm text-main font-600">分享链接</div>
        <div class="flex items-center gap-8">
          <a-input :value="url" readonly class="min-w-0 flex-1">
            <template #prefix>
              <Icon name="i-lucide:link" :size="15" class="text-secondary" />
            </template>
          </a-input>
          <a-button type="primary" class="shrink-0" @click="emits('copy')">
            <template #icon>
              <Icon name="i-lucide:copy" :size="15" />
            </template>
            复制链接
          </a-button>
        </div>
      </div>

      <div>
        <div class="mb-8 text-sm text-main font-600">分享到</div>
        <div class="grid grid-cols-3 gap-8">
          <button
            v-for="platform in platforms"
            :key="platform.key"
            type="button"
            class="flex flex-col items-center gap-6 rounded-10 b-1-muted bg-container px-8 py-10 transition-[background-color,border-color,transform] duration-200 hover:(-translate-y-1 border-primary bg-hover) active:translate-y-0 motion-reduce:(transform-none transition-none)"
            :title="platform.label"
            :aria-label="`分享到${platform.label}`"
            @click="emits('share', platform)"
          >
            <img
              v-if="platform.iconImage"
              :src="platform.iconImage"
              :alt="platform.label"
              class="size-28"
            />
            <Icon
              v-else
              :name="platform.icon"
              :size="28"
              :style="{ color: platform.color }"
            />
            <span class="text-xs text-regular">{{ platform.label }}</span>
          </button>
        </div>
        <div class="mt-8 text-xs text-secondary">
          微信需复制链接后在微信内粘贴发送
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import type { ShareModalEmits, ShareModalProps } from '../types'

withDefaults(defineProps<ShareModalProps>(), {
  open: false,
  chatTitle: '',
  content: '',
  platforms: () => [],
})

const emits = defineEmits<ShareModalEmits>()
</script>
