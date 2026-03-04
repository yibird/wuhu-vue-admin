<template>
  <n-drawer v-model:show="open" :width="400" placement="right" @after-leave="handleClose">
    <n-drawer-content title="项目设置" footer-class="p-10 grid! grid-cols-3 gap-10">
      <div class="flex justify-center">
        <n-radio-group v-model:value="value">
          <n-radio-button v-for="item in options" :key="item.value" :value="item.value">
            {{ item.label }}
          </n-radio-button>
        </n-radio-group>
      </div>
      <component :is="component" />
      <template #footer>
        <n-button type="primary">拷贝</n-button>
        <n-button type="primary">导入配置</n-button>
        <n-button type="primary" danger>重置配置</n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
<script lang="ts" setup>
import { computed, defineAsyncComponent, reactive, ref, type Component } from 'vue';
import type { SettingEmit } from './types';

const open = defineModel<boolean>('open');
const emits = defineEmits<SettingEmit>();

const value = ref('appearance');
const options = reactive([
  {
    label: '外观',
    value: 'appearance',
    path: './appearance/index.vue',
  },
  {
    label: '布局',
    value: 'layout',
    path: './layout/index.vue',
  },
  {
    label: '快捷键',
    value: 'shortcutKeys',
    path: './shortcutKeys/index.vue',
  },
  {
    label: '通用',
    value: 'general',
    path: './general/index.vue',
  },
]);

const components = import.meta.glob<() => Promise<{ default: Component }>>('./**/index.vue');
const component = computed(() => {
  const item = options.find((item) => item.value === value.value);
  console.log('item:', item);
  if (!item) return;
  return defineAsyncComponent(components[item.path]);
});

const handleClose = () => {
  emits('close');
};
</script>
