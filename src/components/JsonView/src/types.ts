import type { VNode } from 'vue'
import type { NodeDataType } from 'vue-json-pretty/types/components/TreeNode'

export type JsonViewProps = {
  data?: Record<string, any>

  indent?: number
  deep?: number
  collapsedNodeLength?: number
  showLength?: boolean
  showLine?: boolean
  showLineNumber?: boolean
  showIcon?: boolean
  showDoubleQuotes?: boolean
  virtual?: boolean
  height?: number
  itemHeight?: number
  rootPath?: string
  nodeSelectable?: (path: NodeDataType) => boolean
  selectableType?: 'multiple' | 'single'
  showSelectController?: boolean
  selectOnClickNode?: boolean
  highlightSelectedNode?: boolean
  collapsedOnClickBrackets?: boolean
  renderNodeKey?: ({ node, defaultKey }: { node: NodeDataType; defaultKey: string }) => VNode
  renderNodeValue?: ({ node, defaultValue }: { node: NodeDataType; defaultValue: string }) => VNode
  renderNodeActions?:
    | boolean
    | (({
        node,
        defaultActions
      }: {
        node: NodeDataType
        defaultActions: {
          copy: () => void
        }
      }) => VNode)
  editable?: boolean
  editableTrigger?: 'click' | 'dblclick'
  theme?: 'dark' | 'light'

  /**
   * @desc 是否显示边框
   * @default true
   */
  bordered?: boolean
  /**
   * @desc 是否显示复制按钮
   * @default true
   */
  showCopy?: boolean
}

export interface JsonViewEmits {
  (e: 'nodeClick', node: NodeDataType): void
  (e: 'nodeMouseover', node: NodeDataType): void
  (e: 'bracketsClick', collapsed: boolean, node: NodeDataType): void
  (e: 'iconClick', collapsed: boolean, node: NodeDataType): void
  (e: 'selectedChange', newVal: Record<string, any>, oldVal: Record<string, any>): void
  (e: 'copy', data: JsonViewProps['data']): void
}
