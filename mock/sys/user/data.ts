import { faker } from '@faker-js/faker'
import type { UserResp } from '@/apis'

function createUser(index: number): UserResp {
  const gender = faker.number.int({ min: 0, max: 2 })
  const dataStatus = faker.datatype.boolean()

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
    email: faker.internet.email(),
    address: `${faker.location.state()} ${faker.location.city()} ${faker.location.streetAddress()}`,
    birthday: faker.date
      .birthdate({ min: 18, max: 80, mode: 'age' })
      .toISOString()
      .split('T')[0],
    education: faker.number.int({ min: 0, max: 4 }),
    work_experience: faker.number.int({ min: 0, max: 5 }),
    marital_status: faker.number.int({ min: 0, max: 3 }),
    source: faker.number.int({ min: 0, max: 2 }),
  }
}

export const dataSource: UserResp[] = Array.from({ length: 1000 }, createUser)
