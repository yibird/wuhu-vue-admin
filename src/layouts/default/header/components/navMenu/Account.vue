<template>
  <div>
    <a-dropdown>
      <template #overlay>
        <a-menu>
          <a-menu-item @click="goAccount">个人信息</a-menu-item>
          <a-menu-item @click="visible = true">修改密码</a-menu-item>
          <a-menu-divider />
          <a-menu-item @click="loginOut">退出</a-menu-item>
        </a-menu>
      </template>
      <li>
        <a-avatar>U</a-avatar>
        <span className="ml-[8px]">Z乘风</span>
      </li>
    </a-dropdown>
    <ChangePassword v-model:visible.sync="visible" />
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import ChangePassword from './ChangePassword.vue';
  import { useRouter } from 'vue-router';
  import { useAccount } from './useAccount';
  const router = useRouter();
  const { goAccount, loginOut } = useAccount(router);

  const visible = ref(false);
</script>
