import { structuredCloneSafe } from './schema'
import type { ApplicationSchema, MaterialSchema } from './schema/types'

// 本地存储键保持稳定（不随路由/菜单位置变化），避免升级后丢失草稿与发布记录
const DRAFT_PREFIX = 'low-code-v2:draft:'
const DRAFT_META_PREFIX = 'low-code-v2:draft-meta:'
const PUBLISHED_PREFIX = 'low-code-v2:published:'
const MATERIAL_KEY = 'low-code-v2:materials'
const MAX_VERSIONS = 30

/** 发布快照：版本控制的最小单元 */
export interface PublishedSnapshot {
  id: string
  appId: string
  version: string
  time: number
  /** 发布说明 */
  note?: string
  /** 是否为当前线上版本 */
  current?: boolean
  schema: ApplicationSchema
}

export interface PublishOptions {
  version: string
  note?: string
  /** 是否设为当前线上版本，默认 true */
  setCurrent?: boolean
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

/** 保存草稿（未发布的工作区） */
export function saveDraft(schema: ApplicationSchema) {
  const savedAt = Date.now()
  const saved = writeJson(`${DRAFT_PREFIX}${schema.app.id}`, schema)
  if (saved) {
    writeJson(`${DRAFT_META_PREFIX}${schema.app.id}`, { savedAt })
  }
  return saved
}

export function loadDraft(appId: string): ApplicationSchema | undefined {
  return readJson<ApplicationSchema | undefined>(
    `${DRAFT_PREFIX}${appId}`,
    undefined
  )
}

export function loadDraftSavedAt(appId: string): number | undefined {
  const meta = readJson<{ savedAt?: number } | undefined>(
    `${DRAFT_META_PREFIX}${appId}`,
    undefined
  )
  return meta?.savedAt
}

export function clearDraft(appId: string) {
  window.localStorage.removeItem(`${DRAFT_PREFIX}${appId}`)
  window.localStorage.removeItem(`${DRAFT_META_PREFIX}${appId}`)
}

/** 发布：保存快照、写入发布说明并维护当前线上版本 */
export function publishApp(
  schema: ApplicationSchema,
  options: PublishOptions
): PublishedSnapshot {
  const setCurrent = options.setCurrent ?? true
  const snapshot: PublishedSnapshot = {
    id: `pub-${Date.now().toString(36)}`,
    appId: schema.app.id,
    version: options.version,
    time: Date.now(),
    note: options.note?.trim() || undefined,
    current: setCurrent,
    schema: structuredCloneSafe(schema),
  }
  const versions = listPublished(schema.app.id)
  // 同一版本号重复发布时覆盖旧记录
  const duplicated = versions.findIndex(
    (item) => item.version === options.version
  )
  if (duplicated >= 0) versions.splice(duplicated, 1)
  versions.unshift(snapshot)
  const next = versions.slice(0, MAX_VERSIONS)
  if (setCurrent) markCurrentVersion(next, snapshot.id)
  // 若当前版本被删除或从未设置，则回退到最新版本
  if (!next.some((item) => item.current) && next.length) {
    next[0].current = true
  }
  writeJson(`${PUBLISHED_PREFIX}${schema.app.id}`, next)
  return snapshot
}

export function listPublished(appId: string): PublishedSnapshot[] {
  return readJson<PublishedSnapshot[]>(`${PUBLISHED_PREFIX}${appId}`, [])
}

export function loadPublished(
  appId: string,
  version?: string
): PublishedSnapshot | undefined {
  const versions = listPublished(appId)
  if (!versions.length) return undefined
  if (version) {
    return versions.find((item) => item.version === version)
  }
  return versions.find((item) => item.current) ?? versions[0]
}

/** 切换当前线上版本（回滚/切版） */
export function setCurrentVersion(appId: string, id: string) {
  const versions = listPublished(appId)
  if (!versions.some((item) => item.id === id)) return
  markCurrentVersion(versions, id)
  writeJson(`${PUBLISHED_PREFIX}${appId}`, versions)
}

/** 删除某个已发布版本（当前版本被删除时自动回退到最新版本） */
export function deletePublished(appId: string, id: string) {
  const versions = listPublished(appId).filter((item) => item.id !== id)
  if (!versions.some((item) => item.current) && versions.length) {
    versions[0].current = true
  }
  writeJson(`${PUBLISHED_PREFIX}${appId}`, versions)
}

function markCurrentVersion(versions: PublishedSnapshot[], id: string) {
  for (const item of versions) {
    item.current = item.id === id
  }
}

/** 物料注册信息本地存储 */
export function saveMaterials(materials: MaterialSchema[]) {
  const serializable = materials.map((material) => ({
    ...material,
    definition: { ...material.definition, renderer: undefined },
  }))
  return writeJson(MATERIAL_KEY, serializable)
}

export function loadMaterials(): MaterialSchema[] {
  return readJson<MaterialSchema[]>(MATERIAL_KEY, [])
}
