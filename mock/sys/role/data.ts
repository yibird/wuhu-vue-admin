import { faker } from '@faker-js/faker'
import type { RoleResp } from '@/apis'

function createRole(_: any, index: number): RoleResp {
  return {
    id: `${index + 1}`,
    roleName: faker.person.jobTitle(),
    dataScope: faker.number.int({ min: 0, max: 3 }),
  }
}

export const dataSource: RoleResp[] = Array.from({ length: 1000 }, createRole)
