<template>
  <n-drawer v-model:show="show" :width="740">
    <n-drawer-content title="日志详情" closable>
      <div class="flex flex-col gap-20">
        <div>
          <div class="text-md font-bold mb-16">基本信息</div>
          <n-descriptions :column="2" label-placement="left">
            <n-descriptions-item>
              <template #label>日志 ID</template>
              <span>751120645399516228</span>
            </n-descriptions-item>
            <n-descriptions-item>
              <template #label>Trace ID</template>
              <span>751120645399516228</span>
            </n-descriptions-item>
            <n-descriptions-item>
              <template #label>操作人</template>
              <span>751120645399516228</span>
            </n-descriptions-item>
            <n-descriptions-item>
              <template #label>操作时间</template>
              <span>2025-08-27 16:45:17</span>
            </n-descriptions-item>
            <n-descriptions-item>
              <template #label>操作描述</template>
              <span>分页查询任务列表</span>
            </n-descriptions-item>
            <n-descriptions-item>
              <template #label>所属任务</template>
              <span>任务</span>
            </n-descriptions-item>
            <n-descriptions-item>
              <template #label>操作 IP</template>
              <span>116.24.67.23</span>
            </n-descriptions-item>
            <n-descriptions-item>
              <template #label>操作地点</template>
              <span>中国|广东省|深圳市|电信</span>
            </n-descriptions-item>
            <n-descriptions-item>
              <template #label>浏览器</template>
              <span>Chrome 139.0.0.0</span>
            </n-descriptions-item>
            <n-descriptions-item>
              <template #label>终端系统</template>
              <span>OSX</span>
            </n-descriptions-item>
            <n-descriptions-item>
              <template #label>状态</template>
              <span>OSX</span>
            </n-descriptions-item>
            <n-descriptions-item>
              <template #label>耗时</template>
              <n-tag :bordered="false" type="success">3ms</n-tag>
            </n-descriptions-item>
            <n-descriptions-item :span="2">
              <template #label>请求方法</template>
              <n-tag :bordered="false" type="success">POST</n-tag>
            </n-descriptions-item>
            <n-descriptions-item :span="2">
              <template #label>请求URI</template>
              <div class="max-w-420 truncate"
                >http://api.continew.top/schedule/job?groupName=continew-admin&page=1&size=10</div
              >
            </n-descriptions-item>
          </n-descriptions>
        </div>
        <div>
          <div class="text-md font-bold mb-16">响应信息</div>
          <n-tabs type="segment" default-value="respHeader" animated>
            <n-tab-pane name="respHeader" tab="响应头">
              <JsonView :data="{ key: 'value' }" />
            </n-tab-pane>
            <n-tab-pane name="respBody" tab="响应体">
              <JsonView :data="{ key: 'value' }" />
            </n-tab-pane>
          </n-tabs>
        </div>
        <div>
          <div class="text-md font-bold mb-16">请求信息</div>
          <n-tabs type="segment" default-value="reqHeader" animated>
            <n-tab-pane name="reqHeader" tab="请求头">
              <JsonView :data="{ key: 'value' }" />
            </n-tab-pane>
            <n-tab-pane name="reqBody" tab="请求体">
              <JsonView :data="{ key: 'value' }" />
            </n-tab-pane>
          </n-tabs>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>
<script lang="ts" setup>
import { JsonView } from '@/components';
const show = defineModel('show', {
  default: false,
  type: Boolean,
});
</script>
