import type {
  CreateDictItemReq,
  CreateDictReq,
  DictItemResp,
  DictResp,
  UpdateDictItemReq,
  UpdateDictReq,
} from '@/apis'

function createBase(id: string, sort: number) {
  return {
    id,
    dataStatus: true,
    deleted: false,
    version: 1,
    sort,
    createdBy: '系统管理员',
    createdAt: new Date(Date.now() - sort * 86_400_000).toISOString(),
  }
}

function createDict(
  id: string,
  name: string,
  type: string,
  sort: number,
  remark: string
): DictResp {
  return {
    ...createBase(id, sort),
    name,
    type,
    status: true,
    remark,
  }
}

export const dictDataSource: DictResp[] = [
  createDict('1', '用户性别', 'sys_user_sex', 1, '用户基础性别选项'),
  createDict('2', '通知类型', 'sys_notice_type', 2, '系统通知的内容类型'),
  createDict('3', '任务状态', 'sys_task_status', 3, '任务流转状态'),
  createDict('4', '数据权限', 'sys_data_scope', 4, '后台数据访问范围'),
  createDict('5', '消息优先级', 'sys_message_priority', 5, '消息处理优先级'),
]

function createItem(
  id: string,
  dictId: string,
  label: string,
  value: string,
  sort: number,
  remark = ''
): DictItemResp {
  return {
    ...createBase(id, sort),
    dictId,
    label,
    value,
    status: true,
    remark,
  }
}

export const dictItemDataSource: DictItemResp[] = [
  createItem('1', '1', '男', '1', 1),
  createItem('2', '1', '女', '2', 2),
  createItem('3', '1', '未知', '0', 3),
  createItem('4', '2', '通知', '1', 1),
  createItem('5', '2', '公告', '2', 2),
  createItem('6', '3', '待处理', 'todo', 1),
  createItem('7', '3', '进行中', 'doing', 2),
  createItem('8', '3', '已完成', 'done', 3),
  createItem('9', '3', '已取消', 'cancelled', 4),
  createItem('10', '4', '全部数据', 'all', 1),
  createItem('11', '4', '本部门及以下', 'dept_and_children', 2),
  createItem('12', '4', '本部门', 'dept', 3),
  createItem('13', '4', '仅本人', 'self', 4),
  createItem('14', '5', '低', 'low', 1),
  createItem('15', '5', '普通', 'normal', 2),
  createItem('16', '5', '高', 'high', 3),
  createItem('17', '5', '紧急', 'urgent', 4),
]

export function appendDict(input: CreateDictReq) {
  const dict = {
    ...createBase(String(Date.now()), dictDataSource.length + 1),
    ...input,
  }
  dictDataSource.unshift(dict)
  return dict
}

export function findDict(id: string) {
  return dictDataSource.find((item) => item.id === id)
}

export function updateDict(input: UpdateDictReq) {
  const dict = findDict(input.id)
  if (!dict) return false
  Object.assign(dict, input, {
    updatedAt: new Date().toISOString(),
    updatedBy: '系统管理员',
  })
  return true
}

export function deleteDict(ids: Array<string | number>) {
  const idSet = new Set(ids.map(String))
  const originalLength = dictDataSource.length
  for (let index = dictDataSource.length - 1; index >= 0; index -= 1) {
    if (idSet.has(dictDataSource[index].id)) dictDataSource.splice(index, 1)
  }
  for (let index = dictItemDataSource.length - 1; index >= 0; index -= 1) {
    if (idSet.has(dictItemDataSource[index].dictId)) {
      dictItemDataSource.splice(index, 1)
    }
  }
  return originalLength !== dictDataSource.length
}

export function appendDictItem(input: CreateDictItemReq) {
  const dictItem: DictItemResp = {
    ...createBase(String(Date.now()), dictItemDataSource.length + 1),
    ...input,
  }
  dictItemDataSource.unshift(dictItem)
  return dictItem
}

export function findDictItem(id: string) {
  return dictItemDataSource.find((item) => item.id === id)
}

export function updateDictItem(input: UpdateDictItemReq) {
  const dictItem = findDictItem(input.id)
  if (!dictItem) return false
  Object.assign(dictItem, input, {
    updatedAt: new Date().toISOString(),
    updatedBy: '系统管理员',
  })
  return true
}

export function deleteDictItems(ids: Array<string | number>) {
  const idSet = new Set(ids.map(String))
  const originalLength = dictItemDataSource.length
  for (let index = dictItemDataSource.length - 1; index >= 0; index -= 1) {
    if (idSet.has(dictItemDataSource[index].id)) {
      dictItemDataSource.splice(index, 1)
    }
  }
  return originalLength !== dictItemDataSource.length
}
