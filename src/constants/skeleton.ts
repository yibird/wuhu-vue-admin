import type { SnapshotConfig } from 'boneyard-js'

/**
 * boneyard 抓取配置
 *
 * 排除纯装饰的空元素,避免它们被识别为整块骨骼并覆盖内部细节。
 */
export const SKELETON_SNAPSHOT_CONFIG: SnapshotConfig = {
  excludeSelectors: ['.ant-border-beam'],
}
