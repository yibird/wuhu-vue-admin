<template>
  <div class="grid gap-16">
    <section
      v-for="event in definition?.events ?? []"
      :key="event.name"
      class="grid gap-8"
    >
      <div class="flex-between-center gap-6">
        <span class="inline-flex-y-center gap-6 text-base text-main font-600">
          {{ event.label }}
          <a-tooltip v-if="event.description" :title="event.description">
            <Icon name="i-lucide:help-circle" :size="12" class="text-muted" />
          </a-tooltip>
        </span>
        <a-select
          :value="null"
          class="w-150px"
          placeholder="添加已存在动作"
          :options="actionOptions"
          show-search
          option-filter-prop="label"
          @change="addAction(event.name, $event)"
        />
      </div>

      <div v-if="actionsOf(event.name).length" class="grid gap-8">
        <div
          v-for="(actionId, index) in actionsOf(event.name)"
          :key="`${actionId}-${index}`"
          class="rounded-6 border-1 border-color-2 border-solid bg-fill-quaternary p-10"
        >
          <div class="flex-between-center gap-6">
            <span class="inline-flex-y-center gap-6 text-xs text-main">
              <Icon name="i-lucide:zap" :size="12" class="text-primary" />
              {{ actionLabel(actionId) }}
            </span>
            <div class="flex-y-center gap-2">
              <button
                class="span-button size-22 inline-flex items-center justify-center text-muted hover:text-primary"
                type="button"
                :disabled="index === 0"
                @click="moveAction(event.name, index, -1)"
              >
                <Icon name="i-lucide:arrow-up" :size="12" />
              </button>
              <button
                class="span-button size-22 inline-flex items-center justify-center text-muted hover:text-primary"
                type="button"
                :disabled="index === actionsOf(event.name).length - 1"
                @click="moveAction(event.name, index, 1)"
              >
                <Icon name="i-lucide:arrow-down" :size="12" />
              </button>
              <button
                class="span-button size-22 inline-flex items-center justify-center text-muted hover:text-error"
                type="button"
                @click="removeAction(event.name, index)"
              >
                <Icon name="i-lucide:x" :size="12" />
              </button>
            </div>
          </div>

          <div
            v-if="actionParams(actionId).length"
            class="mt-10 grid gap-10 border-0 border-t-1 border-color-2 border-t-solid pt-10"
          >
            <ActionValueControl
              v-for="param in actionParams(actionId)"
              :key="param.key"
              :field="param"
              :value="actionSchema(actionId)?.params?.[param.key]"
              @update:value="setParam(actionId, param.key, $event)"
            />
          </div>
        </div>
      </div>
      <div v-else class="text-xs text-muted">未绑定动作</div>
    </section>

    <div v-if="!definition?.events?.length" class="text-sm text-muted">
      当前组件暂无可配置事件
    </div>

    <a-button
      type="dashed"
      block
      :disabled="!definition?.events?.length"
      @click="openCreate(definition?.events?.[0]?.name ?? '')"
    >
      <Icon name="i-lucide:plus" :size="13" class="mr-4" />
      新建动作并绑定
    </a-button>

    <ActionCreateModal
      :open="createOpen"
      @close="createOpen = false"
      @created="onActionCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@/components'
import { actionRegistry } from '../../core/runtime'
import { componentRegistry } from '../../core/registry'
import { useDesignerContext } from '../../composables'
import ActionCreateModal from './ActionCreateModal.vue'
import ActionValueControl from './ActionValueControl.vue'
import type { ComponentSchema, ValueSchema } from '../../core/schema/types'

const props = defineProps<{ node: ComponentSchema }>()
const designer = useDesignerContext()
const createOpen = ref(false)
const pendingEvent = ref<string | undefined>(undefined)

const definition = computed(() =>
  componentRegistry.getDefinition(props.node.type)
)

const actionOptions = computed(() =>
  designer.schema.actions.map((action) => ({
    label: action.name || action.type,
    value: action.id,
  }))
)

function eventSchema(name: string) {
  return designer.activeIndex.value
    .get(props.node.id)
    ?.events?.find((item) => item.name === name)
}

function actionsOf(name: string) {
  return eventSchema(name)?.actions ?? []
}

function actionSchema(actionId: string) {
  return designer.schema.actions.find((action) => action.id === actionId)
}

function actionLabel(actionId: string) {
  const action = actionSchema(actionId)
  if (!action) return '已删除的动作'
  return action.name || actionRegistry.get(action.type)?.label || action.type
}

function actionParams(actionId: string) {
  const action = actionSchema(actionId)
  if (!action) return []
  return actionRegistry.get(action.type)?.params ?? []
}

function commitEvent(name: string, actions: string[]) {
  const node = designer.activeIndex.value.get(props.node.id)
  if (!node) return
  const events = (node.events ?? []).filter((item) => item.name !== name)
  events.push({ name, actions })
  designer.setEvents(props.node.id, events)
}

function addAction(eventName: string, actionId: unknown) {
  if (!actionId) return
  commitEvent(eventName, [...actionsOf(eventName), String(actionId)])
}

function removeAction(eventName: string, index: number) {
  commitEvent(
    eventName,
    actionsOf(eventName).filter((_, itemIndex) => itemIndex !== index)
  )
}

function moveAction(eventName: string, index: number, offset: number) {
  const next = [...actionsOf(eventName)]
  const target = index + offset
  if (target < 0 || target >= next.length) return
  const [item] = next.splice(index, 1)
  next.splice(target, 0, item)
  commitEvent(eventName, next)
}

function setParam(actionId: string, key: string, value: ValueSchema) {
  designer.editSection(
    'actions',
    '修改动作参数',
    (actions) => {
      const action = actions.find((item) => item.id === actionId)
      if (!action) return
      action.params = { ...action.params, [key]: value }
    },
    `action-param:${actionId}:${key}`
  )
}

function openCreate(eventName: string) {
  pendingEvent.value = eventName
  createOpen.value = true
}

function onActionCreated(actionId: string) {
  const eventName = pendingEvent.value ?? definition.value?.events?.[0]?.name
  if (eventName) addAction(eventName, actionId)
  pendingEvent.value = undefined
}
</script>
