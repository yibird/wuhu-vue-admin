<template>
  <div class="h-full min-h-0 flex flex-col gap-10 p-10">
    <header
      class="flex flex-wrap items-center gap-12 rounded-4 bg-container px-16 py-12"
    >
      <a-button type="text" title="返回列表" @click="goBack">
        <template #icon><Icon name="i-lucide:arrow-left" /></template>
      </a-button>

      <div
        class="size-42 flex-none flex-center rounded-4 bg-primary-tint text-primary"
      >
        <Icon :name="menu?.icon || 'i-lucide:menu'" :size="20" />
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-8">
          <h1 class="m-0 truncate text-base text-main font-700">
            {{ menu?.name || '菜单详情' }}
          </h1>
          <a-tag
            v-if="menu"
            :bordered="false"
            :color="menu.status ? 'success' : 'default'"
          >
            {{ menu.status ? '正常' : '停用' }}
          </a-tag>
        </div>
        <p class="m-0 mt-2 truncate text-xs text-secondary">
          {{ subtitle }}
        </p>
      </div>

      <div class="flex flex-none items-center gap-8">
        <a-button :disabled="!menu" @click="openEdit">
          <template #icon><Icon name="i-lucide:pencil" /></template>
          编辑
        </a-button>
      </div>
    </header>

    <div class="min-h-0 flex-1 overflow-y-auto">
      <a-spin :spinning="loading">
        <div v-if="menu" class="flex flex-col gap-10">
          <section class="rounded-4 bg-container p-16">
            <h2 class="mb-12 text-sm text-main font-600">基础信息</h2>
            <a-descriptions
              bordered
              size="middle"
              :column="{ xs: 1, sm: 2, xl: 3 }"
              :label-style="{ width: '110px' }"
            >
              <a-descriptions-item label="菜单名称">
                {{ menu.name }}
              </a-descriptions-item>
              <a-descriptions-item label="菜单类型">
                <a-tag :bordered="false" :color="menuType?.color">
                  {{ menuType?.label ?? '-' }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="排序">
                {{ menu.sort }}
              </a-descriptions-item>
              <a-descriptions-item label="状态">
                <a-tag
                  :bordered="false"
                  :color="menu.status ? 'success' : 'default'"
                >
                  {{ menu.status ? '正常' : '停用' }}
                </a-tag>
              </a-descriptions-item>
            </a-descriptions>
          </section>

          <section class="rounded-4 bg-container p-16">
            <h2 class="mb-12 text-sm text-main font-600">路由与权限</h2>
            <a-descriptions
              bordered
              size="middle"
              :column="{ xs: 1, sm: 2, xl: 3 }"
              :label-style="{ width: '110px' }"
            >
              <a-descriptions-item label="路由地址">
                {{ menu.path || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="组件路径">
                {{ menu.component || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="权限标识">
                <code class="text-xs">{{ menu.perms || '-' }}</code>
              </a-descriptions-item>
            </a-descriptions>
          </section>

          <section class="rounded-4 bg-container p-16">
            <h2 class="mb-12 text-sm text-main font-600">其他信息</h2>
            <a-descriptions
              bordered
              size="middle"
              :column="{ xs: 1, sm: 2, xl: 3 }"
              :label-style="{ width: '110px' }"
            >
              <a-descriptions-item label="备注" :span="3">
                {{ menu.remark || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="创建人">
                {{ menu.createdBy || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="创建时间">
                {{ menu.createdAt || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="更新时间">
                {{ menu.updatedAt || '-' }}
              </a-descriptions-item>
            </a-descriptions>
          </section>
        </div>

        <a-empty
          v-else-if="!loading"
          class="py-80"
          description="菜单不存在或已被删除"
        >
          <a-button type="primary" @click="goBack">返回列表</a-button>
        </a-empty>
      </a-spin>
    </div>

    <FormModal ref="modalRef" @success="onUpdated" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { getMenuRecordApi, type SysMenu } from '@/apis'
import { Icon } from '@/components'
import { useRequest, useTabs } from '@/hooks'
import FormModal from '../list/components/form-modal.vue'

import type { MenuType } from '#/config'

const route = useRoute()
const { openTabByPath } = useTabs()

const menuId = computed(() =>
  typeof route.query.id === 'string' ? route.query.id : ''
)

const modalRef = ref<InstanceType<typeof FormModal>>()

const { data, loading, run } = useRequest(
  (params: { id: string }) => getMenuRecordApi(params),
  { defaultParams: [{ id: menuId.value }], manual: !menuId.value }
)

const menu = computed<SysMenu | undefined>(() => data.value?.data ?? undefined)

/** 菜单类型展示配置,与 SysMenu.type 语义保持一致 */
const menuTypeMap: Record<MenuType, { label: string; color: string }> = {
  1: { label: '目录', color: 'blue' },
  2: { label: '菜单', color: 'cyan' },
  3: { label: '按钮', color: 'orange' },
  4: { label: '权限按钮', color: 'purple' },
}

const menuType = computed(() =>
  menu.value ? menuTypeMap[menu.value.type] : undefined
)

const typeLabel = computed(() => menuType.value?.label ?? '-')

const subtitle = computed(() =>
  menu.value
    ? `${typeLabel.value} · ${menu.value.path || '无路由'}`
    : '加载中...'
)

function goBack() {
  openTabByPath('/sys/menu/list')
}

function openEdit() {
  const record = menu.value
  if (!record) return
  modalRef.value?.show(record)
}

function onUpdated() {
  run({ id: menuId.value })
}
</script>
