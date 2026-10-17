<template>
  <div class="h-full min-h-0 flex flex-col gap-12" aria-busy="true">
    <div
      class="flex items-center justify-between gap-10 rounded-4 bg-container p-12"
    >
      <div>
        <a-skeleton-input active class="!w-92" />
        <a-skeleton-input active size="small" class="mt-5 !w-240" />
      </div>
      <a-skeleton-button active class="!w-148" />
    </div>
    <div class="min-h-320 flex-1 overflow-hidden rounded-4 bg-container p-14">
      <div
        v-for="row in 7"
        :key="row"
        class="h-48 flex items-center gap-12 border-b-1 border-color-2 border-b-solid"
      >
        <a-skeleton-input active size="small" class="!w-120" />
        <div
          class="h-16 rounded-4 bg-fill-tertiary"
          :style="{ width: `${28 + row * 7}%` }"
        />
      </div>
    </div>
    <div class="h-188 rounded-4 bg-container p-14">
      <a-skeleton active :paragraph="{ rows: 5 }" />
    </div>
  </div>
</template>
