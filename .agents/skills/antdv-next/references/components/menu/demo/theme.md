# Menu Themes

## Description (en-US)

There are two built-in themes: `light` and `dark`. The default value is `light`.

## Source

```vue
<script setup lang="ts">
import type { MenuItemType } from 'antdv-next'
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const theme = ref<'dark' | 'light'>('dark')
const current = ref('1')

const items: MenuItemType[] = [
  {
    key: 'sub1',
    label: 'Navigation One',
    icon: MailOutlined,
    children: [
      { key: '1', label: 'Option 1' },
      { key: '2', label: 'Option 2' },
      { key: '3', label: 'Option 3' },
      { key: '4', label: 'Option 4' },
    ],
  },
  {
    key: 'sub2',
    label: 'Navigation Two',
    icon: AppstoreOutlined,
    children: [
      { key: '5', label: 'Option 5' },
      { key: '6', label: 'Option 6' },
      {
        key: 'sub3',
        label: 'Submenu',
        children: [
          { key: '7', label: 'Option 7' },
          { key: '8', label: 'Option 8' },
        ],
      },
    ],
  },
  {
    key: 'sub4',
    label: 'Navigation Three',
    icon: SettingOutlined,
    children: [
      { key: '9', label: 'Option 9' },
      { key: '10', label: 'Option 10' },
      { key: '11', label: 'Option 11' },
      { key: '12', label: 'Option 12' },
    ],
  },
]

function changeTheme(value: boolean) {
  theme.value = value ? 'dark' : 'light'
}

function onClick(e: any) {
  console.log('click ', e)
  current.value = e.key
}
</script>

<template>
  <a-switch
    :checked="theme === 'dark'"
    checked-children="Dark"
    un-checked-children="Light"
    @change="changeTheme"
  />
  <br>
  <br>
  <a-menu
    :theme="theme"
    :selected-keys="[current]"
    style="width: 256px"
    :default-open-keys="['sub1']"
    mode="inline"
    :items="items"
    @click="onClick"
  />
</template>
```
