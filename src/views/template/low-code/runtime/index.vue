<template>
  <div
    class="h-full min-h-0 flex flex-col overflow-hidden bg-page"
    :style="themeStyle"
  >
    <template v-if="schema && runtime">
      <header
        class="flex-y-center gap-10 border-0 border-b-1 border-color-2 border-b-solid bg-container px-16 py-10"
      >
        <span class="size-28 flex-center rounded-7 bg-primary text-white">
          <Icon name="i-lucide:blocks" :size="15" />
        </span>
        <div class="min-w-0">
          <div class="text-sm text-main font-700">
            {{ schema.app.name }}
          </div>
          <div class="text-11px text-muted">
            v{{ schema.app.version }} · Runtime 渲染
          </div>
        </div>

        <div class="mx-auto flex-y-center gap-8">
          <button
            v-for="page in accessiblePages"
            :key="page.id"
            class="rounded-6 px-10 py-5 text-xs"
            :class="
              page.id === activePageId
                ? 'bg-primary/8 text-primary'
                : 'text-secondary hover:text-primary'
            "
            type="button"
            @click="activePageId = page.id"
          >
            {{ page.name }}
          </button>
        </div>

        <a-button @click="refresh">
          <Icon name="i-lucide:refresh-cw" :size="13" class="mr-4" /> 刷新数据
        </a-button>
      </header>

      <div class="min-h-0 flex-1 overflow-auto p-16">
        <div
          v-if="!runtime.canAccessPage(activePageId)"
          class="mx-auto mt-80px flex max-w-520px flex-col items-center gap-10 rounded-10 border-1 border-color-2 border-solid bg-container p-40"
        >
          <Icon name="i-lucide:shield-x" :size="32" class="text-error" />
          <div class="text-sm text-main font-600">当前角色无权访问该页面</div>
        </div>
        <div
          v-else
          class="mx-auto w-full overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-main shadow-elevated"
          :style="{ maxWidth: '1440px' }"
        >
          <SchemaRenderer
            :runtime="runtime"
            :components="activePage?.components ?? []"
          />
        </div>
      </div>
    </template>

    <div v-else class="flex-center h-full flex-col gap-12 bg-container">
      <Icon name="i-lucide:file-question" :size="36" class="text-muted" />
      <div class="text-sm text-main font-600">未找到已发布的应用</div>
      <div class="max-w-420px text-center text-xs text-secondary">
        运行时页面会读取当前浏览器中已发布的 Schema 快照。
        请先在设计器中点击「发布」，或检查链接参数是否正确。
      </div>
      <a-button type="primary" @click="goDesigner">返回设计器</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@/components'
import { formatRgbColor, hexToRgb } from '@/utils'
import { SchemaRenderer } from '../components'
import { loadPublished } from '../core/persistence'
import { createRuntime } from '../core/runtime'
import { setupLowCodePlatform } from '../core/setup'
import type { DeviceKind } from '../core/runtime'
import type { ApplicationSchema, PageSchema } from '../core/schema/types'

setupLowCodePlatform()

const route = useRoute()
const router = useRouter()

const published = loadPublished(
  String(route.query.app ?? 'low-code-demo'),
  route.query.version ? String(route.query.version) : undefined
)
const schema = ref<ApplicationSchema | undefined>(published?.schema)

const activePageId = ref(schema.value?.pages[0]?.id ?? '')
const viewportWidth = ref(window.innerWidth)
const device = computed<DeviceKind>(() =>
  viewportWidth.value < 768
    ? 'mobile'
    : viewportWidth.value < 1280
      ? 'tablet'
      : 'pc'
)

const activePage = computed<PageSchema | undefined>(() =>
  schema.value?.pages.find((page) => page.id === activePageId.value)
)

const runtime = schema.value
  ? createRuntime({
      schema: schema.value,
      page: activePage as never,
      device,
      routeParams: Object.fromEntries(
        Object.entries(route.query).map(([key, value]) => [
          key,
          String(value ?? ''),
        ])
      ),
      navigate: (path, query) => {
        router.push({
          path,
          query: query as Record<string, string>,
        })
      },
    })
  : undefined

const accessiblePages = computed(
  () =>
    schema.value?.pages.filter((page) => runtime?.canAccessPage(page.id)) ?? []
)

const themeStyle = computed(() => {
  const color = schema.value?.theme?.primaryColor
  const rgb = hexToRgb(color ?? '')
  return {
    '--w-color-primary':
      formatRgbColor(rgb ?? (color || '#1677ff'), ' ') ?? undefined,
  }
})

function refresh() {
  runtime?.refreshAutoQueries()
}

function goDesigner() {
  router.push('/template/low-code')
}

function onResize() {
  viewportWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', onResize)
  runtime?.refreshAutoQueries()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  runtime?.dispose()
})
</script>
