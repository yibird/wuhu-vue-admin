<script setup lang="ts">
import type { DesignerNodeAction } from '../types'

const props = defineProps<{
  actions: DesignerNodeAction[]
  open: boolean
  positionStyle?: Record<string, string>
}>()

defineEmits<{
  action: [key: DesignerNodeAction['key']]
  close: []
}>()

const menuActions = computed(() =>
  props.actions.filter((action) => !action.disabled)
)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[10080]"
      @contextmenu.prevent
      @pointerdown.self="$emit('close')"
      @wheel.passive="$emit('close')"
    >
      <div
        data-low-code-context-menu
        class="fixed left-0 top-0 min-w-156 rounded-8 border-1 border-color-2 border-solid bg-container p-5 shadow-[0_18px_50px_rgb(15_23_42_/_22%)] will-change-transform"
        :style="positionStyle"
        role="menu"
        @pointerdown.stop
      >
        <button
          v-for="action in menuActions"
          :key="action.key"
          type="button"
          role="menuitem"
          :class="[
            'h-34 w-full inline-flex items-center gap-9 rounded-6 border-0 bg-transparent px-9 text-left text-13px text-regular cursor-pointer transition-colors hover:bg-hover hover:text-main',
            action.danger ? 'hover:bg-error-tint hover:text-error' : '',
          ]"
          @click="$emit('action', action.key)"
        >
          <Icon :name="action.icon" :size="15" />
          <span>{{ action.label }}</span>
        </button>
      </div>
    </div>
  </Teleport>
</template>
