<template>
  <component v-if="component" :is="component" />
</template>
<script lang="ts" setup>
import { useSider } from './hooks'
const { component } = useSider()
</script>
