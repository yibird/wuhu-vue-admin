import { default as _Button } from './src/BasicButton.vue';
import { withInstall } from '/@/utils/with-install';
const Button = withInstall(_Button);
export default Button;
export type { ButtonProps } from './src/types'

declare module 'vue' {
    export interface GlobalComponents {
        Button: typeof Button;
    }
}