<template>
  <Button :class="getBtnCls" v-bind="getBindValue">
    <template #default>
      <Icon :name="preIcon" v-if="preIcon" :size="iconSize" />
      <slot v-bind="{} || {}" />
      <Icon :name="postIcon" v-if="postIcon" :size="iconSize" />
    </template>
  </Button>
</template>
<script setup lang="ts">
  import { Button } from "ant-design-vue";
  import { computed, unref } from "vue";
  import { ButtonProps } from "./types";
  import { useAttrs } from "/@/hooks/core/useAttrs";

  const props = defineProps<ButtonProps>();
  const { iconSize = 14, color, disabled = false } = props;
  const attrs = useAttrs({ excludeDefaultKeys: false });

  const getBtnCls = computed(() => {
    return [
      {
        [`ant-btn-${color}`]: !!color,
        [`is-disabled`]: disabled,
      },
    ];
  });
  const getBindValue = computed(() => ({ ...unref(attrs), ...props }));
</script>
