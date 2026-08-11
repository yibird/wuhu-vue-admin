# Use hooks to get context

## Description (en-US)

Use `Modal.useModal` to get `contextHolder` with context accessible issue. Only hooks method support Promise `await` operation.

## Source

```vue
<script setup lang="ts">
import type { InjectionKey, Ref } from 'vue'
import { Modal } from 'antdv-next'
import { computed, defineComponent, h, inject, provide, ref } from 'vue'

const [modal, ContextModal] = Modal.useModal()

const ReachableContextKey: InjectionKey<Ref<string>> = Symbol('ReachableContextKey')
const UnreachableContextKey: InjectionKey<Ref<string | null>> = Symbol('UnreachableContextKey')

const ReachableConsumer = defineComponent(() => {
  const value = inject(ReachableContextKey, ref())
  return () => {
    return `Reachable: ${value.value}!`
  }
})

const UnreachableConsumer = defineComponent(() => {
  const value = inject(UnreachableContextKey, ref(null))
  return () => {
    return `Unreachable: ${value.value}!`
  }
})

const config = {
  title: 'Use Hook!',
  content: () => [
    h(ReachableConsumer),
    h('br'),
    h(UnreachableConsumer),
  ],
}
const ReachableProvider = defineComponent(
  (props, { slots }) => {
    provide(ReachableContextKey, computed(() => props.value))
    return () => {
      return slots?.default?.()
    }
  },
  {
    props: ['value'],
  },
)

const UnreachableProvider = defineComponent((props, { slots }) => {
  provide(UnreachableContextKey, computed(() => props.value))
  return () => {
    return slots?.default?.()
  }
}, {
  props: ['value'],
})

async function handleClick() {
  const confirmed = await modal.confirm(config)
  console.log('Confirmed: ', confirmed)
}
</script>

<template>
  <ReachableProvider value="Light">
    <a-space>
      <a-button @click="handleClick">
        Confirm
      </a-button>
      <a-button
        @click="() => {
          modal.warning(config)
        }"
      >
        Warning
      </a-button>
      <a-button
        @click="() => {
          modal.info(config)
        }"
      >
        Info
      </a-button>
      <a-button
        @click="() => {
          modal.error(config)
        }"
      >
        Error
      </a-button>
    </a-space>
    <ContextModal />
    <UnreachableProvider value="Bamboo" />
  </ReachableProvider>
</template>
```
