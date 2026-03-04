<template>
  <n-drawer v-model:show="show" title="任务中心" width="90%" placement="right">
    <n-drawer-content title="斯通纳" closable header-class="py-0! px-20" body-content-class="p-0!">
      <template #header>
        <n-tabs
          animated
          size="large"
          :tab-style="{ padding: '12px 0' }"
          :pane-style="{ padding: 0 }"
        >
          <n-tab-pane v-for="item in statusOptions" :name="item.value" :tab="item.label">
            <template #tab>
              <n-badge :value="5" :offset="[10, 24]">
                {{ item.label }}
              </n-badge>
            </template>
          </n-tab-pane>
        </n-tabs>
      </template>
      <div class="full flex overflow-hidden">
        <div class="w-180 py-20 bg-[#f8f9fa] overflow-auto">
          <div v-for="item in typeOptions" :key="item.value" class="px-20 py-10 cursor-pointer">
            {{ item.label }}
          </div>
        </div>
        <div class="flex-1 overflow-hidden"></div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>
<script lang="ts" setup>
  const show = defineModel('show', { default: false })

  const statusOptions = [
    {
      label: '全部',
      value: 0
    },
    {
      label: '已读',
      value: 1
    },
    {
      label: '未读',
      value: 2
    }
  ]
  const typeOptions = [
    {
      label: '任务管理',
      value: 0
    },
    {
      label: '文件管理',
      value: 1
    }
  ]
</script>
