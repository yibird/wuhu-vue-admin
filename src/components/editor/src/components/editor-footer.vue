<script setup lang="ts">
import type { EditorLocale } from '../types'

defineProps<{
  readonly characterCount: number
  readonly wordCount: number
  readonly locale: EditorLocale
}>()
</script>

<template>
  <div
    class="flex items-center justify-between border-t-1 border-t-solid border-color-2 bg-fill-quaternary px-12 py-8 text-xs text-secondary"
  >
    <span>
      {{ characterCount }} {{ locale.characterUnit }} / {{ wordCount }}
      {{ locale.wordUnit }}
    </span>
    <span>{{ locale.editorName }}</span>
  </div>
</template>
