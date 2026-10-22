import type {
  SysDictDataCreateReq,
  SysDictTypeCreateReq,
  SysDictData,
  SysDictType,
} from '@/apis'

const NOW = new Date('2026-10-18T09:30:00+08:00')

function isoOffset(days: number) {
  return new Date(NOW.getTime() + days * 24 * 60 * 60 * 1000).toISOString()
}

function createBaseFields(index: number) {
  return {
    dataStatus: true,
    deleted: false,
    version: 1,
    sort: index,
    unionId: 2000 + index,
    createdBy: '系统管理员',
    updatedBy: '系统管理员',
    createdAt: isoOffset(-30 + index),
    updatedAt: isoOffset(-index),
    remark: '',
  }
}

function createDictType(
  id: string,
  name: string,
  type: string,
  sort: number,
  remark: string
): SysDictType {
  return {
    ...createBaseFields(sort),
    id,
    name,
    type,
    status: true,
    sort,
    remark,
  }
}

export const dictTypeDataSource: SysDictType[] = [
  createDictType('1', '用户性别', 'sys_sex', 1, '用户基础性别选项'),
  createDictType('2', '用户状态', 'sys_user_status', 2, '用户账号启用状态'),
  createDictType('3', '通知类型', 'sys_notice_type', 3, '系统通知的内容类型'),
  createDictType('4', '任务状态', 'sys_task_status', 4, '任务流转状态'),
  createDictType('5', '数据权限', 'sys_data_scope', 5, '后台数据访问范围'),
  createDictType(
    '6',
    '消息优先级',
    'sys_message_priority',
    6,
    '消息处理优先级'
  ),
]

function createDictData(
  id: string,
  dictId: string,
  label: string,
  value: string,
  sort: number,
  remark = ''
): SysDictData {
  return {
    ...createBaseFields(sort),
    id,
    dictId,
    label,
    value,
    status: true,
    sort,
    remark,
  }
}

export const dictDataDataSource: SysDictData[] = [
  createDictData('1', '1', '男', '1', 1),
  createDictData('2', '1', '女', '0', 2),
  createDictData('3', '1', '未知', '2', 3),
  createDictData('4', '2', '正常', '1', 1),
  createDictData('5', '2', '停用', '0', 2),
  createDictData('6', '3', '通知', '1', 1),
  createDictData('7', '3', '公告', '2', 2),
  createDictData('8', '4', '待处理', 'todo', 1),
  createDictData('9', '4', '进行中', 'doing', 2),
  createDictData('10', '4', '已完成', 'done', 3),
  createDictData('11', '4', '已取消', 'cancelled', 4),
  createDictData('12', '5', '全部数据', 'all', 1),
  createDictData('13', '5', '本部门及以下', 'dept_and_children', 2),
  createDictData('14', '5', '本部门', 'dept', 3),
  createDictData('15', '5', '仅本人', 'self', 4),
  createDictData('16', '6', '低', 'low', 1),
  createDictData('17', '6', '普通', 'normal', 2),
  createDictData('18', '6', '高', 'high', 3),
  createDictData('19', '6', '紧急', 'urgent', 4),
]

export function findDictType(id: string) {
  return dictTypeDataSource.find((item) => item.id === id)
}

export function findDictTypeByType(type: string, excludeId?: string) {
  return dictTypeDataSource.find(
    (item) => item.type === type && item.id !== excludeId
  )
}

export function appendDictType(input: SysDictTypeCreateReq): SysDictType {
  const index = dictTypeDataSource.length
  const dict: SysDictType = {
    ...createBaseFields(index),
    id: `dict-${Date.now().toString(36)}`,
    name: input.name.trim(),
    type: input.type.trim(),
    status: input.status ?? true,
    sort: index,
    remark: input.remark?.trim() ?? '',
  }
  dictTypeDataSource.unshift(dict)
  return dict
}

export function updateDictType(
  input: Partial<SysDictTypeCreateReq> & { id: string }
) {
  const current = findDictType(input.id)
  if (!current) return undefined
  if (input.name !== undefined) current.name = input.name.trim()
  if (input.type !== undefined) current.type = input.type.trim()
  if (input.status !== undefined) current.status = input.status
  if (input.remark !== undefined) current.remark = input.remark.trim()
  current.updatedAt = new Date().toISOString()
  return current
}

export function deleteDictTypes(ids: Array<string | number>) {
  const keys = new Set(ids.map(String))
  for (let index = dictTypeDataSource.length - 1; index >= 0; index -= 1) {
    if (keys.has(dictTypeDataSource[index].id)) {
      dictTypeDataSource.splice(index, 1)
    }
  }
  for (let index = dictDataDataSource.length - 1; index >= 0; index -= 1) {
    if (keys.has(dictDataDataSource[index].dictId)) {
      dictDataDataSource.splice(index, 1)
    }
  }
}

export function findDictData(id: string) {
  return dictDataDataSource.find((item) => item.id === id)
}

export function findDictDataByValue(
  dictId: string,
  value: string,
  excludeId?: string
) {
  return dictDataDataSource.find(
    (item) =>
      item.dictId === dictId && item.value === value && item.id !== excludeId
  )
}

export function appendDictData(input: SysDictDataCreateReq): SysDictData {
  const index = dictDataDataSource.length
  const item: SysDictData = {
    ...createBaseFields(index),
    id: `dict-data-${Date.now().toString(36)}`,
    dictId: input.dictId,
    label: input.label.trim(),
    value: input.value.trim(),
    status: input.status ?? true,
    sort: input.sort ?? index,
    remark: input.remark?.trim() ?? '',
  }
  dictDataDataSource.push(item)
  return item
}

export function updateDictData(
  input: Partial<SysDictDataCreateReq> & { id: string }
) {
  const current = findDictData(input.id)
  if (!current) return undefined
  if (input.dictId !== undefined) current.dictId = input.dictId
  if (input.label !== undefined) current.label = input.label.trim()
  if (input.value !== undefined) current.value = input.value.trim()
  if (input.status !== undefined) current.status = input.status
  if (input.sort !== undefined) current.sort = input.sort
  if (input.remark !== undefined) current.remark = input.remark.trim()
  current.updatedAt = new Date().toISOString()
  return current
}

export function deleteDictData(ids: Array<string | number>) {
  const keys = new Set(ids.map(String))
  for (let index = dictDataDataSource.length - 1; index >= 0; index -= 1) {
    if (keys.has(dictDataDataSource[index].id)) {
      dictDataDataSource.splice(index, 1)
    }
  }
}
