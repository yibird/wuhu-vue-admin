<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import {
  getTicketPriorityMeta,
  getTicketStatusMeta,
  ticketPriorityList,
} from '../../center/data'
import type { TicketPriority, TicketRecord } from '../../center/types'
import {
  CURRENT_AGENT,
  closingReasonOptions,
  resolutionReasonOptions,
  slaStatusMeta,
  supportAgentsByTeam,
  supportTeamOptions,
  waitingReasonOptions,
} from '../data'
import type { TicketAssignment, TicketResolution } from '../types'

const props = defineProps<{
  ticket?: TicketRecord
}>()

const emit = defineEmits<{
  accept: []
  assignmentChange: [assignment: TicketAssignment]
  close: [reason: string]
  continue: []
  priorityChange: [priority: TicketPriority]
  reopen: []
  resolve: [resolution: TicketResolution]
  waiting: [reason: string]
}>()

const team = shallowRef('')
const assignee = shallowRef('')
const waitingReason = shallowRef('')
const resolutionReason = shallowRef('')
const processingResult = shallowRef('')
const closingReason = shallowRef('')

const priorityOptions = ticketPriorityList.map(({ label, value }) => ({
  label,
  value,
}))

const assigneeOptions = computed(() =>
  (supportAgentsByTeam[team.value] ?? []).map((name) => ({
    label: name,
    value: name,
  }))
)

const assignmentChanged = computed(
  () =>
    !!props.ticket &&
    (props.ticket.team !== team.value ||
      props.ticket.assignee !== assignee.value)
)

watch(
  () => [props.ticket?.id, props.ticket?.team, props.ticket?.assignee] as const,
  ([, nextTeam, nextAssignee]) => {
    team.value = nextTeam === '待分配' ? '平台支持组' : nextTeam || ''
    assignee.value =
      nextAssignee === '待分配' ? CURRENT_AGENT : nextAssignee || ''
  },
  { immediate: true }
)

watch(
  () => props.ticket?.id,
  () => {
    waitingReason.value = ''
    resolutionReason.value = ''
    processingResult.value = ''
    closingReason.value = ''
  }
)

function handleTeamChange(value: string) {
  team.value = value
  const agents = supportAgentsByTeam[value] ?? []
  if (!agents.includes(assignee.value)) assignee.value = agents[0] ?? ''
}

function saveAssignment() {
  if (!team.value || !assignee.value) return
  emit('assignmentChange', { team: team.value, assignee: assignee.value })
}

function assignToMe() {
  const availableTeam = supportTeamOptions.find((option) =>
    supportAgentsByTeam[option.value]?.includes(CURRENT_AGENT)
  )
  if (availableTeam) team.value = availableTeam.value
  assignee.value = CURRENT_AGENT
}

function handlePriorityChange(value: TicketPriority) {
  emit('priorityChange', value)
}

function submitWaiting() {
  if (!waitingReason.value) return
  emit('waiting', waitingReason.value)
  waitingReason.value = ''
}

function submitResolution() {
  const result = processingResult.value.trim()
  if (!resolutionReason.value || !result) return
  emit('resolve', { reason: resolutionReason.value, result })
  resolutionReason.value = ''
  processingResult.value = ''
}

function submitClose() {
  if (!closingReason.value) return
  emit('close', closingReason.value)
  closingReason.value = ''
}
</script>

<template>
  <aside
    class="min-h-0 flex flex-col border-l-1 border-color-2 border-l-solid bg-container max-xl:border-l-0 max-xl:border-t-1 max-xl:border-t-solid"
  >
    <header
      class="flex-none border-b-1 border-color-2 border-b-solid px-12 py-11"
    >
      <h3 class="mb-0 text-sm text-main font-700">处理属性</h3>
    </header>

    <a-empty v-if="!ticket" class="my-auto" description="暂无工单属性" />

    <div v-else class="min-h-0 flex-1 overflow-y-auto">
      <section class="border-b-1 border-color-2 border-b-solid px-12 py-12">
        <div class="flex items-center justify-between gap-8">
          <span class="text-xs text-secondary">当前状态</span>
          <a-tag
            :bordered="false"
            :color="getTicketStatusMeta(ticket.status).color"
          >
            {{ getTicketStatusMeta(ticket.status).label }}
          </a-tag>
        </div>
        <div class="mt-9 flex items-center justify-between gap-8">
          <span class="text-xs text-secondary">SLA 截止</span>
          <span
            class="inline-flex items-center gap-4 text-xs font-600"
            :class="slaStatusMeta[ticket.slaStatus].textClass"
          >
            <Icon :name="slaStatusMeta[ticket.slaStatus].icon" :size="13" />
            {{ ticket.slaDueAt }}
          </span>
        </div>
        <div class="mt-7 text-right text-xs text-secondary">
          {{ slaStatusMeta[ticket.slaStatus].label }}
        </div>
        <div
          v-if="ticket.waitingReason"
          class="mt-9 border-t-1 border-color-2 border-t-solid pt-8"
        >
          <div class="text-xs text-secondary">当前等待原因</div>
          <p class="mb-0 mt-4 text-xs text-main leading-5">
            {{ ticket.waitingReason }}
          </p>
        </div>
      </section>

      <section class="border-b-1 border-color-2 border-b-solid px-12 py-12">
        <div class="mb-9 flex items-center justify-between gap-8">
          <h4 class="mb-0 text-xs text-main font-700">分配</h4>
          <a-button
            type="link"
            size="small"
            :disabled="ticket.status === 'closed'"
            @click="assignToMe"
          >
            分配给我
          </a-button>
        </div>
        <label class="mb-4 block text-xs text-secondary">处理组</label>
        <a-select
          :value="team"
          class="w-full"
          :disabled="ticket.status === 'closed'"
          :options="supportTeamOptions"
          @change="handleTeamChange"
        />
        <label class="mb-4 mt-9 block text-xs text-secondary">处理人</label>
        <a-select
          v-model:value="assignee"
          class="w-full"
          :disabled="ticket.status === 'closed'"
          :options="assigneeOptions"
        />
        <a-button
          class="mt-9 w-full"
          :disabled="ticket.status === 'closed' || !assignmentChanged"
          @click="saveAssignment"
        >
          保存分配
        </a-button>
      </section>

      <section class="border-b-1 border-color-2 border-b-solid px-12 py-12">
        <h4 class="mb-8 text-xs text-main font-700">优先级</h4>
        <a-select
          :value="ticket.priority"
          class="w-full"
          :disabled="ticket.status === 'closed'"
          :options="priorityOptions"
          @change="handlePriorityChange"
        >
          <template #labelRender>
            <span class="inline-flex items-center gap-5">
              <Icon
                :name="getTicketPriorityMeta(ticket.priority).icon"
                :size="13"
              />
              {{ getTicketPriorityMeta(ticket.priority).label }}
            </span>
          </template>
        </a-select>
      </section>

      <section class="border-b-1 border-color-2 border-b-solid px-12 py-12">
        <h4 class="mb-9 text-xs text-main font-700">处理时间</h4>
        <dl
          class="mb-0 grid grid-cols-[76px_minmax(0,1fr)] gap-x-8 gap-y-7 text-xs"
        >
          <dt class="text-secondary">创建</dt>
          <dd class="mb-0 text-right text-main">{{ ticket.createdAt }}</dd>
          <dt class="text-secondary">受理</dt>
          <dd class="mb-0 text-right text-main">
            {{ ticket.acceptedAt || '--' }}
          </dd>
          <dt class="text-secondary">首次响应</dt>
          <dd class="mb-0 text-right text-main">
            {{ ticket.firstResponseAt || '--' }}
          </dd>
          <dt class="text-secondary">解决</dt>
          <dd class="mb-0 text-right text-main">
            {{ ticket.resolvedAt || '--' }}
          </dd>
          <dt class="text-secondary">关闭</dt>
          <dd class="mb-0 text-right text-main">
            {{ ticket.closedAt || '--' }}
          </dd>
        </dl>
      </section>

      <section class="px-12 py-12">
        <h4 class="mb-9 text-xs text-main font-700">状态流转</h4>

        <a-button
          v-if="ticket.status === 'pending'"
          type="primary"
          class="w-full"
          @click="emit('accept')"
        >
          <template #icon><Icon name="i-lucide:circle-play" /></template>
          受理并开始处理
        </a-button>

        <a-button
          v-if="ticket.status === 'waiting'"
          type="primary"
          class="w-full"
          @click="emit('continue')"
        >
          <template #icon><Icon name="i-lucide:play" /></template>
          继续处理
        </a-button>

        <template v-if="ticket.status === 'processing'">
          <label class="mb-4 block text-xs text-secondary">等待原因</label>
          <a-select
            v-model:value="waitingReason"
            class="w-full"
            placeholder="选择等待原因"
            :options="waitingReasonOptions"
          />
          <a-button
            class="mt-7 w-full"
            :disabled="!waitingReason"
            @click="submitWaiting"
          >
            <template #icon><Icon name="i-lucide:pause" /></template>
            转为等待用户
          </a-button>

          <div class="my-12 border-t-1 border-color-2 border-t-solid" />

          <label class="mb-4 block text-xs text-secondary">解决原因</label>
          <a-select
            v-model:value="resolutionReason"
            class="w-full"
            placeholder="选择解决原因"
            :options="resolutionReasonOptions"
          />
          <label class="mb-4 mt-8 block text-xs text-secondary">处理结果</label>
          <a-textarea
            v-model:value="processingResult"
            :auto-size="{ minRows: 3, maxRows: 5 }"
            :maxlength="500"
            placeholder="记录修复、配置或答复结果"
          />
          <a-button
            type="primary"
            class="mt-7 w-full"
            :disabled="!resolutionReason || !processingResult.trim()"
            @click="submitResolution"
          >
            <template #icon><Icon name="i-lucide:circle-check-big" /></template>
            标记已解决
          </a-button>
        </template>

        <template v-if="ticket.status === 'resolved'">
          <div class="mb-10 bg-fill px-9 py-8 text-xs leading-5">
            <div class="text-main font-600">{{ ticket.resolutionReason }}</div>
            <div class="mt-4 text-secondary">{{ ticket.processingResult }}</div>
          </div>
          <label class="mb-4 block text-xs text-secondary">关闭原因</label>
          <a-select
            v-model:value="closingReason"
            class="w-full"
            placeholder="选择关闭原因"
            :options="closingReasonOptions"
          />
          <a-button
            type="primary"
            class="mt-7 w-full"
            :disabled="!closingReason"
            @click="submitClose"
          >
            <template #icon><Icon name="i-lucide:archive" /></template>
            关闭工单
          </a-button>
          <a-button class="mt-7 w-full" @click="emit('reopen')">
            重新打开
          </a-button>
        </template>

        <a-button
          v-if="ticket.status === 'closed'"
          class="w-full"
          @click="emit('reopen')"
        >
          <template #icon><Icon name="i-lucide:rotate-ccw" /></template>
          重新打开
        </a-button>
      </section>
    </div>
  </aside>
</template>
