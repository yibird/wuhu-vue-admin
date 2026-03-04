<template>
  <div class="relative">
    <button class="toolbar-item" @click="onShow">
      <Icon name="i-lucide:settings" :size="16" />
    </button>
    <Transition name="fade">
      <div v-show="show" ref="popover" :class="['popover']" :style="position">
        <div class="min-w-200 relative">
          <div class="h-40 flex items-center px-15 whitespace-nowrap">
            <n-checkbox
              v-model:checked="showColumn"
              label="列显示"
              @update:checked="onAllChecked"
            />
            <n-checkbox v-model:checked="selectionCol" label="选项列" />
            <n-checkbox v-model:checked="indexCol" label="序号列" />
          </div>
          <div
            v-if="settingColumns.length > 0"
            ref="parent"
            class="max-h-300 p-10 overflow-hidden border-y-1 border-y-solid border-[#f8f8f8]"
          >
            <div
              v-for="(item, index) in settingColumns"
              :key="item.key ?? index"
              :index="index"
              class="group flex items-center justify-between py-6 px-5 rounded-4 cursor-pointer hover:(bg-[#f8f8f8])"
            >
              <div>
                <Icon name="i-lucide:grip-vertical" :size="18" />
                <n-checkbox
                  class="ml-10"
                  :checked="item.show"
                  @update-checked="(checked) => onChecked(index, checked)"
                  >{{ getTitle(item.title) }}</n-checkbox
                >
              </div>
              <div class="opacity-0 group-hover:opacity-100">
                <Icon
                  name="i-lucide:arrow-up-from-line"
                  :size="18"
                  class="hover:text-theme"
                  @click="onMoveUp(index)"
                />
                <Icon
                  name="i-lucide:arrow-down-from-line"
                  :size="18"
                  class="hover:text-theme"
                  @click="onMoveDown(index)"
                />
              </div>
            </div>
          </div>
          <div class="flex justify-end px-15 py-10">
            <n-button type="primary" size="small" @click="onReset">重置</n-button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core';
import { cloneDeep } from 'es-toolkit';
import { useDragAndDrop } from 'fluid-dnd/vue';
import { useTablePlusInject } from '../../context';
import type { TablePlusColumn } from '../../types';

const { columns, selectionCol, indexCol } = useTablePlusInject();

const columnsClone = ref(cloneDeep(columns.value));
const settingColumns = ref(columns.value);
const showColumn = ref(true);

const show = ref(false);
const popover = ref<HTMLDivElement>();
const position = reactive({ left: '0px', top: '0px' });

const [parent] = useDragAndDrop(columns, {});

const getTitle = (title: TablePlusColumn['title']) => {
  return typeof title === 'function' ? title() : title;
};

const onAllChecked = (checked: boolean) => {
  columns.value = checked ? columnsClone.value : [];
  settingColumns.value = settingColumns.value.map((item) => {
    return { ...item, show: checked };
  });
};

const onChecked = (index: number, checked: boolean) => {
  settingColumns.value[index].show = checked;
  const column = settingColumns.value[index];
  const include = columns.value.find((item) => item.key === column.key);
  if (!include) {
    columns.value.push({ ...column, show: checked });
  } else {
    columns.value[index].show = checked;
  }
  showColumn.value = settingColumns.value.some((item) => item.show);
};

const onMoveUp = (index: number) => {
  if (index === 0) return;
  const item = columns.value[index];
  columns.value.splice(index, 1);
  columns.value.splice(index - 1, 0, item);
};

const onMoveDown = (index: number) => {
  if (index === columns.value.length - 1) return;
  const item = columns.value[index];
  columns.value.splice(index, 1);
  columns.value.splice(index + 1, 0, item);
};

const onReset = () => {
  columns.value = columnsClone.value;
  settingColumns.value = columnsClone.value;
};

onClickOutside(popover, () => (show.value = false));

const onShow = (e: Event) => {
  show.value = true;
  nextTick(() => {
    const buttonEl = e.currentTarget as HTMLElement;
    const containerEl = popover.value;
    if (!containerEl) return;
    const top = `${buttonEl.clientHeight + 5}px`;
    const left = `${-containerEl.clientWidth + buttonEl.clientWidth}px`;
    Object.assign(position, {
      left,
      top,
    });
  });
};
</script>
<style scoped>
.popover {
  position: absolute;
  background-color: #fff;
  border-radius: 2px;
  z-index: 2000;
  box-shadow:
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
