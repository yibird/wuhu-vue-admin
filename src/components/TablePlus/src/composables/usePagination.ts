import type { PaginationProps } from 'naive-ui'

interface UsePaginationOptions {
  /**
   * 分页的初始值
   */
  initial?: PaginationProps
  /**
   * @desc 总条数
   * @default 0
   */
  itemCount?: Ref<number>
  /**
   * 切换分页时回调
   * @param page 当前分页
   * @param pageSize 每页显示数量
   * @returns void
   */
  onPaginate?: (page: number, pageSize: number) => void
}

const defaultPagination: PaginationProps = {
  pageSizes: [10, 20, 30, 50, 100, 200],
  pageSize: 10,
  page: 1,
  showQuickJumpDropdown: true,
  showQuickJumper: true,
  showSizePicker: true,
  prefix(info) {
    return h('div', [
      h('span', '共'),
      h(
        'span',
        { class: 'font-bold text-theme', style: { margin: '0 4px' } },
        info.itemCount ?? 0
      ),
      h('span', '条数据'),
    ])
  },
}

export function usePagination(options?: UsePaginationOptions) {
  const { itemCount = ref(0), onPaginate } = options || {}

  const initialPagination = { ...defaultPagination, ...options?.initial }
  const pagination = reactive<PaginationProps>(initialPagination)

  const changePage = (page: number) => {
    Object.assign(pagination, {
      page,
    })
    if (typeof onPaginate === 'function') {
      onPaginate(page, pagination.pageSize ?? 0)
    }
  }

  const changePageSize = (size: number) => {
    Object.assign(pagination, {
      page: 1,
      pageSize: size,
    })
    if (typeof onPaginate === 'function') {
      onPaginate(1, size)
    }
  }

  watch(itemCount, (val) => {
    pagination.itemCount = val
  })

  pagination.onUpdatePage = changePage
  pagination.onUpdatePageSize = changePageSize

  return {
    pagination: pagination as PaginationProps,
    changePage,
    changePageSize,
  }
}
