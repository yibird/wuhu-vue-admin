import {
  createVNode,
  render,
  type AppContext,
  type ComponentPublicInstance,
} from 'vue'
import Host from './Host.vue'
import type {
  ModalController,
  ModalOpenOptions,
  ModalOpenPromise,
  ModalResult,
  ModalUpdateOptions,
} from './types'

type ModalHostInstance = ComponentPublicInstance<{
  close: () => void
  destroy: () => void
}>

interface ModalRecord<
  TComponentProps extends Record<string, unknown> = Record<string, unknown>,
  TResult = unknown,
> {
  container: HTMLElement
  appContext: AppContext | null
  currentOptions: ModalOpenOptions<TComponentProps, TResult>
  host: ModalHostInstance | null
  settled: boolean
  resolve: (result: ModalResult<TResult>) => void
}

type StoredModalRecord = ModalRecord<Record<string, unknown>, unknown>

let defaultAppContext: AppContext | undefined
const records = new Set<StoredModalRecord>()

function asStoredRecord<
  TComponentProps extends Record<string, unknown>,
  TResult,
>(record: ModalRecord<TComponentProps, TResult>): StoredModalRecord {
  return record as unknown as StoredModalRecord
}

export function setModalAppContext(appContext: AppContext) {
  defaultAppContext = appContext
}

function getHostInstance(value: unknown): ModalHostInstance | null {
  return value && typeof value === 'object'
    ? (value as ModalHostInstance)
    : null
}

function createRecord<TComponentProps extends Record<string, unknown>, TResult>(
  options: ModalOpenOptions<TComponentProps, TResult>,
  resolve: (result: ModalResult<TResult>) => void
): ModalRecord<TComponentProps, TResult> | undefined {
  if (typeof document === 'undefined') return

  const container = document.createElement('div')
  container.dataset.modalHost = 'true'
  document.body.appendChild(container)

  return {
    container,
    appContext: options.appContext ?? defaultAppContext ?? null,
    currentOptions: { ...options },
    host: null,
    settled: false,
    resolve,
  }
}

function unmountRecord<
  TComponentProps extends Record<string, unknown>,
  TResult,
>(record: ModalRecord<TComponentProps, TResult>, result: ModalResult<TResult>) {
  if (record.settled) return
  record.settled = true
  render(null, record.container)
  record.container.remove()
  records.delete(asStoredRecord(record))
  record.resolve(result)
}

function renderRecord<TComponentProps extends Record<string, unknown>, TResult>(
  record: ModalRecord<TComponentProps, TResult>
) {
  const vnode = createVNode(Host, {
    options: record.currentOptions,
    onSettled: (result: ModalResult<TResult>) => unmountRecord(record, result),
    ref: (value: unknown) => {
      record.host = getHostInstance(value)
    },
  })
  vnode.appContext = record.appContext
  render(vnode, record.container)
}

function updateRecord<TComponentProps extends Record<string, unknown>, TResult>(
  record: ModalRecord<TComponentProps, TResult>,
  update:
    | ModalUpdateOptions<TComponentProps, TResult>
    | ((
        previous: ModalOpenOptions<TComponentProps, TResult>
      ) => ModalUpdateOptions<TComponentProps, TResult>)
) {
  if (record.settled) return
  const changes =
    typeof update === 'function' ? update(record.currentOptions) : update
  record.currentOptions = { ...record.currentOptions, ...changes }
  renderRecord(record)
}

export function open<
  TComponentProps extends Record<string, unknown> = Record<string, unknown>,
  TResult = unknown,
>(
  options: ModalOpenOptions<TComponentProps, TResult> = {}
): ModalOpenPromise<TComponentProps, TResult> {
  let record: ModalRecord<TComponentProps, TResult> | undefined
  const promise = new Promise<ModalResult<TResult>>((resolve) => {
    record = createRecord(options, resolve)
    if (!record) {
      resolve({ action: 'destroy' })
      return
    }
    records.add(asStoredRecord(record))
    renderRecord(record)
  }) as ModalOpenPromise<TComponentProps, TResult>

  const controller: ModalController<TComponentProps, TResult> = {
    close() {
      if (record?.settled) return
      record?.host?.close()
    },
    destroy() {
      if (!record || record.settled) return
      unmountRecord(record, { action: 'destroy' })
    },
    update(updateOptions) {
      if (record) updateRecord(record, updateOptions)
    },
  }

  Object.assign(promise, controller)
  return promise
}

export function destroyAll() {
  for (const record of records) {
    unmountRecord(record, { action: 'destroy' })
  }
}
