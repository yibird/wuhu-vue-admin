<template>
  <article
    class="org-node w-172 cursor-pointer rounded-10 b-1-regular bg-container px-10 py-9 text-left shadow-sm motion-interactive hover:(-translate-y-1 shadow-md)"
    :class="{
      'org-node--accent': root,
      'org-node--selected': selected,
    }"
    :style="{ '--w-dept-node-accent': accent.color }"
  >
    <div class="flex min-w-0 items-center gap-8">
      <span
        class="dept-org-accent size-26 flex flex-none items-center justify-center rounded-7 text-white"
      >
        <Icon :name="accent.icon" :size="15" />
      </span>
      <div class="min-w-0 flex-1">
        <div class="truncate text-sm text-main font-600">{{ name }}</div>
        <div class="mt-2 truncate text-xs text-secondary">{{ subtitle }}</div>
      </div>
    </div>

    <div class="mt-8 flex min-w-0 items-center gap-6 b-t-1-muted pt-8">
      <span
        v-if="initial"
        class="dept-org-accent-soft org-node__avatar size-20 flex flex-none items-center justify-center rounded-full text-xs font-600"
      >
        {{ initial }}
      </span>
      <span class="min-w-0 flex-1 truncate text-xs text-secondary">
        {{ leader || (root ? '组织架构根节点' : '暂未指定负责人') }}
      </span>
      <span class="flex-none text-xs text-muted">{{ count }} 下级</span>
    </div>
  </article>
</template>

<script setup lang="ts">
import { resolveDeptAccent } from '../data'
import { Icon } from '@/components/icon'
import type { DeptType } from '@/apis'

interface Props {
  /**
   * @desc 节点名称
   */
  name: string
  /**
   * @desc 节点编码
   */
  code: string
  /**
   * @desc 节点负责人
   */
  leader: string
  /**
   * @desc 节点类型(1:部门,2:岗位)
   */
  type: DeptType
  /**
   * @desc 直接下级数量
   */
  count: number
  /**
   * @desc 是否为虚拟根节点
   * @default false
   */
  root?: boolean
  /**
   * @desc 是否处于选中态
   * @default false
   */
  selected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  root: false,
  selected: false,
})

const accent = computed(() => resolveDeptAccent(props.type, props.root))

const initial = computed(() => (props.leader ? props.leader.slice(-1) : ''))

const subtitle = computed(() =>
  props.root ? '组织架构总览' : `${props.code || '—'} · ${accent.value.label}`
)
</script>

<style lang="less" scoped>
/**
 * 卡片底色:左上角强调色光晕 + 斜向淡渐变,常态用弱强度,
 * 根节点与选中态通过改写局部变量换成强调强度,渐变表达式只维护一份。
 */
.org-node {
  background-image:
    radial-gradient(
      circle at 0% 0%,
      color-mix(
        in srgb,
        var(--w-dept-node-accent) var(--w-dept-node-sheen-opacity),
        transparent
      ),
      transparent var(--w-dept-node-glow-stop)
    ),
    linear-gradient(
      135deg,
      color-mix(
          in srgb,
          var(--w-dept-node-accent) var(--w-dept-node-sheen-opacity),
          transparent
        )
        0%,
      transparent 56%
    );

  &--accent,
  &--selected {
    --w-dept-node-sheen-opacity: var(--w-dept-node-accent-opacity);
  }

  &--accent {
    border-color: color-mix(
      in srgb,
      var(--w-dept-node-accent) 40%,
      transparent
    );
  }

  &--selected {
    border-color: var(--w-dept-node-accent);
    box-shadow: 0 0 0 var(--w-dept-node-ring-width)
      color-mix(
        in srgb,
        var(--w-dept-node-accent) var(--w-dept-node-ring-opacity),
        transparent
      );
  }

  // 悬浮态统一走强调色,声明放在最后以覆盖上面的状态边框
  &:hover {
    border-color: var(--w-dept-node-accent);
  }
}

.org-node__avatar {
  color: var(--w-dept-node-accent);
}
</style>
