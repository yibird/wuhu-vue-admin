<template>
  <WView :full="true" :padding="0">
    <div
      ref="scrollRef"
      class="h-full w-full overflow-x-hidden overflow-y-auto bg-page"
    >
      <main class="mx-auto min-h-full w-full p-12 sm:p-16">
        <header class="mb-16 flex flex-wrap items-end justify-between gap-10">
          <div class="min-w-0">
            <h1 class="m-0 text-lg text-main font-800">灵感瀑布流</h1>
            <p class="mb-0 mt-6 text-sm text-secondary">
              持续滚动到底部自动加载更多作品，已加载
              <span class="text-main font-600 tabular-nums">
                {{ cards.length }}
              </span>
              / {{ TOTAL_CARDS }}
            </p>
          </div>
          <a-tag color="processing" class="m-0!">
            <template #icon>
              <Icon name="i-lucide:gallery-vertical" :size="13" />
            </template>
            Masonry
          </a-tag>
        </header>

        <MasonrySkeleton v-if="initialLoading" />

        <a-masonry
          v-else
          :items="masonryItems"
          :columns="{ xs: 1, sm: 2, md: 3, xl: 4, xxl: 5 }"
          :gutter="[16, 16]"
        >
          <template #itemRender="{ data }">
            <MasonryCard :card="data" @select="openCardDetail" />
          </template>
        </a-masonry>

        <div ref="sentinelRef" class="h-1" aria-hidden="true" />

        <div class="flex items-center justify-center py-16 text-secondary">
          <a-spin v-if="loadingMore" size="small" />
          <span v-else-if="finished" class="text-xs">已经到底了</span>
        </div>
      </main>
    </div>

    <a-modal
      v-model:open="detailOpen"
      :footer="null"
      :width="680"
      destroy-on-hidden
    >
      <div v-if="activeCard" class="flex flex-col gap-16 sm:flex-row">
        <div
          class="h-220 w-full flex-none overflow-hidden rounded-6 bg-muted sm:h-280 sm:w-240"
        >
          <img
            :src="activeCard.image"
            :alt="activeCard.title"
            class="size-full object-cover"
          />
        </div>

        <div class="min-w-0 flex flex-1 flex-col gap-10">
          <div class="flex items-center gap-8">
            <a-tag color="processing" class="m-0!">
              {{ activeCard.tag }}
            </a-tag>
            <span
              class="ml-auto flex items-center gap-3 text-xs text-secondary"
            >
              <Icon name="i-lucide:heart" :size="14" class="text-error/70" />
              {{ activeCardLikes }}
            </span>
          </div>

          <h3 class="m-0 text-base text-main font-700">
            {{ activeCard.title }}
          </h3>
          <p class="m-0 text-sm text-secondary leading-22px">
            {{ activeCard.description }}
          </p>

          <div class="mt-auto flex items-center justify-between gap-10 pt-8">
            <span
              class="min-w-0 flex items-center gap-6 text-xs text-secondary"
            >
              <a-avatar :src="activeCard.avatar" :size="24" round />
              <span class="truncate">{{ activeCard.author }}</span>
            </span>
            <a-button
              :type="activeCardLiked ? 'default' : 'primary'"
              @click="toggleLike"
            >
              <template #icon>
                <Icon
                  name="i-lucide:heart"
                  :class="activeCardLiked ? 'text-error' : ''"
                />
              </template>
              {{ activeCardLiked ? '已喜欢' : '喜欢' }}
            </a-button>
          </div>
        </div>
      </div>
    </a-modal>
  </WView>
</template>

<script setup lang="ts">
import { Icon } from '@/components'
import { MasonryCard, MasonrySkeleton } from './components'
import {
  createMasonryCards,
  LOAD_MORE_SIZE,
  PAGE_SIZE,
  TOTAL_CARDS,
} from './data'
import type { MasonryCard as MasonryCardType } from './types'

const scrollRef = useTemplateRef<HTMLDivElement>('scrollRef')
const sentinelRef = useTemplateRef<HTMLDivElement>('sentinelRef')
const cards = shallowRef<MasonryCardType[]>([])
const initialLoading = shallowRef(true)
const loadingMore = shallowRef(false)
const finished = shallowRef(false)

const activeCard = shallowRef<MasonryCardType>()
const detailOpen = shallowRef(false)
const likedIds = shallowRef<Set<string>>(new Set())
const activeCardLiked = computed(
  () => !!activeCard.value && likedIds.value.has(activeCard.value.id)
)
const activeCardLikes = computed(
  () => (activeCard.value?.likes ?? 0) + (activeCardLiked.value ? 1 : 0)
)

function openCardDetail(card: MasonryCardType) {
  activeCard.value = card
  detailOpen.value = true
}

function toggleLike() {
  const card = activeCard.value
  if (!card) return

  const next = new Set(likedIds.value)
  if (next.has(card.id)) next.delete(card.id)
  else next.add(card.id)
  likedIds.value = next
}

const masonryItems = computed(() =>
  cards.value.map((card) => ({
    key: card.id,
    height: card.height,
    data: card,
  }))
)

/** 哨兵提前触发的距离,与 IntersectionObserver 的 rootMargin 保持一致 */
const LOAD_AHEAD = 320

let observer: IntersectionObserver | null = null
let loadToken = 0
let disposed = false

const sleep = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms))

const nextFrame = () =>
  new Promise<void>((resolve) => {
    if (typeof requestAnimationFrame === 'undefined') {
      resolve()
      return
    }
    requestAnimationFrame(() => resolve())
  })

/**
 * 判断哨兵是否已进入触发范围
 *
 * IntersectionObserver 只会在交叉状态变化时回调:首屏加载期间命中会被忽略,
 * 若加载完成后哨兵仍在视口内(大屏或内容不足一屏),状态不再变化就不会再次回调,
 * 因此每次追加完成后主动补一次判断。
 */
function isSentinelNearViewport() {
  const root = scrollRef.value
  const sentinel = sentinelRef.value
  if (!root || !sentinel) return false

  const rootRect = root.getBoundingClientRect()
  const sentinelRect = sentinel.getBoundingClientRect()
  return sentinelRect.top <= rootRect.bottom + LOAD_AHEAD
}

async function checkLoadMore() {
  if (loadingMore.value || finished.value) return
  await nextTick()
  await nextFrame()
  if (disposed || loadingMore.value || finished.value) return
  if (isSentinelNearViewport()) void appendCards(LOAD_MORE_SIZE)
}

async function appendCards(size: number) {
  if (loadingMore.value || finished.value) return

  loadingMore.value = true
  const token = ++loadToken
  await sleep(650)
  if (token !== loadToken || disposed) return

  const remaining = TOTAL_CARDS - cards.value.length
  if (remaining <= 0) {
    finished.value = true
    loadingMore.value = false
    return
  }

  cards.value = [
    ...cards.value,
    ...createMasonryCards(cards.value.length, Math.min(size, remaining)),
  ]
  finished.value = cards.value.length >= TOTAL_CARDS
  loadingMore.value = false
  void checkLoadMore()
}

async function loadInitialCards() {
  initialLoading.value = true
  await appendCards(PAGE_SIZE)
  if (disposed) return
  initialLoading.value = false
  // 首屏内容不足一屏时继续补齐,否则哨兵常驻视口内不会再触发观察器回调
  void checkLoadMore()
}

onMounted(() => {
  void loadInitialCards()

  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        void appendCards(LOAD_MORE_SIZE)
      }
    },
    {
      root: scrollRef.value,
      rootMargin: '0px 0px 320px 0px',
    }
  )
  if (sentinelRef.value) observer.observe(sentinelRef.value)
})

onBeforeUnmount(() => {
  disposed = true
  loadToken += 1
  observer?.disconnect()
  observer = null
})
</script>
