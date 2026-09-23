import { smoothMotion } from './smooth'
import { reorderMotion } from './reorder'
import type { MotionProps } from 'motion-v'
import type { MotionType } from '../types'

export const motions: Readonly<Record<MotionType, MotionProps>> = {
  smooth: smoothMotion,
  reorder: reorderMotion,
}
