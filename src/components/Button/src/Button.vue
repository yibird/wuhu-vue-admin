<template>
  <AButton :class="getCls" v-bind="getBindValue">
    <template #default>
      <Icon :name="preIcon" v-if="preIcon" :size="iconSize" />
      <slot v-bind="{} || {}" />
      <Icon :name="postIcon" v-if="postIcon" :size="iconSize" />
    </template>
  </AButton>
</template>
<script setup lang="ts">
  import { Button as AButton } from 'ant-design-vue';
  import { computed, unref } from 'vue';
  import { ButtonProps } from './types';
  import { useAttrs } from '/@/hooks/core/useAttrs';

  defineOptions({
    name: 'Button',
  });

  const props = defineProps<ButtonProps>();
  const { iconSize = 14, color, disabled = false } = props;
  const attrs = useAttrs({ excludeDefaultKeys: false });

  const getCls = computed(() => {
    return [
      {
        [`ant-btn-${color}`]: !!color,
        [`is-disabled`]: disabled,
      },
    ];
  });
  const getBindValue = computed(() => ({ ...unref(attrs), ...props }));
</script>
