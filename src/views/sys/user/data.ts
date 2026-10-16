import type {
  UserEducation,
  UserMaritalStatus,
  UserSex,
  UserSource,
  UserWorkExperience,
} from '@/apis'

/**
 * 选项项
 */
export interface UserOption<T extends number = number> {
  /**
   * @desc 展示文案
   */
  label: string
  /**
   * @desc 选项值
   */
  value: T
}

export const sexOptions: UserOption<UserSex>[] = [
  { label: '男', value: 0 },
  { label: '女', value: 1 },
  { label: '未知', value: 2 },
]

export const educationOptions: UserOption<UserEducation>[] = [
  { label: '高中', value: 0 },
  { label: '大专', value: 1 },
  { label: '本科', value: 2 },
  { label: '硕士', value: 3 },
  { label: '博士', value: 4 },
]

export const workExperienceOptions: UserOption<UserWorkExperience>[] = [
  { label: '无', value: 0 },
  { label: '1 年', value: 1 },
  { label: '2 年', value: 2 },
  { label: '3 年', value: 3 },
  { label: '4 年', value: 4 },
  { label: '5 年以上', value: 5 },
]

export const maritalStatusOptions: UserOption<UserMaritalStatus>[] = [
  { label: '未婚', value: 0 },
  { label: '已婚', value: 1 },
  { label: '离异', value: 2 },
  { label: '丧偶', value: 3 },
]

export const sourceOptions: UserOption<UserSource>[] = [
  { label: '注册', value: 0 },
  { label: '导入', value: 1 },
  { label: '第三方登录', value: 2 },
]

/**
 * 取选项文案,未命中时回退为占位符
 *
 * @param options 选项列表
 * @param value 选项值
 */
export function resolveOptionLabel<T extends number>(
  options: UserOption<T>[],
  value?: number
) {
  if (value === undefined) return '-'
  return options.find((item) => item.value === value)?.label ?? '-'
}
