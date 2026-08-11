<template>
  <a-modal
    v-model:open="open"
    title="新建菜单"
    cancel-text="取消"
    ok-text="确定"
    :width="800"
  >
    <a-form
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
            <a-input />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="路由地址" name="path">
            <a-input />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="重定向" name="redirect">
            <a-input />
          </a-form-item>
        </a-col>

        <a-col :span="24">
          <a-form-item label="组件路径" name="component">
            <a-input />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="组件名称" name="componentName">
            <a-input />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="权限标识" name="permission">
            <a-input />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="是否隐藏" name="hidden">
            <a-switch />
          </a-form-item>
        </a-col>

        <a-col v-if="formState.menuType !== 3" :span="12">
          <a-form-item label="是否缓存" name="keepAlive">
            <a-switch v-model:checked="formState.keepAlive" />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="菜单排序" name="sort">
            <a-input-number :min="0" :max="99999999" />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="是否启用" name="enabled">
            <a-switch />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const open = ref(false)

const show = (_record?: any) => {
  open.value = true
}

defineExpose({ show })

const menuTypeOptions = [
  {
    label: '目录',
    value: 0,
  },
  {
    label: '菜单',
    value: 1,
  },
  {
    label: '子页面',
    value: 2,
  },
  {
    label: '按钮',
    value: 3,
  },
]

const formState = ref({
  menuType: 0,
  menuName: '',
  keepAlive: true,
})

const rules = {
  menuName: [
    {
      required: true,
      message: '请输入菜单名称',
      trigger: 'blur',
    },
  ],
}
</script>
