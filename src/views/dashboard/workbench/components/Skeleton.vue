<template>
  <div
    class="min-h-full min-w-0 w-full p-12 flex flex-col gap-12 overflow-x-hidden lg:p-16"
  >
    <section
      class="min-w-0 flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between"
    >
      <div class="min-w-0">
        <div class="flex items-center gap-8">
          <a-skeleton-input active size="small" class="!w-86" />
          <a-skeleton-input active size="small" class="!w-110" />
        </div>
        <div class="mt-10">
          <a-skeleton-input active size="small" class="!w-120" />
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-8">
        <a-skeleton-button active class="!w-92" />
        <a-skeleton-button active class="!w-92" />
        <a-skeleton-button active shape="square" />
      </div>
    </section>

    <div class="grid grid-cols-1 gap-12 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="item in 4"
        :key="item"
        class="rounded-8 border-1 border-color-2 border-solid bg-container p-14"
      >
        <div class="flex items-center justify-between gap-12">
          <a-skeleton-input active size="small" class="!w-96" />
          <a-skeleton-avatar active size="small" />
        </div>
        <div class="mt-16">
          <a-skeleton-input active class="!w-136" />
        </div>
        <a-skeleton
          active
          :title="false"
          :paragraph="{ rows: 1, width: '72%' }"
          class="mt-8"
        />
      </div>
    </div>

    <a-row :gutter="[{ xs: 0, sm: 12, md: 12, lg: 12 }, 12]">
      <a-col :xs="24" :sm="24" :md="24" :lg="16" :xl="17" :xxl="17">
        <div class="flex flex-col gap-12">
          <div
            class="rounded-8 border-1 border-color-2 border-solid bg-container p-14"
          >
            <div class="mb-14 flex items-center justify-between gap-12">
              <a-skeleton-input active size="small" class="!w-120" />
              <a-skeleton-button active size="small" class="!w-64" />
            </div>
            <a-skeleton
              active
              :title="false"
              :paragraph="{
                rows: 5,
                width: ['96%', '88%', '92%', '74%', '82%'],
              }"
            />
          </div>
          <div
            class="rounded-8 border-1 border-color-2 border-solid bg-container p-14"
          >
            <div class="mb-14 flex items-center justify-between gap-12">
              <a-skeleton-input active size="small" class="!w-120" />
              <a-skeleton-button active size="small" class="!w-64" />
            </div>
            <a-skeleton
              active
              :title="false"
              :paragraph="{
                rows: 4,
                width: ['94%', '86%', '90%', '70%'],
              }"
            />
          </div>
        </div>
      </a-col>
      <a-col :xs="24" :sm="24" :md="24" :lg="8" :xl="7" :xxl="7">
        <div class="flex flex-col gap-12">
          <div
            v-for="item in 3"
            :key="item"
            class="rounded-8 border-1 border-color-2 border-solid bg-container p-14"
          >
            <div class="mb-14 flex items-center justify-between gap-12">
              <a-skeleton-input active size="small" class="!w-116" />
              <a-skeleton-avatar active size="small" />
            </div>
            <a-skeleton
              active
              :title="false"
              :paragraph="{
                rows: item === 1 ? 3 : 4,
                width: ['92%', '78%', '86%', '64%'],
              }"
            />
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
