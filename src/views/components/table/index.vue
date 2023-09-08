<template>
  <div>
    <div>table基础demo</div>
    <BasicTable showSetting :dataSource="dataSource" :columns="columns">
      <template #title>123123131231231asdasd</template>
    </BasicTable>
  </div>
</template>
<script setup lang="ts">
  import { BasicTable } from "/@/components/Table";

  const showSetting = true;
  const dataSource = [
    {
      key: "1",
      name: "胡彦斌",
      age: 32,
      address: "西湖区湖底公园1号",
    },
    {
      key: "2",
      name: "胡彦祖",
      age: 42,
      address: "西湖区湖底公园1号",
    },
  ];
  const columns = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      show: true,
    },
    {
      title: "年龄",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "住址",
      dataIndex: "address",
      key: "address",
    },
  ];
</script>
