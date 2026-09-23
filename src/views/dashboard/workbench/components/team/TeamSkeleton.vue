<template>
  <section data-swapy-slot="team" class="min-w-0" aria-busy="true">
    <a-card :styles="{ body: { padding: 0 } }" data-swapy-item="team">
      <template #title>
        <a-skeleton-input active class="!w-88" />
      </template>
      <template #extra>
        <a-skeleton-button active size="small" />
      </template>
      <div class="flex flex-col gap-10 p-20">
        <div
          v-for="item in 3"
          :key="item"
          class="min-h-66 flex items-start gap-10 p-10"
        >
          <a-skeleton-avatar active :size="38" class="shrink-0" />
          <div class="min-w-0 flex-1">
            <div class="flex justify-between gap-8">
              <a-skeleton-input active size="small" class="!w-104" />
              <a-skeleton-input active size="small" class="!w-64" />
            </div>
            <a-skeleton-input active size="small" class="mt-4 !w-160" />
            <a-skeleton-input active class="mt-9 !h-6 !w-full" />
          </div>
        </div>
      </div>
    </a-card>
  </section>
</template>
