import type { Band, DataRegion } from '../../types'

export type RowOperation = 'insert' | 'delete'

/**
 * 调整区域 Band 的行坐标
 * @param regions 数据区域
 * @param operation 插入或删除
 * @param index 起始行
 * @param count 行数
 * @returns 调整后的区域
 */
export function shiftRegions(
  regions: DataRegion[],
  operation: RowOperation,
  index: number,
  count: number
): { regions: DataRegion[]; changed: boolean } {
  let changed = false
  const next: DataRegion[] = []

  regions.forEach((region) => {
    const detail = mapBand(region.detail, operation, index, count)
    if (!detail) {
      changed = true
      return
    }
    if (
      detail.startRow !== region.detail.startRow ||
      detail.endRow !== region.detail.endRow
    ) {
      changed = true
    }
    const groups = region.groups.map((group) => {
      const header = group.header
        ? mapBand(group.header, operation, index, count)
        : undefined
      const footer = group.footer
        ? mapBand(group.footer, operation, index, count)
        : undefined
      if (
        header?.startRow !== group.header?.startRow ||
        header?.endRow !== group.header?.endRow ||
        footer?.startRow !== group.footer?.startRow ||
        footer?.endRow !== group.footer?.endRow
      ) {
        changed = true
      }
      return { ...group, header, footer }
    })
    next.push({ ...region, detail, groups })
  })

  return { regions: next, changed }
}

/**
 * 判断行区间是否与任意 Band 相交
 * @param regions 数据区域
 * @param startRow 起始行
 * @param endRow 结束行
 * @returns 是否相交
 */
export function bandsIntersect(
  regions: DataRegion[],
  startRow: number,
  endRow: number
) {
  return regions.some((region) => {
    const [start, end] = regionRowRange(region)
    return startRow <= end && endRow >= start
  })
}

/**
 * 区域覆盖的行范围
 * @param region 数据区域
 * @returns [起始行, 结束行]
 */
export function regionRowRange(region: DataRegion): [number, number] {
  const rows = [
    region.detail.startRow,
    region.detail.endRow,
    ...region.groups.flatMap((group) =>
      [group.header, group.footer]
        .filter((band): band is Band => Boolean(band))
        .flatMap((band) => [band.startRow, band.endRow])
    ),
  ]
  return [Math.min(...rows), Math.max(...rows)]
}

function mapBand(
  band: Band,
  operation: RowOperation,
  index: number,
  count: number
): Band | undefined {
  if (operation === 'insert') {
    if (band.startRow >= index) {
      return {
        startRow: band.startRow + count,
        endRow: band.endRow + count,
      }
    }
    if (band.endRow >= index) {
      return { startRow: band.startRow, endRow: band.endRow + count }
    }
    return band
  }

  const end = index + count - 1
  if (band.endRow < index) return band
  if (band.startRow > end) {
    return {
      startRow: band.startRow - count,
      endRow: band.endRow - count,
    }
  }
  const startRow = band.startRow < index ? band.startRow : index
  const endRow = band.endRow > end ? band.endRow - count : index - 1
  if (endRow < startRow) return undefined
  return { startRow, endRow }
}
