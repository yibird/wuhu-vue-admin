<script setup lang="ts">
import type { FormPlusActionButton } from '../types'

const props = withDefaults(
  defineProps<{
    /**
     * @desc 提交按钮配置,不传表示隐藏
     */
    submit?: FormPlusActionButton
    /**
     * @desc 重置按钮配置,不传表示隐藏
     */
    reset?: FormPlusActionButton
    /**
     * @desc 折叠按钮配置,不传表示隐藏
     */
    collapse?: FormPlusActionButton
    /**
     * @desc 是否禁用全部按钮
     */
    disabled?: boolean
  }>(),
  {
    submit: undefined,
    reset: undefined,
    collapse: undefined,
    disabled: false,
  }
)

const emit = defineEmits<{
  submit: []
  reset: []
  toggleCollapse: []
}>()
</script>

<template>
  <a-form-item class="form-plus__actions">
    <div class="flex flex-wrap items-center justify-end gap-6">
      <a-button
        v-if="props.submit"
        type="primary"
        :disabled="props.disabled"
        @click="emit('submit')"
      >
        <template v-if="props.submit.icon" #icon>
          <Icon :name="props.submit.icon" />
        </template>
        {{ props.submit.text }}
      </a-button>

      <a-button
        v-if="props.reset"
        :disabled="props.disabled"
        @click="emit('reset')"
      >
        <template v-if="props.reset.icon" #icon>
          <Icon :name="props.reset.icon" />
        </template>
        {{ props.reset.text }}
      </a-button>

      <a-button
        v-if="props.collapse"
        type="link"
        class="px-0"
        @click="emit('toggleCollapse')"
      >
        {{ props.collapse.text }}
        <template #icon>
          <Icon :name="props.collapse.icon" />
        </template>
      </a-button>
    </div>
  </a-form-item>
</template>
