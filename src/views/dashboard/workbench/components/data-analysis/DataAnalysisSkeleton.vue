<template>
  <section data-swapy-slot="analysis" class="min-w-0" aria-busy="true">
    <a-card :styles="{ body: { padding: 0 } }" data-swapy-item="analysis">
      <template #title>
        <a-skeleton-input active class="!w-88" />
      </template>
      <div class="p-20">
        <div class="grid grid-cols-2 gap-8">
          <div
            v-for="item in 2"
            :key="item"
            class="rounded-8 bg-fill-tertiary p-10"
          >
            <a-skeleton-input active size="small" class="!w-84" />
            <a-skeleton-input active class="mt-6 !w-72" />
            <a-skeleton-input active size="small" class="mt-4 !w-56" />
          </div>
        </div>
        <div class="mt-16">
          <div class="mb-10 flex justify-between gap-10">
            <a-skeleton-input active size="small" class="!w-104" />
            <a-skeleton-input active size="small" class="!w-76" />
          </div>
          <div class="flex flex-col gap-10">
            <div v-for="item in 4" :key="item">
              <div class="mb-5 flex justify-between gap-8">
                <a-skeleton-input active size="small" class="!w-72" />
                <a-skeleton-input active size="small" class="!w-40" />
              </div>
              <a-skeleton-input active class="!h-7 !w-full" />
            </div>
          </div>
        </div>
        <div
          class="mt-16 flex items-center gap-8 rounded-8 border-1 border-color-2 border-solid p-12"
        >
          <a-skeleton-avatar active size="small" />
          <div class="min-w-0 flex-1">
            <a-skeleton-input active size="small" class="!w-72" />
            <a-skeleton-input active size="small" class="mt-4 !w-180" />
          </div>
        </div>
      </div>
    </a-card>
  </section>
</template>
