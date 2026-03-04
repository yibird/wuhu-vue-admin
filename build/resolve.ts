import { resolve } from 'path'
const pathResolve = (dir: string) => resolve(process.cwd(), '.', dir)

export function createResolve() {
  return {
    alias: [
      {
        find: '@',
        replacement: pathResolve('src') + '/'
      },
      {
        find: '#',
        replacement: pathResolve('typings') + '/'
      },
      {
        find: '#mock',
        replacement: pathResolve('mock') + '/'
      }
    ]
  }
}
