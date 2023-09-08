/// <reference types="vite/client" />
/// <reference types="vue/macros-global" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

import 'vue';

type EventHandler = (...args: any[]) => void;

declare module 'vue' {
  interface ComponentCustomProps {
    id?: string;
    role?: string;
    tabindex?: number;
    onClick?: EventHandler;
    onTouchend?: EventHandler;
    onTouchmove?: EventHandler;
    onTouchstart?: EventHandler;
    onTouchcancel?: EventHandler;
    onTouchmovePassive?: EventHandler;
    onTouchstartPassive?: EventHandler;
  }

  interface HTMLAttributes {
    onTouchmovePassive?: EventHandler;
    onTouchstartPassive?: EventHandler;
  }
}