<script setup lang="ts">
import BaseModal from './index.vue'
import type {
  ModalAction,
  ModalAsyncComponentLoader,
  ModalComponent,
  ModalOpenOptions,
  ModalResult,
} from './types'

interface HostState {
  options: ModalOpenOptions
}

const props = defineProps<{ state: HostState }>()
const emit = defineEmits<{
  settled: [result: ModalResult]
}>()

const options = computed(() => props.state.options)
const open = shallowRef(true)
const confirmLoading = shallowRef(false)
const loadedComponent = shallowRef<ModalComponent>()
const loadingError = shallowRef<unknown>()

let loadVersion = 0
let pendingResult: ModalResult | null = null
let settled = false

const modalBindings = computed(() => {
  const {
    appContext: _appContext,
    component: _component,
    componentProps: _componentProps,
    content: _content,
    onCancel: _onCancel,
    onOk: _onOk,
    afterClose: _afterClose,
    ...bindings
  } = options.value
  return bindings
})

const ContentRenderer = () => options.value.content ?? null

function isComponent(value: unknown): value is ModalComponent {
  return (
    (typeof value === 'object' && value !== null) || typeof value === 'function'
  )
}

function unwrapComponent(value: unknown): ModalComponent | undefined {
  if (
    typeof value === 'object' &&
    value !== null &&
    'default' in value &&
    isComponent(value.default)
  ) {
    return value.default
  }
  return isComponent(value) ? value : undefined
}

async function loadComponent(component: ModalComponent | undefined) {
  const version = ++loadVersion
  loadedComponent.value = undefined
  loadingError.value = undefined

  if (!component) return

  // Object components are mounted directly. Function values are lazy loaders.
  if (typeof component !== 'function') {
    loadedComponent.value = markRaw(component)
    return
  }

  try {
    const module = await (component as ModalAsyncComponentLoader)()
    if (version !== loadVersion) return

    const resolved = unwrapComponent(module)
    if (!resolved) throw new TypeError('Invalid modal component loader result')
    loadedComponent.value = markRaw(resolved)
  } catch (error) {
    if (version === loadVersion) loadingError.value = error
  }
}

watch(() => options.value.component, loadComponent, { immediate: true })

function requestClose(action: ModalAction, data?: unknown) {
  if (settled || pendingResult) return
  pendingResult = { action, data }
  open.value = false
}

async function handleOk(event: MouseEvent) {
  if (settled || pendingResult || confirmLoading.value) return

  confirmLoading.value = true
  try {
    const result = await options.value.onOk?.(event)
    if (result !== false) requestClose('ok', result)
  } catch {
    // A rejected guard keeps the modal open. The callback owns user feedback.
  } finally {
    confirmLoading.value = false
  }
}

async function handleCancel(event: MouseEvent | KeyboardEvent) {
  if (settled || pendingResult || confirmLoading.value) return

  try {
    const result = await options.value.onCancel?.(event)
    if (result !== false) requestClose('cancel')
  } catch {
    // A rejected guard keeps the modal open. The callback owns user feedback.
  }
}

function handleAfterClose() {
  if (settled) return
  settled = true
  emit('settled', pendingResult ?? { action: 'destroy' })
}

function close() {
  requestClose('destroy')
}

function destroy() {
  if (settled) return
  settled = true
  emit('settled', { action: 'destroy' })
}

function retryLoad() {
  void loadComponent(options.value.component)
}

defineExpose({ close, destroy })

onBeforeUnmount(() => {
  loadVersion += 1
})
</script>

<template>
  <BaseModal
    v-bind="modalBindings"
    :open="open"
    :confirm-loading="confirmLoading || options.confirmLoading"
    :after-close="handleAfterClose"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <component
      :is="loadedComponent"
      v-if="loadedComponent"
      v-bind="options.componentProps"
      @ok="requestClose('ok', $event)"
      @cancel="requestClose('cancel', $event)"
      @close="close"
    />
    <ContentRenderer v-else-if="options.content !== undefined" />
    <div
      v-else-if="options.component && !loadingError"
      class="min-h-120 flex items-center justify-center"
    >
      <a-spin />
    </div>
    <a-result
      v-else-if="loadingError"
      status="error"
      title="组件加载失败"
      sub-title="请重试或关闭当前弹窗"
    >
      <template #extra>
        <a-button type="primary" @click="retryLoad">重试</a-button>
      </template>
    </a-result>
  </BaseModal>
</template>
