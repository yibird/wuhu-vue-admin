import { Locale } from '@/constants'

export const localeOptions = [
  {
    label: '中文简体',
    value: Locale.ZH_CN,
  },
  {
    label: 'English',
    value: Locale.EN,
  },
]

export const pageAnimationOptions = [
  {
    label: '从左滑动',
    value: 'slide-left',
  },
  {
    label: '从右滑动',
    value: 'slide-right',
  },
  {
    label: '从上滑动',
    value: 'slide-up',
  },
  {
    label: '从下滑动',
    value: 'slide-down',
  },
  {
    label: '淡入淡出',
    value: 'fade',
  },
  {
    label: '放大',
    value: 'fade-scale',
  },
  {
    label: '横向反转',
    value: 'flip-x',
  },
  {
    label: '竖向反转',
    value: 'flip-y',
  },
]

export const loadingOptions = [
  {
    label: '跳动',
    value: 'beat',
  },
  {
    label: '轨道旋转',
    value: 'spinner',
  },
  {
    label: '脉冲扩散',
    value: 'pulse',
  },
  {
    label: '柱状跳动',
    value: 'bars',
  },
  {
    label: '圆环旋转',
    value: 'ring',
  },
]
