<template>
  <section data-swapy-slot="project" class="page-enter page-enter--3 min-w-0">
    <a-card
      size="small"
      :segmented="{ content: true }"
      data-swapy-item="project"
      content-class="p-0!"
    >
      <template #header>
        <div class="min-w-0 flex items-center gap-8">
          <span class="text-base text-main font-700">重点项目</span>
          <span
            class="rounded-full bg-fill-tertiary px-8 py-2 text-xs text-secondary"
          >
            {{ projectItems.length }} 个进行中
          </span>
        </div>
      </template>
      <template #header-extra>
        <a-button type="link" size="small">查看全部</a-button>
      </template>

      <div class="grid grid-cols-1 gap-10 p-12 xl:grid-cols-2">
        <article
          v-for="item in projectItems"
          :key="item.id"
          class="group min-w-0 rounded-8 border-1 border-color-2 border-solid bg-container p-14 transition-[border-color,background-color,box-shadow,transform] duration-200 hover:(-translate-y-1 border-color-primary bg-primary/5 shadow-all-sm)"
        >
          <div class="min-w-0 flex items-start justify-between gap-12">
            <div class="min-w-0 flex items-center gap-10">
              <span
                class="size-46 flex shrink-0 items-center justify-center rounded-10 border-1 border-solid shadow-all-sm transition-transform duration-200 group-hover:(-translate-y-1 scale-105)"
                :class="item.logoClass"
              >
                <Icon :name="item.logo.icon" :size="21" />
              </span>
              <div class="min-w-0">
                <div class="flex items-center gap-8">
                  <h3 class="m-0 truncate text-base text-main font-700">
                    {{ item.name }}
                  </h3>
                  <span
                    class="shrink-0 rounded-full px-8 py-2 text-xs"
                    :class="item.statusClass"
                  >
                    {{ item.status }}
                  </span>
                </div>
                <p
                  class="mb-0 mt-5 line-clamp-2 text-sm text-secondary leading-22px"
                >
                  {{ item.describe }}
                </p>
              </div>
            </div>

            <a-button
              type="text"
              size="small"
              class="shrink-0 opacity-60 transition-opacity group-hover:opacity-100"
              :aria-label="`设置${item.name}`"
              title="项目设置"
              @click="emit('openSettings', item)"
            >
              <template #icon>
                <Icon name="i-lucide:ellipsis" :size="16" />
              </template>
            </a-button>
          </div>

          <div class="mt-16">
            <div class="mb-6 flex items-center justify-between text-xs">
              <span class="text-secondary">完成进度</span>
              <span class="text-main font-600">{{ item.progress }}%</span>
            </div>
            <a-progress :percent="item.progress" :show-info="false" :size="7" />
          </div>

          <div
            class="mt-14 flex flex-col gap-10 text-xs text-secondary sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="min-w-0 flex items-center gap-7">
              <Icon name="i-lucide:user-round" :size="14" />
              <span class="truncate">{{ item.master }}</span>
            </div>
            <div class="min-w-0 flex items-center gap-7">
              <Icon name="i-lucide:calendar-clock" :size="14" />
              <span class="truncate">截止 {{ item.dueAt }}</span>
            </div>
          </div>

          <div class="mt-14 flex items-center justify-between gap-12">
            <a-avatar-group
              :options="item.members"
              :size="28"
              :max="{ count: 3 }"
            >
              <template #avatar="{ option }">
                <a-tooltip :title="option.name">
                  <a-avatar :src="option.src">{{
                    option.name.slice(0, 1)
                  }}</a-avatar>
                </a-tooltip>
              </template>
            </a-avatar-group>
            <span class="text-xs text-secondary"
              >创建于 {{ item.createAt }}</span
            >
          </div>
        </article>
      </div>
    </a-card>
  </section>
</template>

<script lang="ts" setup>
import { getProjectLogoOption } from '../data'
import type { Project } from './types'

const props = defineProps<{
  projects: Project[]
}>()

const emit = defineEmits<{
  openSettings: [project: Project]
}>()

const projectItems = computed(() =>
  props.projects.map((project) => ({
    ...project,
    logoClass: getProjectLogoOption(project.logo).class,
  }))
)
</script>
