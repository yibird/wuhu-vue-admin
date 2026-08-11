<script lang="ts" setup>
const chartBars = [44, 62, 50, 76, 58, 86, 64, 72, 48, 80, 56, 70]
const rankingRows = [92, 84, 76, 68, 62, 54]
</script>

<template>
  <div class="w-full flex flex-col gap-12">
    <section
      class="overflow-hidden rounded-8 border-1 border-solid border-color-2 bg-container px-14 py-14 shadow-[var(--w-shadow-card)] sm:px-18 sm:py-16"
    >
      <div class="flex flex-wrap items-center justify-between gap-12">
        <div class="min-w-0">
          <a-skeleton-input active class="!w-118" />
          <a-skeleton-input
            active
            size="small"
            class="!mt-8 !w-220 max-sm:!w-180"
          />
        </div>
        <div class="flex items-center gap-8">
          <a-skeleton-button active size="small" class="!w-88" />
          <a-skeleton-button active size="small" class="!w-76" />
        </div>
      </div>
    </section>

    <div class="grid grid-cols-1 gap-12 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="item in 4"
        :key="item"
        class="rounded-8 border-1 border-color-2 border-solid bg-container p-14 shadow-[var(--w-shadow-card)]"
      >
        <div class="mb-18 flex items-start justify-between gap-12">
          <div class="min-w-0">
            <a-skeleton-input active size="small" class="!w-84" />
            <a-skeleton-input active size="small" class="!mt-8 !w-112" />
          </div>
          <a-skeleton-button active size="small" shape="round" class="!w-86" />
        </div>
        <div class="flex items-end justify-between gap-12">
          <div class="min-w-0">
            <a-skeleton-input active class="!w-104" />
            <a-skeleton-input active size="small" class="!mt-12 !w-126" />
          </div>
          <a-skeleton-avatar active shape="square" class="!h-44 !w-44" />
        </div>
      </div>
    </div>

    <section
      class="overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container shadow-[var(--w-shadow-card)]"
    >
      <div
        class="flex flex-wrap items-center justify-between gap-12 border-b-1 border-b-solid border-color-2 px-14 py-12 sm:px-18"
      >
        <div>
          <a-skeleton-input active size="small" class="!w-96" />
          <a-skeleton-input active size="small" class="!mt-8 !w-170" />
        </div>
        <div class="flex flex-wrap items-center justify-end gap-8">
          <a-skeleton-button
            active
            class="!w-390 max-md:!w-280 max-sm:!w-full"
          />
          <a-skeleton-input active class="!w-220 max-sm:!w-full" />
        </div>
      </div>
      <div class="border-b-1 border-b-solid border-color-2 px-18 pt-12">
        <div class="flex items-center gap-20">
          <a-skeleton-input active size="small" class="!w-58" />
          <a-skeleton-input active size="small" class="!w-58" />
        </div>
      </div>
      <div class="h-360 p-12 max-md:h-300">
        <div class="h-full flex items-end gap-10">
          <div
            v-for="item in chartBars"
            :key="item"
            class="flex-1 rounded-t-8 bg-fill-tertiary"
            :style="{ height: `${item}%` }"
          />
        </div>
      </div>
    </section>

    <div
      class="grid grid-cols-1 gap-12 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_400px]"
    >
      <main class="min-w-0 flex flex-col gap-12">
        <section
          class="overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container shadow-[var(--w-shadow-card)]"
        >
          <div class="flex items-center gap-10 px-14 py-12">
            <a-skeleton-avatar active shape="square" size="small" />
            <div class="min-w-0">
              <a-skeleton-input active size="small" class="!w-84" />
              <a-skeleton-input active size="small" class="!mt-6 !w-130" />
            </div>
          </div>
          <div class="h-320 p-12 max-md:h-260">
            <div class="h-full rounded-8 bg-fill-secondary" />
          </div>
        </section>

        <section
          class="overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container shadow-[var(--w-shadow-card)]"
        >
          <div class="flex items-center gap-10 px-14 py-12">
            <a-skeleton-avatar active shape="square" size="small" />
            <div class="min-w-0">
              <a-skeleton-input active size="small" class="!w-84" />
              <a-skeleton-input active size="small" class="!mt-6 !w-130" />
            </div>
          </div>
          <div class="h-520 p-12 max-md:h-360">
            <div class="h-full rounded-8 bg-fill-secondary" />
          </div>
        </section>
      </main>

      <aside class="min-w-0 flex flex-col gap-12">
        <section
          class="overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container shadow-[var(--w-shadow-card)]"
        >
          <div class="flex items-center gap-10 px-14 py-12">
            <a-skeleton-avatar active shape="square" size="small" />
            <div class="min-w-0">
              <a-skeleton-input active size="small" class="!w-84" />
              <a-skeleton-input active size="small" class="!mt-6 !w-120" />
            </div>
          </div>
          <div class="h-320 p-12 max-md:h-280">
            <div class="mx-auto size-230 rounded-999 bg-fill-secondary" />
          </div>
        </section>

        <section
          class="overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container p-14 shadow-[var(--w-shadow-card)]"
        >
          <div class="mb-14 flex items-center gap-10">
            <a-skeleton-avatar active shape="square" size="small" />
            <div>
              <a-skeleton-input active size="small" class="!w-84" />
              <a-skeleton-input active size="small" class="!mt-6 !w-118" />
            </div>
          </div>
          <div class="flex flex-col gap-12">
            <div
              v-for="item in rankingRows"
              :key="item"
              class="rounded-8 bg-container-secondary p-10"
            >
              <div class="mb-8 flex items-center gap-10">
                <a-skeleton-avatar active size="small" />
                <a-skeleton-input active size="small" class="!flex-1" />
                <a-skeleton-input active size="small" class="!w-38" />
              </div>
              <div class="h-6 overflow-hidden rounded-999 bg-fill-secondary">
                <div
                  class="h-full rounded-999 bg-fill-tertiary"
                  :style="{ width: `${item}%` }"
                />
              </div>
            </div>
          </div>
        </section>
      </aside>
    </div>
  </div>
</template>
