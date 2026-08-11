export function getSafeRedirect(value: unknown, fallback = '/'): string {
  if (typeof value !== 'string') return fallback
  const redirect = value.trim()
  if (
    !redirect.startsWith('/') ||
    redirect.startsWith('//') ||
    redirect.includes('\\')
  ) {
    return fallback
  }
  return redirect
}
