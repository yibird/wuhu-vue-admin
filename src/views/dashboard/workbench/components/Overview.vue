<template>
  <div
    class="flex flex-wrap justify-between gap-10 bg-white px-20 py-20 dark:bg-dark-primary"
  >
    <div class="flex items-center">
      <n-avatar :size="50" class="dark:bg-[#faad14]">Z乘风</n-avatar>
      <div class="px-16">
        <div class="text-base text-main font-medium dark:text-dark-main">
          早安，吴彦祖，祝你开心每一天!
        </div>
        <div class="mt-6 text-xs text-regular dark:text-dark-regular">
          交互专家 | 蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED
        </div>
      </div>
    </div>
    <div class="flex items-center">
      <template v-for="(item, index) in items" :key="index">
        <div class="px-10">
          <div class="text-sm mb-4 text-regular dark:text-dark-regular">
            {{ item.title }}
          </div>
          <div class="text-lg text-main dark:text-dark-main">
            {{ item.value }}
          </div>
        </div>
        <n-divider v-if="index !== items.length - 1" vertical class="h-30!" />
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
const items = [
  {
    title: '项目数量',
    value: 1000,
  },
  {
    title: '团队人数',
    value: 14,
  },
  {
    title: '项目访问数',
    value: 2000,
  },
]
</script>
