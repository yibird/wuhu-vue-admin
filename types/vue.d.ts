declare type MaybeRef<T> = T | Ref<T>;

declare type InferDefault<P, T> = T extends null | number | string | boolean | symbol | Function ? T | ((props: P) => T) : (props: P) => T;

declare type InferDefaults<T> = {
    [K in keyof T]?: InferDefault<T, NotUndefined<T[K]>>;
};

declare type Component<T extends any = any> =
    | ReturnType<typeof defineComponent>
    | (() => Promise<typeof import('*.vue')>)
    | (() => Promise<T>);