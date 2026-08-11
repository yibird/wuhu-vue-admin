<template>
  <a-dropdown
    :menu="{ items: options, selectedKeys: [placement] }"
    @menu-click="onSelect"
  >
    <button
      :aria-label="$t('common.auth.layout')"
      class="size-40 flex cursor-pointer items-center justify-center rounded-8 border-0 bg-transparent text-main outline-none transition-[background-color,color,transform,box-shadow] duration-180 hover:(bg-hover text-primary -translate-y-1) focus-visible:shadow-[0_0_0_2px_rgb(var(--w-color-primary)_/_24%)] active:translate-y-0 motion-reduce:(transform-none transition-none)"
      type="button"
    >
      <Icon name="i-lucide:panel-left" :size="20" />
    </button>
  </a-dropdown>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Placement } from './types'

const { t } = useI18n()
const options = computed<Array<{ key: Placement; label: string }>>(() => [
  { key: 'left', label: t('common.auth.alignLeft') },
  { key: 'center', label: t('common.auth.alignCenter') },
  { key: 'right', label: t('common.auth.alignRight') },
])

const emit = defineEmits<{
  change: [value: Placement]
}>()

const placement = shallowRef<Placement>('right')

const isPlacement = (value: string): value is Placement =>
  ['left', 'center', 'right'].includes(value)

const onSelect = ({ key }: { key: string }) => {
  if (!isPlacement(key)) return
  placement.value = key
  emit('change', key)
}
</script>
