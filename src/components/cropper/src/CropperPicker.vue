<template>
  <a-modal
    :open="open"
    @update:open="$emit('update:open', $event)"
    :title="title"
    :width="width"
    @ok="handleOk"
    :confirmLoading="saving"
    destroyOnHidden
  >
    <div class="flex flex-col gap-16 py-10">
      <div class="flex justify-between items-center">
        <a-button type="primary" @click="triggerSelectFile">
          <template #icon><Icon name="i-lucide:upload" :size="16" /></template>
          选择图片
        </a-button>
        <input
          type="file"
          ref="fileInputRef"
          accept="image/*"
          class="hidden"
          @change="handleFileChange"
        />
        <div v-if="cropperSrc" class="flex gap-10">
          <a-tooltip title="放大">
            <a-button aria-label="放大" @click="handleZoom(0.1)">
              <template #icon
                ><Icon name="i-lucide:zoom-in" :size="16"
              /></template>
            </a-button>
          </a-tooltip>
          <a-tooltip title="缩小">
            <a-button aria-label="缩小" @click="handleZoom(-0.1)">
              <template #icon
                ><Icon name="i-lucide:zoom-out" :size="16"
              /></template>
            </a-button>
          </a-tooltip>
          <a-tooltip title="向左旋转">
            <a-button aria-label="向左旋转" @click="handleRotate(-90)">
              <template #icon
                ><Icon name="i-lucide:rotate-ccw" :size="16"
              /></template>
            </a-button>
          </a-tooltip>
          <a-tooltip title="向右旋转">
            <a-button aria-label="向右旋转" @click="handleRotate(90)">
              <template #icon
                ><Icon name="i-lucide:rotate-cw" :size="16"
              /></template>
            </a-button>
          </a-tooltip>
          <a-tooltip title="水平翻转">
            <a-button aria-label="水平翻转" @click="handleFlipX">
              <template #icon
                ><Icon name="i-lucide:flip-horizontal" :size="16"
              /></template>
            </a-button>
          </a-tooltip>
          <a-tooltip title="垂直翻转">
            <a-button aria-label="垂直翻转" @click="handleFlipY">
              <template #icon
                ><Icon name="i-lucide:flip-vertical" :size="16"
              /></template>
            </a-button>
          </a-tooltip>
          <a-tooltip title="重置">
            <a-button aria-label="重置" @click="handleReset">
              <template #icon
                ><Icon name="i-lucide:refresh-cw" :size="16"
              /></template>
            </a-button>
          </a-tooltip>
        </div>
      </div>

      <div
        class="w-drag-upload-area h-400 overflow-hidden rounded-4 border bg-fill-quaternary transition-colors"
        :class="isDragging ? 'w-drag-upload-area--dragging bg-primary/5' : ''"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
      >
        <Cropper
          v-if="cropperSrc"
          ref="cropperRef"
          :src="cropperSrc"
          :options="mergedOptions"
        />
        <div
          v-else
          class="h-full flex cursor-pointer flex-col items-center justify-center text-secondary transition-colors hover:text-primary focus-visible:(outline-2 outline-primary outline-solid outline-offset--2)"
          role="button"
          tabindex="0"
          aria-label="选择需要裁剪的图片"
          @click="triggerSelectFile"
          @keydown.enter.prevent="triggerSelectFile"
          @keydown.space.prevent="triggerSelectFile"
        >
          <Icon
            name="i-lucide:image-plus"
            :size="48"
            class="mb-10 opacity-50"
          />
          <span>请先选择一张图片，或将图片拖拽至此</span>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import {
  computed,
  onBeforeUnmount,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue'
import { message } from 'antdv-next'
import Cropper from './Cropper.vue'
import type { CropperOptions } from 'cropperjs'
import type {
  CropperExpose,
  CropperPickerEmits,
  CropperPickerProps,
} from './types'

const props = withDefaults(defineProps<CropperPickerProps>(), {
  title: '裁剪图片',
  width: '600px',
  src: '',
  canvasOptions: () => ({ width: 256, height: 256 }),
  maxFileSize: 10 * 1024 * 1024,
})

const emit = defineEmits<CropperPickerEmits>()

const fileInputRef = useTemplateRef<HTMLInputElement>('fileInputRef')
const cropperRef = useTemplateRef<CropperExpose>('cropperRef')
const cropperSrc = shallowRef(props.src)
const scaleX = shallowRef(1)
const scaleY = shallowRef(1)
const saving = shallowRef(false)
const isDragging = shallowRef(false)
let objectUrl: string | undefined

function releaseObjectUrl() {
  if (!objectUrl) return
  URL.revokeObjectURL(objectUrl)
  objectUrl = undefined
}

function resetTransformState() {
  scaleX.value = 1
  scaleY.value = 1
}

function setSelectedFile(file: File) {
  if (!file.type.startsWith('image/')) {
    message.warning('请选择图片文件')
    return
  }
  if (file.size > props.maxFileSize) {
    message.warning(`图片不能超过 ${formatFileSize(props.maxFileSize)}`)
    return
  }

  releaseObjectUrl()
  objectUrl = URL.createObjectURL(file)
  cropperSrc.value = objectUrl
  resetTransformState()
}

function formatFileSize(bytes: number) {
  return `${Math.max(1, Math.round(bytes / 1024 / 1024))} MB`
}

watch(
  () => props.src,
  (newVal) => {
    releaseObjectUrl()
    cropperSrc.value = newVal
  }
)

watch(
  () => props.open,
  (newVal) => {
    if (newVal) {
      releaseObjectUrl()
      cropperSrc.value = props.src
      resetTransformState()
      return
    }

    releaseObjectUrl()
    cropperSrc.value = props.src
  }
)

onBeforeUnmount(releaseObjectUrl)

const defaultOptions: CropperOptions = {
  template: `
    <cropper-canvas background>
      <cropper-image rotatable scalable translatable></cropper-image>
      <cropper-shade hidden></cropper-shade>
      <cropper-handle action="select" plain></cropper-handle>
      <cropper-selection aspect-ratio="1" initial-coverage="0.8" movable resizable>
        <cropper-grid role="grid" bordered covered></cropper-grid>
        <cropper-crosshair centered></cropper-crosshair>
        <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)"></cropper-handle>
        <cropper-handle action="n-resize"></cropper-handle>
        <cropper-handle action="e-resize"></cropper-handle>
        <cropper-handle action="s-resize"></cropper-handle>
        <cropper-handle action="w-resize"></cropper-handle>
        <cropper-handle action="ne-resize"></cropper-handle>
        <cropper-handle action="nw-resize"></cropper-handle>
        <cropper-handle action="se-resize"></cropper-handle>
        <cropper-handle action="sw-resize"></cropper-handle>
      </cropper-selection>
    </cropper-canvas>
  `,
}

const mergedOptions = computed(() => ({
  ...defaultOptions,
  ...props.options,
}))

const triggerSelectFile = () => {
  fileInputRef.value?.click()
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) setSelectedFile(file)
  // Reset input so the same file can be selected again
  if (target) {
    target.value = ''
  }
}

const handleDragOver = () => {
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) setSelectedFile(file)
}

const handleRotate = (angle: number) => {
  cropperRef.value?.rotate(angle * (Math.PI / 180)) // cropperjs v2 uses radians for rotation
}

const handleZoom = (factor: number) => {
  cropperRef.value?.zoom(factor)
}

const handleFlipX = () => {
  scaleX.value = scaleX.value === 1 ? -1 : 1
  cropperRef.value?.scale(scaleX.value, scaleY.value)
}

const handleFlipY = () => {
  scaleY.value = scaleY.value === 1 ? -1 : 1
  cropperRef.value?.scale(scaleX.value, scaleY.value)
}

const handleReset = () => {
  scaleX.value = 1
  scaleY.value = 1
  cropperRef.value?.reset()
}

const handleOk = async () => {
  if (!cropperRef.value || !cropperSrc.value) {
    message.warning('请先选择图片并裁剪')
    return
  }

  saving.value = true
  try {
    const canvas = await cropperRef.value.getCroppedCanvas(props.canvasOptions)

    if (canvas) {
      const dataUrl = canvas.toDataURL('image/jpeg')
      emit('crop', dataUrl)
      emit('update:open', false)
    }
  } catch (error) {
    message.error('裁剪失败')
    console.error(error)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.w-drag-upload-area {
  border-image: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 5px,
      #ddd 5px,
      #ddd 10px
    )
    1;
}

.w-drag-upload-area.w-drag-upload-area--dragging {
  border-image: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 5px,
      rgb(var(--w-color-primary)) 5px,
      rgb(var(--w-color-primary)) 10px
    )
    1;
}
</style>
