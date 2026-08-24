<template>
  <div class="w-cropper-wrapper">
    <img
      ref="imgRef"
      :src="src"
      :alt="alt"
      crossorigin="anonymous"
      @load="initCropper"
    />
  </div>
</template>

<script setup lang="ts">
import Cropper from 'cropperjs'
import type { CropperEmits, CropperInstance, CropperProps } from './types'

const props = withDefaults(defineProps<CropperProps>(), {
  alt: 'image',
  options: () => ({}),
})

const emit = defineEmits<CropperEmits>()

const imgRef = useTemplateRef<HTMLImageElement>('imgRef')
const cropper = shallowRef<Cropper | null>(null)

const initCropper = () => {
  if (cropper.value) {
    cropper.value.destroy()
  }
  if (imgRef.value) {
    cropper.value = new Cropper(imgRef.value, props.options)
    emit('ready', cropper.value)
  }
}

onUnmounted(() => {
  if (cropper.value) {
    cropper.value.destroy()
    cropper.value = null
  }
})

watch(
  () => props.src,
  async () => {
    if (cropper.value) {
      cropper.value.destroy()
      cropper.value = null
    }
    await nextTick()
  }
)

const rotate = (angle: number) => {
  return cropper.value?.getCropperImage()?.$rotate(angle)
}

const scale = (x: number, y?: number) => {
  return cropper.value?.getCropperImage()?.$scale(x, y)
}

const zoom = (factor: number) => {
  return cropper.value?.getCropperImage()?.$zoom(factor)
}

const getCroppedCanvas = async (options?: {
  width?: number
  height?: number
}) => {
  const selection = cropper.value?.getCropperSelection()
  if (!selection) return null
  return await selection.$toCanvas(options)
}

const reset = () => {
  cropper.value?.getCropperImage()?.$resetTransform()
  cropper.value?.getCropperImage()?.$center()
}

const getInstance = () => cropper.value

defineExpose<CropperInstance>({
  rotate,
  scale,
  zoom,
  reset,
  getCroppedCanvas,
  getInstance,
})
</script>

<style scoped lang="less">
.w-cropper-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  img {
    display: block;
    max-width: 100%;
    max-height: 100%;
  }
}

:deep(cropper-canvas) {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
