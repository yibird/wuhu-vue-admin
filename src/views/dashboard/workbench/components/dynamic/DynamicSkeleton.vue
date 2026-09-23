<template>
  <section data-swapy-slot="dynamic" class="min-w-0" aria-busy="true">
    <a-card :styles="{ body: { padding: 0 } }" data-swapy-item="dynamic">
      <template #title>
        <a-skeleton-input active class="!w-88" />
      </template>
      <template #extra>
        <a-skeleton-button active size="small" />
      </template>
      <div class="flex flex-col p-20">
        <div
          v-for="item in 4"
          :key="item"
          class="min-h-86 flex gap-20 px-8 py-12"
        >
          <a-skeleton-avatar active :size="34" class="shrink-0" />
          <div class="min-w-0 flex-1">
            <a-skeleton-input active size="small" class="!w-180" />
            <a-skeleton
              active
              class="mt-5"
              :title="false"
              :paragraph="{ rows: 1 }"
            />
            <a-skeleton-input active size="small" class="mt-7 !w-72" />
          </div>
        </div>
      </div>
    </a-card>
  </section>
</template>
