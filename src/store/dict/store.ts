import { defineStore, storeToRefs } from 'pinia'
import type { DictOption, DictMap, DictLoadedMap } from './types'

const mockDictMap: DictMap = {
  sys_sex: [
    {
      label: '男',
      value: '1',
    },
    {
      label: '女',
      value: '0',
    },
  ],
  sys_user_status: [
    {
      label: '正常',
      value: '1',
    },
    {
      label: '停用',
      value: '0',
    },
  ],
}

// 同一字典类型的并发请求复用同一个 Promise
const pendingRequests = new Map<string, Promise<DictOption[]>>()

// 根据字典类型获取字典数据
async function getDictOptions(type: string): Promise<DictOption[]> {
  return mockDictMap[type] || []
}

// 获取所有字典数据,key为字典类型,value为字典数据
async function getAllDict(): Promise<Record<string, DictOption[]>> {
  return mockDictMap
}

export const dictStore = defineStore('dict', {
  state: () => ({
    // 字典数据映射,key为字典类型,value为字典数据
    dictMap: {} as DictMap,
    // 字典数据加载状态映射,key为字典类型,value为是否加载完成
    loadedMap: {} as DictLoadedMap,
  }),
  actions: {
    /**
     * 加载所有字典数据
     */
    async loadAllDict() {
      const dictMap = await getAllDict()
      this.dictMap = dictMap
      this.loadedMap = Object.fromEntries(
        Object.keys(dictMap).map((type) => [type, true])
      )
    },
    /**
     * 根据字典类型加载字典数据
     *
     * @param type 字典类型
     * @param force 是否强制加载
     * @returns 字典数据 Promise
     */
    loadDict(type: string, force = false) {
      // 不强制加载且已加载完成,直接返回已加载数据
      if (!force && this.loadedMap[type]) return this.getDict(type)

      // 不强制加载且未加载完成,返回待加载 Promise
      if (!force) {
        const pending = pendingRequests.get(type)
        if (pending) return pending
      }
      const request = getDictOptions(type)
        .then((options) => {
          this.dictMap[type] = options
          this.loadedMap[type] = true
          return options
        })
        .finally(() => {
          if (pendingRequests.get(type) === request) {
            pendingRequests.delete(type)
          }
        })
      // 强制加载,缓存新加载 Promise,并返回
      pendingRequests.set(type, request)
      return request
    },
    /**
     * 根据字典类型获取字典数据
     *
     * @param type 字典类型
     * @returns 字典数据
     */
    getDict(type: string) {
      return this.dictMap[type] ?? []
    },
    /**
     * 刷新字典数据
     *
     * @param type 字典类型
     */
    refreshDict(type: string) {
      return this.loadDict(type, true)
    },
    /**
     * 清除字典数据
     *
     * @param type 字典类型
     */
    clearDict(type: string) {
      delete this.dictMap[type]
      delete this.loadedMap[type]
      pendingRequests.delete(type)
    },
    /**
     * 清除所有字典数据
     */
    clearAllDict() {
      this.dictMap = {}
      this.loadedMap = {}
      pendingRequests.clear()
    },
  },
  persist: true,
})

export const useDictStore = () => {
  const store = dictStore()
  return { ...store, ...storeToRefs(store) }
}
