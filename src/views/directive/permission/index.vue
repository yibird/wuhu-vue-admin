<template>
  <div>
    <div v-permission="'add'">content1</div>
    <!-- 由于没有check权限,因此content2不会显示 -->
    <div v-permission="'check'">content2</div>
    <div v-permission="['query', 'check']">content3</div>
  </div>
</template>
<script setup lang="ts"></script>
