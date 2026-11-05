import type { SkeletonProps } from 'boneyard-js/vue'

export interface ViewSectionSkeletonOptions extends Omit<
  SkeletonProps,
  'loading'
> {}

export interface ViewSectionProps {
  /**
   * @desc 是否显示骨架屏
   * @default true
   */
  showSkeleton?: boolean
  /**
   * @desc 区块是否处于加载态
   * @default false
   */
  loading?: boolean
  /**
   * @desc 骨架屏名称
   * @default 'default'
   */
  skeletonName?: string
  /**
   * @desc 骨架屏选项
   * @default {}
   */
  skeletonOptions?: ViewSectionSkeletonOptions
}
