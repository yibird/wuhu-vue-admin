<template>
  <n-layout-content
    class="relative flex-1"
    content-class="layout-content dark:bg-[#070707]!"
  >
    <router-view v-if="store.renderRouteView" v-slot="{ Component }">
      <transition name="slide-left" mode="out-in">
        <keep-alive :include="include">
          <component :is="Component" :key="$route.fullPath" />
        </keep-alive>
      </transition>
    </router-view>
    <div v-else class="full"></div>
  </n-layout-content>
</template>
<script lang="ts" setup>
import { tabsStore } from '@/store'
import { useKeepAlive } from './useKeepAlive'

const store = tabsStore()
const { include } = useKeepAlive()
</script>
