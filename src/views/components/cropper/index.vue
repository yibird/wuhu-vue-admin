<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
import message from 'antdv-next/dist/message/index'
import { Cropper, CropperPicker } from '@/components/cropper'
import { Icon } from '@/components/icon'
import { Scrollbar } from '@/components/scrollbar'
import loginBanner from '@/assets/svg/login-banner.svg'
import type { CropperExpose } from '@/components/cropper'

const cropperOpen = shallowRef(false)
const croppedImage = shallowRef('')
const cropperReady = shallowRef(false)
const cropperRef = useTemplateRef<CropperExpose>('cropperRef')

function handleCrop(dataUrl: string) {
  croppedImage.value = dataUrl
  message.success('裁剪结果已生成')
}

function rotatePreview() {
  cropperRef.value?.rotate(Math.PI / 2)
}

function resetPreview() {
  cropperRef.value?.reset()
}
</script>

<template>
  <WView :full="true" :padding="false" class="bg-page">
    <Scrollbar class="h-full" content-class="min-h-full p-16 md:p-20">
      <section
        class="mx-auto max-w-1280 rounded-8 border-1 border-color-1 border-solid bg-container p-16 shadow-all-sm md:p-20"
      >
        <header
          class="mb-16 flex flex-wrap items-start justify-between gap-12 border-b-1 border-color-1 border-b-solid pb-14"
        >
          <div class="min-w-0">
            <h1 class="m-0 text-xl text-main font-600">Cropper</h1>
            <p class="mb-0 mt-6 text-sm leading-22 text-secondary">
              图片选择、拖放、变换与裁剪结果输出。
            </p>
          </div>
          <a-tag color="blue">src/components/cropper</a-tag>
        </header>

        <div class="grid gap-14">
          <div class="flex flex-wrap items-center gap-8">
            <a-button type="primary" @click="cropperOpen = true">
              <template #icon><Icon name="i-lucide:image-plus" /></template>
              选择并裁剪图片
            </a-button>
            <a-button :disabled="!cropperReady" @click="rotatePreview">
              <template #icon><Icon name="i-lucide:rotate-cw" /></template>
              旋转预览
            </a-button>
            <a-button :disabled="!cropperReady" @click="resetPreview">
              <template #icon><Icon name="i-lucide:refresh-cw" /></template>
              重置
            </a-button>
          </div>
          <div
            class="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_180px]"
          >
            <div
              class="h-380 overflow-hidden rounded-6 border-1 border-color-2 border-solid bg-fill-1"
            >
              <Cropper
                ref="cropperRef"
                :src="loginBanner"
                alt="裁剪组件示例图片"
                @ready="cropperReady = true"
              />
            </div>
            <div
              class="h-180 overflow-hidden rounded-6 border-1 border-color-2 border-solid bg-fill-1"
            >
              <img
                v-if="croppedImage"
                :src="croppedImage"
                alt="裁剪结果"
                class="size-full object-cover"
              />
              <div
                v-else
                class="size-full flex flex-col items-center justify-center gap-8 text-muted"
              >
                <Icon name="i-lucide:image" :size="28" />
                <span class="text-xs">裁剪结果</span>
              </div>
            </div>
          </div>
          <CropperPicker
            v-model:open="cropperOpen"
            title="裁剪示例图片"
            @crop="handleCrop"
          />
        </div>
      </section>
    </Scrollbar>
  </WView>
</template>
