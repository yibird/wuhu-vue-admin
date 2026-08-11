<script setup lang="ts">
import { shallowRef } from 'vue'
import dayjs from 'dayjs'
import { DatePicker, DateRangePicker } from '@/components/datePicker'
import { Scrollbar } from '@/components/scrollbar'
import type { Dayjs } from 'dayjs'

const selectedDate = shallowRef<Dayjs>(dayjs())
const selectedRange = shallowRef<[Dayjs, Dayjs]>([
  dayjs().startOf('week'),
  dayjs().endOf('week'),
])
</script>

<template>
  <WView :full="true" :padding="false" class="bg-page">
    <Scrollbar class="h-full" content-class="min-h-full p-16 md:p-20">
      <section
        class="mx-auto max-w-1280 rounded-8 border-1 border-color-1 border-solid bg-container p-16 shadow-all-sm md:p-20"
      >
        <header
          class="mb-16 flex flex-wrap items-start justify-between gap-12 border-b-1 border-color-1 border-b-solid pb-14"
        >
          <div class="min-w-0">
            <h1 class="m-0 text-xl text-main font-600">DatePicker</h1>
            <p class="mb-0 mt-6 text-sm leading-22 text-secondary">
              内置常用日期与日期范围快捷选项。
            </p>
          </div>
          <a-tag color="blue">src/components/datePicker</a-tag>
        </header>

        <div class="grid max-w-720 gap-18 sm:grid-cols-2">
          <div>
            <label class="mb-7 block text-sm text-main font-500"
              >业务日期</label
            >
            <DatePicker v-model:value="selectedDate" class="w-full" />
            <p class="mb-0 mt-7 text-xs text-muted">
              {{ selectedDate?.format('YYYY-MM-DD') }}
            </p>
          </div>
          <div>
            <label class="mb-7 block text-sm text-main font-500"
              >统计周期</label
            >
            <DateRangePicker v-model:value="selectedRange" class="w-full" />
            <p class="mb-0 mt-7 text-xs text-muted">
              {{
                selectedRange?.map((item) => item.format('MM-DD')).join(' 至 ')
              }}
            </p>
          </div>
        </div>
      </section>
    </Scrollbar>
  </WView>
</template>
