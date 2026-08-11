import type {
  DesignerNode,
  DesignerNodeDensity,
  DesignerNodeTone,
} from '../types'

const densityClassMap: Record<DesignerNodeDensity, string> = {
  compact: 'p-10',
  comfortable: 'p-14',
  spacious: 'p-18',
}

const toneClassMap: Record<DesignerNodeTone, string> = {
  neutral: 'border-color-2 hover:border-color-3',
  primary: 'border-color-primary bg-primary-tint',
  success: 'border-color-success bg-success-tint',
  warning: 'border-color-warning bg-warning-tint',
}

const tonePillClassMap: Record<DesignerNodeTone, string> = {
  neutral: 'bg-fill-tertiary text-muted',
  primary: 'bg-primary-tint text-primary',
  success: 'bg-success-tint text-success',
  warning: 'bg-warning-tint text-warning',
}

const toneButtonClassMap: Record<DesignerNodeTone, string> = {
  neutral: 'bg-primary',
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
}

const toneSurfaceClassMap: Record<DesignerNodeTone, string> = {
  neutral: 'bg-page',
  primary: 'bg-primary-tint',
  success: 'bg-success-tint',
  warning: 'bg-warning-tint',
}

const toneTextClassMap: Record<DesignerNodeTone, string> = {
  neutral: 'text-muted',
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
}

function getNodeDensity(node: DesignerNode): DesignerNodeDensity {
  return node.style.density ?? 'comfortable'
}

function getNodeTone(node: DesignerNode): DesignerNodeTone {
  return node.style.tone ?? 'neutral'
}

export function useDesignerNodeClasses() {
  function getNodeClass(node: DesignerNode, selected: boolean) {
    return [
      'low-code-designer-node group relative cursor-pointer select-none overflow-hidden rounded-8 border-1 border-solid bg-container transition-[transform,box-shadow,border-color,background-color,opacity] duration-200 ease-out hover:-translate-y-1',
      densityClassMap[getNodeDensity(node)],
      selected
        ? 'border-color-primary bg-primary-tint shadow-[0_0_0_3px_rgb(var(--w-color-primary)_/_28%),0_18px_42px_rgb(37_99_235_/_18%)] ring-2 ring-primary ring-offset-2 ring-offset-container'
        : toneClassMap[getNodeTone(node)],
    ]
  }

  function getTonePillClass(node: DesignerNode) {
    return tonePillClassMap[getNodeTone(node)]
  }

  function getToneButtonClass(node: DesignerNode) {
    return toneButtonClassMap[getNodeTone(node)]
  }

  function getToneSurfaceClass(node: DesignerNode) {
    return toneSurfaceClassMap[getNodeTone(node)]
  }

  function getToneTextClass(node: DesignerNode) {
    return toneTextClassMap[getNodeTone(node)]
  }

  function getChartBarClass(node: DesignerNode, index: number) {
    if (index % 2) return getToneButtonClass(node)
    return getTonePillClass(node).split(' ')[0]
  }

  return {
    getChartBarClass,
    getNodeClass,
    getToneButtonClass,
    getTonePillClass,
    getToneSurfaceClass,
    getToneTextClass,
  }
}
