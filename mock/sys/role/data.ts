import { faker } from '@faker-js/faker'
import type { RoleResp, UpdateRoleReq } from '@/apis'

function createRole(_: unknown, index: number): RoleResp {
  return {
    id: `${index + 1}`,
    roleName: faker.person.jobTitle(),
    dataScope: faker.number.int({ min: 0, max: 3 }),
  }
}

export const dataSource: RoleResp[] = Array.from({ length: 1000 }, createRole)

export function appendRole(
  input: Pick<RoleResp, 'roleName' | 'dataScope'> & { remark?: string }
) {
  const role: RoleResp = {
    id: `${dataSource.length + 1}`,
    roleName: input.roleName,
    dataScope: input.dataScope,
    remark: input.remark,
  }
  dataSource.unshift(role)
  return role
}

export function findRole(id: string) {
  return dataSource.find((item) => item.id === id)
}

export function updateRole(input: UpdateRoleReq) {
  const role = findRole(input.id)
  if (!role) return false

  Object.assign(role, input)
  return true
}
