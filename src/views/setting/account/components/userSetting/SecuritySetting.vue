<template>
  <a-list item-layout="horizontal" :data-source="data">
    <template #renderItem="{ item }">
      <a-list-item>
        <a-list-item-meta class="px-[20px]">
          <template #title>{{ item.title }}</template>
          <template #description>
            <div class="flex justify-between">
              <div>{{ item.description }}</div>
              <a-typography-link>修改</a-typography-link>
            </div>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
</template>
<script setup lang="ts">
  const data = [
    {
      title: '账户密码',
      description: '绑定手机和邮箱，并设置密码，帐号更安全',
    },
    {
      title: '绑定手机',
      description: '已绑定手机号：+86189****4877',
    },
    {
      title: '密保问题',
      description: '未设置密保问题，密保问题可有效保护账户安全',
    },
    {
      title: '个性域名',
      description: '已绑定域名：https://www.naiveadmin.com',
    },
  ];
</script>
