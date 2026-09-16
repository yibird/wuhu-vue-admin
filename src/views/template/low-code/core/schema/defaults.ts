import type { ApplicationSchema, ComponentKind, ComponentSchema } from './types'

interface NodeOptions {
  name?: string
  props?: Record<string, unknown>
  style?: ComponentSchema['style']
  bindings?: Record<string, string>
  events?: ComponentSchema['events']
  visible?: string
  disabled?: string
  children?: ComponentSchema[]
}

let sequence = 0
function nid() {
  sequence += 1
  return `n${sequence.toString(36)}${Math.random().toString(36).slice(2, 5)}`
}

function node(
  type: string,
  kind: ComponentKind,
  options: NodeOptions = {}
): ComponentSchema {
  return {
    id: nid(),
    __type: kind,
    type,
    name: options.name,
    props: options.props,
    bindings: options.bindings,
    events: options.events,
    visible: options.visible,
    disabled: options.disabled,
    style: options.style,
    children: options.children,
  }
}

const userRows = [
  {
    id: '1',
    name: '张三',
    role: '管理员',
    status: '启用',
    createdAt: '2026-01-12',
  },
  {
    id: '2',
    name: '李四',
    role: '编辑',
    status: '启用',
    createdAt: '2026-02-03',
  },
  {
    id: '3',
    name: '王五',
    role: '访客',
    status: '停用',
    createdAt: '2026-02-18',
  },
  {
    id: '4',
    name: '赵六',
    role: '编辑',
    status: '启用',
    createdAt: '2026-03-05',
  },
]

function createDemoPageComponents(): ComponentSchema[] {
  return [
    node('Flex', 1, {
      name: '页面根容器',
      style: {
        layout: 'flex',
        direction: 'column',
        gap: 16,
        padding: '24px',
        minHeight: 900,
        background: '#f5f7fa',
      },
      children: [
        node('Flex', 1, {
          name: '标题区',
          style: {
            layout: 'flex',
            direction: 'row',
            justify: 'between',
            align: 'center',
          },
          children: [
            node('Flex', 1, {
              style: { layout: 'flex', direction: 'column', gap: 4 },
              children: [
                node('Title', 0, {
                  props: { text: '运营数据看板', level: 3 },
                }),
                node('Text', 0, {
                  props: {
                    text: '基于 Schema 驱动的低代码示例页面，可直接编辑',
                    type: 'secondary',
                  },
                }),
              ],
            }),
            node('Button', 0, {
              name: '刷新按钮',
              props: { text: '刷新数据', type: 'default' },
              events: [{ name: 'click', actions: ['act-load-users'] }],
            }),
          ],
        }),
        node('Grid', 1, {
          name: '指标卡',
          style: { layout: 'grid', columns: 3, gap: 16 },
          children: [
            node('Card', 1, {
              props: { title: '用户总数' },
              children: [
                node('Statistic', 0, {
                  props: { title: '总用户数', suffix: '人' },
                  bindings: { value: 'queries.users.data.length' },
                }),
              ],
            }),
            node('Card', 1, {
              props: { title: '启用用户' },
              children: [
                node('Statistic', 0, {
                  props: { title: '启用用户', suffix: '人' },
                  bindings: {
                    value:
                      "(queries.users.data || []).filter(item => item.status === '启用').length",
                  },
                }),
              ],
            }),
            node('Card', 1, {
              props: { title: '查询状态' },
              children: [
                node('Statistic', 0, {
                  props: { title: '查询状态' },
                  bindings: {
                    value:
                      "queries.users.loading ? '加载中' : (queries.users.error ? '失败' : '正常')",
                  },
                }),
              ],
            }),
          ],
        }),
        node('Card', 1, {
          name: '用户表单卡片',
          props: { title: '新增用户' },
          style: { width: '100%' },
          children: [
            node('Form', 1, {
              bindings: { model: 'variables.form' },
              props: { layout: 'vertical' },
              events: [{ name: 'finish', actions: ['act-submit-flow'] }],
              children: [
                node('Grid', 1, {
                  style: {
                    layout: 'grid',
                    columns: 2,
                    gap: 16,
                    padding: '0px',
                  },
                  children: [
                    node('FormItem', 1, {
                      props: {
                        label: '用户名',
                        name: 'username',
                        required: true,
                      },
                      children: [
                        node('Input', 0, {
                          props: {
                            name: 'username',
                            placeholder: '请输入用户名',
                          },
                        }),
                      ],
                    }),
                    node('FormItem', 1, {
                      props: { label: '角色', name: 'role' },
                      children: [
                        node('Select', 0, {
                          props: {
                            name: 'role',
                            placeholder: '请选择角色',
                            options: [
                              { label: '管理员', value: 'admin' },
                              { label: '编辑', value: 'editor' },
                              { label: '访客', value: 'guest' },
                            ],
                          },
                        }),
                      ],
                    }),
                  ],
                }),
                node('Flex', 1, {
                  style: {
                    layout: 'flex',
                    direction: 'row',
                    justify: 'end',
                    gap: 8,
                    padding: '0px',
                  },
                  children: [
                    node('Button', 0, {
                      props: { text: '重置', type: 'default' },
                      events: [{ name: 'click', actions: ['act-reset-form'] }],
                    }),
                    node('Button', 0, {
                      props: {
                        text: '提交',
                        type: 'primary',
                        htmlType: 'submit',
                      },
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        node('Card', 1, {
          name: '用户列表卡片',
          props: { title: '用户列表', extra: '数据来自静态数据源' },
          children: [
            node('Table', 0, {
              props: {
                rowKey: 'id',
                pagination: false,
                columns: [
                  { title: '姓名', dataIndex: 'name', key: 'name' },
                  { title: '角色', dataIndex: 'role', key: 'role' },
                  { title: '状态', dataIndex: 'status', key: 'status' },
                  {
                    title: '创建时间',
                    dataIndex: 'createdAt',
                    key: 'createdAt',
                  },
                ],
              },
              bindings: { dataSource: 'queries.users.data' },
            }),
          ],
        }),
      ],
    }),
  ]
}

/** 创建默认应用 Schema（首次进入设计器时使用） */
export function createDefaultApplication(): ApplicationSchema {
  return {
    version: '2.0.0',
    app: {
      id: 'low-code-demo',
      name: '低代码示例应用',
      description: 'Demo application',
      version: '1.0.0',
    },
    pages: [
      {
        id: 'page-home',
        name: '首页',
        path: '/',
        components: createDemoPageComponents(),
      },
    ],
    dataSources: [
      {
        id: 'ds-users',
        name: '用户静态数据',
        type: 'static',
        config: {
          value: { type: 'value', value: userRows },
        },
      },
      {
        id: 'ds-todos',
        name: 'Todo REST 数据',
        type: 'rest',
        config: {
          url: 'https://jsonplaceholder.typicode.com/todos',
          method: 'GET',
          timeout: 10000,
        },
      },
    ],
    queries: [
      {
        id: 'users',
        name: '用户列表',
        dataSourceId: 'ds-users',
        trigger: 'pageLoad',
      },
      {
        id: 'todos',
        name: '待办事项',
        dataSourceId: 'ds-todos',
        trigger: 'manual',
        params: {
          _limit: { type: 'value', value: 10 },
        },
      },
    ],
    actions: [
      {
        id: 'act-notify-success',
        name: '提示成功',
        type: 'showMessage',
        params: {
          type: { type: 'value', value: 'success' },
          content: { type: 'value', value: '操作成功' },
        },
      },
      {
        id: 'act-notify-form-error',
        name: '提示表单校验失败',
        type: 'showMessage',
        params: {
          type: { type: 'value', value: 'warning' },
          content: { type: 'value', value: '请先完善表单必填项' },
        },
      },
      {
        id: 'act-reset-form',
        name: '重置表单',
        type: 'setVariables',
        params: {
          values: { type: 'value', value: { form: {} } },
        },
      },
      {
        id: 'act-count-up',
        name: '计数 +1',
        type: 'setVariables',
        params: {
          values: {
            type: 'expression',
            value: '{ count: (variables.count || 0) + 1 }',
          },
        },
      },
      {
        id: 'act-load-users',
        name: '加载用户',
        type: 'runQuery',
        params: {
          query: { type: 'value', value: 'users' },
        },
      },
      {
        id: 'act-submit-flow',
        name: '提交表单流程',
        type: 'runWorkflow',
        params: {
          workflow: { type: 'value', value: 'wf-submit' },
        },
      },
    ],
    workflows: [
      {
        id: 'wf-submit',
        name: '提交表单流程',
        description: '校验表单并给出反馈',
        trigger: { type: 'manual' },
        steps: [
          {
            id: 'step-check',
            type: 'condition',
            condition: 'variables.form && variables.form.username',
            // eslint-disable-next-line unicorn/no-thenable
            then: [
              {
                id: 'step-success',
                type: 'action',
                action: 'act-notify-success',
              },
              { id: 'step-count', type: 'action', action: 'act-count-up' },
            ],
            else: [
              {
                id: 'step-warning',
                type: 'action',
                action: 'act-notify-form-error',
              },
            ],
          },
        ],
      },
      {
        id: 'wf-refresh',
        name: '刷新全部数据',
        description: '并行刷新多个查询',
        trigger: { type: 'manual' },
        steps: [
          {
            id: 'step-parallel',
            type: 'parallel',
            steps: [
              {
                id: 'step-users',
                type: 'action',
                action: 'act-load-users',
              },
            ],
          },
        ],
      },
    ],
    variables: [
      {
        id: 'var-form',
        name: 'form',
        type: 'json',
        scope: 'page',
        initial: { type: 'value', value: {} },
      },
      {
        id: 'var-count',
        name: 'count',
        type: 'number',
        scope: 'page',
        initial: { type: 'value', value: 0 },
      },
    ],
    theme: {
      primaryColor: '#1677ff',
      borderRadius: 8,
      mode: 'light',
    },
    permissions: {
      roles: [
        {
          id: 'admin',
          name: '管理员',
          permissions: [
            { resource: 'app:low-code-demo', actions: ['read', 'edit'] },
          ],
        },
        {
          id: 'viewer',
          name: '访客',
          permissions: [{ resource: 'app:low-code-demo', actions: ['read'] }],
        },
      ],
      pages: {},
    },
  }
}
