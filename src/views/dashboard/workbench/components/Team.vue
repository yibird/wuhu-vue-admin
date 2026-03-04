<template>
  <div data-swapy-slot="team">
    <n-card
      size="small"
      :segmented="{
        content: true,
      }"
      content-class="p-0!"
      data-swapy-item="team"
    >
      <template #header>
        <span class="text-md font-bold">团队</span>
      </template>
      <template #header-extra>
        <n-button type="primary">更多</n-button>
      </template>
      <n-grid
        item-responsive
        responsive="screen"
        x-gap="10 xs:0 s:10 m:10 l:10 xl:10 xxl:10"
        y-gap="10"
        class="p-15 overflow-hidden"
      >
        <n-grid-item v-for="item in items" :key="item.id" span="24 xs:24 s:24 m:24 l:24 xl:6 xxl:3">
          <n-card hoverable content-class="p-0!">
            <div class="py-20 px-10 text-center cursor-pointer">
              <n-avatar round :src="item.icon" :size="36" />
              <div class="mt-4 truncate">{{ item.name }}</div>
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>
<script lang="ts" setup>
import type { TeamItem } from './types';

const items: TeamItem[] = [
  {
    id: 1,
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png',
    name: 'React团队',
  },
  {
    id: 2,
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png',
    name: 'Vue团队',
  },
  {
    id: 3,
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
    name: 'Solid团队',
  },
  {
    id: 4,
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
    name: 'Antd团队',
  },
];
</script>
