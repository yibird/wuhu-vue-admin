export function getElSpacingInfo(target?: Element | null) {
  if (!target || !(target instanceof Element)) {
    return {
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        x: 0,
        y: 0
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        x: 0,
        y: 0
      },
      border: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        x: 0,
        y: 0
      }
    }
  }
  const computedStyle = window.getComputedStyle(target)

  const marginTop = parseFloat(computedStyle.marginTop)
  const marginBottom = parseFloat(computedStyle.marginBottom)
  const marginLeft = parseFloat(computedStyle.marginLeft)
  const marginRight = parseFloat(computedStyle.marginRight)
  const margin = {
    top: marginTop,
    right: marginRight,
    bottom: marginBottom,
    left: marginLeft,
    y: marginTop + marginBottom,
    x: marginLeft + marginRight
  }

  const paddingTop = parseFloat(computedStyle.paddingTop)
  const paddingBottom = parseFloat(computedStyle.paddingBottom)
  const paddingLeft = parseFloat(computedStyle.paddingLeft)
  const paddingRight = parseFloat(computedStyle.paddingRight)
  const padding = {
    top: paddingTop,
    right: paddingRight,
    bottom: paddingBottom,
    left: paddingLeft,
    y: paddingTop + paddingBottom,
    x: paddingLeft + paddingRight
  }

  const borderTopWidth = parseFloat(computedStyle.borderTopWidth)
  const borderBottomWidth = parseFloat(computedStyle.borderBottomWidth)
  const borderLeftWidth = parseFloat(computedStyle.borderLeftWidth)
  const borderRightWidth = parseFloat(computedStyle.borderRightWidth)
  const border = {
    top: borderTopWidth,
    right: borderLeftWidth,
    bottom: borderBottomWidth,
    left: borderRightWidth,
    y: borderTopWidth + borderBottomWidth,
    x: borderLeftWidth + borderRightWidth
  }
  return {
    margin,
    padding,
    border
  }
}

export function getElSpacing(target?: Element | null) {
  const { margin, padding, border } = getElSpacingInfo(target)
  return {
    x: margin.x + padding.x + border.x,
    y: margin.y + padding.y + border.y
  }
}

export function getElVerticalSpacing(target?: Element | null) {
  if (!target) return 0
  const { margin, padding, border } = getElSpacingInfo(target)
  return margin.y + padding.y + border.y
}

export function getElHorizontalSpacing(target?: Element | null) {
  if (!target) return 0
  const { margin, padding, border } = getElSpacingInfo(target)
  return margin.x + padding.x + border.x
}

export function getElementSize(element?: Element | null) {
  if (!element) return { width: 0, height: 0 }
  const spacing = getElSpacingInfo(element)
  return {
    width: element.clientWidth + spacing.margin.x + spacing.padding.x + spacing.border.x,
    height: element.clientHeight + spacing.margin.y + spacing.padding.y + spacing.border.y
  }
}

export function getElementTotalHeight(element?: Element | null) {
  if (!element) return 0
  const { height } = getElementSize(element)
  return height
}

export function getElementTotalWidth(element?: Element | null) {
  if (!element) return 0
  const { width } = getElementSize(element)
  return width
}
