# Searchable

## Description (en-US)

Searchable Tree.

## Source

```vue
<script setup lang="ts">
import type { TreeDataNode, TreeEmits } from 'antdv-next'
import { computed, h, ref, watch } from 'vue'

type Key = string | number

const x = 3
const y = 2
const z = 1
const defaultData: TreeDataNode[] = []

function generateData(_level: number, _preKey?: Key, _tns?: TreeDataNode[]) {
  const preKey = _preKey || '0'
  const tns = _tns || defaultData

  const children: Key[] = []
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`
    tns.push({ title: key, key })
    if (i < y) {
      children.push(key)
    }
  }
  if (_level < 0) {
    return tns
  }
  const level = _level - 1
  children.forEach((key, index) => {
    tns[index!]!.children = []
    return generateData(level, key, tns[index!]!.children)
  })
}
generateData(z)

const dataList: { key: Key, title: string }[] = []
function generateList(data: TreeDataNode[]) {
  for (let i = 0; i < data.length; i++) {
    const node = data[i!]!
    const { key } = node
    dataList.push({ key, title: key as string })
    if (node.children) {
      generateList(node.children)
    }
  }
}
generateList(defaultData)

function getParentKey(key: Key, tree: TreeDataNode[]): Key {
  let parentKey: Key
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i!]!
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key
      }
      else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey!
}

const expandedKeys = ref<Key[]>([])
const searchValue = ref('')
const autoExpandParent = ref(true)

const onExpand: TreeEmits['expand'] = (newExpandedKeys) => {
  expandedKeys.value = newExpandedKeys
  autoExpandParent.value = false
}

function onChange(value: string) {
  const newExpandedKeys = dataList
    .map((item) => {
      if (item.title.includes(value)) {
        return getParentKey(item.key, defaultData)
      }
      return null
    })
    .filter((item, i, self): item is Key => !!(item && self.indexOf(item) === i))
  expandedKeys.value = newExpandedKeys
  autoExpandParent.value = true
}

watch(searchValue, (value) => {
  onChange(value)
})
const treeData = computed(() => {
  const loop = (data: TreeDataNode[]): TreeDataNode[] =>
    data.map((item) => {
      const strTitle = item.title as string
      const index = strTitle.indexOf(searchValue.value)
      const beforeStr = strTitle.substring(0, index)
      const afterStr = strTitle.slice(index + searchValue.value.length)
      const title
        = index > -1
          ? h('span', { key: item.key }, [
              beforeStr,
              h('span', { class: 'site-tree-search-value' }, searchValue.value),
              afterStr,
            ])
          : h('span', { key: item.key }, strTitle)
      if (item.children) {
        return { title, key: item.key, children: loop(item.children) }
      }

      return {
        title,
        key: item.key,
      }
    })

  return loop(defaultData)
})
</script>

<template>
  <div>
    <a-input-search
      v-model:value="searchValue"
      class="mb-8px"
      placeholder="Search"
    />
    {{ expandedKeys }}
    <a-tree
      v-model:expanded-keys="expandedKeys"
      :auto-expand-parent="autoExpandParent"
      :tree-data="treeData"
      @expand="onExpand"
    />
  </div>
</template>

<style>
.site-tree-search-value {
  color: #f50;
}
</style>
```
