<script setup lang="ts">
import ToolbarButtonGroup from './ToolbarButtonGroup.vue'
import type { MenuProps } from 'antdv-next'
import type {
  EditorColorOption,
  EditorLocale,
  EditorSelectOption,
  EditorToolbarItem,
} from '../types'

defineProps<{
  readonly disabled?: boolean
  readonly showSelectControls?: boolean
  readonly currentBlock: string
  readonly currentFontFamily: string
  readonly currentFontSize: string
  readonly currentTextColor: string
  readonly currentHighlightColor: string
  readonly blockOptions: readonly EditorSelectOption[]
  readonly fontFamilyOptions: readonly EditorSelectOption[]
  readonly fontSizeOptions: readonly EditorSelectOption[]
  readonly textColorOptions: readonly EditorColorOption[]
  readonly highlightColorOptions: readonly EditorColorOption[]
  readonly inlineItems: readonly EditorToolbarItem[]
  readonly blockItems: readonly EditorToolbarItem[]
  readonly alignItems: readonly EditorToolbarItem[]
  readonly imageMenu: MenuProps
  readonly tableMenu: MenuProps
  readonly canUndo: boolean
  readonly canRedo: boolean
  readonly isLinkActive: boolean
  readonly isTableActive: boolean
  readonly buttonClass: (active?: boolean) => string
  readonly stateVersion: number
  readonly locale: EditorLocale
}>()

const emit = defineEmits<{
  setBlock: [value: string | number]
  setFontFamily: [value: string | number]
  setFontSize: [value: string | number]
  setTextColor: [value: string | number]
  setHighlightColor: [value: string | number]
  setLink: []
  clearFormatting: []
  undo: []
  redo: []
}>()

function toOptionValue(value: unknown): string | number {
  return typeof value === 'number' ? value : String(value ?? '')
}
</script>

<template>
  <div
    class="flex flex-wrap items-center gap-8 border-b-1 border-b-solid border-color-2 bg-fill-quaternary px-10 py-9"
  >
    <template v-if="showSelectControls">
      <a-select
        :value="currentBlock"
        class="w-112"
        size="small"
        :disabled="disabled"
        @change="emit('setBlock', toOptionValue($event))"
      >
        <a-select-option
          v-for="option in blockOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </a-select-option>
      </a-select>

      <a-select
        :value="currentFontFamily"
        class="w-148"
        size="small"
        :disabled="disabled"
        @change="emit('setFontFamily', toOptionValue($event))"
      >
        <a-select-option
          v-for="option in fontFamilyOptions"
          :key="option.value || 'default-font'"
          :value="option.value"
        >
          <span :style="{ fontFamily: option.value || undefined }">
            {{ option.label }}
          </span>
        </a-select-option>
      </a-select>

      <a-select
        :value="currentFontSize"
        class="w-98"
        size="small"
        :disabled="disabled"
        @change="emit('setFontSize', toOptionValue($event))"
      >
        <a-select-option
          v-for="option in fontSizeOptions"
          :key="option.value || 'default-size'"
          :value="option.value"
        >
          {{ option.label }}
        </a-select-option>
      </a-select>

      <a-select
        :value="currentTextColor"
        class="w-112"
        size="small"
        :disabled="disabled"
        @change="emit('setTextColor', toOptionValue($event))"
      >
        <a-select-option
          v-for="option in textColorOptions"
          :key="option.value || 'default-text-color'"
          :value="option.value"
        >
          <span class="inline-flex items-center gap-6">
            <span
              class="size-12 rounded-3 border-1 border-solid border-color-1"
              :style="{ backgroundColor: option.color }"
            />
            <span>{{ option.label }}</span>
          </span>
        </a-select-option>
      </a-select>

      <a-select
        :value="currentHighlightColor"
        class="w-112"
        size="small"
        :disabled="disabled"
        @change="emit('setHighlightColor', toOptionValue($event))"
      >
        <a-select-option
          v-for="option in highlightColorOptions"
          :key="option.value || 'default-highlight-color'"
          :value="option.value"
        >
          <span class="inline-flex items-center gap-6">
            <span
              class="size-12 rounded-3 border-1 border-solid border-color-1"
              :style="{ backgroundColor: option.color }"
            />
            <span>{{ option.label }}</span>
          </span>
        </a-select-option>
      </a-select>
    </template>

    <ToolbarButtonGroup
      :items="inlineItems"
      :disabled="disabled"
      :button-class="buttonClass"
      :state-version="stateVersion"
    />
    <ToolbarButtonGroup
      :items="blockItems"
      :disabled="disabled"
      :button-class="buttonClass"
      :state-version="stateVersion"
    />
    <ToolbarButtonGroup
      :items="alignItems"
      :disabled="disabled"
      :button-class="buttonClass"
      :state-version="stateVersion"
    />

    <div
      class="ml-auto flex items-center gap-2 rounded-8 border-1 border-solid border-color-2 bg-container p-3 max-lg:ml-0"
    >
      <a-tooltip :title="locale.link">
        <button
          type="button"
          class="button size-30 rounded-6 transition-colors"
          :class="buttonClass(isLinkActive)"
          :disabled="disabled"
          :aria-label="locale.link"
          @click="emit('setLink')"
        >
          <Icon name="i-lucide:link" :size="16" />
        </button>
      </a-tooltip>

      <a-dropdown :trigger="['click']" :menu="imageMenu">
        <a-tooltip :title="locale.image">
          <button
            type="button"
            class="button size-30 rounded-6 text-secondary transition-colors hover:(bg-hover text-primary)"
            :disabled="disabled"
            :aria-label="locale.image"
            @click.prevent
          >
            <Icon name="i-lucide:image-plus" :size="16" />
          </button>
        </a-tooltip>
      </a-dropdown>

      <a-dropdown :trigger="['click']" :menu="tableMenu">
        <a-tooltip :title="locale.table">
          <button
            type="button"
            class="button size-30 rounded-6 transition-colors"
            :class="buttonClass(isTableActive)"
            :disabled="disabled"
            :aria-label="locale.table"
            @click.prevent
          >
            <Icon name="i-lucide:table-2" :size="16" />
          </button>
        </a-tooltip>
      </a-dropdown>

      <a-tooltip :title="locale.clearFormatting">
        <button
          type="button"
          class="button size-30 rounded-6 text-secondary transition-colors hover:(bg-hover text-primary)"
          :disabled="disabled"
          :aria-label="locale.clearFormatting"
          @click="emit('clearFormatting')"
        >
          <Icon name="i-lucide:eraser" :size="16" />
        </button>
      </a-tooltip>
      <a-tooltip :title="locale.undo">
        <button
          type="button"
          class="button size-30 rounded-6 text-secondary transition-colors hover:(bg-hover text-primary) disabled:(cursor-not-allowed text-disabled)"
          :disabled="disabled || !canUndo"
          :aria-label="locale.undo"
          @click="emit('undo')"
        >
          <Icon name="i-lucide:undo-2" :size="16" />
        </button>
      </a-tooltip>
      <a-tooltip :title="locale.redo">
        <button
          type="button"
          class="button size-30 rounded-6 text-secondary transition-colors hover:(bg-hover text-primary) disabled:(cursor-not-allowed text-disabled)"
          :disabled="disabled || !canRedo"
          :aria-label="locale.redo"
          @click="emit('redo')"
        >
          <Icon name="i-lucide:redo-2" :size="16" />
        </button>
      </a-tooltip>
    </div>
  </div>
</template>
