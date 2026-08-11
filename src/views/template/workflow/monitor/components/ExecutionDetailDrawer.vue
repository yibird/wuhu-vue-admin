<script setup lang="ts">
import { computed } from 'vue'
import { useClipboard } from '@vueuse/core'
import { message } from 'antdv-next'
import {
  workflowRunStatusMeta,
  workflowStepStatusMeta,
} from '../../management/meta'
import type { WorkflowRunInstance } from '../../management/types'

const props = defineProps<{
  instance?: WorkflowRunInstance
}>()

const emit = defineEmits<{
  retry: [id: string]
  terminate: [id: string]
}>()

const open = defineModel<boolean>('open', { required: true })
const { copy, isSupported } = useClipboard({ legacy: true })
const statusMeta = computed(() =>
  props.instance ? workflowRunStatusMeta[props.instance.status] : undefined
)

async function copyTraceId() {
  if (!props.instance || !isSupported.value) {
    message.warning('当前环境不支持复制')
    return
  }
  await copy(props.instance.traceId)
  message.success('Trace ID 已复制')
}
</script>

<template>
  <a-drawer
    v-model:open="open"
    :destroy-on-hidden="true"
    :mask="false"
    :size="620"
    placement="right"
  >
    <template #title>
      <div v-if="instance" class="min-w-0 pr-10">
        <div class="flex flex-wrap items-center gap-7">
          <span class="truncate text-md text-main font-650">{{
            instance.id
          }}</span>
          <a-tag :bordered="false" :color="statusMeta?.color">
            {{ statusMeta?.label }}
          </a-tag>
        </div>
        <div class="mt-3 truncate text-xs text-secondary">
          {{ instance.workflowName }} · {{ instance.version }}
        </div>
      </div>
    </template>

    <template #extra>
      <div v-if="instance" class="flex items-center gap-5">
        <a-button
          v-if="['failed', 'terminated'].includes(instance.status)"
          size="small"
          @click="emit('retry', instance.id)"
        >
          <template #icon>
            <Icon name="i-lucide:rotate-ccw" />
          </template>
          重新执行
        </a-button>
        <a-popconfirm
          v-if="['running', 'suspended'].includes(instance.status)"
          title="终止执行实例"
          description="终止后当前节点不会继续执行。"
          ok-text="终止"
          ok-type="danger"
          cancel-text="取消"
          @confirm="emit('terminate', instance.id)"
        >
          <a-button danger size="small">
            <template #icon>
              <Icon name="i-lucide:square" />
            </template>
            终止
          </a-button>
        </a-popconfirm>
      </div>
    </template>

    <div v-if="instance" class="flex flex-col gap-16">
      <section>
        <div class="mb-9 flex items-center justify-between gap-8">
          <h3 class="m-0 text-sm text-main font-650">执行概览</h3>
          <span class="text-xs text-secondary"
            >进度 {{ instance.progress }}%</span
          >
        </div>
        <a-progress
          :percent="instance.progress"
          :status="instance.status === 'failed' ? 'exception' : 'normal'"
        />
        <div
          class="mt-12 grid grid-cols-2 gap-x-18 gap-y-12 max-sm:grid-cols-1"
        >
          <div>
            <div class="text-xs text-secondary">当前节点</div>
            <div class="mt-3 text-sm text-main">{{ instance.currentNode }}</div>
          </div>
          <div>
            <div class="text-xs text-secondary">执行耗时</div>
            <div class="mt-3 text-sm text-main">{{ instance.duration }}</div>
          </div>
          <div>
            <div class="text-xs text-secondary">触发方式</div>
            <div class="mt-3 text-sm text-main">
              {{ instance.trigger }} · {{ instance.initiator }}
            </div>
          </div>
          <div>
            <div class="text-xs text-secondary">运行环境</div>
            <div class="mt-3 text-sm text-main">
              {{
                instance.environment === 'production' ? '生产环境' : '预发环境'
              }}
            </div>
          </div>
          <div>
            <div class="text-xs text-secondary">开始时间</div>
            <div class="mt-3 text-sm text-main">{{ instance.startedAt }}</div>
          </div>
          <div>
            <div class="text-xs text-secondary">重试次数</div>
            <div class="mt-3 text-sm text-main">{{ instance.retries }} 次</div>
          </div>
        </div>
      </section>

      <a-divider class="my-0!" />

      <section>
        <h3 class="m-0 mb-11 text-sm text-main font-650">节点执行轨迹</h3>
        <ol class="m-0 list-none p-0">
          <li
            v-for="(step, index) in instance.steps"
            :key="step.id"
            class="relative flex gap-10 pb-14 last:pb-0"
          >
            <span
              v-if="index < instance.steps.length - 1"
              class="absolute left-14 top-28 h-[calc(100%-18px)] w-1 bg-fill-secondary"
            ></span>
            <span
              class="relative z-1 size-29 flex flex-none items-center justify-center rounded-full border-1 border-color-2 border-solid bg-container"
              :class="[
                step.status === 'success'
                  ? 'text-success'
                  : step.status === 'failed'
                    ? 'text-error'
                    : step.status === 'running'
                      ? 'text-primary'
                      : 'text-secondary',
              ]"
            >
              <Icon
                :name="workflowStepStatusMeta[step.status].icon"
                :class="{ 'animate-spin': step.status === 'running' }"
                :size="14"
              />
            </span>
            <div
              class="min-w-0 flex-1 rounded-6 bg-fill-quaternary/50 px-10 py-8"
            >
              <div class="flex flex-wrap items-center justify-between gap-6">
                <div class="flex min-w-0 items-center gap-6">
                  <strong class="truncate text-xs text-main font-650">
                    {{ step.name }}
                  </strong>
                  <a-tag :bordered="false">{{ step.type }}</a-tag>
                </div>
                <span class="flex-none text-xs text-secondary">
                  {{ step.duration || '-' }}
                </span>
              </div>
              <p class="m-0 mt-5 text-xs text-regular leading-18px">
                {{ step.detail }}
              </p>
            </div>
          </li>
        </ol>
      </section>

      <a-divider class="my-0!" />

      <section>
        <h3 class="m-0 mb-9 text-sm text-main font-650">链路信息</h3>
        <div
          class="flex items-center gap-8 rounded-6 bg-fill-quaternary/60 px-10 py-9"
        >
          <Icon name="i-lucide:fingerprint" class="text-secondary" />
          <code class="min-w-0 flex-1 truncate text-xs text-main">
            {{ instance.traceId }}
          </code>
          <a-tooltip title="复制 Trace ID">
            <a-button
              type="text"
              size="small"
              aria-label="复制 Trace ID"
              @click="copyTraceId"
            >
              <template #icon>
                <Icon name="i-lucide:copy" />
              </template>
            </a-button>
          </a-tooltip>
        </div>
      </section>
    </div>
  </a-drawer>
</template>
