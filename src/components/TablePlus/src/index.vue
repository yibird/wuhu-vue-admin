<template>
  <Motion
    layout
    :transition="{
      type: 'spring',
      stiffness: 500,
      damping: 30,
    }"
    :class="[
      'table-plus w-full h-full flex flex-col',
      {
        'fixed inset-0 bg-white z-1000': contextValue.fullScreen?.value,
      },
    ]"
    ref="tRef"
  >
    <div class="flex flex-col bg-white overflow-hidden">
      <TableHeader>
        <template v-for="(_, key) in slots" :key="key" v-slot:[key]>
          <slot :name="key"></slot>
        </template>
      </TableHeader>
      <TableContent />
    </div>
  </Motion>
</template>
<script lang="ts" setup generic="T extends Record<string, any>">
import { Motion } from 'motion-v';
import { TableHeader, TableContent } from './components';
import { useTablePlusProvider } from './context';
import type { TablePlusProps, TablePlusEmits, TablePlusProvide, TablePlusSlots } from './types';

const props = withDefaults(defineProps<TablePlusProps<T>>(), {
  autoSize: true,
  selectionCol: true,
  indexCol: true,
  bordered: true,
  columns: () => [],
  singleColumn: false,
  singleLine: false,
  striped: false,
  size: 'small',
});
const emits = defineEmits<TablePlusEmits<T>>();
const slots = defineSlots<TablePlusSlots>();
const tRef = ref<HTMLDivElement>();

const initialConlumns = props.columns.map((item) => {
  return { ...item, show: typeof item.show === 'undefined' ? true : item.show };
}) as NonNullable<TablePlusProps['columns']>;

const fullScreen = ref(false);
const striped = ref(props.striped);
const size = ref<NonNullable<TablePlusProps['size']>>(props.size);
const columns = ref(initialConlumns);
const selectionCol = ref<boolean>(props.selectionCol);
const indexCol = ref<boolean>(props.indexCol);

const contextValue = {
  ...toRefs(props),
  fullScreen,
  striped,
  size,
  columns,
  selectionCol,
  indexCol,
  emits,
} as TablePlusProvide<T>;

useTablePlusProvider(contextValue);
</script>
