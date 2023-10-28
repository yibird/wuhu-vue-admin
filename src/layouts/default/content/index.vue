<template>
  <a-layout-content class="flex flex-col">
    <div class="flex-1 m-10 p-10 bg-white overflow-y-auto">
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
<script setup lang="ts"></script>
