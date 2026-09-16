import { setupBuiltinMaterials } from './materials'
import { loadMaterials } from './persistence'
import { componentRegistry } from './registry'
import { setupBuiltinActions } from './runtime'

let installed = false

/**
 * 初始化低代码平台内核（幂等）：
 * 注册内置物料 -> 注册内置 Action -> 载入物料中心本地注册信息。
 */
export function setupLowCodePlatform() {
  if (installed) return
  installed = true
  setupBuiltinMaterials()
  setupBuiltinActions()
  for (const material of loadMaterials()) {
    componentRegistry.registerMaterial(material)
  }
}
