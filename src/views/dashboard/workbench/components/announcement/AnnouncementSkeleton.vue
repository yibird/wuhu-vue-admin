<template>
  <section data-swapy-slot="announcement" class="min-w-0" aria-busy="true">
    <a-card
      :styles="{ body: { padding: '12px' } }"
      data-swapy-item="announcement"
    >
      <template #title>
        <a-skeleton-input active class="!w-128" />
      </template>
      <template #extra>
        <a-skeleton-button active size="small" />
      </template>
      <div class="flex flex-col gap-5">
        <div
          v-for="item in 4"
          :key="item"
          class="min-h-82 flex gap-10 px-8 py-10"
        >
          <a-skeleton-avatar active :size="32" class="shrink-0" />
          <div class="min-w-0 flex-1">
            <a-skeleton-input active size="small" class="!w-160" />
            <a-skeleton-input active size="small" class="mt-4 !w-full" />
            <div class="mt-7 flex gap-7">
              <a-skeleton-input active size="small" class="!w-44" />
              <a-skeleton-input active size="small" class="!w-76" />
            </div>
          </div>
        </div>
      </div>
      <div
        class="border-color-2 border-t-1 border-t-solid px-12 py-10 text-center"
      >
        <a-skeleton-input active size="small" class="!w-120" />
      </div>
    </a-card>
  </section>
</template>
