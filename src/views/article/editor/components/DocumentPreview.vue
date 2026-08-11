<script setup lang="ts">
import { computed } from 'vue'
import { sanitizeHtml } from '../utils'

const props = defineProps<{
  html: string
}>()

const safeHtml = computed(() => sanitizeHtml(props.html))
</script>

<template>
  <article class="editor-preview" v-html="safeHtml" />
</template>

<style scoped>
.editor-preview {
  color: rgb(var(--w-text-main));
}

.editor-preview :deep(*) {
  max-width: 100%;
}

.editor-preview :deep(p) {
  margin: 0 0 0.9em;
  line-height: 1.85;
}

.editor-preview :deep(h1),
.editor-preview :deep(h2),
.editor-preview :deep(h3),
.editor-preview :deep(h4),
.editor-preview :deep(h5),
.editor-preview :deep(h6) {
  margin: 0 0 0.7em;
  font-weight: 650;
  line-height: 1.3;
}

.editor-preview :deep(h1) {
  font-size: 30px;
}

.editor-preview :deep(h2) {
  font-size: 24px;
}

.editor-preview :deep(h3) {
  font-size: 19px;
}

.editor-preview :deep(h4) {
  font-size: 17px;
}

.editor-preview :deep(h5),
.editor-preview :deep(h6) {
  font-size: 15px;
}

.editor-preview :deep(ul),
.editor-preview :deep(ol) {
  padding-left: 1.4em;
  margin: 0 0 1em;
}

.editor-preview :deep(ul[data-type='taskList']) {
  padding-left: 0;
  list-style: none;
}

.editor-preview :deep(li[data-type='taskItem']) {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.editor-preview :deep(li[data-type='taskItem'] > label) {
  flex: 0 0 auto;
  margin-top: 3px;
}

.editor-preview :deep(li[data-type='taskItem'] > div) {
  flex: 1;
  min-width: 0;
}

.editor-preview :deep(blockquote) {
  padding: 10px 14px;
  margin: 0 0 1em;
  color: rgb(var(--w-text-regular));
  background: rgb(var(--w-fill-quaternary));
  border-left: 3px solid rgb(var(--w-color-primary));
  border-radius: 0 6px 6px 0;
}

.editor-preview :deep(pre) {
  padding: 14px 16px;
  overflow-x: auto;
  color: #f8fafc;
  background: #111827;
  border-radius: 8px;
}

.editor-preview :deep(code) {
  padding: 2px 5px;
  color: rgb(var(--w-color-primary));
  background: rgb(var(--w-color-primary) / 10%);
  border-radius: 4px;
}

.editor-preview :deep(pre code) {
  padding: 0;
  color: inherit;
  background: transparent;
}

.editor-preview :deep(a) {
  color: rgb(var(--w-color-primary));
  text-decoration: underline;
  text-underline-offset: 3px;
}

.editor-preview :deep(mark) {
  padding: 0 3px;
  border-radius: 3px;
}

.editor-preview :deep(img) {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 8px 0;
  border-radius: 8px;
}

.editor-preview :deep(hr) {
  height: 1px;
  margin: 18px 0;
  background: rgb(var(--w-border-color-2));
  border: 0;
}

.editor-preview :deep(table) {
  width: 100%;
  margin: 12px 0 1em;
  overflow: hidden;
  border-collapse: collapse;
  border: 1px solid rgb(var(--w-border-color-2));
  border-radius: 6px;
}

.editor-preview :deep(th),
.editor-preview :deep(td) {
  min-width: 90px;
  padding: 9px 10px;
  vertical-align: top;
  border: 1px solid rgb(var(--w-border-color-2));
}

.editor-preview :deep(th) {
  font-weight: 600;
  background: rgb(var(--w-fill-quaternary));
}
</style>
