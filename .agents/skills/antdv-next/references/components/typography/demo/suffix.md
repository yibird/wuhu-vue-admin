# suffix

## Description (en-US)

Add suffix ellipsis support.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const rows = ref(1)

const article = `To be, or not to be, that is the question: Whether it is nobler in the mind to suffer. The slings and arrows of outrageous fortune Or to take arms against a sea of troubles, And by opposing end them? To die: to sleep; No more; and by a sleep to say we end The heart-ache and the thousand natural shocks That flesh is heir to, 'tis a consummation Devoutly to be wish'd. To die, to sleep To sleep- perchance to dream: ay, there's the rub! For in that sleep of death what dreams may come When we have shuffled off this mortal coil, Must give us pause. There 's the respect That makes calamity of so long life`

function onEllipsis(ellipsis: boolean) {
  console.log('Ellipsis changed:', ellipsis)
}
</script>

<template>
  <div>
    <a-slider v-model:value="rows" :min="1" :max="10" />
    <a-typography-paragraph
      :ellipsis="{
        rows,
        expandable: true,
        suffix: '--William Shakespeare',
        onEllipsis,
      }"
      :title="`${article}--William Shakespeare`"
    >
      {{ article }}
    </a-typography-paragraph>
  </div>
</template>
```
