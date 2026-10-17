import type { MasonryCard } from './types'

/** 首屏卡片数量 */
export const PAGE_SIZE = 12
/** 触底每次追加数量 */
export const LOAD_MORE_SIZE = 9
/** 演示数据总量 */
export const TOTAL_CARDS = 60

/** 骨架屏列高，模拟瀑布流错落效果 */
export const SKELETON_HEIGHTS = [220, 300, 180, 260, 340, 200, 280, 240]

const titles = [
  '极简主义界面探索',
  '城市夜景光影记录',
  '品牌视觉系统重设计',
  '山海之间的旅行手记',
  '未来感 3D 场景练习',
  '春日野餐配色灵感',
  '移动端交互细节拆解',
  '独立书店的空间叙事',
  '复古胶片质感人像',
  '咖啡馆品牌包装方案',
  '数据可视化的叙事方式',
  '留白与秩序的平衡',
]

const descriptions = [
  '从版式、留白与层级出发，梳理一套可以复用的视觉语言。',
  '用镜头记录城市入夜后的光线、秩序与情绪变化。',
  '围绕品牌识别、色彩与字体建立完整的视觉资产。',
  '沿途收集的风景、人物与片刻，整理成旅行手记。',
  '尝试材质、光线与构图在三维空间中的表现力。',
  '用一组低饱和配色呈现轻松、明亮的春日氛围。',
  '聚焦手势、反馈与动效，还原流畅的移动端体验。',
  '记录独立书店如何通过空间设计讲述自己的故事。',
  '胶片颗粒、色温与自然光共同构成复古的画面质感。',
  '从标志到物料，探索小体量品牌的一致性表达。',
  '通过图表与信息层级，让复杂数据更容易被理解。',
  '在有限的画布中寻找呼吸感与视觉节奏。',
]

const tags = ['UI 设计', '摄影', '品牌', '旅行', '3D', '配色', '交互']

const authors = ['林舟', '陈晚', '苏禾', '周野', '顾言', '许白', '沈青', '江屿']

const tones = [
  'from-primary/25 to-primary/5',
  'from-warning/25 to-warning/5',
  'from-success/25 to-success/5',
  'from-info/25 to-info/5',
  'from-error/20 to-error/5',
]

const heights = [220, 300, 180, 260, 340, 200, 280, 240, 320, 210]

export function createMasonryCard(index: number): MasonryCard {
  const seed = index + 1

  return {
    id: `masonry-${seed}`,
    title: `${titles[index % titles.length]} #${seed}`,
    description: descriptions[index % descriptions.length],
    tag: tags[index % tags.length],
    author: authors[index % authors.length],
    avatar: `https://i.pravatar.cc/80?img=${(index % 60) + 1}`,
    likes: 120 + ((index * 37) % 860),
    height: heights[index % heights.length],
    image: `https://picsum.photos/seed/wuhu-masonry-${seed}/600/900`,
    tone: tones[index % tones.length],
  }
}

export function createMasonryCards(start: number, count: number) {
  return Array.from({ length: count }, (_, offset) =>
    createMasonryCard(start + offset)
  )
}
