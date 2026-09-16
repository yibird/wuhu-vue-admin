import { faker } from '@faker-js/faker'
import type { DeptResp, UpdateDeptReq } from '@/apis'

function createDept(_: unknown, index: number): DeptResp {
  const id = `${index + 1}`
  return {
    id,
    parentId: index < 4 ? '0' : `${(index % 4) + 1}`,
    name: `${faker.company.buzzNoun()}部`,
    code: `D${String(index + 1).padStart(3, '0')}`,
    type: 1,
    leader: faker.person.fullName(),
    phone: faker.phone.number(),
    email: faker.internet.email(),
    dataStatus: true,
    deleted: false,
    version: 1,
    sort: index + 1,
    createdBy: '系统管理员',
    createdAt: faker.date.past().toISOString(),
  }
}

const postNames = [
  '产品经理',
  '项目经理',
  '前端工程师',
  '后端工程师',
  '测试工程师',
  'UI 设计师',
  '运维工程师',
  '数据分析师',
  '人力资源专员',
  '财务专员',
  '客户成功经理',
  '技术支持',
]

function createPost(name: string, index: number): DeptResp {
  return {
    id: `${25 + index}`,
    parentId: `${(index % 8) + 1}`,
    name,
    code: `P${String(index + 1).padStart(3, '0')}`,
    type: 2,
    leader: faker.person.fullName(),
    phone: faker.phone.number(),
    email: faker.internet.email(),
    dataStatus: true,
    deleted: false,
    version: 1,
    sort: index + 1,
    createdBy: '系统管理员',
    createdAt: faker.date.past().toISOString(),
  }
}

export const dataSource: DeptResp[] = [
  ...Array.from({ length: 24 }, createDept),
  ...postNames.map(createPost),
]

export function appendDept(
  input: Omit<DeptResp, keyof Pick<DeptResp, 'id' | 'createdAt'>>
) {
  const dept: DeptResp = {
    ...input,
    id: `${dataSource.length + 1}`,
    createdAt: new Date().toISOString(),
  }
  dataSource.unshift(dept)
  return dept
}

export function findDept(id: string) {
  return dataSource.find((item) => item.id === id)
}

export function updateDept(input: UpdateDeptReq) {
  const dept = findDept(input.id)
  if (!dept) return false

  Object.assign(dept, input, {
    updatedAt: new Date().toISOString(),
    updatedBy: '系统管理员',
  })
  return true
}
