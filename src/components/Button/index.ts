import { default as _Button } from './src/Button.vue';
import { withInstall } from '/@/utils/with-install';
const Button = withInstall(_Button);
export default Button;
export type * from './src/types'

declare module 'vue' {
    export interface GlobalComponents {
        Button: typeof Button;
    }
}