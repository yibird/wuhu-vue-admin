<template>
  <canvas ref="canvasRef" class="lc-ruler" />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, shallowRef, watch } from 'vue'
import type { CanvasViewApi } from '../../composables'

const props = defineProps<{
  orientation: 'horizontal' | 'vertical'
  view: CanvasViewApi
  /** 视口尺寸（px） */
  length: number
  thickness?: number
}>()

const canvasRef = shallowRef<HTMLCanvasElement>()
let frame = 0

const BASE_STEPS = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000]

function pickStep(zoom: number) {
  const minSpacing = 56
  for (const step of BASE_STEPS) {
    if (step * zoom >= minSpacing) return step
  }
  return BASE_STEPS[BASE_STEPS.length - 1]
}

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const dpr = window.devicePixelRatio || 1
  const thickness = props.thickness ?? 20
  const width = props.orientation === 'horizontal' ? props.length : thickness
  const height = props.orientation === 'horizontal' ? thickness : props.length
  if (width <= 0 || height <= 0) return
  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, width, height)

  const zoom = props.view.zoom.value
  const offset =
    props.orientation === 'horizontal'
      ? props.view.panX.value
      : props.view.panY.value
  const step = pickStep(zoom)
  const majorEvery = 5

  ctx.fillStyle = 'rgba(148, 163, 184, 0.18)'
  ctx.fillRect(0, 0, width, height)
  ctx.font = '11px Inter, "PingFang SC", sans-serif'
  ctx.fillStyle = 'rgb(107, 114, 128)'
  ctx.strokeStyle = 'rgba(107, 114, 128, 0.55)'
  ctx.lineWidth = 1

  const worldStart = Math.floor(-offset / zoom / step) * step
  const worldEnd = (props.length - offset) / zoom

  for (let value = worldStart; value <= worldEnd; value += step) {
    const screen = value * zoom + offset
    if (screen < -2 || screen > props.length + 2) continue
    const isMajor = Math.round(value / step) % majorEvery === 0
    const tickSize = isMajor ? thickness * 0.55 : thickness * 0.28
    ctx.beginPath()
    if (props.orientation === 'horizontal') {
      ctx.moveTo(Math.round(screen) + 0.5, thickness - tickSize)
      ctx.lineTo(Math.round(screen) + 0.5, thickness)
    } else {
      ctx.moveTo(thickness - tickSize, Math.round(screen) + 0.5)
      ctx.lineTo(thickness, Math.round(screen) + 0.5)
    }
    ctx.stroke()
    if (isMajor) {
      if (props.orientation === 'horizontal') {
        ctx.fillText(String(value), screen + 3, 9)
      } else {
        ctx.save()
        ctx.translate(9, screen + 3)
        ctx.rotate(-Math.PI / 2)
        ctx.fillText(String(value), 0, 0)
        ctx.restore()
      }
    }
  }
}

function scheduleDraw() {
  if (frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    draw()
  })
}

watch(
  () => [
    props.length,
    props.view.zoom.value,
    props.view.panX.value,
    props.view.panY.value,
    props.orientation,
  ],
  scheduleDraw
)

onMounted(scheduleDraw)
onBeforeUnmount(() => {
  if (frame) cancelAnimationFrame(frame)
})
</script>

<style scoped lang="less">
.lc-ruler {
  display: block;
}
</style>
