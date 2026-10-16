<template>
  <Card class="min-h-1080 2xl:min-h-595" aria-hidden="true">
    <template #title>
      <span
        class="block h-14 w-84 rounded-4 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
      />
    </template>

    <div class="grid grid-cols-1 gap-16 2xl:grid-cols-[minmax(0,1fr)_260px]">
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
            v-for="rate in stageRates"
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
                class="h-full rounded-6 bg-fill-quaternary animate-pulse motion-reduce:animate-none"
                :style="{ width: `${rate}%` }"
              />
            </div>
          </div>
        </div>
      </div>

      <aside class="min-w-0">
        <div class="rounded-10 bg-fill-secondary p-12">
          <div class="flex items-center justify-between gap-8">
            <div
              class="h-12 w-70 rounded-4 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
            />
            <div
              class="size-28 shrink-0 rounded-8 bg-fill-tertiary animate-pulse motion-reduce:animate-none"
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
            class="flex items-start gap-10 rounded-8 px-6 py-10 sm:px-10 2xl:px-6"
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
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@/components'

const stageRates = [100, 72, 48, 28]
</script>
