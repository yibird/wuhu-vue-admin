<script setup lang="ts">
import {
  ClientError,
  Error as ServerError,
  NotAuthorized,
  NotFound,
} from '@/components'
import { Scrollbar } from '@/components/scrollbar'

const exceptionType = shallowRef('not-found')
const exceptionOptions = [
  { label: '404', value: 'not-found' },
  { label: '403', value: 'not-authorized' },
  { label: '500', value: 'server-error' },
  { label: '客户端错误', value: 'client-error' },
]
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
            <h1 class="m-0 text-xl text-main font-600">Exception</h1>
            <p class="mb-0 mt-6 text-sm leading-22 text-secondary">
              统一 403、404、500 与客户端错误状态。
            </p>
          </div>
          <a-tag color="blue">src/components/exception</a-tag>
        </header>

        <div class="grid gap-12">
          <a-segmented
            v-model:value="exceptionType"
            :options="exceptionOptions"
          />
          <div
            class="h-460 overflow-hidden rounded-6 border-1 border-color-1 border-solid bg-page"
          >
            <NotFound
              v-if="exceptionType === 'not-found'"
              title="页面不存在"
              description="当前示例展示统一异常状态。"
            />
            <NotAuthorized v-else-if="exceptionType === 'not-authorized'" />
            <ServerError v-else-if="exceptionType === 'server-error'" />
            <ClientError v-else :error="null" :show-details="true" />
          </div>
        </div>
      </section>
    </Scrollbar>
  </WView>
</template>
