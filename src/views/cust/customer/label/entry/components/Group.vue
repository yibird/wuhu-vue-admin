<template>
  <div class="border-1 border-solid border-[#f0f0f0] rounded-2 overflow-hidden">
    <div
      class="p-12 flex items-center justify-between bg-[#fafafa] border-b-1 border-b-solid border-[#f0f0f0]"
    >
      <span class="text-sm">
        <span>标签(共</span>
        <span class="mx-2 text-theme">6</span>
        <span>个标签)</span>
      </span>
      <div class="flex gap-8">
        <Icon name="i-lucide:edit" :size="18" class="cursor-pointer hover:text-theme" />
        <n-popconfirm @positive-click="handlePositiveClick" @negative-click="handleNegativeClick">
          <template #trigger>
            <Icon name="i-lucide:beer" :size="18" class="cursor-pointer hover:text-theme" />
          </template>
          是否删除该标签组？
        </n-popconfirm>
      </div>
    </div>
    <div class="py-12 px-15 flex gap-12">
      <n-button @click="handleAdd">添加</n-button>
      <n-input
        v-if="edit"
        ref="inputRef"
        clearable
        :maxlength="30"
        placeholder="请输入标签名称"
        class="w-180!"
      />
      <Tag />
      <Tag />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import Tag from './Tag.vue'
  const edit = ref(false)
  const inputRef = ref()
  const handlePositiveClick = () => {}
  const handleNegativeClick = () => {}

  const handleAdd = () => {
    if (edit.value) {
      edit.value = false
      return
    }
    edit.value = true
    setTimeout(() => {
      inputRef.value.focus()
    })
  }
</script>
