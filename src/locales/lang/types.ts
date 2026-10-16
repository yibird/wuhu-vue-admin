/**
 * 语言包消息类型
 *
 * 以 en 为单一事实来源派生,避免手工罗列全部语言键导致类型与消息漂移。
 */
export type LocaleMessages = typeof import('./en').default
