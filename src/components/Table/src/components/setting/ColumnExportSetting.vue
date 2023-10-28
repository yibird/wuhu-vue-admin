<!-- 列导出 -->
<template>
  <a-tooltip>
    <template #title>列导出</template>
    <a-popover
      trigger="click"
      placement="bottomRight"
      :overlayInnerStyle="{ padding: 0 }"
    >
      <template #content>
        <div class="flex items-center justify-between px-15 py-10">
          <div>
            <a-checkbox :checked="checkAll" @change="handleCheckAll"
              >全选</a-checkbox
            >
            <span>
              <span>已选中</span>
              <a-typography-link class="px-5">
                {{ checkedLength }}
              </a-typography-link>
              <span>项</span>
            </span>
          </div>
        </div>
        <ul class="panel-list">
          <li
            v-for="(item, index) in exportColumns"
            :key="item.dataIndex + '-' + index"
          >
            <a-checkbox
              :checked="item.checked"
              @change="handleCheckItem(index, item.checked)"
              >{{ item.title || '' }}</a-checkbox
            >
          </li>
        </ul>
        <div class="flex justify-end p-10">
          <a-button
            :loading="loading"
            type="primary"
            size="small"
            @click="handleExport"
            >导出</a-button
          >
        </div>
      </template>
      <Icon name="ri-download-cloud-line" :size="20" />
    </a-popover>
  </a-tooltip>
</template>
<script setup lang="ts">
  import { inject, reactive, toValue, computed, toRefs } from 'vue';
  import { ContextType } from '../../types';

  const { columns } = inject<ContextType>('context')!;
  const state = reactive({
    loading: false,
    exportColumns: toValue(columns).map((item) => ({
      ...item,
      checked: true,
    })),
  });
  const { loading, exportColumns } = toRefs(state);

  // ====================== computed
  const checkedLength = computed(() => {
    return toValue(exportColumns).filter((item) => item.checked).length;
  });
  const checkAll = computed(() => {
    return toValue(checkedLength) === toValue(exportColumns).length;
  });

  // ====================== method
  const handleCheckAll = () => {
    const checkedColumns = toValue(exportColumns).map((item) => {
      return { ...item, checked: !toValue(checkAll) };
    });
    Object.assign(state, { exportColumns: checkedColumns });
  };
  const handleCheckItem = (index: number, checked: boolean) => {
    exportColumns.value[index].checked = !checked;
  };
  const handleExport = () => {
    const columnNames = toValue(exportColumns)
      .filter((item) => item.checked)
      .map((item) => item.dataIndex);
    console.log('columnNames:', columnNames);
  };
</script>

<style scoped>
  .panel-list {
    max-height: 300px;
    min-width: 240px;
    overflow-y: auto;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }
  .panel-list li {
    @apply flex items-center justify-between px-15 py-5;
  }
  .panel-list li:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
</style>
