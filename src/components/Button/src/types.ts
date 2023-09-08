export interface ButtonProps {
  // button 颜色
  color?: 'success' | 'error' | 'warning' | 'info';
  // button 禁用状态
  disabled?: boolean;
  // button text 前icon name
  preIcon?: string;
  // button text 后icon name
  postIcon?: string;
  // icon 字体大小
  iconSize?: number;
}
