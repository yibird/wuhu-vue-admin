<template>
  <section
    class="overflow-hidden rounded-4 border-1 border-color-2 border-solid bg-container"
    aria-label="工作台概览加载中"
    aria-busy="true"
  >
    <div class="grid gap-0 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div class="min-w-0 p-16 sm:p-20">
        <div class="flex flex-col gap-14 sm:flex-row sm:items-center">
          <a-skeleton-avatar active :size="54" class="shrink-0" />
          <div class="min-w-0 flex-1">
            <a-skeleton active :title="false" :paragraph="{ rows: 2 }" />
          </div>
        </div>
        <div class="mt-18 flex flex-wrap items-center gap-8">
          <a-skeleton-button v-for="item in 3" :key="item" active />
        </div>
      </div>

      <div
        class="grid grid-cols-2 border-color-2 border-t-1 border-t-solid sm:grid-cols-4 lg:grid-cols-2 lg:border-l-1 lg:border-l-solid lg:border-t-0"
      >
        <div
          v-for="item in 4"
          :key="item"
          class="min-w-0 border-color-2 border-r-1 border-b-1 border-r-solid border-b-solid p-14"
        >
          <div class="flex items-center justify-between gap-10">
            <a-skeleton-input active size="small" class="!w-72" />
            <a-skeleton-avatar active size="small" />
          </div>
          <a-skeleton-input active class="mt-10 !w-58" />
          <a-skeleton-input active size="small" class="mt-6 !w-84" />
        </div>
      </div>
    </div>
  </section>
</template>
