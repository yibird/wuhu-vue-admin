<template>
  <a-modal :visible="visible" title="修改密码" @cancel="cancelHandle" @ok="okHandle">
    <a-form
      ref="formRef"
      :model="model"
      :rules="rules"
      :labelCol="{ span: 4 }"
      :wrapperCol="{ span: 20 }"
    >
      <a-form-item label="旧密码" name="password">
        <a-input-password v-model:value="model.password" placeholder="请求输入旧密码" />
      </a-form-item>
      <a-form-item label="新密码" name="newPassword">
        <a-input-password v-model:value="model.newPassword" placeholder="请输入新密码" />
      </a-form-item>
      <a-form-item label="确认密码" name="confirmPassword">
        <a-input-password v-model:value="model.confirmPassword" placeholder="请输入确认密码" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="ts">
  import type { FormInstance } from 'ant-design-vue';
  import type { Rule } from 'ant-design-vue/es/form/interface';
  import { reactive, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  interface Emits {
    (e: 'update:visible', visible: boolean): void;
    (e: 'ok'): void;
  }
  const { visible = false } = defineProps<{ visible: boolean }>();
  const emit = defineEmits<Emits>();

  const { createMessage } = useMessage();

  const formRef = ref<FormInstance>();
  const model = reactive({
    password: '',
    newPassword: '',
    confirmPassword: '',
  });

  const rules: Record<string, Rule[]> = {
    password: [{ required: true, message: '请输入密码' }],
    newPassword: [{ required: true, message: '请输入新密码' }],
    confirmPassword: [{ required: true, message: '请输入确认密码' }],
  };

  const cancelHandle = () => {
    emit('update:visible', false);
  };
  const okHandle = () => {
    formRef.value?.validate().then(() => {
      createMessage.success('修改成功');
      setTimeout(() => {
        emit('update:visible', false);
      }, 200);
    });
  };
</script>
