<template>
  <a-layout-content class="flex flex-col">
    <LayoutMultiTabs />
    <div class="px-10 pb-10 flex-1 overflow-y-auto">
      <RouterView>
        <template #default="{ Component, route }">
          <transition name="fade" mode="out-in" appear>
            <component :is="Component" :key="route.fullPath" />
          </transition>
        </template>
      </RouterView>
    </div>
  </a-layout-content>
</template>
<script setup lang="ts">
  import LayoutMultiTabs from '../multiTabs/index.vue';
</script>
