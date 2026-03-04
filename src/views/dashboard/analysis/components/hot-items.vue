<template>
  <n-card
    :segmented="{ content: true }"
    :header-style="{ padding: 0 }"
    header-class="bg-gradient-to-b from-[#e8f4ff80] to-[#fff0]"
  >
    <template #header>
      <div class="px-20 py-15 text-md font-bold">热门榜单</div>
    </template>
    <div class="flex flex-col gap-12">
      <div
        v-for="(item, index) in items"
        :key="item.id"
        class="flex items-center justify-between gap-10"
      >
        <div class="flex-1 flex items-center gap-10">
          <div
            :style="{ backgroundColor: index < 3 ? '#000' : '#eee' }"
            class="size-20 flex items-center justify-center text-white rounded-full"
            >{{ index + 1 }}</div
          >
          <div class="max-w-300 text-base truncate">{{ item.title }}</div>
        </div>
        <n-progress
          type="line"
          :percentage="item.value"
          :height="12"
          :border-radius="2"
          :fill-border-radius="0"
          class="w-300!"
        />
      </div>
    </div>
  </n-card>
</template>
<script lang="ts" setup>
const items = [
  {
    id: 1,
    title: '飘柔洗发水',
    value: 90,
  },
  {
    id: 2,
    title: '小米Su7',
    value: 87,
  },
  {
    id: 3,
    title: '小米Yu7',
    value: 84,
  },
  {
    id: 4,
    title: 'iphone17 Pro Max 256GB',
    value: 84,
  },
  {
    id: 5,
    title: '三星盖乐世512GB',
    value: 82,
  },
  {
    id: 6,
    title: '小米asdasdYu7',
    value: 76,
  },
  {
    id: 7,
    title: '小米吹风机',
    value: 76,
  },
  {
    id: 8,
    title: '兰博基尼',
    value: 72,
  },
  {
    id: 9,
    title: '法拉利',
    value: 63.8,
  },
];
</script>
