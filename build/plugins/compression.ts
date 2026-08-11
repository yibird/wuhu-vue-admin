import { compression } from 'vite-plugin-compression2'

export function compressionPlugin() {
  return compression({
    threshold: 10 * 1024,
    skipIfLargerOrEqual: true,
    logLevel: 'silent',
    algorithms: ['gzip', 'brotliCompress'],
  })
}
