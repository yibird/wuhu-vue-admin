<template>
  <n-modal
    v-model:show="show"
    title="新建菜单"
    preset="dialog"
    :show-icon="false"
    negativeText="取消"
    positiveText="确定"
    style="width: 800px"
  >
    <n-form :rules="rules" :model="formState" label-placement="left" label-width="80" class="py-10">
      <n-grid :cols="24" :x-gap="20">
        <n-form-item-gi :span="24" label="菜单类型" prop="name">
          <n-radio-group v-model:value="formState.menuType">
            <n-space>
              <n-radio v-for="item in menuTypeOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item-gi>
        <n-form-item-gi :span="24" label="上级菜单" prop="name">
          <n-select />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="菜单名称" prop="formState.menuName" required>
          <n-input v-model:value="formState.menuName" clearable :maxlength="30" show-count />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="菜单图标" prop="name">
          <n-input />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="路由地址" prop="name">
          <n-input />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="重定向" prop="name">
          <n-input />
        </n-form-item-gi>
        <n-form-item-gi :span="24" label="组件路径" prop="name">
          <n-input />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="组件名称" prop="menuName">
          <n-input />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="权限标识" prop="menuName">
          <n-input />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="是否隐藏" prop="name">
          <n-switch :round="false" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="是否缓存" prop="name">
          <n-switch :round="false" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="菜单排序" prop="name">
          <n-input-number :min="0" :max="99999999" />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="是否启用" prop="name">
          <n-switch :round="false" />
        </n-form-item-gi>
      </n-grid>
    </n-form>
  </n-modal>
</template>
<script lang="ts" setup>
const show = defineModel<boolean>('show')

const menuTypeOptions = [
  {
    label: '目录',
    value: 0
  },
  {
    label: '菜单',
    value: 1
  },
  {
    label: '子页面',
    value: 2
  },
  {
    label: '按钮',
    value: 3
  }
]

const formState = ref({
  menuType: 0,
  menuName: ''
})

const rules = {
  menuName: {
    required: true,
    message: '请输入菜单名称',
    trigger: 'blur'
  }
}
</script>
