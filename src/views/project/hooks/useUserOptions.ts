import { getDeptPageListApi, getUserPageListApi } from '@/apis'
import type { UserPickerOption } from '@/features'

/** 用户选项缓存:项目负责人/任务负责人/项目成员共用 */
const userOptions = shallowRef<UserPickerOption[]>([])
const userOptionsLoading = shallowRef(false)
let loadPromise: Promise<void> | undefined

export function useUserOptions() {
  function load() {
    if (loadPromise) return loadPromise
    if (userOptions.value.length) return Promise.resolve()

    userOptionsLoading.value = true
    loadPromise = Promise.all([
      getUserPageListApi({ current: 1, pageSize: 1000 }),
      getDeptPageListApi({ current: 1, pageSize: 1000, type: 1 }),
    ])
      .then(([userResponse, deptResponse]) => {
        const deptNames = new Map(
          (deptResponse.data?.list ?? []).map((dept) => [dept.id, dept.name])
        )

        userOptions.value = (userResponse.data?.list ?? [])
          .filter((user) => !user.deleted)
          .map((user) => ({
            label: user.realname || user.nickname || user.username,
            value: user.id,
            email: user.email,
            department: deptNames.get(user.deptId ?? ''),
            disabled: !user.dataStatus,
          }))
      })
      .catch(() => {
        // 业务错误已由请求层统一提示,这里保持空选项
      })
      .finally(() => {
        userOptionsLoading.value = false
        loadPromise = undefined
      })

    return loadPromise
  }

  /**
   * @param userId 用户 id
   * @returns 用户选项,未知用户返回 undefined
   */
  function getUserOption(userId?: string) {
    if (!userId) return undefined
    return userOptions.value.find((option) => option.value === userId)
  }

  /**
   * @param userId 用户 id
   * @returns 展示名,未知用户返回空字符串
   */
  function getUserLabel(userId?: string) {
    return getUserOption(userId)?.label ?? ''
  }

  onMounted(() => void load())

  return {
    userOptions,
    userOptionsLoading,
    getUserOption,
    getUserLabel,
  }
}
