import { App } from 'vue';
import { setupClickOutsideDirective } from './clickOutside'
import { setupDebounceDirective } from './debounce';
import { setupPermissionDirective } from './permission';
import { setupLongPressDirective } from './longPress';
import { setupCopyDirective } from './copy';
import { setupLoadingDirective } from './loading';
import { setupLazyLoadDirective } from './lazyLoad';
import { setupDraggableDirective } from './draggable';
import { setupWaterMarkerDirective } from './waterMarker'
/**
 * 注册全局指令
 * @param app Vue实例
 */
export function setupDirectives(app: App<Element>) {
    setupClickOutsideDirective(app);
    setupDebounceDirective(app);
    setupPermissionDirective(app);
    setupLongPressDirective(app);
    setupCopyDirective(app);
    setupLoadingDirective(app);
    setupLazyLoadDirective(app);
    setupDraggableDirective(app);
    setupWaterMarkerDirective(app);
}