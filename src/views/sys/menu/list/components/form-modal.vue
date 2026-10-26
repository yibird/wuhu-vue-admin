<template>
  <a-modal
    v-model:open="open"
    title="新建菜单"
    cancel-text="取消"
    ok-text="确定"
    :width="800"
  >
    <a-form
      ref="formRef"
      :rules="rules"
      :model="formState"
      :label-col="{ style: { width: '88px' } }"
      class="py-10"
    >
      <a-row :gutter="20">
        <a-col :span="24">
          <a-form-item label="菜单类型" name="menuType">
            <a-radio-group v-model:value="formState.menuType">
              <a-space>
                <a-radio
                  v-for="item in menuTypeOptions"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-radio>
              </a-space>
            </a-radio-group>
          </a-form-item>
        </a-col>

        <a-col :span="24">
          <a-form-item label="上级菜单" name="parentId">
            <a-select />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="菜单名称" name="menuName" required>
            <a-input
              v-model:value="formState.menuName"
              allow-clear
              :maxlength="30"
              show-count
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="菜单图标" name="icon">
            <IconSelector
              v-model:value="formState.icon"
              empty-text="没有匹配的图标"
              placeholder="请选择菜单图标"
              search-placeholder="搜索图标名称"
            />
          </a-form-item>
        </a-col>

        <a-col v-if="formState.menuType !== 4" :span="12">
          <a-form-item label="路由地址" name="path">
            <a-input
              v-model:value="formState.path"
              allow-clear
              :placeholder="
                formState.isExternal
                  ? '请输入外部链接地址，例如 https://example.com'
                  : '请输入路由地址'
              "
            />
          </a-form-item>
        </a-col>

        <a-col
          v-if="formState.menuType !== 4 && !formState.isExternal"
          :span="24"
        >
          <a-form-item name="component">
            <template #label>
              <span class="inline-flex items-center gap-4">
                <span>组件路径</span>
                <a-tooltip
                  title="填写相对于 src/views 的页面组件路径，例如 sys/user/index.vue"
                >
                  <Icon
                    name="i-lucide:circle-help"
                    class="cursor-help text-muted"
                    :size="14"
                  />
                </a-tooltip>
              </span>
            </template>
            <a-input
              v-model:value="formState.component"
              allow-clear
              placeholder="请输入组件路径"
            />
          </a-form-item>
        </a-col>

        <a-col v-if="formState.menuType === 4" :span="12">
          <a-form-item label="权限标识" name="perms">
            <a-input
              v-model:value="formState.perms"
              allow-clear
              placeholder="请输入权限标识"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="是否隐藏" name="hidden">
            <a-switch v-model:checked="formState.hidden" />
          </a-form-item>
        </a-col>

        <a-col v-if="formState.menuType !== 4" :span="12">
          <a-form-item label="是否外链" name="isExternal">
            <a-switch v-model:checked="formState.isExternal" />
          </a-form-item>
        </a-col>

        <a-col v-if="formState.menuType !== 4" :span="12">
          <a-form-item label="是否缓存" name="keepAlive">
            <a-switch v-model:checked="formState.keepAlive" />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="菜单排序" name="sort">
            <a-input-number
              v-model:value="formState.sort"
              :min="0"
              :max="99999999"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { IconSelector } from '@/components/icon-picker'
import type { SysMenu } from '@/apis'
import type { MenuType } from '#/config'
import type { FormInstance } from 'antdv-next'

const open = ref(false)
const formRef = shallowRef<FormInstance>()
const show = (_record?: SysMenu) => {
  open.value = true
}

defineExpose({ show })

/** 与 SysMenu.type 的语义保持一致:1 目录、2 菜单、3 子菜单、4 权限按钮 */
const menuTypeOptions: Array<{ label: string; value: MenuType }> = [
  {
    label: '目录',
    value: 1,
  },
  {
    label: '菜单',
    value: 2,
  },
  {
    label: '子菜单',
    value: 3,
  },
  {
    label: '权限按钮',
    value: 4,
  },
]

const formState = reactive({
  menuType: 1 as MenuType,
  menuName: '',
  icon: '',
  path: '',
  isExternal: false,
  component: '',
  perms: '',
  hidden: false,
  keepAlive: true,
  sort: 0,
})

const rules = computed(() => ({
  menuName: [
    {
      required: true,
      message: '请输入菜单名称',
      trigger: 'blur',
    },
  ],
  path: [
    {
      required: formState.menuType !== 4,
      whitespace: true,
      message: '请输入路由地址',
      trigger: 'blur',
    },
  ],
  perms: [
    {
      required: formState.menuType === 4,
      whitespace: true,
      message: '请输入权限标识',
      trigger: 'blur',
    },
  ],
}))

/** 权限按钮不需要路由与组件 */
watch(
  () => formState.menuType,
  (menuType) => {
    formRef.value?.clearValidate(['path', 'component', 'perms'])
    if (menuType === 4) {
      formState.path = ''
      formState.component = ''
    } else {
      formState.perms = ''
    }
  }
)

/** 外部链接没有本地组件 */
watch(
  () => formState.isExternal,
  (isExternal) => {
    formRef.value?.clearValidate(['path', 'component'])
    if (isExternal) formState.component = ''
  }
)
</script>
