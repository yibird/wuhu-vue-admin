<script lang="ts" setup>
import { onKeyStroke, useDateFormat, useNow } from '@vueuse/core'
import { useAppStore } from '@/store'
import { useLockScreen } from '../composables'

const show = defineModel('show', { default: false })
const { app } = useAppStore()
const { unlock } = useLockScreen()

const now = useNow({ interval: 1000 })
const lockedAt = shallowRef(new Date())

const appName = computed(() => app.value.name || 'Wuhu Admin')
const appLogo = computed(() => app.value.logo)
const currentTime = useDateFormat(now, 'HH:mm')
const currentSeconds = useDateFormat(now, 'ss')
const lockedAtText = useDateFormat(lockedAt, 'HH:mm:ss')
const currentDate = computed(() => {
  return new Intl.DateTimeFormat('zh-CN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(now.value)
})
const greetingText = computed(() => {
  const hour = now.value.getHours()
  if (hour < 6) return '夜间守护'
  if (hour < 12) return '上午好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

const securityItems = computed(() => [
  {
    label: '会话状态',
    value: '已锁定',
    icon: 'i-lucide:shield-check',
  },
  {
    label: '锁定时间',
    value: lockedAtText.value,
    icon: 'i-lucide:clock-3',
  },
  {
    label: '保护范围',
    value: '当前工作区',
    icon: 'i-lucide:monitor-dot',
  },
])

watch(show, (value) => {
  if (value) {
    lockedAt.value = new Date()
  }
})

function handleUnlock() {
  unlock()
}

onKeyStroke(
  'Enter',
  (event) => {
    if (!show.value || event.defaultPrevented || event.isComposing) return

    event.preventDefault()
    handleUnlock()
  },
  { dedupe: true }
)
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <Scrollbar v-if="show" class="fixed inset-0 z-[2000] bg-page text-main">
        <div
          class="grid min-h-full grid-cols-[minmax(0,1fr)_430px] max-lg:grid-cols-1"
        >
          <section
            class="relative hidden min-h-full overflow-hidden px-56 py-44 text-white lg:flex"
            :class="[
              '[background:linear-gradient(135deg,rgb(var(--w-color-primary))_0%,rgb(var(--w-color-info))_52%,rgb(22_163_74)_118%)]',
            ]"
          >
            <div
              class="pointer-events-none absolute inset-0 opacity-22 [background-image:linear-gradient(rgb(255_255_255/20%)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/16%)_1px,transparent_1px)] [background-size:44px_44px]"
            />
            <div
              class="pointer-events-none absolute left-0 top-0 h-full w-16 bg-white/28"
            />
            <div
              class="relative z-1 flex min-h-full w-full flex-col justify-between gap-44"
            >
              <div class="flex items-center gap-12">
                <div
                  class="size-44 flex items-center justify-center overflow-hidden rounded-10 bg-white/16 ring-1 ring-white/26"
                >
                  <img
                    v-if="appLogo"
                    :src="appLogo"
                    :alt="appName"
                    class="size-28 object-contain"
                  />
                  <Icon v-else name="i-lucide:shield" :size="22" />
                </div>
                <div class="min-w-0">
                  <div class="truncate text-18px font-800 leading-24px">
                    {{ appName }}
                  </div>
                  <div class="mt-3 text-13px text-white/72">
                    Secure workspace
                  </div>
                </div>
              </div>

              <div class="max-w-720">
                <div
                  class="inline-flex items-center gap-8 rounded-full border border-white/22 bg-white/13 px-12 py-7 text-13px font-700 backdrop-blur-12"
                >
                  <span class="size-7 rounded-full bg-[rgb(110_231_183)]" />
                  {{ greetingText }}
                </div>
                <div
                  class="mt-24 flex items-start gap-12 tabular-nums text-88px font-900 leading-none max-xl:text-72px"
                >
                  <span>{{ currentTime }}</span>
                  <span class="mt-11 text-30px text-white/70 font-700">
                    {{ currentSeconds }}
                  </span>
                </div>
                <div class="mt-14 text-18px text-white/78">
                  {{ currentDate }}
                </div>
                <p
                  class="m-0 mt-26 max-w-560 text-15px text-white/72 leading-26px"
                >
                  当前会话已经进入保护状态，后台任务会继续运行，解锁后可直接回到工作区。
                </p>
              </div>

              <div class="grid grid-cols-3 gap-12 max-xl:grid-cols-2">
                <div
                  v-for="item in securityItems"
                  :key="item.label"
                  class="rounded-12 border border-white/18 bg-white/12 p-14 backdrop-blur-12"
                >
                  <Icon :name="item.icon" :size="18" class="text-white/78" />
                  <div class="mt-12 text-12px text-white/62">
                    {{ item.label }}
                  </div>
                  <div class="mt-4 text-15px font-800">{{ item.value }}</div>
                </div>
              </div>
            </div>
          </section>

          <section
            class="relative flex min-h-screen items-center justify-center overflow-hidden px-24 py-36 max-sm:px-16"
          >
            <div
              class="pointer-events-none absolute inset-0 [background:linear-gradient(160deg,rgb(var(--w-bg-container))_0%,rgb(var(--w-bg-page))_52%,rgb(var(--w-bg-info-tint))_100%)]"
            />
            <div
              class="relative z-1 w-full max-w-430 rounded-14 border-1 border-color-2 border-solid bg-container p-28 shadow-[0_24px_80px_rgb(15_23_42_/_14%)] backdrop-blur-18 max-sm:p-20"
            >
              <div class="mb-28 lg:hidden">
                <div
                  class="text-54px text-main font-900 leading-none tabular-nums"
                >
                  {{ currentTime }}
                </div>
                <div class="mt-8 text-sm text-secondary">{{ currentDate }}</div>
              </div>

              <div class="flex items-start justify-between gap-16">
                <div class="min-w-0">
                  <div
                    class="inline-flex items-center gap-6 rounded-full bg-primary-tint px-10 py-5 text-xs text-primary font-700"
                  >
                    <Icon name="i-lucide:lock-keyhole" :size="13" />
                    已锁定
                  </div>
                  <h1
                    class="m-0 mt-16 text-28px text-main font-900 leading-34px"
                  >
                    工作区已保护
                  </h1>
                  <p class="m-0 mt-10 text-sm text-regular leading-24px">
                    解锁后会恢复到当前页面，正在执行的任务不会被中断。
                  </p>
                </div>
                <div
                  class="size-54 shrink-0 flex items-center justify-center rounded-14 bg-main text-primary shadow-[inset_0_0_0_1px_rgb(var(--w-border-color-2))]"
                >
                  <Icon name="i-lucide:fingerprint" :size="26" />
                </div>
              </div>

              <div
                class="mt-24 divide-y divide-solid divide-color-1 rounded-10 border-1 border-color-2 border-solid bg-container-secondary"
              >
                <div
                  v-for="item in securityItems"
                  :key="item.label"
                  class="flex items-center justify-between gap-14 px-14 py-13"
                >
                  <span
                    class="inline-flex items-center gap-8 text-sm text-secondary"
                  >
                    <Icon :name="item.icon" :size="16" />
                    {{ item.label }}
                  </span>
                  <span class="text-sm text-main font-700">{{
                    item.value
                  }}</span>
                </div>
              </div>

              <a-button
                type="primary"
                size="large"
                block
                class="mt-24 h-46! rounded-8!"
                @click="handleUnlock"
              >
                <template #icon>
                  <Icon name="i-lucide:unlock-keyhole" />
                </template>
                解锁工作区
              </a-button>
            </div>
          </section>
        </div>
      </Scrollbar>
    </Transition>
  </Teleport>
</template>
