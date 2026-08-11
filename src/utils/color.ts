export type RgbColor = readonly [red: number, green: number, blue: number]
export type ColorValue = string | RgbColor

const HEX_COLOR_PATTERN = /^#([\da-f]{3}|[\da-f]{6})$/i

function isRgbColor(color: ColorValue): color is RgbColor {
  return typeof color !== 'string'
}

function normalizeRgbChannels(channels: readonly number[]): RgbColor | null {
  if (
    channels.length !== 3 ||
    channels.some(
      (channel) => !Number.isFinite(channel) || channel < 0 || channel > 255
    )
  ) {
    return null
  }

  const [red, green, blue] = channels as [number, number, number]
  return [Math.round(red), Math.round(green), Math.round(blue)]
}

function parseRgbChannel(channel: string): number | null {
  const value = channel.trim()
  if (!value) return null

  if (value.endsWith('%')) {
    const percentage = Number(value.slice(0, -1))
    if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
      return null
    }
    return (percentage / 100) * 255
  }

  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function resolveColor(color: ColorValue): RgbColor | null {
  if (isRgbColor(color)) return normalizeRgbChannels(color)
  return hexToRgb(color) ?? parseRgbColor(color)
}

export function parseRgbColor(color: string): RgbColor | null {
  const value = color.trim()
  const functionMatch = /^rgb\((.*)\)$/i.exec(value)
  const body = functionMatch?.[1] ?? value
  const channels = body.includes(',')
    ? body.split(',')
    : body.split(/\s+/).filter(Boolean)

  if (channels.length !== 3) return null

  const parsedChannels: number[] = []
  for (const channel of channels) {
    const parsedChannel = parseRgbChannel(channel)
    if (parsedChannel === null) return null
    parsedChannels.push(parsedChannel)
  }

  return normalizeRgbChannels(parsedChannels)
}

export function hexToRgb(color: string): RgbColor | null {
  const match = HEX_COLOR_PATTERN.exec(color.trim())
  if (!match) return null

  const value = match[1]
  if (!value) return null

  const normalized =
    value.length === 3
      ? value
          .split('')
          .map((channel) => channel.repeat(2))
          .join('')
      : value

  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
  ]
}

export function rgbToHex(color: string | RgbColor): string | null {
  const rgb = isRgbColor(color)
    ? normalizeRgbChannels(color)
    : parseRgbColor(color)
  if (!rgb) return null

  return `#${rgb
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('')}`
}

export function isValidColor(color: string): boolean {
  return resolveColor(color) !== null
}

export function formatRgbColor(
  color: ColorValue,
  separator = ', '
): string | null {
  const rgb = resolveColor(color)
  return rgb ? rgb.join(separator) : null
}

export function colorToRgba(color: ColorValue, alpha: number): string | null {
  const rgb = resolveColor(color)
  if (!rgb || !Number.isFinite(alpha) || alpha < 0 || alpha > 1) return null
  return `rgba(${rgb.join(', ')}, ${alpha})`
}

export function getRelativeLuminance(color: ColorValue): number | null {
  const rgb = resolveColor(color)
  if (!rgb) return null

  const [red, green, blue] = rgb.map((channel) => {
    const value = channel / 255
    return value <= 0.04045
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

export function getContrastColor(
  background: ColorValue,
  darkColor: ColorValue = '#111827',
  lightColor: ColorValue = '#ffffff'
): string | null {
  const backgroundLuminance = getRelativeLuminance(background)
  const darkLuminance = getRelativeLuminance(darkColor)
  const lightLuminance = getRelativeLuminance(lightColor)
  if (
    backgroundLuminance === null ||
    darkLuminance === null ||
    lightLuminance === null
  ) {
    return null
  }

  const contrast = (first: number, second: number) =>
    (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05)

  const darkContrast = contrast(backgroundLuminance, darkLuminance)
  const lightContrast = contrast(backgroundLuminance, lightLuminance)
  const selectedColor = darkContrast >= lightContrast ? darkColor : lightColor

  if (isRgbColor(selectedColor)) return rgbToHex(selectedColor)
  return selectedColor
}
