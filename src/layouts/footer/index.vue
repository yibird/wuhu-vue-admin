<template>
  <a-layout-footer v-if="footer.show" class="p-0!">
    <div
      v-if="copyright.show"
      class="py-8 flex items-center justify-center text-xs text-regular"
    >
      <a :href="copyright.icpUrl" target="_blank" class="mx-6 hover:text-theme">
        {{ copyright.icpNo }}
      </a>
      <span>Copyright © {{ copyright.date }}</span>
      <a
        :href="copyright.companyUrl"
        target="_blank"
        class="mx-6 hover:text-theme"
      >
        {{ copyright.companyName }}
      </a>
    </div>
  </a-layout-footer>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store'

const { footer, copyright } = useAppStore()
</script>
