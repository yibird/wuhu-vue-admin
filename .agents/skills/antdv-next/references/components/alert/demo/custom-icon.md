# Custom Icon

## Description (en-US)

A relevant icon makes information clearer and more friendly.

## Source

```vue
<script setup lang="ts">
import { SmileOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const icon = () => h(SmileOutlined)
</script>

<template>
  <a-alert :icon="icon" title="showIcon = false" type="success" />
  <br>
  <a-alert :icon="icon" title="Success Tips" type="success" show-icon />
  <br>
  <a-alert :icon="icon" title="Informational Notes" type="info" show-icon />
  <br>
  <a-alert :icon="icon" title="Warning" type="warning" show-icon />
  <br>
  <a-alert :icon="icon" title="Error" type="error" show-icon />
  <br>
  <a-alert
    :icon="icon"
    title="Success Tips"
    description="Detailed description and advice about successful copywriting."
    type="success"
    show-icon
  />
  <br>
  <a-alert
    :icon="icon"
    title="Informational Notes"
    description="Additional description and information about copywriting."
    type="info"
    show-icon
  />
  <br>
  <a-alert
    :icon="icon"
    title="Warning"
    description="This is a warning notice about copywriting."
    type="warning"
    show-icon
  />
  <br>
  <a-alert
    :icon="icon"
    title="Error"
    description="This is an error message about copywriting."
    type="error"
    show-icon
  />
</template>
```
