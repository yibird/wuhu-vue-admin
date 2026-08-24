import { createVNode, render } from 'vue'
import { Tooltip } from 'antdv-next'
import type { AppContext, Directive, DirectiveBinding } from 'vue'
import type { TooltipPlacement, TooltipProps } from 'antdv-next'

const OVERFLOW_TOLERANCE = 1
const DESTROY_DELAY = 180

export interface EllipsisTooltipOptions extends Pick<
  TooltipProps,
  'color' | 'getPopupContainer' | 'placement' | 'zIndex'
> {
  content?: number | string
  disabled?: boolean
}

export type EllipsisTooltipValue =
  | EllipsisTooltipOptions
  | false
  | null
  | number
  | string
  | undefined

interface EllipsisTooltipContext {
  appContext?: AppContext
  arg?: string
  container?: HTMLDivElement
  destroyTimer?: number
  open: boolean
  value: EllipsisTooltipValue
  onBlur: () => void
  onFocus: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
  onViewportChange: () => void
}

const contexts = new WeakMap<HTMLElement, EllipsisTooltipContext>()

function isOverflowing(el: HTMLElement) {
  if (el.clientWidth === 0 || el.clientHeight === 0) return false

  return (
    el.scrollWidth - el.clientWidth > OVERFLOW_TOLERANCE ||
    el.scrollHeight - el.clientHeight > OVERFLOW_TOLERANCE
  )
}

function getOptions(value: EllipsisTooltipValue) {
  return value && typeof value === 'object' ? value : undefined
}

function getContent(el: HTMLElement, value: EllipsisTooltipValue) {
  const options = getOptions(value)
  const content =
    options?.content ??
    (typeof value === 'number' || typeof value === 'string'
      ? value
      : el.textContent)

  return String(content ?? '').trim()
}

function getPlacement(
  value: EllipsisTooltipValue,
  arg?: string
): TooltipPlacement {
  return (getOptions(value)?.placement ?? arg ?? 'top') as TooltipPlacement
}

function clearDestroyTimer(context: EllipsisTooltipContext) {
  if (context.destroyTimer === undefined) return
  window.clearTimeout(context.destroyTimer)
  context.destroyTimer = undefined
}

function removeViewportListeners(
  el: HTMLElement,
  context: EllipsisTooltipContext
) {
  el.ownerDocument.removeEventListener('scroll', context.onViewportChange, true)
  el.ownerDocument.defaultView?.removeEventListener(
    'resize',
    context.onViewportChange
  )
}

function destroyTooltip(el: HTMLElement, context: EllipsisTooltipContext) {
  clearDestroyTimer(context)
  removeViewportListeners(el, context)
  context.open = false

  if (!context.container) return
  render(null, context.container)
  context.container.remove()
  context.container = undefined
}

function ensureContainer(el: HTMLElement, context: EllipsisTooltipContext) {
  if (context.container) return context.container

  const container = el.ownerDocument.createElement('div')
  container.dataset.ellipsisTooltipHost = ''
  container.style.display = 'contents'
  el.ownerDocument.body.appendChild(container)
  context.container = container

  el.ownerDocument.addEventListener('scroll', context.onViewportChange, true)
  el.ownerDocument.defaultView?.addEventListener(
    'resize',
    context.onViewportChange
  )

  return container
}

function renderTooltip(el: HTMLElement, context: EllipsisTooltipContext) {
  const content = getContent(el, context.value)
  if (!content) {
    destroyTooltip(el, context)
    return
  }

  const options = getOptions(context.value)
  const rect = el.getBoundingClientRect()
  const container = ensureContainer(el, context)
  const vnode = createVNode(
    Tooltip,
    {
      color: options?.color,
      destroyOnHidden: true,
      fresh: true,
      getPopupContainer:
        options?.getPopupContainer ?? (() => el.ownerDocument.body),
      mouseEnterDelay: 0,
      mouseLeaveDelay: 0,
      open: context.open,
      placement: getPlacement(context.value, context.arg),
      title: content,
      trigger: [],
      zIndex: options?.zIndex,
    },
    {
      default: () =>
        createVNode('span', {
          'aria-hidden': 'true',
          'data-ellipsis-tooltip-anchor': '',
          style: {
            display: 'block',
            height: `${rect.height}px`,
            left: `${rect.left}px`,
            pointerEvents: 'none',
            position: 'fixed',
            top: `${rect.top}px`,
            width: `${rect.width}px`,
          },
        }),
    }
  )

  vnode.appContext = context.appContext ?? null
  render(vnode, container)
}

function showTooltip(el: HTMLElement, context: EllipsisTooltipContext) {
  clearDestroyTimer(context)

  const options = getOptions(context.value)
  if (context.value === false || options?.disabled || !isOverflowing(el)) {
    destroyTooltip(el, context)
    return
  }

  context.open = true
  renderTooltip(el, context)
}

function hideTooltip(el: HTMLElement, context: EllipsisTooltipContext) {
  if (!context.container) return

  context.open = false
  renderTooltip(el, context)
  clearDestroyTimer(context)
  context.destroyTimer = window.setTimeout(() => {
    destroyTooltip(el, context)
  }, DESTROY_DELAY)
}

function getAppContext(binding: DirectiveBinding<EllipsisTooltipValue>) {
  const instance = binding.instance?.$
  if (!instance) return undefined

  return {
    ...instance.appContext,
    provides: instance.provides,
  }
}

export const ellipsisTooltip: Directive<HTMLElement, EllipsisTooltipValue> = {
  mounted(el, binding) {
    const context: EllipsisTooltipContext = {
      appContext: getAppContext(binding),
      arg: binding.arg,
      open: false,
      value: binding.value,
      onBlur: () => hideTooltip(el, context),
      onFocus: () => showTooltip(el, context),
      onMouseEnter: () => showTooltip(el, context),
      onMouseLeave: () => hideTooltip(el, context),
      onViewportChange: () => destroyTooltip(el, context),
    }

    contexts.set(el, context)
    el.addEventListener('mouseenter', context.onMouseEnter)
    el.addEventListener('mouseleave', context.onMouseLeave)
    el.addEventListener('focus', context.onFocus)
    el.addEventListener('blur', context.onBlur)
  },

  updated(el, binding) {
    const context = contexts.get(el)
    if (!context) return

    context.value = binding.value
    context.arg = binding.arg
    context.appContext = getAppContext(binding)

    if (context.open) {
      showTooltip(el, context)
    }
  },

  beforeUnmount(el) {
    const context = contexts.get(el)
    if (!context) return

    el.removeEventListener('mouseenter', context.onMouseEnter)
    el.removeEventListener('mouseleave', context.onMouseLeave)
    el.removeEventListener('focus', context.onFocus)
    el.removeEventListener('blur', context.onBlur)
    destroyTooltip(el, context)
    contexts.delete(el)
  },
}
