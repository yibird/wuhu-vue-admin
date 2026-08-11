<script setup lang="ts">
import { computed } from 'vue'
import { FILE_NODE_TYPE, type IFile } from '../types'
import {
  formatFileSize,
  getFileCategoryLabel,
  getFileExtension,
} from '../utils'

const file = defineModel<IFile | null>('file', {
  required: true,
})

defineProps<{
  pathText: string
}>()

const detailTitle = computed(() => file.value?.fileName ?? '文件详情')
const fileExtension = computed(() => {
  if (!file.value || file.value.type === FILE_NODE_TYPE.DIRECTORY) return '-'
  return (
    file.value.fileExtension?.toUpperCase() ||
    getFileExtension(file.value.fileName).toUpperCase() ||
    '-'
  )
})
</script>

<template>
  <a-modal
    :open="!!file"
    :title="detailTitle"
    :footer="null"
    destroy-on-hidden
    :width="680"
    @cancel="file = null"
  >
    <a-descriptions v-if="file" size="small" :column="1" bordered>
      <a-descriptions-item label="ID">
        {{ file.id }}
      </a-descriptions-item>
      <a-descriptions-item label="文件名称">
        {{ file.fileName }}
      </a-descriptions-item>
      <a-descriptions-item label="位置">
        {{ pathText }}
      </a-descriptions-item>
      <a-descriptions-item label="节点类型">
        {{ file.type === FILE_NODE_TYPE.DIRECTORY ? '目录' : '文件' }}
      </a-descriptions-item>
      <a-descriptions-item label="父级ID">
        {{ file.parentId }}
      </a-descriptions-item>
      <a-descriptions-item label="根ID">
        {{ file.rootId }}
      </a-descriptions-item>
      <a-descriptions-item label="节点路径">
        {{ file.rootLevel }}
      </a-descriptions-item>
      <a-descriptions-item label="父级路径">
        {{ file.parentLevel }}
      </a-descriptions-item>
      <a-descriptions-item
        v-if="file.type === FILE_NODE_TYPE.FILE"
        label="文件分类"
      >
        {{ getFileCategoryLabel(file.fileType) }}
      </a-descriptions-item>
      <a-descriptions-item
        v-if="file.type === FILE_NODE_TYPE.FILE"
        label="原始类型"
      >
        {{ file.fileRawType || '-' }}
      </a-descriptions-item>
      <a-descriptions-item
        v-if="file.type === FILE_NODE_TYPE.FILE"
        label="扩展名"
      >
        {{ fileExtension }}
      </a-descriptions-item>
      <a-descriptions-item
        v-if="file.type === FILE_NODE_TYPE.FILE"
        label="文件大小"
      >
        {{ formatFileSize(file.fileSize) }}
      </a-descriptions-item>
      <a-descriptions-item
        v-if="file.type === FILE_NODE_TYPE.FILE"
        label="文件地址"
      >
        {{ file.fileUrl || '-' }}
      </a-descriptions-item>
      <a-descriptions-item label="创建人">
        {{ file.creator || '-' }}
      </a-descriptions-item>
      <a-descriptions-item label="创建时间">
        {{ file.createTime || '-' }}
      </a-descriptions-item>
      <a-descriptions-item label="更新人">
        {{ file.updater || '-' }}
      </a-descriptions-item>
      <a-descriptions-item label="更新时间">
        {{ file.updateTime || '-' }}
      </a-descriptions-item>
      <a-descriptions-item label="来源">
        {{ file.source === 'local' ? '本地上传' : '演示文件' }}
      </a-descriptions-item>
      <a-descriptions-item
        v-if="file.type === FILE_NODE_TYPE.FILE"
        label="收藏状态"
      >
        {{ file.favorite ? '已收藏' : '未收藏' }}
      </a-descriptions-item>
      <a-descriptions-item label="加密状态">
        {{ file.encrypted ? '已加密' : '未加密' }}
      </a-descriptions-item>
      <a-descriptions-item v-if="file.encrypted" label="加密密码">
        {{ file.encryptPassword || '-' }}
      </a-descriptions-item>
      <a-descriptions-item label="回收站状态">
        {{ file.deleted || file.deletedTime ? '回收站中' : '正常' }}
      </a-descriptions-item>
      <a-descriptions-item
        v-if="file.deleted || file.deletedTime"
        label="删除时间"
      >
        {{ file.deletedTime || '-' }}
      </a-descriptions-item>
      <a-descriptions-item
        v-if="file.deleted || file.deletedTime"
        label="删除人"
      >
        {{ file.deleteUser || '-' }}
      </a-descriptions-item>
      <a-descriptions-item v-if="file.tags?.length" label="标签">
        <a-space wrap>
          <a-tag v-for="tag in file.tags" :key="tag">{{ tag }}</a-tag>
        </a-space>
      </a-descriptions-item>
      <a-descriptions-item v-if="file.remark" label="备注">
        {{ file.remark }}
      </a-descriptions-item>
    </a-descriptions>
  </a-modal>
</template>
