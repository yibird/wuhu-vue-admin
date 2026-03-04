<template>
  <div class="p-10">
    <n-grid responsive="screen" item-responsive x-gap="12" y-gap="12">
      <n-grid-item span="xs:24 s:24 m:24 l:8 xl:8 xxl:8">
        <n-card
          size="small"
          header-class="bg-gradient-to-b from-[#e8f4ff80] to-[#fff0]"
          footer-class="p-12! text-center border-t-1 border-solid border-[#eee]"
        >
          <template #header>基本信息</template>
          <template #footer>
            <span class="text-xs text-secondary">注册于：2023-01-01 09:00:00</span>
          </template>
          <div class="py-50">
            <div class="flex justify-center">
              <div class="size-80 rounded-full bg-gray-100"></div>
            </div>
            <div class="my-20 flex-center gap-5 text-md text-center">
              <span>超级管理员</span>
              <Icon name="i-lucide:mars" :size="18" color="rgb(25, 187, 241)" />
              <Icon name="i-lucide:square-pen" :size="16" />
            </div>
            <div class="flex-center gap-8">
              <Icon name="i-lucide:id-card" :size="20" />
              <span class="text-secondary">123123123123</span>
            </div>
          </div>
          <div class="flex flex-col gap-12">
            <div v-for="item in profileItems" :key="item.prop" class="flex">
              <div class="max-w-100 w-100 flex items-center gap-6">
                <Icon :name="item.icon" :size="16" />
                <span>{{ item.label }}</span>
              </div>
              <div class="flex-1">{{ item.value }}</div>
            </div>
          </div>
        </n-card>
      </n-grid-item>
      <n-grid-item span="xs:24 s:24 m:24 l:16 xl:16 xxl:16">
        <div class="flex flex-col gap-12">
          <n-card
            size="small"
            header-class="bg-gradient-to-b from-[#e8f4ff80] to-[#fff0]"
            footer-class="p-12! text-center border-t-1 border-solid border-[#eee]"
          >
            <template #header>安全设置</template>
            <div class="py-20 flex flex-col gap-20">
              <div v-for="(item, index) in settingItems" :key="index" class="flex">
                <div class="size-45 rounded-full bg-gray-100"></div>
                <div class="flex-1 px-10">
                  <div class="flex items-center gap-10">
                    <span class="text-primary">{{ item.title }}</span>
                    <span
                      class="flex items-center"
                      :style="{ color: item.status === 0 ? '#ff7d00' : '#00b42a' }"
                    >
                      <Icon name="i-lucide:circle-alert" :size="16" />
                      <span class="ml-4 text-xs">{{
                        item.status === 0 ? '未绑定' : '已绑定'
                      }}</span>
                    </span>
                  </div>
                  <div class="mt-6 text-xs text-secondary">{{ item.description }}</div>
                </div>
                <n-button :type="item.status === 0 ? 'default' : 'primary'">
                  {{ item.status === 0 ? '绑定' : '解绑' }}
                </n-button>
              </div>
            </div>
          </n-card>
          <n-card
            size="small"
            header-class="bg-gradient-to-b from-[#e8f4ff80] to-[#fff0]"
            footer-class="p-12! text-center border-t-1 border-solid border-[#eee]"
          >
            <template #header>第三方账号</template>
            <div class="py-20 flex flex-col gap-20">
              <div v-for="(item, index) in accountItems" :key="index" class="flex">
                <div class="size-45 rounded-full bg-gray-100"></div>
                <div class="flex-1 px-10">
                  <div class="flex items-center gap-10">
                    <span class="text-primary">{{ item.title }}</span>
                    <span
                      class="flex items-center"
                      :style="{ color: item.status === 0 ? '#ff7d00' : '#00b42a' }"
                    >
                      <Icon name="i-lucide:circle-alert" :size="16" />
                      <span class="ml-4 text-xs">{{
                        item.status === 0 ? '未绑定' : '已绑定'
                      }}</span>
                    </span>
                  </div>
                  <div class="mt-6 text-xs text-secondary">{{ item.description }}</div>
                </div>
                <n-button :type="item.status === 0 ? 'default' : 'primary'">
                  {{ item.status === 0 ? '绑定' : '解绑' }}
                </n-button>
              </div>
            </div>
          </n-card>
        </div>
      </n-grid-item>
    </n-grid>
  </div>
</template>
<script lang="ts" setup>
const profileItems = [
  {
    icon: 'i-lucide:user',
    label: '用户名',
    value: '751120645399516228',
    prop: 'username',
  },
  {
    icon: 'i-lucide:phone',
    label: '手机',
    value: '751120645399516228',
    prop: 'mobile',
  },
  {
    icon: 'i-lucide:mail',
    label: '邮箱',
    value: '751120645399516228',
    prop: 'email',
  },
  {
    icon: 'i-lucide:building',
    label: '部门',
    value: '751120645399516228',
    prop: 'dept',
  },
  {
    icon: 'i-lucide:key',
    label: '角色',
    value: '超级管理员',
    prop: 'role',
  },
];

const settingItems = [
  {
    icon: '',
    title: '安全手机',
    status: 1,
    description: '手机号可用于登录、身份验证、密码找回、通知接收',
  },
  {
    icon: '',
    title: '安全邮箱',
    status: 0,
    description: '邮箱可用于登录、身份验证、密码找回、通知接收',
  },
  {
    icon: '',
    title: '登录密码',
    status: 0,
    description: '为了您的账号安全，建议定期修改密码',
  },
];

const accountItems = [
  {
    icon: '',
    title: '绑定 GitHub',
    status: 1,
    description: '可通过 GitHub 进行登录',
  },
  {
    icon: '',
    title: '绑定 Gitee',
    status: 0,
    description: '可通过 Gitee 进行登录',
  },
];
</script>
