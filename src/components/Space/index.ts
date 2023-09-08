import { withInstall } from '/@/utils/with-install';
import _Space from './src/Space';
export const Space = withInstall(_Space);
export default Space;
export { spaceProps } from './src/Space';
export type { SpaceProps, SpaceSize, SpaceAlign } from './src/Space';

declare module 'vue' {
    export interface GlobalComponents {
        Space: typeof Space;
    }
}