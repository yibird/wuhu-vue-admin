<template>
  <n-layout-content
    class="relative flex-1"
    content-class="layout-content dark:bg-[#070707]!"
  >
    <router-view v-if="renderRouteView" v-slot="{ Component }">
      <transition :name="transitionName" mode="out-in">
        <keep-alive :include="include">
          <suspense :timeout="0">
            <component :is="Component" :key="$route.fullPath" />
            <template #fallback>
              <div class="h-full flex items-center justify-center">
                <n-spin size="large">
                  <template #description>Loading...</template>
                </n-spin>
              </div>
            </template>
          </suspense>
        </keep-alive>
      </transition>
    </router-view>
  </n-layout-content>
</template>
<script lang="ts" setup>
import { useKeepAlive } from './useKeepAlive'
import { useTransition } from './useTransition'
const { renderRouteView, include } = useKeepAlive()
const { transitionName } = useTransition()
</script>
