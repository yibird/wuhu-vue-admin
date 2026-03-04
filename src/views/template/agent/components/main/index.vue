<template>
  <main class="flex-1">
   <div class="full m-auto flex flex-col items-center justify-center sm:w-150 md:w-240 lg:w-400 xl:w-800">
      <div class="text-lg">有什么可以帮忙的？</div>
      <div
        class="mt-20 w-full p-10 border-1 border-solid border-[#E8E8E8] rounded-10"
      >
        <Editor />
        <div class="mt-10 flex items-center justify-between">
          <div class="flex items-center gap-10">
            <Model />
            <Tool />
          </div>
          <div class="flex items-center gap-5">
            <Issue />
            <Attachment />
            <Send />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
import Editor from './Editor.vue'
import Model from './model.vue'
import Tool from './tool.vue'
import Issue from './issue.vue'
import Attachment from './attachment.vue'
import Send from './send.vue'
</script>
