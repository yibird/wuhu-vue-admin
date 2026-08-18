<script setup lang="ts">
import message from 'antdv-next/dist/message/index'
import { shallowRef, useTemplateRef } from 'vue'
import { Icon } from '@/components/icon'
import { Modal } from '@/components/modal'
import { Scrollbar } from '@/components/scrollbar'
import type { ModalInstance, ModalPosition } from '@/components/modal'

const basicOpen = shallowRef(false)
const enhancedOpen = shallowRef(false)
const controlledOpen = shallowRef(false)
const controlledFullscreen = shallowRef(false)
const lastEvent = shallowRef('等待交互')
const enhancedModal = useTemplateRef<ModalInstance>('enhancedModal')

function handleDragEnd(position: ModalPosition) {
  lastEvent.value = `拖拽结束：x ${Math.round(position.x)} / y ${Math.round(position.y)}`
}

function handleFullscreenChange(fullscreen: boolean) {
  lastEvent.value = fullscreen ? '已进入全屏' : '已退出全屏'
}

function resetEnhancedPosition() {
  enhancedModal.value?.resetPosition()
  lastEvent.value = '已重置弹窗位置'
  message.success('弹窗位置已重置')
}

function toggleControlledFullscreen() {
  controlledFullscreen.value = !controlledFullscreen.value
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
            <div class="mb-8 flex items-center gap-8">
              <span
                class="size-32 flex items-center justify-center rounded-6 bg-primary/10 text-primary"
              >
                <Icon name="i-lucide:panels-top-left" :size="17" />
              </span>
              <h1 class="m-0 text-xl text-main font-600">Modal</h1>
            </div>
            <p class="mb-0 mt-6 text-sm text-secondary leading-22">
              基于 Antdv Next Modal 增强，支持可选的头部拖拽与全屏切换。
            </p>
          </div>
          <a-tag color="blue">src/components/modal</a-tag>
        </header>

        <div class="grid gap-14 lg:grid-cols-2">
          <article
            class="rounded-8 border-1 border-color-1 border-solid bg-fill-1 p-16"
          >
            <div class="flex items-start justify-between gap-12">
              <div>
                <h2 class="m-0 text-lg text-main font-600">基础用法</h2>
                <p class="mb-0 mt-6 text-sm text-secondary leading-22">
                  保持 Antdv Next 的标题、内容与底部操作区域。
                </p>
              </div>
              <Icon name="i-lucide:mouse-pointer-click" class="text-primary" />
            </div>
            <a-button class="mt-18" type="primary" @click="basicOpen = true">
              <template #icon><Icon name="i-lucide:external-link" /></template>
              打开基础弹窗
            </a-button>

            <Modal
              v-model:open="basicOpen"
              title="基础弹窗"
              ok-text="完成"
              @ok="basicOpen = false"
            >
              <div class="py-12 text-sm text-regular leading-22">
                这是一个保留 Antdv Next 默认交互的 Modal 示例。
              </div>
            </Modal>
          </article>

          <article
            class="rounded-8 border-1 border-color-1 border-solid bg-fill-1 p-16"
          >
            <div class="flex items-start justify-between gap-12">
              <div>
                <h2 class="m-0 text-lg text-main font-600">增强交互</h2>
                <p class="mb-0 mt-6 text-sm text-secondary leading-22">
                  开启头部拖拽与全屏切换，拖拽位置会限制在可视区域内。
                </p>
              </div>
              <Icon name="i-lucide:move" class="text-primary" />
            </div>
            <div class="mt-18 flex flex-wrap gap-8">
              <a-button type="primary" @click="enhancedOpen = true">
                <template #icon><Icon name="i-lucide:move" /></template>
                打开增强弹窗
              </a-button>
              <a-button @click="resetEnhancedPosition">
                <template #icon><Icon name="i-lucide:locate-fixed" /></template>
                重置位置
              </a-button>
            </div>
            <a-alert class="mt-14" type="info" show-icon :message="lastEvent" />

            <Modal
              ref="enhancedModal"
              v-model:open="enhancedOpen"
              :draggable="true"
              :fullscreenable="true"
              title="增强交互弹窗"
              @drag-end="handleDragEnd"
              @fullscreen-change="handleFullscreenChange"
            >
              <div class="grid gap-14 py-12 text-sm text-regular leading-22">
                <p class="m-0">
                  拖动头部可以调整弹窗位置，点击右上角按钮可以切换全屏状态。
                </p>
                <div class="grid gap-10 sm:grid-cols-3">
                  <div class="rounded-6 bg-container p-12">
                    <Icon name="i-lucide:move" class="text-primary" />
                    <div class="mt-8 text-xs text-secondary">头部拖拽</div>
                  </div>
                  <div class="rounded-6 bg-container p-12">
                    <Icon name="i-lucide:maximize-2" class="text-primary" />
                    <div class="mt-8 text-xs text-secondary">全屏切换</div>
                  </div>
                  <div class="rounded-6 bg-container p-12">
                    <Icon name="i-lucide:shield-check" class="text-primary" />
                    <div class="mt-8 text-xs text-secondary">边界保护</div>
                  </div>
                </div>
              </div>
            </Modal>
          </article>

          <article
            class="rounded-8 border-1 border-color-1 border-solid bg-fill-1 p-16 lg:col-span-2"
          >
            <div class="flex flex-wrap items-start justify-between gap-12">
              <div>
                <h2 class="m-0 text-lg text-main font-600">受控全屏状态</h2>
                <p class="mb-0 mt-6 text-sm text-secondary leading-22">
                  可以通过 v-model:fullscreen 或实例方法控制全屏状态。
                </p>
              </div>
              <div class="flex flex-wrap gap-8">
                <a-button @click="toggleControlledFullscreen">
                  <template #icon>
                    <Icon
                      :name="
                        controlledFullscreen
                          ? 'i-lucide:minimize-2'
                          : 'i-lucide:maximize-2'
                      "
                    />
                  </template>
                  {{ controlledFullscreen ? '退出全屏' : '进入全屏' }}
                </a-button>
                <a-button type="primary" @click="controlledOpen = true">
                  <template #icon><Icon name="i-lucide:settings-2" /></template>
                  打开受控弹窗
                </a-button>
              </div>
            </div>

            <Modal
              v-model:open="controlledOpen"
              v-model:fullscreen="controlledFullscreen"
              :fullscreenable="true"
              title="受控状态弹窗"
              @fullscreen-change="handleFullscreenChange"
            >
              <div class="max-w-720 py-12 text-sm text-regular leading-22">
                当前全屏状态：{{ controlledFullscreen ? '已开启' : '已关闭' }}。
                关闭后再次打开，状态仍由外部 v-model 控制。
              </div>
            </Modal>
          </article>
        </div>
      </section>
    </Scrollbar>
  </WView>
</template>
