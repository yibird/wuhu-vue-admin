<script setup lang="ts">
type SkeletonVariant = 'trend' | 'chart' | 'pie' | 'funnel' | 'ranking'

const props = withDefaults(
  defineProps<{
    minHeight: number
    variant?: SkeletonVariant
  }>(),
  {
    variant: 'chart',
  }
)

const chartBars = [42, 58, 48, 72, 54, 84, 64, 76, 50, 68, 56, 78]
const funnelStages = [100, 72, 48, 28]
const rankingRows = Array.from({ length: 8 }, (_, index) => 92 - index * 4)
</script>

<template>
  <div
    class="analysis-block-skeleton flex flex-col overflow-hidden rounded-8 border-1 border-solid border-color-2 bg-container shadow-[var(--w-shadow-card)]"
    :style="{ minHeight: `${props.minHeight}px` }"
    aria-hidden="true"
  >
    <div
      :class="[
        'flex flex-wrap items-center justify-between gap-12 border-b-1 border-b-solid border-color-2 px-14 sm:px-18',
        props.variant === 'trend' ? 'min-h-59 py-12' : 'h-52',
      ]"
    >
      <div v-if="props.variant === 'trend'" class="min-w-0">
        <div
          class="h-14 w-84 rounded-4 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
        />
        <div
          class="mt-5 h-10 w-170 rounded-4 bg-fill-secondary animate-pulse motion-reduce:animate-none"
        />
      </div>
      <div v-else class="min-w-0 flex items-center gap-10">
        <div
          class="size-30 shrink-0 rounded-8 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
        />
        <div class="min-w-0">
          <div
            class="h-14 w-84 rounded-4 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
          />
          <div
            class="mt-5 h-10 w-130 rounded-4 bg-fill-secondary animate-pulse motion-reduce:animate-none"
          />
        </div>
      </div>

      <div
        v-if="props.variant === 'trend'"
        class="min-w-0 flex flex-wrap items-center justify-end gap-8"
      >
        <div class="flex items-center">
          <div
            v-for="item in 6"
            :key="item"
            class="h-32 w-54 border-1 border-color-2 border-solid bg-fill-1 animate-pulse motion-reduce:animate-none first:rounded-l-4 last:rounded-r-4"
          />
        </div>
        <div
          class="h-32 w-220 rounded-4 bg-fill-1 animate-pulse motion-reduce:animate-none"
        />
      </div>
    </div>

    <template v-if="props.variant === 'trend'">
      <div
        class="h-46 flex shrink-0 items-center gap-20 border-b-1 border-color-2 border-b-solid px-18"
      >
        <div
          class="relative h-46 w-58 pt-15 text-center after:absolute after:bottom-0 after:left-0 after:h-2 after:w-full after:rounded-999 after:bg-fill-tertiary"
        >
          <div
            class="mx-auto h-12 w-40 rounded-4 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
          />
        </div>
        <div
          class="h-12 w-58 rounded-4 bg-fill-secondary animate-pulse motion-reduce:animate-none"
        />
      </div>
      <div class="h-360 p-12 max-md:h-300">
        <div class="relative h-full overflow-hidden rounded-6 bg-fill-1 p-12">
          <div
            v-for="item in 4"
            :key="item"
            class="absolute left-12 right-12 border-t-1 border-color-2 border-t-solid"
            :style="{ top: `${item * 20}%` }"
          />
          <div class="relative h-full flex items-end gap-8 pt-12">
            <div
              v-for="height in chartBars"
              :key="height"
              class="flex-1 rounded-t-6 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
              :style="{ height: `${height}%` }"
            />
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="props.variant === 'chart' || props.variant === 'pie'">
      <div
        :class="[
          'p-12',
          props.variant === 'pie' ? 'h-427 max-md:h-327' : 'h-427 max-md:h-307',
        ]"
      >
        <div class="relative h-full overflow-hidden rounded-6 bg-fill-1 p-12">
          <div
            v-for="item in 4"
            :key="item"
            class="absolute left-12 right-12 border-t-1 border-color-2 border-t-solid"
            :style="{ top: `${item * 20}%` }"
          />
          <div
            class="absolute bottom-42 left-12 right-12 h-120 rounded-[50%] bg-fill-secondary/60 blur-8 animate-pulse motion-reduce:animate-none"
          />
        </div>
      </div>
    </template>

    <template v-else-if="props.variant === 'funnel'">
      <div
        class="grid flex-1 grid-cols-1 gap-16 p-14 sm:p-16 2xl:grid-cols-[minmax(0,1fr)_260px]"
      >
        <div class="min-w-0">
          <div class="mb-14 flex items-end justify-between gap-12">
            <div class="min-w-0">
              <div
                class="h-14 w-130 rounded-4 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
              />
              <div
                class="mt-5 h-10 w-220 rounded-4 bg-fill-secondary animate-pulse motion-reduce:animate-none"
              />
            </div>
            <div class="shrink-0 text-right">
              <div
                class="h-28 w-70 rounded-4 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
              />
              <div
                class="mt-4 h-10 w-70 rounded-4 bg-fill-secondary animate-pulse motion-reduce:animate-none"
              />
            </div>
          </div>
          <div class="flex flex-col gap-6">
            <div
              v-for="rate in funnelStages"
              :key="rate"
              class="rounded-8 px-6 py-10"
            >
              <div class="mb-9 flex items-center justify-between gap-10">
                <div class="min-w-0 flex items-center gap-9">
                  <div
                    class="size-28 shrink-0 rounded-999 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
                  />
                  <div class="min-w-0">
                    <div
                      class="h-14 w-84 rounded-4 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
                    />
                    <div
                      class="mt-4 h-10 w-70 rounded-4 bg-fill-secondary animate-pulse motion-reduce:animate-none"
                    />
                  </div>
                </div>
                <div class="shrink-0 text-right">
                  <div
                    class="h-16 w-40 rounded-4 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
                  />
                  <div
                    class="mt-4 h-10 w-48 rounded-4 bg-fill-secondary animate-pulse motion-reduce:animate-none"
                  />
                </div>
              </div>
              <div class="h-22 overflow-hidden rounded-6 bg-fill-tertiary">
                <div
                  class="h-full rounded-6 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
                  :style="{ width: `${rate}%` }"
                />
              </div>
            </div>
          </div>
        </div>
        <aside class="min-w-0">
          <div class="h-124 rounded-10 bg-fill-secondary p-12">
            <div class="flex items-center justify-between gap-8">
              <div
                class="h-12 w-70 rounded-4 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
              />
              <div
                class="size-28 rounded-8 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
              />
            </div>
            <div
              class="mt-12 h-28 w-100 rounded-4 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
            />
            <div
              class="mt-6 h-10 w-180 rounded-4 bg-fill-secondary animate-pulse motion-reduce:animate-none"
            />
            <div class="mt-12 flex items-center justify-between gap-8">
              <div
                class="h-10 w-70 rounded-4 bg-fill-secondary animate-pulse motion-reduce:animate-none"
              />
              <div
                class="h-12 w-40 rounded-4 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
              />
            </div>
            <div class="mt-6 h-6 rounded-999 bg-fill-tertiary" />
          </div>
          <div class="mt-14 flex items-center justify-between gap-8 px-2">
            <div
              class="h-14 w-70 rounded-4 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
            />
            <div
              class="h-10 w-58 rounded-4 bg-fill-secondary animate-pulse motion-reduce:animate-none"
            />
          </div>
          <div class="mt-6 flex flex-col gap-6">
            <div
              v-for="item in 3"
              :key="item"
              class="flex items-start gap-10 rounded-8 px-6 py-10"
            >
              <div
                class="size-32 shrink-0 rounded-8 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
              />
              <div class="min-w-0">
                <div
                  class="h-10 w-58 rounded-4 bg-fill-secondary animate-pulse motion-reduce:animate-none"
                />
                <div
                  class="mt-5 h-18 w-70 rounded-4 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
                />
                <div
                  class="mt-4 h-10 w-100 rounded-4 bg-fill-secondary animate-pulse motion-reduce:animate-none"
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </template>

    <template v-else>
      <div class="p-14 sm:p-16">
        <div class="h-124 rounded-10 bg-fill-secondary p-12">
          <div class="flex items-start justify-between gap-10">
            <div class="min-w-0">
              <div class="flex items-center gap-7">
                <div
                  class="size-26 rounded-8 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
                />
                <div
                  class="h-12 w-70 rounded-4 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
                />
              </div>
              <div
                class="mt-10 h-18 w-130 rounded-4 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
              />
              <div class="mt-5 flex items-center gap-6">
                <div
                  class="h-10 w-58 rounded-4 bg-fill-secondary animate-pulse motion-reduce:animate-none"
                />
                <div
                  class="h-10 w-58 rounded-4 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
                />
              </div>
            </div>
            <div class="shrink-0 text-right">
              <div
                class="h-28 w-70 rounded-4 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
              />
              <div
                class="mt-4 h-10 w-58 rounded-4 bg-fill-secondary animate-pulse motion-reduce:animate-none"
              />
            </div>
          </div>
          <div class="mt-12 h-7 rounded-999 bg-fill-tertiary" />
        </div>
        <div class="mt-10 flex flex-col">
          <div
            v-for="rank in rankingRows"
            :key="rank"
            class="h-48 flex items-center gap-10 rounded-8 px-6 py-9"
          >
            <div
              class="size-26 shrink-0 rounded-8 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
            />
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-8">
                <div
                  class="h-14 flex-1 rounded-4 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
                />
                <div
                  class="h-14 w-40 rounded-4 bg-fill-secondary animate-pulse motion-reduce:animate-none"
                />
              </div>
              <div class="mt-7 h-5 rounded-999 bg-fill-secondary">
                <div
                  class="h-full rounded-999 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
                  :style="{ width: `${rank}%` }"
                />
              </div>
            </div>
            <div
              class="h-10 w-58 shrink-0 rounded-4 bg-fill-secondary animate-pulse motion-reduce:animate-none"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
