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
const emit = defineEmits<Emits>()
</script>

<template>
  <section class="pricing-faq" aria-label="常见问题">
    <div class="pricing-section-head">
      <div>
        <span>Question Stack</span>
        <h2>常见问题</h2>
      </div>
    </div>

    <div class="pricing-faq__list">
      <button
        v-for="(faq, index) in props.faqs"
        :key="faq.question"
        type="button"
        class="pricing-faq__item dark:hover:bg-primary/10"
        :class="{ 'pricing-faq__item--open': props.openIndex === index }"
        :aria-expanded="props.openIndex === index"
        @click="emit('toggle', index)"
      >
        <span class="pricing-faq__question">
          {{ faq.question }}
          <Icon
            :name="
              props.openIndex === index ? 'i-lucide:minus' : 'i-lucide:plus'
            "
            :size="16"
          />
        </span>
        <span
          class="grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none"
          :class="
            props.openIndex === index
              ? 'grid-rows-[1fr] opacity-100'
              : 'grid-rows-[0fr] opacity-0'
          "
          :aria-hidden="props.openIndex !== index"
        >
          <span class="min-h-0 overflow-hidden">
            <span class="pricing-faq__answer">
              {{ faq.answer }}
            </span>
          </span>
        </span>
      </button>
    </div>
  </section>
</template>
