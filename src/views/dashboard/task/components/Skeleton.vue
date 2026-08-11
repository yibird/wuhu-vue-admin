<script setup lang="ts">
import type { ScrollbarProps } from '@/components'

const taskGroupScrollbarOptions = {
  overflow: { x: 'hidden', y: 'scroll' },
} satisfies ScrollbarProps['options']
</script>

<template>
  <div
    class="box-border full min-h-0 min-w-0 overflow-hidden flex flex-col gap-10"
  >
    <div
      class="min-w-0 shrink-0 flex flex-wrap items-center justify-between gap-12 rounded-4 bg-container p-12"
    >
      <div class="min-w-0 max-w-full flex flex-wrap items-center gap-8">
        <a-skeleton-button active class="max-w-full !w-92" />
        <a-skeleton-button active size="small" class="max-w-full !w-90" />
        <a-skeleton-button active size="small" class="max-w-full !w-86" />
      </div>

      <div
        class="min-w-0 max-w-full flex flex-1 flex-wrap items-center justify-end gap-10 max-sm:w-full"
      >
        <a-skeleton-input active class="max-w-full !w-220 max-sm:!w-full" />
        <a-skeleton-input active class="max-w-full !w-130 max-sm:!w-full" />
        <a-skeleton-button active class="max-w-full !w-168" />
      </div>
    </div>

    <div
      class="grid min-h-0 flex-1 grid-cols-1 gap-10 overflow-y-auto md:grid-cols-3 xl:grid-cols-4 xl:overflow-hidden 2xl:grid-cols-6"
    >
      <div
        v-for="group in 4"
        :key="group"
        class="min-h-0 min-w-0 xl:max-h-full xl:overflow-hidden"
      >
        <div
          class="max-h-full min-h-0 flex flex-col overflow-hidden rounded-4 bg-container"
        >
          <div
            class="min-w-0 shrink-0 flex items-center justify-between gap-10 p-10"
          >
            <a-skeleton-button active size="small" class="max-w-full !w-74" />
            <a-skeleton-input active size="small" class="max-w-full !w-64" />
          </div>
          <Scrollbar
            class="min-w-0 flex-1 overflow-hidden"
            :options="taskGroupScrollbarOptions"
          >
            <div class="relative min-h-200 p-10 flex flex-col gap-10">
              <div
                v-for="item in group === 4 ? 2 : 3"
                :key="item"
                class="min-w-0 shrink-0 rounded-6 border-1 border-color-2 border-solid bg-container"
              >
                <div class="p-10 pb-6">
                  <div class="min-w-0 flex items-start justify-between gap-8">
                    <a-skeleton-input
                      active
                      size="small"
                      class="max-w-full !w-136"
                    />
                    <a-skeleton-button
                      active
                      size="small"
                      class="shrink-0 !w-54"
                    />
                  </div>
                </div>

                <div class="px-10">
                  <a-skeleton
                    active
                    :title="false"
                    :paragraph="{ rows: 2, width: ['92%', '68%'] }"
                  />
                </div>

                <div
                  class="my-10 px-10 flex items-center justify-between gap-8"
                >
                  <div class="min-w-0 flex items-center gap-8">
                    <a-skeleton-avatar active size="small" />
                    <div class="min-w-0 flex flex-col gap-4">
                      <a-skeleton-input
                        active
                        size="small"
                        class="max-w-full !w-72"
                      />
                      <a-skeleton-input
                        active
                        size="small"
                        class="max-w-full !w-56"
                      />
                    </div>
                  </div>
                  <a-skeleton-input
                    active
                    size="small"
                    class="shrink-0 !w-52"
                  />
                </div>

                <div
                  class="p-10 flex items-center border-t-1 border-t-solid border-color-2"
                >
                  <a-skeleton-input
                    active
                    size="small"
                    class="flex-1 !w-full"
                  />
                  <a-divider vertical />
                  <a-skeleton-input
                    active
                    size="small"
                    class="flex-1 !w-full"
                  />
                  <a-divider vertical />
                  <a-skeleton-input
                    active
                    size="small"
                    class="flex-1 !w-full"
                  />
                </div>
              </div>
            </div>
          </Scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>
