export interface HistoryEntry {
  label: string
  undo: () => void
  redo: () => void
  /** 相同 mergeKey 的连续操作会合并为一条历史记录（如连续输入） */
  mergeKey?: string
  timestamp: number
}

export interface PushOptions {
  mergeKey?: string
  /** 合并时间窗口（ms） */
  mergeWindow?: number
}

const DEFAULT_LIMIT = 100
const DEFAULT_MERGE_WINDOW = 600

/**
 * HistoryManager：统一的 Undo/Redo 系统。
 * 所有修改都必须通过命令进入 History，保证操作可逆。
 */
export class HistoryManager {
  private undoStack: HistoryEntry[] = []
  private redoStack: HistoryEntry[] = []
  private limit = DEFAULT_LIMIT
  private revision = 0
  /** 变更回调（用于驱动响应式 UI） */
  onChange?: () => void

  get canUndo() {
    return this.undoStack.length > 0
  }

  get canRedo() {
    return this.redoStack.length > 0
  }

  get undoDepth() {
    return this.undoStack.length
  }

  get redoDepth() {
    return this.redoStack.length
  }

  get version() {
    return this.revision
  }

  push(entry: Omit<HistoryEntry, 'timestamp'>, options: PushOptions = {}) {
    const next: HistoryEntry = { ...entry, timestamp: Date.now() }
    const top = this.undoStack[this.undoStack.length - 1]
    const mergeWindow = options.mergeWindow ?? DEFAULT_MERGE_WINDOW

    if (
      options.mergeKey &&
      top?.mergeKey === options.mergeKey &&
      next.timestamp - top.timestamp < mergeWindow
    ) {
      top.redo = next.redo
      top.timestamp = next.timestamp
    } else {
      this.undoStack.push(next)
      if (this.undoStack.length > this.limit) this.undoStack.shift()
    }

    this.redoStack = []
    this.bump()
  }

  /** 记录一个「已经应用」的操作（例如拖拽过程中已实时修改，结束时补记录） */
  record(entry: Omit<HistoryEntry, 'timestamp'>, options: PushOptions = {}) {
    this.push(entry, options)
  }

  undo() {
    const entry = this.undoStack.pop()
    if (!entry) return
    entry.undo()
    this.redoStack.push(entry)
    this.bump()
  }

  redo() {
    const entry = this.redoStack.pop()
    if (!entry) return
    entry.redo()
    this.undoStack.push(entry)
    this.bump()
  }

  clear() {
    this.undoStack = []
    this.redoStack = []
    this.bump()
  }

  private bump() {
    this.revision += 1
    this.onChange?.()
  }
}
