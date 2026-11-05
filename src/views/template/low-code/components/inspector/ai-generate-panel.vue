<template>
  <div class="min-h-0 flex-1 flex flex-col">
    <header
      class="shrink-0 flex items-center justify-between gap-8 border-0 b-b-1-regular px-14 py-9"
    >
      <div class="min-w-0 flex-y-center gap-6">
        <Icon name="i-lucide:sparkles" :size="15" class="text-primary" />
        <span class="truncate text-sm text-main font-700">AI 生成页面</span>
      </div>
      <a-popover placement="bottomRight" trigger="click">
        <a-button size="small" title="提示词模板">
          <template #icon>
            <Icon name="i-lucide:lightbulb" :size="13" />
          </template>
          示例
        </a-button>
        <template #content>
          <div class="w-280 grid gap-6">
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
    </header>

    <div class="min-h-0 flex-1">
      <Scrollbar class="h-full">
        <div class="p-12">
          <div
            v-for="item in messages"
            :key="item.id"
            class="mb-10 flex"
            :class="item.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[92%] rounded-7 px-9 py-7 text-xs leading-18px"
              :class="
                item.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-fill text-regular'
              "
            >
              <p class="m-0">{{ item.content }}</p>
              <span class="mt-3 block text-10px opacity-58">
                {{ item.createdAt }}
              </span>
            </div>
          </div>

          <div v-if="busy" class="mb-10 flex-y-center gap-6 text-xs text-muted">
            <Icon
              name="i-lucide:loader-circle"
              :size="13"
              class="animate-spin"
            />
            正在解析提示词并生成 Schema…
          </div>

          <section
            v-if="plan"
            class="mt-2 overflow-hidden rounded-7 b-1-primary/30"
          >
            <header class="b-b-1-primary/20 bg-primary/4 px-10 py-8">
              <div class="flex-y-center justify-between gap-8">
                <div class="min-w-0">
                  <div class="truncate text-xs text-main font-700">
                    {{ plan.title }}
                  </div>
                  <div class="mt-2 text-10px text-muted">
                    {{ plan.summary }}
                  </div>
                </div>
                <a-tag color="blue" :bordered="false">
                  {{ plan.fields.length }} 字段
                </a-tag>
              </div>
            </header>

            <div class="grid gap-6 p-10">
              <div
                v-for="(highlight, index) in plan.highlights"
                :key="`h-${index}`"
                class="flex-y-center gap-6 text-11px text-regular"
              >
                <Icon
                  name="i-lucide:circle-check"
                  :size="12"
                  class="shrink-0 text-success"
                />
                <span class="min-w-0">{{ highlight }}</span>
              </div>

              <div
                v-for="(warning, index) in plan.warnings"
                :key="`w-${index}`"
                class="flex-y-center gap-6 text-11px text-warning"
              >
                <Icon
                  name="i-lucide:triangle-alert"
                  :size="12"
                  class="shrink-0"
                />
                <span class="min-w-0">{{ warning }}</span>
              </div>

              <div class="flex flex-wrap gap-5 pt-1">
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
      </Scrollbar>
    </div>

    <footer class="shrink-0 b-t-1-regular p-10">
      <textarea
        v-model="prompt"
        class="h-64 w-full resize-none rounded-6 b-1-regular bg-fill px-9 py-7 text-xs text-main outline-none focus:border-primary"
        placeholder="例如：生成一个用户管理列表页，包含姓名、角色、状态、创建日期，顶部带搜索筛选"
        @keydown.ctrl.enter.prevent="generate"
        @keydown.meta.enter.prevent="generate"
      ></textarea>
      <div class="mt-8 grid grid-cols-2 gap-6">
        <a-button
          block
          type="primary"
          :disabled="busy || !prompt.trim()"
          @click="generate"
        >
          <Icon
            :name="busy ? 'i-lucide:loader-circle' : 'i-lucide:wand-sparkles'"
            :size="14"
            class="mr-4"
            :class="{ 'animate-spin': busy }"
          />
          {{ busy ? '生成中' : '生成页面' }}
        </a-button>
        <a-button block :disabled="!canApply" @click="apply">
          <Icon name="i-lucide:check-check" :size="14" class="mr-4" />
          应用到画布
        </a-button>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { message } from 'antdv-next'
import { Icon, Scrollbar } from '@/components'
import { useDesignerAi, useDesignerContext } from '../../hooks'

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
}
</script>
