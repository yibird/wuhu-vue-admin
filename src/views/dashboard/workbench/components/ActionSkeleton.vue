<template>
  <section data-swapy-slot="action" class="min-w-0" aria-busy="true">
    <a-card :styles="{ body: { padding: 0 } }" data-swapy-item="action">
      <template #title>
        <a-skeleton-input active class="!w-88" />
      </template>
      <template #extra>
        <a-skeleton-button active size="small" />
      </template>
      <div class="grid grid-cols-2 gap-8 p-20 lg:grid-cols-3 xl:grid-cols-4">
        <div
          v-for="item in 6"
          :key="item"
          class="min-h-105 min-w-0 rounded-8 border-1 border-color-2 border-solid p-12"
        >
          <a-skeleton-avatar active :size="34" />
          <a-skeleton-input active class="mt-10 !w-84" />
          <a-skeleton-input active size="small" class="mt-4 !w-full" />
        </div>
      </div>
    </a-card>
  </section>
</template>
