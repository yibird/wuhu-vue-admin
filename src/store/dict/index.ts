import { defineStore, storeToRefs } from 'pinia'
import type { DictState } from './types'

export const dictStore = defineStore('dict', {
  state: (): DictState => ({ dictData: {} }),
  actions: {},
})

export const useDictStore = () => {
  const store = dictStore()
  return { ...store, ...storeToRefs(store) }
}
