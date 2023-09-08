import { App, Component } from "vue";

type EventShim = {
    new(...args: any[]): {
        $props: {
            onClick?: (...args: any[]) => void;
        };
    };
};

export type WithInstall<T> = T & {
    install(app: App): void;
} & EventShim;

/**
 * 为组件提供install函数用于注册组件
 */
export function withInstall<T extends Component>(options: T) {
    (options as Record<string, unknown>).install = (app: App) => {
        const { name } = options;
        if (name) {
            app.component(name, options);
        }
    };
    return options as WithInstall<T>;
} 