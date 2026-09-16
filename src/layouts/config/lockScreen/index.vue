<script setup lang="ts">
import { onKeyStroke, useDateFormat, useNow } from '@vueuse/core'
import { useAppStore, useAuthStore, authStore } from '@/store'
import { useGo } from '@/router'
import { useLockScreen } from '../composables'
import FlipClock from './components/FlipClock.vue'

const items = [
  {
    label: '年',
    value: 'year',
  },
  {
    label: '月',
    value: 'month',
  },
  {
    label: '日',
    value: 'day',
  },
]

const open = defineModel('open', { default: false })
const { app } = useAppStore()
const { user } = useAuthStore()
const { to } = useGo()
const {
  isSetting,
  failedAttempts,
  maxAttempts,
  confirmPin,
  cancelSetting,
  unlock,
  clearPin,
} = useLockScreen()

const PIN_PATTERN = /^\d{4,8}$/
const pin = shallowRef('')
const pinError = shallowRef('')
const submitting = shallowRef(false)

const pinPlaceholder = computed(() =>
  isSetting.value ? '设置 4-8 位数字解锁 PIN' : '输入解锁 PIN'
)
const actionLabel = computed(() =>
  isSetting.value ? '开始锁定' : '解锁工作区'
)

const now = useNow({ interval: 1000 })
const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const appName = computed(() => app.value.name)
const appLogo = computed(() => app.value.logo)
const hours = useDateFormat(now, 'HH')
const minutes = useDateFormat(now, 'mm')
const seconds = useDateFormat(now, 'ss')

const currentDate = computed(() => dateFormatter.format(now.value))
const currentDateParts = computed(() => {
  const parts = dateFormatter.formatToParts(now.value)
  const getPart = (type: string) =>
    parts.find((part) => part.type === type)?.value || ''

  return {
    year: getPart('year'),
    month: getPart('month'),
    day: getPart('day'),
    weekday: getPart('weekday'),
  }
})
const currentTimeLabel = computed(
  () => `${hours.value}:${minutes.value}:${seconds.value}`
)
const displayName = computed(
  () => user.value?.name || user.value?.account || '当前用户'
)
const userAvatar = computed(() => user.value?.avatar)

function pinErrorMessage() {
  if (failedAttempts.value === 0) return 'PIN 错误，请重试'
  const remaining = maxAttempts - failedAttempts.value
  return `PIN 错误，还可尝试 ${remaining} 次`
}

async function handleSubmit() {
  if (submitting.value) return
  const value = pin.value.trim()
  if (!PIN_PATTERN.test(value)) {
    pinError.value = '请输入 4-8 位数字 PIN'
    return
  }

  submitting.value = true
  try {
    if (isSetting.value) {
      await confirmPin(value)
      pin.value = ''
      pinError.value = ''
      return
    }

    const result = await unlock(value)
    if (result === 'unlocked') {
      pin.value = ''
      pinError.value = ''
      return
    }
    if (result === 'exceeded') {
      clearPin()
      authStore().logout()
      await to('/login', true)
      return
    }
    pinError.value = pinErrorMessage()
    pin.value = ''
  } finally {
    submitting.value = false
  }
}

function handleCancelSetting() {
  cancelSetting()
  pin.value = ''
  pinError.value = ''
}

onKeyStroke(
  'Enter',
  (event) => {
    if (!open.value || event.defaultPrevented || event.isComposing) return

    event.preventDefault()
    handleSubmit()
  },
  { dedupe: true }
)
</script>

<template>
  <Teleport to="body">
    <Transition name="fade-zoom" appear>
      <div
        v-if="open"
        class="fixed inset-0 z-[2000] transform-gpu [background:rgba(var(--w-bg-page),0.68)] text-main backdrop-blur-10 will-change-[transform,opacity] motion-reduce:will-change-auto"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lock-screen-title"
          data-testid="lock-screen"
          class="relative min-h-screen flex flex-col items-center justify-between overflow-hidden px-20 py-24 sm:(px-32 py-30)"
        >
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-16 shadow-all-sm max-sm:inset-8 max-sm:rounded-12"
          />
          <header
            class="absolute left-20 top-24 z-1 flex items-center gap-16 sm:left-32 sm:top-30"
          >
            <div class="min-w-0 flex items-center gap-10">
              <img
                v-if="appLogo"
                :src="appLogo"
                :alt="appName"
                class="size-34 shrink-0 object-contain"
              />
              <Icon
                v-else
                name="i-lucide:shield-check"
                :size="26"
                class="shrink-0 text-primary"
              />
              <span class="truncate text-md font-700">{{ appName }}</span>
            </div>
          </header>

          <main
            class="z-1 my-36 w-full max-w-680 flex flex-1 flex-col items-center justify-center text-center"
          >
            <div class="mb-24 flex items-baseline justify-center text-main">
              <time
                class="flex items-baseline gap-7 whitespace-nowrap"
                :datetime="now.toISOString()"
                :aria-label="currentDate"
              >
                <span v-for="item in items" :key="item.value">
                  <span class="text-xl font-700 leading-none sm:text-2xl">{{
                    currentDateParts[
                      item.value as keyof typeof currentDateParts
                    ]
                  }}</span>
                  <small class="mx-4 text-xs font-500 sm:text-sm">{{
                    item.label
                  }}</small>
                </span>
                <span
                  class="ml-6 text-2xl text-primary font-800 leading-none sm:text-2xl"
                >
                  {{ currentDateParts.weekday }}
                </span>
              </time>
            </div>

            <FlipClock
              :hours="hours"
              :minutes="minutes"
              :seconds="seconds"
              :label="`当前时间 ${currentTimeLabel}`"
            />

            <div class="mt-38 flex flex-col items-center">
              <div
                class="size-56 flex items-center justify-center overflow-hidden rounded-full border-1 border-color-2 border-solid bg-primary-tint text-lg text-primary font-700"
              >
                <img
                  v-if="userAvatar"
                  :src="userAvatar"
                  :alt="displayName"
                  class="size-full object-cover"
                />
                <Icon v-else name="i-lucide:user-round" :size="24" />
              </div>
              <h1
                id="lock-screen-title"
                class="m-0 mt-16 text-xl text-main font-700"
              >
                {{ displayName }}
              </h1>
            </div>

            <div class="mt-24 w-full max-w-320 flex flex-col items-center">
              <a-input-password
                v-model:value="pin"
                :maxlength="8"
                autocomplete="off"
                autofocus
                :placeholder="pinPlaceholder"
                size="large"
                @change="pinError = ''"
              />
              <span
                v-if="pinError"
                role="alert"
                class="mt-8 min-h-22 text-sm text-error"
              >
                {{ pinError }}
              </span>
              <div class="mt-8 flex items-center gap-12">
                <a-button
                  v-if="isSetting"
                  size="large"
                  :disabled="submitting"
                  @click="handleCancelSetting"
                >
                  取消
                </a-button>
                <a-button
                  type="primary"
                  size="large"
                  data-testid="lock-screen-unlock"
                  :loading="submitting"
                  class="h-44! min-w-220 rounded-8! shadow-[0_8px_20px_rgb(var(--w-color-primary)_/_18%)] transition-[transform,box-shadow] duration-motion-base hover:(-translate-y-1 shadow-[0_12px_24px_rgb(var(--w-color-primary)_/_24%)]) active:translate-y-0 motion-reduce:(transform-none transition-none)"
                  @click="handleSubmit"
                >
                  <template #icon>
                    <Icon
                      :name="
                        isSetting ? 'i-lucide:lock' : 'i-lucide:unlock-keyhole'
                      "
                    />
                  </template>
                  {{ actionLabel }}
                </a-button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
