# Coordinate

## Description (en-US)

Coordinating the selection of provinces and cities is a common use case and demonstrates how selection can be coordinated. [Cascader](../../cascader/docs.md) component is strongly recommended in this case.

## Source

```vue
<script setup lang="ts">
import { computed, shallowRef } from 'vue'

const cityData: Record<string, string[]> = {
  Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],
  Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang'],
}

const provinceData: string[] = ['Zhejiang', 'Jiangsu']

const province = shallowRef(provinceData[0]!)
const secondCity = shallowRef(cityData[provinceData[0]!]![0])

const cities = computed(() => cityData[province.value] ?? [])

function handleProvinceChange(value: string) {
  province.value = value
  secondCity.value = cityData[value]?.[0] ?? ''
}
</script>

<template>
  <a-space wrap>
    <a-select
      v-model:value="province"
      style="width: 120px"
      :options="provinceData.map((p) => ({ label: p, value: p }))"
      @change="handleProvinceChange"
    />
    <a-select
      v-model:value="secondCity"
      style="width: 120px"
      :options="cities.map((c) => ({ label: c, value: c }))"
    />
  </a-space>
</template>
```
