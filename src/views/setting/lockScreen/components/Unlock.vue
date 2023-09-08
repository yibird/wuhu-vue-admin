<template>
  <a-modal title="解锁" :visible="visible" @cancel="cancelHandle">
    <div class="text-center">
      <a-avatar :size="64">
        <template #icon>
          <icon name="ri-user-line" />
        </template>
      </a-avatar>
      <div class="text-[20px] font-medium my-[10px]">admin</div>
      <a-input-password v-model="password" :maxlength="12" placeholder="请输入密码" />
    </div>
    <template #footer>
      <a-space>
        <a-button @click="cancelHandle">取消</a-button>
        <a-button @click="reLoginHandle" type="primary">重新登录</a-button>
        <a-button @click="unLockHandle" type="primary">解锁</a-button>
      </a-space>
    </template>
  </a-modal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { useGo } from '/@/hooks/web/usePage';

  const { visible = false } = defineProps<{ visible: boolean }>();
  const password = ref('');
  const go = useGo();

  const emit = defineEmits<{
    (e: 'update:visible', visible: boolean): void;
  }>();

  const cancelHandle = () => {
    emit('update:visible', false);
  };

  const reLoginHandle = () => {
    cancelHandle();
    go('/login');
  };

  const unLockHandle = () => {
    if (password.value.trim().length === 0) {
      return;
    }
    cancelHandle();
  };
</script>
