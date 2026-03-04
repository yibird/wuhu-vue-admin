<template>
  <div data-swapy-slot="project">
    <n-card
      size="small"
      :segmented="{
        content: true,
      }"
      data-swapy-item="project"
      content-class="p-0!"
    >
      <template #header>
        <span class="text-md font-bold">项目</span>
      </template>
      <template #header-extra>
        <n-button type="primary">更多</n-button>
      </template>
      <n-grid
        item-responsive
        responsive="screen"
        x-gap="10"
        y-gap="10"
        class="p-15 overflow-hidden"
      >
        <n-grid-item v-for="item in projects" :key="item.id" span="xs:24 s:24 m:12 l:12 xl:8 xxl:6">
          <n-card hoverable>
            <div class="flex items-center gap-10">
              <n-avatar :src="item.avatar" :size="40" />
              <span className="text-base font-medium">{{ item.name }}</span>
            </div>
            <div class="my-10 min-h-60 text-sm dark-secondary dark:text-dark-secondary">
              {{ item.describe }}
            </div>
            <div className="flex items-center justify-between gap-10">
              <n-avatar-group :options="options" :size="32" :max="3">
                <template #avatar="{ option: { name, src } }">
                  <n-tooltip>
                    <template #trigger>
                      <n-avatar :src="src" />
                    </template>
                    {{ name }}
                  </n-tooltip>
                </template>
                <template #rest="{ options: restOptions, rest }">
                  <n-dropdown
                    :options="createDropdownOptions(restOptions as any[])"
                    placement="top"
                  >
                    <n-avatar>+{{ rest }}</n-avatar>
                  </n-dropdown>
                </template>
              </n-avatar-group>
              <span className="text-sm text-secondary">创建时间：{{ item.createAt }}</span>
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>
<script lang="ts" setup>
import type { Project } from './types';

const projects: Project[] = [
  {
    id: 1,
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
    name: 'Alipay',
    describe: '那是一种内在的东西，他们到达不了，也无法触及的',
    master: 'zchengfeng',
    createAt: '2020-02-02',
  },
  {
    id: 2,
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
    name: 'Angular',
    describe: '那是一种内在的东西，他们到达不了，也无法触及的',
    master: 'zchengfeng',
    createAt: '2020-02-02',
  },
  {
    id: 3,
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
    name: 'Ant Design',
    describe: '那是一种内在的东西，他们到达不了，也无法触及的',
    master: 'zchengfeng',
    createAt: '2020-02-02',
  },
  {
    id: 4,
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
    name: 'Ant Design Pro',
    describe: '那是一种内在的东西，他们到达不了，也无法触及的',
    master: 'zchengfeng',
    createAt: '2020-02-02',
  },
  {
    id: 5,
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
    name: 'Bootstrap',
    describe: '那是一种内在的东西，他们到达不了，也无法触及的',
    master: 'zchengfeng',
    createAt: '2020-02-02',
  },
  {
    id: 6,
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png',
    name: 'React',
    describe: '那是一种内在的东西，他们到达不了，也无法触及的',
    master: 'zchengfeng',
    createAt: '2020-02-02',
  },
];
const options = [
  {
    name: '张三',
    src: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
  },
  {
    name: '李四',
    src: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
  },
  {
    name: '王五',
    src: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
  },
  {
    name: '赵六',
    src: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
  },
  {
    name: '七仔',
    src: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
  },
];

const createDropdownOptions = (options: Array<{ name: string; src: string }>) => {
  return options.map((option) => ({
    key: option.name,
    label: option.name,
  }));
};
</script>
