# Size

## Description (en-US)

There are three sizes available: large, medium, and small. It can coordinate with input box.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const value = shallowRef()
</script>

<template>
  <a-flex vertical gap="middle">
    <a-radio-group v-model:value="value" size="small" default-value="a">
      <a-radio-button value="a">
        Hangzhou
      </a-radio-button>
      <a-radio-button value="b">
        Shanghai
      </a-radio-button>
      <a-radio-button value="c">
        Beijing
      </a-radio-button>
      <a-radio-button value="d">
        Chengdu
      </a-radio-button>
    </a-radio-group>
    <a-radio-group v-model:value="value" default-value="a">
      <a-radio-button value="a">
        Hangzhou
      </a-radio-button>
      <a-radio-button value="b">
        Shanghai
      </a-radio-button>
      <a-radio-button value="c">
        Beijing
      </a-radio-button>
      <a-radio-button value="d">
        Chengdu
      </a-radio-button>
    </a-radio-group>
    <a-radio-group v-model:value="value" size="large" disabled default-value="a">
      <a-radio-button value="a">
        Hangzhou
      </a-radio-button>
      <a-radio-button value="b">
        Shanghai
      </a-radio-button>
      <a-radio-button value="c">
        Beijing
      </a-radio-button>
      <a-radio-button value="d">
        Chengdu
      </a-radio-button>
    </a-radio-group>
  </a-flex>
</template>
```
