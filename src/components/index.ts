import { defineAsyncComponent } from 'vue'

export { Icon } from './icon'
export type { IconProps } from './icon'

export { WCard } from './card'
export type { WCardProps, WCardSlots } from './card'

export { LazyContainer, ResizeContainer } from './container'
export type {
  ContainerSize,
  ContainerTag,
  LazyContainerEmits,
  LazyContainerProps,
  LazyContainerSlotProps,
  LazyContainerSlots,
  ResizeContainerEmits,
  ResizeContainerProps,
  ResizeContainerSlots,
} from './container'

export {
  WView,
  WViewContent,
  WViewFooter,
  WViewHeader,
  WViewSider,
} from './view'
export type {
  WViewProps,
  WViewSiderProps,
  WViewHeaderProps,
  WViewContentProps,
  WViewFooterProps,
} from './view'

export { Scrollbar } from './scrollbar'
export type { ScrollbarProps, ScrollbarInstance } from './scrollbar'

export { NumberTicker } from './number-ticker'
export type { NumberTickerProps } from './number-ticker'

export { Loading, createLoading, hideLoading } from './loading'
export type { LoadingProps } from './loading'

export { ErrorBoundary } from './error-boundary'
export type {
  ErrorBoundaryErrorPayload,
  ErrorBoundaryInstance,
  ErrorBoundaryProps,
} from './error-boundary'

export { DatePicker, DateRangePicker } from './date-picker'

export const Cropper = defineAsyncComponent(async () => {
  const { Cropper } = await import('./cropper')
  return Cropper
})
export const CropperPicker = defineAsyncComponent(async () => {
  const { CropperPicker } = await import('./cropper')
  return CropperPicker
})
export type {
  CropperCanvasOptions,
  CropperExpose,
  CropperPickerProps,
  CropperProps,
} from './cropper'

export const IconPicker = defineAsyncComponent(async () => {
  const { IconPicker } = await import('./icon-picker')
  return IconPicker
})
export const IconSelector = defineAsyncComponent(async () => {
  const { IconSelector } = await import('./icon-picker')
  return IconSelector
})
export type { IconPickerProps, IconSelectorProps } from './icon-picker'

export const JsonView = defineAsyncComponent(async () => {
  const { JsonView } = await import('./json-view')
  return JsonView
})
export type { JsonPrimitive, JsonValue, JsonViewProps } from './json-view'

export const CodeEditor = defineAsyncComponent(async () => {
  const { CodeEditor } = await import('./code-editor')
  return CodeEditor
})
export type { CodeEditorProps } from './code-editor'

export const Editor = defineAsyncComponent(async () => {
  const { Editor } = await import('./editor')
  return Editor
})
export type {
  EditorExpose,
  EditorLocale,
  EditorProps,
  EditorSelectOption,
} from './editor'

export { Draggable, DraggableItem, useDraggable } from './draggable'
export type {
  DraggableDisabled,
  DraggableEmits,
  DraggableIdentifier,
  DraggableItemData,
  DraggableItemKey,
  DraggableItemProps,
  DraggableItemSlotProps,
  DraggableItemState,
  DraggableProps,
  DraggableSlots,
  UseDraggableInput,
} from './draggable'

export { ClientError, Error, NotAuthorized, NotFound } from './exception'
export type { ExceptionProps } from './exception'

export const FilePreview = defineAsyncComponent(async () => {
  const { FilePreview } = await import('./file-preview')
  return FilePreview
})
export type {
  FilePreviewKind,
  FilePreviewLocale,
  FilePreviewProps,
  FilePreviewSource,
} from './file-preview'

export const Gantt = defineAsyncComponent(async () => {
  const { Gantt } = await import('./gantt')
  return Gantt
})
export {
  createGanttTaskSignature,
  normalizeGanttTasks,
} from './gantt/src/utils'
export type {
  GanttContextMenuEvent,
  GanttProps,
  GanttTask,
  GanttViewMode,
  GanttViewModeDefinition,
} from './gantt'
export {
  Highlight,
  createHighlightSegments,
  findLiteralHighlightMatches,
  normalizeHighlightKeywords,
} from './highlight'
export type {
  HighlightClassValue,
  HighlightKeyword,
  HighlightMatch,
  HighlightMatcher,
  HighlightMatcherContext,
  HighlightMatchSegment,
  HighlightProps,
  HighlightSegment,
  HighlightTag,
  HighlightTextSegment,
} from './highlight'
export { Modal } from './modal'
export type {
  ModalAction,
  ModalComponent,
  ModalController,
  ModalInstance,
  ModalMaybePromise,
  ModalOpenOptions,
  ModalOpenPromise,
  ModalPosition,
  ModalProps,
  ModalResult,
  ModalUpdateOptions,
} from './modal'

export { FormPlus } from './form-plus'
export type {
  ComponentType,
  FormContextState,
  FormPlusContext,
  FormPlusControlProps,
  FormPlusInstance,
  FormPlusItem,
  FormPlusModel,
  FormPlusProps,
  FormPlusValue,
} from './form-plus'
export {
  TablePlus,
  useRowProps,
  useRowSelection,
  useSize,
  useTable,
} from './table-plus'
export type {
  TableContextState,
  TablePlusColumn,
  TablePlusContext,
  TablePlusContextMenuInstance,
  TablePlusProps,
  UseRowSelectionOptions,
  UseTableOptions,
} from './table-plus'

export { globalComponents } from './setup'
