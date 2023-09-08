<template>
  <div class="py-[40px]">
    <a-form :labelCol="{ span: 4 }" :wrapperCol="{ span: 10 }">
      <a-form-item label="昵称">
        <a-input placeholder="请输入昵称" />
      </a-form-item>
      <a-form-item label="邮箱">
        <a-input placeholder="请输入邮箱" />
      </a-form-item>
      <a-form-item label="联系电话">
        <a-input placeholder="请输入联系电话" />
      </a-form-item>
      <a-form-item label="个人简介">
        <a-textarea :rows="6" placeholder="请输入个人简介" />
      </a-form-item>
      <a-form-item label="联系地址">
        <a-input placeholder="请输入联系地址" />
      </a-form-item>
      <a-form-item :wrapperCol="{ span: 10, offset: 4 }">
        <a-button type="primary">更新基本信息</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts"></script>
