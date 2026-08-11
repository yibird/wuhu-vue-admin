<template>
  <div class="w-full">
    <section
      class="mb-12 overflow-hidden rounded-8 border-1 border-solid border-color-2 bg-container shadow-[var(--w-shadow-card)]"
    >
      <div
        class="flex flex-wrap items-center justify-between gap-12 border-b-1 border-b-solid border-color-2 px-14 py-14 sm:px-18 sm:py-16"
      >
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-10">
            <a-skeleton-input active size="small" class="!w-118" />
            <a-skeleton-button active size="small" class="!w-82" />
          </div>
          <a-skeleton-input active size="small" class="!mt-8 !w-220" />
        </div>

        <div class="flex flex-wrap items-center gap-8">
          <a-skeleton-button active size="small" class="!w-76" />
          <a-skeleton-button active size="small" class="!w-82" />
        </div>
      </div>

      <div class="grid grid-cols-1 gap-0 sm:grid-cols-3">
        <div
          v-for="item in 3"
          :key="item"
          class="px-14 py-12 sm:px-18 sm:py-14"
          :class="{
            'border-y-1 border-y-solid border-color-2 sm:border-x-1 sm:border-y-0 sm:border-x-solid':
              item === 2,
          }"
        >
          <a-skeleton-input active size="small" class="!w-72" />
          <a-skeleton-input active size="large" class="!mt-8 !w-104" />
        </div>
      </div>
    </section>

    <div
      class="grid grid-cols-1 gap-12 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_400px]"
    >
      <main class="min-w-0 flex flex-col gap-12">
        <SkeletonCard>
          <div class="grid grid-cols-1 gap-12 sm:grid-cols-2 2xl:grid-cols-4">
            <div
              v-for="item in 4"
              :key="item"
              class="rounded-8 border-1 border-solid border-color-2 bg-container-secondary p-14"
            >
              <div class="flex items-start justify-between gap-12">
                <div class="min-w-0 flex-1">
                  <a-skeleton-input active size="small" class="!w-86" />
                  <a-skeleton-input active size="large" class="!mt-8 !w-92" />
                </div>
                <a-skeleton-avatar active shape="square" class="!rounded-8" />
              </div>
              <div class="mt-12 flex items-center justify-between gap-10">
                <a-skeleton-input active size="small" class="!w-108" />
                <a-skeleton-button active size="small" class="!w-58" />
              </div>
            </div>
          </div>
        </SkeletonCard>

        <SkeletonCard>
          <div class="grid grid-cols-1 gap-12 sm:grid-cols-2 xl:grid-cols-4">
            <div
              v-for="item in 4"
              :key="item"
              class="rounded-8 bg-container-secondary p-12"
            >
              <a-skeleton
                active
                :title="{ width: '52%' }"
                :paragraph="{ rows: 2, width: ['86%', '64%'] }"
              />
              <div
                class="mt-12 h-6 overflow-hidden rounded-999 bg-fill-tertiary"
              >
                <div
                  class="h-full rounded-999 bg-primary-tint"
                  :style="{ width: `${statusWidths[item - 1]}%` }"
                />
              </div>
            </div>
          </div>
        </SkeletonCard>

        <SkeletonCard body-class="p-0">
          <div
            class="grid grid-cols-3 gap-0 border-b-1 border-b-solid border-color-2"
          >
            <div
              v-for="item in 3"
              :key="item"
              class="min-w-0 px-16 py-12"
              :class="{
                'border-x-1 border-x-solid border-color-2': item === 2,
              }"
            >
              <a-skeleton-input active size="small" class="!w-46" />
              <a-skeleton-input active size="large" class="!mt-6 !w-72" />
            </div>
          </div>
          <div class="h-360 w-full p-16 max-md:h-280">
            <div class="h-full flex items-end gap-10">
              <div
                v-for="height in chartBars"
                :key="height"
                class="flex-1 rounded-t-6 bg-fill-tertiary"
                :style="{ height: `${height}%` }"
              />
            </div>
          </div>
        </SkeletonCard>

        <SkeletonCard>
          <div class="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div
              v-for="item in 4"
              :key="item"
              class="rounded-8 border-1 border-solid border-color-2 bg-container-secondary p-12"
            >
              <div class="flex items-start justify-between gap-10">
                <div class="min-w-0 flex-1">
                  <a-skeleton-input active size="small" class="!w-110" />
                  <a-skeleton-input active size="small" class="!mt-8 !w-180" />
                </div>
                <a-skeleton-button active size="small" class="!w-68" />
              </div>
              <div class="mt-12 grid grid-cols-3 gap-8">
                <a-skeleton-input
                  v-for="metric in 3"
                  :key="metric"
                  active
                  size="small"
                  class="!w-full"
                />
              </div>
              <div class="mt-10 flex justify-end">
                <a-skeleton-button active size="small" class="!w-58" />
              </div>
            </div>
          </div>
        </SkeletonCard>
      </main>

      <aside class="min-w-0 flex flex-col gap-12">
        <SkeletonCard>
          <div class="flex flex-col gap-10">
            <div
              v-for="item in 3"
              :key="item"
              class="rounded-8 border-1 border-solid border-color-2 bg-container-secondary p-12"
            >
              <a-skeleton
                active
                avatar
                :paragraph="{ rows: 2, width: ['88%', '66%'] }"
              />
              <div class="mt-10 flex items-center justify-between gap-10">
                <a-skeleton-input active size="small" class="!w-90" />
                <a-skeleton-button active size="small" class="!w-52" />
              </div>
            </div>
          </div>
        </SkeletonCard>

        <SkeletonCard>
          <div class="flex flex-col gap-8">
            <div
              v-for="item in 6"
              :key="item"
              class="flex items-center rounded-6 bg-container-secondary px-10 py-9"
            >
              <a-skeleton-input active size="small" class="!w-68" />
              <a-skeleton-input active size="small" class="!ml-12 !w-160" />
            </div>
          </div>
        </SkeletonCard>

        <SkeletonCard>
          <div class="flex flex-col gap-8">
            <div
              v-for="item in 4"
              :key="item"
              class="rounded-8 border-1 border-solid border-color-2 bg-container-secondary p-10"
            >
              <a-skeleton
                active
                avatar
                :paragraph="{ rows: 1, width: '72%' }"
              />
              <div class="mt-10 flex items-center justify-between gap-8">
                <a-skeleton-button active size="small" class="!w-62" />
                <div class="flex items-center gap-6">
                  <a-skeleton-button active size="small" class="!w-50" />
                  <a-skeleton-button active size="small" class="!w-50" />
                </div>
              </div>
            </div>
          </div>
        </SkeletonCard>
      </aside>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SkeletonCard from './SkeletonCard.vue'

const chartBars = [42, 64, 50, 78, 58, 86, 66, 72, 48, 82, 56, 70]
const statusWidths = [72, 58, 84, 46]
</script>
