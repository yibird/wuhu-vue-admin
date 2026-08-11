# Asynchronous loading

## Description (en-US)

async.

## Source

```vue
<script setup lang="ts">
import type { MentionsOptionProps } from 'antdv-next'
import { debounce } from 'es-toolkit'
import { computed, shallowRef } from 'vue'

interface GithubUser {
  login: string
  avatar_url: string
}

const loading = shallowRef(false)
const users = shallowRef<GithubUser[]>([])
let fetchId = 0

async function fetchGithubUsers(search: string): Promise<GithubUser[]> {
  return fetch(`https://api.github.com/search/users?q=${search}`)
    .then(res => res.json())
    .then((res) => {
      const items = Array.isArray(res?.items) ? res.items : []
      return items.slice(0, 10)
    })
}

const debounceFetcher = debounce((search: string) => {
  fetchId += 1
  const currentFetchId = fetchId
  loading.value = true
  users.value = []

  fetchGithubUsers(search)
    .then((items) => {
      if (currentFetchId !== fetchId) {
        return
      }
      loading.value = false
      users.value = items
    })
    .catch(() => {
      if (currentFetchId !== fetchId) {
        return
      }
      loading.value = false
      users.value = []
    })
}, 800)

const options = computed<MentionsOptionProps[]>(() => {
  return users.value.map(({ login, avatar_url: avatar }) => ({
    key: login,
    value: login,
    class: 'mentions-demo-dynamic-option',
    label: avatar,
  }))
})

function handleSearch(search: string) {
  if (!search) {
    loading.value = false
    users.value = []
    return
  }
  debounceFetcher(search)
}
</script>

<template>
  <a-mentions
    style="width: 100%"
    :loading="loading"
    :options="options"
    @search="handleSearch"
  >
    <template #labelRender="{ option }">
      <img :draggable="false" :src="option.label as string" :alt="option.value">
      <span>{{ option.value }}</span>
    </template>
  </a-mentions>
</template>

<style>
.mentions-demo-dynamic-option-content {
  display: inline-flex;
  align-items: center;
}

.mentions-demo-dynamic-option img {
  width: 20px;
  height: 20px;
  margin-inline-end: 8px;
}
</style>
```
