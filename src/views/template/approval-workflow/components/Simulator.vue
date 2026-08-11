<script setup lang="ts">
import { APPROVAL_WORKFLOW_SELECTORS } from '../constants'
import type {
  ApprovalSimulationInput,
  ApprovalSimulationStep,
  ApprovalValidationIssue,
} from '../types'

const input = defineModel<ApprovalSimulationInput>('input', { required: true })

defineProps<{
  issues: readonly ApprovalValidationIssue[]
  steps: readonly ApprovalSimulationStep[]
}>()

const emit = defineEmits<{
  run: []
  validate: []
}>()
</script>

<template>
  <section
    class="min-h-0 min-w-0 grid grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container shadow-[var(--w-shadow-card)]"
    :data-testid="APPROVAL_WORKFLOW_SELECTORS.simulator"
  >
    <header class="border-b border-color-2 px-12 py-10">
      <h2 class="m-0 text-14px font-800 text-primary">模拟与校验</h2>
      <p class="m-0 mt-3 text-12px text-secondary">
        用发起数据跑出命中路径，发布前检查阻塞项
      </p>
    </header>

    <Scrollbar class="min-h-0" content-class="p-10">
      <div class="mb-12 grid gap-8 rounded-7 bg-fill/45 p-10">
        <div class="grid grid-cols-2 gap-8">
          <label class="block text-12px text-secondary">
            报销金额
            <input
              v-model.number="input.amount"
              class="mt-5 h-30 w-full rounded-6 border-1 border-color-2 border-solid bg-fill px-8 text-13px text-primary outline-none focus:border-primary"
              type="number"
            />
          </label>
          <label class="block text-12px text-secondary">
            请假天数
            <input
              v-model.number="input.leaveDays"
              class="mt-5 h-30 w-full rounded-6 border-1 border-color-2 border-solid bg-fill px-8 text-13px text-primary outline-none focus:border-primary"
              type="number"
            />
          </label>
        </div>
        <div class="grid grid-cols-2 gap-8">
          <label class="block text-12px text-secondary">
            申请人
            <input
              v-model="input.applicant"
              class="mt-5 h-30 w-full rounded-6 border-1 border-color-2 border-solid bg-fill px-8 text-13px text-primary outline-none focus:border-primary"
            />
          </label>
          <label class="block text-12px text-secondary">
            部门
            <input
              v-model="input.department"
              class="mt-5 h-30 w-full rounded-6 border-1 border-color-2 border-solid bg-fill px-8 text-13px text-primary outline-none focus:border-primary"
            />
          </label>
        </div>
        <div class="flex gap-8">
          <button
            class="h-30 flex-1 inline-flex items-center justify-center gap-6 rounded-6 border-0 bg-primary text-12px text-white"
            type="button"
            @click="emit('run')"
          >
            <Icon name="i-lucide:play" :size="14" />
            模拟
          </button>
          <button
            class="h-30 flex-1 inline-flex items-center justify-center gap-6 rounded-6 border-1 border-color-2 border-solid bg-container text-12px text-regular hover:bg-hover"
            type="button"
            @click="emit('validate')"
          >
            <Icon name="i-lucide:shield-check" :size="14" />
            校验
          </button>
        </div>
      </div>

      <div v-if="issues.length" class="mb-12">
        <h3 class="m-0 mb-7 text-12px font-700 text-primary">校验结果</h3>
        <div
          v-for="issue in issues"
          :key="issue.id"
          class="mb-7 rounded-7 p-9"
          :class="
            issue.level === 'error'
              ? 'bg-error/10 text-error'
              : issue.level === 'warning'
                ? 'bg-warning/10 text-warning'
                : 'bg-success/10 text-success'
          "
        >
          <strong class="block text-12px">{{ issue.title }}</strong>
          <p class="m-0 mt-3 text-11px leading-16px opacity-82">
            {{ issue.description }}
          </p>
        </div>
      </div>

      <h3 class="m-0 mb-7 text-12px font-700 text-primary">模拟路径</h3>
      <div
        v-if="!steps.length"
        class="rounded-7 bg-fill p-12 text-center text-12px text-secondary"
      >
        点击“模拟”查看审批路径。
      </div>
      <div v-else>
        <div
          v-for="step in steps"
          :key="`${step.nodeId}-${step.title}`"
          class="mb-8 grid grid-cols-[24px_minmax(0,1fr)] gap-8"
        >
          <span
            class="size-24 flex items-center justify-center rounded-full"
            :class="
              step.status === 'passed'
                ? 'bg-success/12 text-success'
                : 'bg-warning/12 text-warning'
            "
          >
            <Icon
              :name="
                step.status === 'passed' ? 'i-lucide:check' : 'i-lucide:clock'
              "
              :size="13"
            />
          </span>
          <span class="min-w-0">
            <strong class="block truncate text-12px text-primary">{{
              step.title
            }}</strong>
            <small class="mt-2 block line-clamp-2 text-11px text-secondary">
              {{ step.actor }} · {{ step.reason }}
            </small>
          </span>
        </div>
      </div>
    </Scrollbar>
  </section>
</template>
