<template>
  <section data-swapy-slot="team" class="page-enter page-enter--6 min-w-0">
    <a-card :styles="{ body: { padding: 0 } }" data-swapy-item="team">
      <template #title>
        <span class="text-base text-main font-700">协作团队</span>
      </template>
      <template #extra>
        <a-button type="link" size="small">组织视图</a-button>
      </template>

      <div class="p-20 flex flex-col gap-10">
        <div
          v-for="item in items"
          :key="item.id"
          class="group rounded-8 p-10 transition-[background-color,box-shadow,transform] duration-motion-base hover:(-translate-y-1 bg-hover shadow-all-sm)"
        >
          <div class="flex items-start gap-10">
            <a-avatar
              :src="item.icon"
              :size="38"
              class="shrink-0 transition-transform duration-motion-base group-hover:scale-105"
            />
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-8">
                <h3 class="m-0 truncate text-sm text-main font-700">
                  {{ item.name }}
                </h3>
                <span class="shrink-0 text-xs text-secondary">
                  {{ item.online }}/{{ item.members }} 在线
                </span>
              </div>
              <p class="mb-0 mt-4 truncate text-xs text-secondary">
                {{ item.desc }}
              </p>
              <div class="mt-9 flex items-center gap-8">
                <a-progress
                  class="min-w-0 flex-1"
                  :percent="item.progress"
                  :show-info="false"
                  :size="6"
                />
                <span class="w-36 text-right text-xs text-main font-600">
                  {{ item.progress }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-card>
  </section>
</template>

<script lang="ts" setup>
import type { TeamItem } from './types'

const items: TeamItem[] = [
  {
    id: 1,
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png',
    name: '产品体验组',
    desc: '需求分析、交互评审、验收标准',
    members: 8,
    online: 6,
    progress: 82,
    status: '稳定',
  },
  {
    id: 2,
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
    name: '前端工程组',
    desc: '页面开发、组件沉淀、性能治理',
    members: 10,
    online: 8,
    progress: 76,
    status: '推进中',
  },
  {
    id: 3,
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
    name: '平台架构组',
    desc: '权限、审计、接口稳定性',
    members: 7,
    online: 5,
    progress: 64,
    status: '关注',
  },
]
</script>
