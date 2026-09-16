import {
  computed,
  defineComponent,
  h,
  markRaw,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRefs,
  useAttrs,
  useSlots,
  watch,
} from 'vue'
import {
  componentRegistry,
  installMaterialRuntimeBridge,
  provideMaterialVueApi,
} from '../registry'
import { controlMaterialDefinitions } from './controls'
import { displayMaterialDefinitions } from './display'
import { layoutMaterialDefinitions } from './layout'

/** 组件面板分类顺序 */
export const MATERIAL_CATEGORY_ORDER = [
  '布局',
  '基础控件',
  '展示',
  '数据展示',
  '物料',
]

let installed = false

/**
 * 注册平台内置物料（幂等）。
 * 物料中心注册的远程物料走同一 Registry，Runtime 渲染流程完全一致。
 */
export function setupBuiltinMaterials() {
  if (installed) return
  installed = true
  installMaterialRuntimeBridge()
  provideMaterialVueApi({
    computed,
    defineComponent,
    h,
    markRaw,
    nextTick,
    onMounted,
    onUnmounted,
    reactive,
    ref,
    toRefs,
    useAttrs,
    useSlots,
    watch,
  })
  for (const definition of [
    ...layoutMaterialDefinitions,
    ...controlMaterialDefinitions,
    ...displayMaterialDefinitions,
  ]) {
    if (!definition.renderer) {
      console.warn(
        `[low-code] 内置物料 ${definition.type} 缺少 renderer 实现，请检查物料定义`
      )
    }
    componentRegistry.register(definition)
  }
}
