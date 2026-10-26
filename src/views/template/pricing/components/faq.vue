<template>
  <section
    class="page-enter page-enter--5 mt-16 overflow-hidden rounded-16 b-1-muted bg-container shadow-xl shadow-ink/5"
    aria-label="常见问题"
  >
    <div class="flex items-center justify-between gap-12 b-b-1-muted p-20">
      <div>
        <span
          class="inline-flex items-center gap-8 rounded-full bg-primary/10 px-10 py-4 text-xs text-primary font-800 uppercase tracking-wider"
        >
          <Icon name="i-lucide:message-circle-question" :size="12" />
          FAQ
        </span>
        <h2 class="mt-8 text-xl text-main font-900 leading-26">常见问题</h2>
      </div>
    </div>

    <div class="grid">
      <button
        v-for="(faq, index) in props.faqs"
        :key="faq.question"
        type="button"
        class="group w-full cursor-pointer overflow-hidden border-0 b-b-1-muted bg-transparent p-0 text-left outline-none transition-colors duration-200 ease-[var(--w-motion-ease)] last:border-b-0 hover:bg-primary/[0.03] focus-visible:(outline-2 outline-primary/60 outline-offset-2) motion-reduce:transition-none"
        :aria-expanded="props.openIndex === index"
        @click="emits('toggle', index)"
      >
        <span class="flex items-center justify-between gap-16 px-20 py-16">
          <span
            class="text-[15px] text-main font-700 transition-colors duration-200 group-hover:text-primary"
          >
            {{ faq.question }}
          </span>
          <span
            class="size-32 inline-flex shrink-0 items-center justify-center rounded-full transition-all duration-300 ease-[var(--w-motion-ease)]"
            :class="
              props.openIndex === index
                ? 'rotate-180 bg-primary text-white shadow-lg shadow-primary/35'
                : 'bg-muted text-secondary group-hover:(bg-primary/10 text-primary)'
            "
          >
            <Icon
              :name="
                props.openIndex === index ? 'i-lucide:minus' : 'i-lucide:plus'
              "
              :size="14"
            />
          </span>
        </span>
        <span
          class="grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-[var(--w-motion-ease-enter)] motion-reduce:transition-none"
          :class="
            props.openIndex === index
              ? 'grid-rows-[1fr] opacity-100'
              : 'grid-rows-[0fr] opacity-0'
          "
          :aria-hidden="props.openIndex !== index"
        >
          <span class="min-h-0 overflow-hidden">
            <span class="block px-20 pb-18 text-sm text-secondary leading-24">
              {{ faq.answer }}
            </span>
          </span>
        </span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PricingFaq } from '../types'

interface Props {
  faqs: PricingFaq[]
  openIndex: number
}

interface Emits {
  toggle: [index: number]
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()
</script>
