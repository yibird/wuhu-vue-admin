import { resolve } from 'path'
const pathResolve = (dir: string) => resolve(process.cwd(), '.', dir)

export function createResolve() {
  return {
    alias: [
      {
        find: '@',
        replacement: pathResolve('src') + '/',
      },
      {
        find: '#',
        replacement: pathResolve('types') + '/',
      },
      {
        find: '#mock',
        replacement: pathResolve('mock') + '/',
      },
      {
        // frappe-gantt exposes its stylesheet through the root `style` condition,
        // but does not export the documented dist subpath.
        find: 'frappe-gantt/dist/frappe-gantt.css',
        replacement: pathResolve(
          'node_modules/frappe-gantt/dist/frappe-gantt.css'
        ),
      },
    ],
  }
}
