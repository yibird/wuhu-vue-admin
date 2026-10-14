<template>
  <div class="flex flex-col">
    <ThemeMode />
    <MenuMode />
    <Theme />
    <Font />
    <Other />
  </div>
</template>
<script lang="ts" setup>
import ThemeMode from './theme-mode.vue'
import MenuMode from './menu-mode.vue'
import Theme from './theme.vue'
import Font from './font.vue'
import Other from './other.vue'
</script>
