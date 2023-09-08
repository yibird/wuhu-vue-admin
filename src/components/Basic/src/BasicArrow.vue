<template>
  <a-tooltip
    :title="renderTitle"
    :overlayStyle="getOverlayStyle"
    :autoAdjustOverflow="true"
    :placement="placement"
  >
    <span>1231211113</span>
  </a-tooltip>
</template>
<script setup lang="ts">
  import { TooltipProps } from 'ant-design-vue';
  import { computed, CSSProperties, h, unref } from 'vue';
  interface Props extends Pick<TooltipProps, 'placement'> {
    fontSize?: number;
    // 字体颜色
    color?: string;
    // 文本内容
    text?: string | string[];
    // 是否显示序号
    showIndex?: boolean;
    //  最大宽度
    maxWidth?: string;
  }
  const {
    fontSize = 14,
    color = '#fff',
    text,
    showIndex = true,
    maxWidth = '600px',
    placement = 'right',
  } = defineProps<Props>();

  const getStyle = $computed(() => {
    return {
      color,
      fontSize,
    } as CSSProperties;
  });

  const getOverlayStyle = $computed((): CSSProperties => {
    return { maxWidth };
  });

  const renderText = () => {
    if (typeof text === 'string') {
      const node = h('p', { innerHTML: text });
      return node;
    }
    return text?.map((item, index) => {
      const text = showIndex ? `${index + 1}. ${item}` : item;
      return h('p', { innerHTML: text });
    });
  };

  const renderTitle = () => {
    return h('div', { style: unref(getStyle) }, renderText());
  };
</script>
