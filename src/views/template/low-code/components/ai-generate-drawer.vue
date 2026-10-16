<template>
  <a-drawer
    :open="open"
    placement="right"
    :size="560"
    :styles="{ body: { padding: 0 } }"
    @close="emit('close')"
  >
    <template #title>
      <div class="flex-y-center gap-7">
        <Icon name="i-lucide:sparkles" :size="17" class="text-primary" />
        <span class="text-14px text-main font-700">AI 生成页面</span>
        <span
          class="rounded-4 border-1 border-primary/25 border-solid bg-primary/8 px-4 text-10px text-primary"
        >
          自然语言 → DSL
        </span>
      </div>
    </template>
    <template #extra>
      <a-popover placement="bottomRight" trigger="click">
        <a-button size="small" title="提示词模板">
          <template #icon>
            <Icon name="i-lucide:lightbulb" :size="14" />
          </template>
          示例
        </a-button>
        <template #content>
          <div class="w-300 grid gap-6">
            <a-button
              v-for="suggestion in suggestions"
              :key="suggestion.id"
              class="!h-auto !justify-start !whitespace-normal !py-7 !text-left"
              @click="useSuggestion(suggestion.prompt)"
            >
              <Icon :name="suggestion.icon" :size="14" class="mr-4" />
              {{ suggestion.title }}
            </a-button>
          </div>
        </template>
      </a-popover>
    </template>

    <div class="h-full grid grid-rows-[minmax(0,1fr)_auto]">
      <div class="min-h-0 overflow-x-hidden overflow-y-auto p-14">
        <div
          v-for="item in messages"
          :key="item.id"
          class="mb-10 flex"
          :class="item.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div
            class="max-w-[88%] rounded-8 px-10 py-8 text-12px leading-20px"
            :class="
              item.role === 'user'
                ? 'bg-primary text-white'
                : 'bg-fill text-regular'
            "
          >
            <p class="m-0">{{ item.content }}</p>
            <span class="mt-4 block text-10px opacity-58">
              {{ item.createdAt }}
            </span>
          </div>
        </div>

        <div v-if="busy" class="mb-10 flex-y-center gap-6 text-12px text-muted">
          <Icon name="i-lucide:loader-circle" :size="14" class="animate-spin" />
          正在解析提示词并生成 Schema…
        </div>

        <section
          v-if="plan"
          class="mt-4 overflow-hidden rounded-8 border-1 border-primary/30 border-solid"
        >
          <header
            class="border-b-1 border-b-solid border-primary/20 bg-primary/4 px-12 py-9"
          >
            <div class="flex-y-center justify-between gap-8">
              <div class="min-w-0">
                <div class="truncate text-13px text-main font-700">
                  {{ plan.title }}
                </div>
                <div class="mt-2 text-11px text-muted">{{ plan.summary }}</div>
              </div>
              <a-tag color="blue" :bordered="false">
                {{ plan.fields.length }} 字段
              </a-tag>
            </div>
          </header>

          <div class="grid gap-8 p-12">
            <div
              v-for="(highlight, index) in plan.highlights"
              :key="`h-${index}`"
              class="flex-y-center gap-6 text-12px text-regular"
            >
              <Icon
                name="i-lucide:circle-check"
                :size="13"
                class="shrink-0 text-success"
              />
              <span class="min-w-0">{{ highlight }}</span>
            </div>

            <div
              v-for="(warning, index) in plan.warnings"
              :key="`w-${index}`"
              class="flex-y-center gap-6 text-12px text-warning"
            >
              <Icon
                name="i-lucide:triangle-alert"
                :size="13"
                class="shrink-0"
              />
              <span class="min-w-0">{{ warning }}</span>
            </div>

            <div class="flex flex-wrap gap-6 pt-2">
              <a-tag
                v-for="field in plan.fields"
                :key="field.key"
                :bordered="false"
              >
                {{ field.label }} · {{ field.type }}
              </a-tag>
            </div>
          </div>
        </section>
      </div>

      <footer class="border-t-1 border-t-solid border-color-2 p-12">
        <textarea
          v-model="prompt"
          class="h-76 w-full resize-none rounded-7 border-1 border-color-2 border-solid bg-fill px-10 py-8 text-13px text-main outline-none focus:border-primary"
          placeholder="例如：生成一个用户管理列表页，包含姓名、角色、状态、创建日期，顶部带搜索筛选"
          @keydown.ctrl.enter.prevent="generate"
          @keydown.meta.enter.prevent="generate"
        ></textarea>
        <div class="mt-8 grid grid-cols-2 gap-8">
          <a-button
            block
            type="primary"
            :disabled="busy || !prompt.trim()"
            @click="generate"
          >
            <Icon
              :name="busy ? 'i-lucide:loader-circle' : 'i-lucide:wand-sparkles'"
              :size="15"
              class="mr-4"
              :class="{ 'animate-spin': busy }"
            />
            {{ busy ? '生成中' : '生成页面' }}
          </a-button>
          <a-button block :disabled="!canApply" @click="apply">
            <Icon name="i-lucide:check-check" :size="15" class="mr-4" />
            应用到当前页面
          </a-button>
        </div>
      </footer>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { message } from 'antdv-next'
import { Icon } from '@/components'
import { useDesignerAi, useDesignerContext } from '../hooks'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const designer = useDesignerContext()
const {
  prompt,
  busy,
  messages,
  plan,
  canApply,
  suggestions,
  generate,
  applyPlan,
  useSuggestion,
} = useDesignerAi(designer)

function apply() {
  if (!applyPlan()) return
  message.success('已生成页面，可在画布上继续调整')
  emit('close')
}
</script>
