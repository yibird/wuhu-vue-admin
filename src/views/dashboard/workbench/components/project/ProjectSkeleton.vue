<template>
  <section data-swapy-slot="project" class="min-w-0" aria-busy="true">
    <a-card :styles="{ body: { padding: 0 } }" data-swapy-item="project">
      <template #title>
        <a-skeleton-input active class="!w-148" />
      </template>
      <template #extra>
        <a-skeleton-button active size="small" />
      </template>
      <div class="grid grid-cols-1 gap-10 p-20 xl:grid-cols-2">
        <article
          v-for="item in 4"
          :key="item"
          class="min-h-190 min-w-0 rounded-8 border-1 border-color-2 border-solid p-14"
        >
          <div class="flex items-start gap-10">
            <a-skeleton-avatar active :size="46" class="shrink-0" />
            <div class="min-w-0 flex-1">
              <a-skeleton-input active class="!w-120" />
              <a-skeleton
                active
                class="mt-5"
                :title="false"
                :paragraph="{ rows: 2 }"
              />
            </div>
          </div>
          <a-skeleton-input active class="mt-16 !h-7 !w-full" />
          <div class="mt-14 flex justify-between gap-12">
            <a-skeleton-input active size="small" class="!w-112" />
            <a-skeleton-input active size="small" class="!w-88" />
          </div>
          <div class="mt-14 flex justify-between gap-12">
            <div class="flex gap-3">
              <a-skeleton-avatar
                v-for="member in 3"
                :key="member"
                active
                :size="28"
              />
            </div>
            <a-skeleton-input active size="small" class="!w-92" />
          </div>
        </article>
      </div>
    </a-card>
  </section>
</template>
