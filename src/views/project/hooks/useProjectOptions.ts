import { getProjectOptionsApi } from '@/apis'
import type { ProjectOption } from '@/apis'

/**
 * 项目下拉选项缓存
 *
 * 列表/表单/详情都会用到,模块级缓存避免重复请求;
 * 项目增删后调用 refreshProjectOptions 主动失效
 */
const projectOptions = shallowRef<ProjectOption[]>([])
const projectOptionsLoading = shallowRef(false)
let loadPromise: Promise<void> | undefined

export function useProjectOptions() {
  function load() {
    if (loadPromise) return loadPromise
    if (projectOptions.value.length) return Promise.resolve()

    projectOptionsLoading.value = true
    loadPromise = getProjectOptionsApi()
      .then((response) => {
        projectOptions.value = response.data ?? []
      })
      .catch(() => {
        // 业务错误已由请求层统一提示,这里保持空选项
      })
      .finally(() => {
        projectOptionsLoading.value = false
        loadPromise = undefined
      })

    return loadPromise
  }

  function refreshProjectOptions() {
    projectOptions.value = []
    return load()
  }

  onMounted(() => void load())

  return {
    projectOptions,
    projectOptionsLoading,
    refreshProjectOptions,
  }
}
