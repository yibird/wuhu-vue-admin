<template>
  <div class="flex min-h-full flex-col gap-12">
    <section
      class="rounded-8 border-1 border-color-2 border-solid bg-container p-18 shadow-[var(--w-shadow-elevated)]"
    >
      <div
        class="flex items-center justify-between gap-12 max-md:flex-col max-md:items-start"
      >
        <div>
          <a-skeleton-input active size="small" class="!w-96" />
          <a-skeleton-input active class="!mt-10 !w-220" />
          <a-skeleton-input active size="small" class="!mt-8 !w-180" />
        </div>
        <div class="flex flex-wrap gap-8">
          <a-skeleton-button active class="!w-92" />
          <a-skeleton-button active class="!w-72" />
          <a-skeleton-button active class="!w-104" />
        </div>
      </div>
    </section>

    <div class="grid grid-cols-4 gap-12 max-lg:grid-cols-2 max-sm:grid-cols-1">
      <div
        v-for="item in 4"
        :key="item"
        class="rounded-8 border-1 border-color-2 border-solid bg-container p-14"
      >
        <a-skeleton-avatar active shape="square" size="small" />
        <a-skeleton-input active class="!mt-12 !w-76" />
        <a-skeleton-input active size="small" class="!mt-8 !w-130" />
      </div>
    </div>

    <div
      class="grid flex-1 grid-cols-[minmax(0,1fr)_320px] gap-12 max-[1100px]:grid-cols-1"
    >
      <section
        class="min-h-560 rounded-8 border-1 border-color-2 border-solid bg-container p-16"
      >
        <a-skeleton active :paragraph="{ rows: 12 }" />
      </section>
      <section
        class="min-h-560 rounded-8 border-1 border-color-2 border-solid bg-container p-16"
      >
        <a-skeleton active :paragraph="{ rows: 10 }" />
      </section>
    </div>
  </div>
</template>
