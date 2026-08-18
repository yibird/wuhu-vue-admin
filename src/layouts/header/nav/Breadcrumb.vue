<template>
  <div
    v-if="showBreadcrumb"
    class="mx-10 hidden min-w-0 flex-1 overflow-hidden md:block"
  >
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
              v-if="item.children && item.children.length > 0"
              :menu="{ items: dropdownMenus[index] }"
              @menu-click="onSelect"
            >
              <div class="max-w-140 flex items-center gap-4 truncate">
                <Icon
                  v-if="showBreadCrumbIcon && item.icon"
                  :name="item.icon"
                  :size="14"
                  class="shrink-0"
                />
                <span class="truncate">{{ item.title }}</span>
              </div>
            </a-dropdown>
            <div v-else class="max-w-140 flex items-center gap-4 truncate">
              <Icon
                v-if="showBreadCrumbIcon && item.icon"
                :name="item.icon"
                :size="14"
                class="shrink-0"
              />
              <span class="truncate">{{ item.title }}</span>
            </div>
          </div>
        </Transition>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>
<script lang="ts" setup>
import { useBreadcrumb } from '../composables'

const { showBreadcrumb, showBreadCrumbIcon, items, dropdownMenus, openMenu } =
  useBreadcrumb()

const onSelect = ({ key }: { key: string | number }) => {
  openMenu(key)
}
</script>

<style scoped lang="less">
.w-header-breadcrumb.ant-breadcrumb {
  overflow: hidden;
  white-space: nowrap;

  :deep(ol) {
    flex-wrap: nowrap;
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
