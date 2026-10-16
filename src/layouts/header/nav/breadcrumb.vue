<template>
  <div v-if="show" class="mx-10 hidden min-w-0 flex-1 overflow-hidden md:block">
    <a-breadcrumb class="w-header-breadcrumb">
      <a-breadcrumb-item v-for="(item, index) in items" :key="item.id">
        <Transition
          enter-active-class="slide-down-enter-active"
          enter-from-class="slide-down-enter-from"
          enter-to-class="slide-down-enter-to"
          leave-active-class="slide-up-leave-active breadcrumb-item-leave-active"
          leave-from-class="slide-up-leave-from"
          leave-to-class="slide-up-leave-to"
        >
          <div :key="item.id">
            <a-dropdown
              :disabled="!dropdownMenus[index]?.length"
              :menu="{ items: dropdownMenus[index] }"
              @menu-click="onMenuClick"
            >
              <div
                class="max-w-140 flex items-center gap-4 truncate leading-none"
              >
                <Icon
                  v-if="showIcon && item.icon"
                  :name="item.icon"
                  :size="14"
                  class="shrink-0"
                />
                <span class="truncate">{{ item.title }}</span>
              </div>
            </a-dropdown>
          </div>
        </Transition>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>
<script lang="ts" setup>
import { useBreadcrumb } from '../hooks'

const { show, showIcon, items, dropdownMenus, openMenu } = useBreadcrumb()

const onMenuClick = ({ key }: { key: string }) => {
  openMenu(key)
}
</script>

<style scoped lang="less">
.w-header-breadcrumb.ant-breadcrumb {
  overflow: hidden;
  white-space: nowrap;

  :deep(ol) {
    flex-wrap: nowrap;
    align-items: center;
  }

  :deep(.ant-breadcrumb-item) {
    display: inline-flex;
    align-items: center;
  }

  :deep(.ant-breadcrumb-link) {
    position: relative;
    overflow: hidden;
  }

  .breadcrumb-item-leave-active {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
}
</style>
