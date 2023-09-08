import type { InjectionKey } from 'vue'
import { BasicTableProps } from './types';

type ChangeConfig = (newConfig: BasicTableProps) => void

export interface BasicTableContext {
    config: BasicTableProps;
    changeConfig: (newConfig: BasicTableProps) => void;
}

export const contextKey = Symbol('context') as InjectionKey<Required<BasicTableContext>>;
export const configKey = Symbol("config") as InjectionKey<BasicTableProps>
export const changeConfigKey = Symbol("changeConfig") as InjectionKey<ChangeConfig>;