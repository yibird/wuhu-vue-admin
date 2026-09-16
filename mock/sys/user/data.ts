import { faker } from '@faker-js/faker'
import type { CreateUserReq, UpdateUserReq, UserResp } from '@/apis'

function createUser(_: unknown, index: number): UserResp {
  const gender = faker.helpers.arrayElement([0, 1, 2] as const)
  const dataStatus = faker.datatype.boolean()
  const deptId = faker.number.int({ min: 1, max: 8 })
  const postIndexes = Array.from(
    { length: 12 },
    (_, postIndex) => postIndex
  ).filter((postIndex) => (postIndex % 8) + 1 === deptId)
  const postIndex = faker.helpers.arrayElement(postIndexes)

  return {
    // BaseResp 字段
    id: `${index + 1}`,
    dataStatus: dataStatus,
    deleted: faker.datatype.boolean(),
    remark: faker.lorem.sentence(),
    version: faker.number.int({ min: 1, max: 10 }),
    sort: faker.number.int({ min: 1, max: 100 }),
    unionId: faker.number.int({ min: 1000, max: 9999 }),
    createdBy: faker.person.fullName(),
    updatedBy: faker.person.fullName(),
    deletedBy: dataStatus ? undefined : faker.person.fullName(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    deletedAt: dataStatus ? undefined : faker.date.recent().toISOString(),

    // UserResp 字段
    username: faker.internet.username(),
    nickname: faker.internet.displayName(),
    realname: faker.person.fullName(),
    small_avatar: faker.image.avatar(),
    big_avatar: faker.image.avatar(),
    sex: gender,
    age: faker.number.int({ min: 18, max: 80 }),
    phone: faker.phone.number(),
    wechat: `wx_${faker.string.alphanumeric({ length: 10 }).toLowerCase()}`,
    email: faker.internet.email(),
    address: `${faker.location.state()} ${faker.location.city()} ${faker.location.streetAddress()}`,
    birthday: faker.date
      .birthdate({ min: 18, max: 80, mode: 'age' })
      .toISOString()
      .split('T')[0],
    education: faker.helpers.arrayElement([0, 1, 2, 3, 4] as const),
    work_experience: faker.helpers.arrayElement([0, 1, 2, 3, 4, 5] as const),
    marital_status: faker.helpers.arrayElement([0, 1, 2, 3] as const),
    source: faker.helpers.arrayElement([0, 1, 2] as const),
    deptId: `${deptId}`,
    postId: `${25 + postIndex}`,
    roleId: `${faker.number.int({ min: 1, max: 20 })}`,
  }
}

export const dataSource: UserResp[] = Array.from({ length: 1000 }, createUser)

export function appendUser(input: CreateUserReq) {
  const user: UserResp = {
    ...input,
    id: `${dataSource.length + 1}`,
    createdAt: new Date().toISOString(),
    dataStatus: true,
    deleted: false,
    createdBy: '系统管理员',
    version: 1,
  }
  dataSource.unshift(user)
  return user
}

export function findUser(id: string) {
  return dataSource.find((item) => item.id === id)
}

export function updateUser(input: UpdateUserReq) {
  const user = findUser(input.id)
  if (!user) return false

  Object.assign(user, input, {
    updatedAt: new Date().toISOString(),
    updatedBy: '系统管理员',
  })
  return true
}
