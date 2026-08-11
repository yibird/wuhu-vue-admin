<template>
  <div class="flex flex-col">
    <ThemeMode />
    <MenuMode />
    <Theme />
    <Other />
  </div>
</template>
<script lang="ts" setup>
import ThemeMode from './ThemeMode.vue'
import MenuMode from './MenuMode.vue'
import Theme from './Theme.vue'
import Other from './Other.vue'
</script>
