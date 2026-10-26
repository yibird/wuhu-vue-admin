<template>
  <div
    class="flex items-center justify-between b-t-1-regular bg-secondary px-12 py-8 text-xs text-secondary"
  >
    <span>
      {{ characterCount }} {{ locale.characterUnit }} / {{ wordCount }}
      {{ locale.wordUnit }}
    </span>
    <span>{{ locale.editorName }}</span>
  </div>
</template>

<script setup lang="ts">
import type { EditorLocale } from '../types'

defineProps<{
  readonly characterCount: number
  readonly wordCount: number
  readonly locale: EditorLocale
}>()
</script>
