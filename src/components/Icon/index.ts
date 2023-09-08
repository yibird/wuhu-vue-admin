import { withInstall } from '/@/utils/with-install';
import _Icon from './src/Icon'
const Icon = withInstall(_Icon);
export default Icon;
export type { IconProps } from './src/Icon';

declare module 'vue' {
    export interface GlobalComponents {
        Icon: typeof Icon;
    }
}