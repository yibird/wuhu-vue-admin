import type { FormPlusProps } from '@/components/form-plus'

export interface DataScopeOption {
  label: string
  value: number
  color: string
}

export const dataScopeOptions = [
  { label: '全部数据权限', value: 0, color: 'processing' },
  { label: '本部门及以下', value: 1, color: 'success' },
  { label: '本部门', value: 2, color: 'warning' },
  { label: '仅本人', value: 3, color: 'default' },
]

export const dataScopeMap = Object.fromEntries(
  dataScopeOptions.map((item) => [item.value, item])
) as Record<number, DataScopeOption>

export const schemas = shallowRef<FormPlusProps['schemas']>([
  {
    component: 'input',
    field: 'roleName',
    label: '角色名称',
    componentProps: { allowClear: true, placeholder: '请输入角色名称' },
  },
  {
    component: 'select',
    field: 'dataScope',
    label: '数据权限',
    componentProps: {
      allowClear: true,
      options: dataScopeOptions,
    },
  },
])
