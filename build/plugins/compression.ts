import { compression, defineAlgorithm } from 'vite-plugin-compression2'

export function compressionPlugin() {
  return compression({
    algorithms: [
      'gzip',
      'brotliCompress',
      defineAlgorithm('deflate', { level: 9 }),
    ],
  })
}
