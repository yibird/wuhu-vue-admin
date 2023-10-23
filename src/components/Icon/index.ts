import { withInstall } from '/@/utils/with-install';
import _Icon from './src/Icon.vue';

const Icon = withInstall(_Icon);
export default Icon;
export type { IconProps } from './src/types';

declare module 'vue' {
  export interface GlobalComponents {
    Icon: typeof Icon;
  }
}
