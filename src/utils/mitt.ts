export type EventType = string | symbol;
export type Handler<T = any> = (event?: T) => void;
export type WildcardHandler = (type: EventType, event?: any) => void;
export type EventHandlerList = Array<Handler>;
export type WildCardEventHandlerList = Array<WildcardHandler>;
export type EventHandlerMap = Map<EventType, EventHandlerList | WildCardEventHandlerList>;

export interface Emitter {
  all: EventHandlerMap;
  on<T = any>(type: EventType, handler: Handler<T>): void;
  on(type: '*', handler: WildcardHandler): void;
  off<T = any>(type: EventType, handler: Handler<T>): void;
  off(type: '*', handler: WildcardHandler): void;
  emit<T = any>(type: EventType, event?: T): void;
  emit(type: '*', event?: any): void;
  clear(): void;
}

export default function mitt(all: EventHandlerMap = new Map()): Emitter {
  return {
    all,
    // 监听事件
    on<T>(type: EventType, handler: Handler<T>) {
      // 根据数据类型获取事件处理器列表
      const handlers = all.get(type);
      const added = handlers && handlers.push(handler);
      if (added) {
        all.set(type, [handler]);
      }
    },
    // 停止(移除)监听事件
    off<T = any>(type: EventType, handler: Handler<T>) {
      const handlers = all.get(type);
      // 根据事件获取事件处理器数组,从事件处理器数组中移除该事件处理器
      if (handlers) {
        handlers.splice(handlers.indexOf(handler) >>> 0, 1);
      }
    },
    // 触发事件
    emit<T = any>(type: EventType, evt: T) {
      ((all.get(type) || []) as EventHandlerList).slice().map((handle) => {
        handle(evt);
      });
      ((all.get('*') || []) as WildCardEventHandlerList).slice().map((handle) => {
        handle(type, evt);
      });
    },
    // 清除所有事件
    clear() {
      this.all.clear();
    },
  };
}
