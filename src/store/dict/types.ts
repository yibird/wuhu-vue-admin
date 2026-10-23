export interface DictType {
  // 字典类型
  type: string
  // 字典描述
  description: string
}

// 字典数据项
export interface DictOption {
  label: string
  value: string | number
  color?: string
}

// 字典数据映射,key为字典类型,value为字典数据
export type DictMap = Record<string, DictOption[]>
// 字典数据加载状态映射,key为字典类型,value为是否加载完成
export type DictLoadedMap = Record<string, boolean>
