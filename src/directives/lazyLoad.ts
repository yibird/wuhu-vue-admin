import { throttle } from 'lodash-es';
import { App, Directive } from 'vue';

// 图片默认src
let defaultSrc = ""

class LazyLoadImage {
    static init(el: HTMLElement, src: string, defaultSrc: string) {
        el.setAttribute("data-src", src);
        defaultSrc && el.setAttribute("src", defaultSrc)
    }
    static observeImage(el: HTMLImageElement) {
        const observer = new IntersectionObserver((entries) => {
            // 从自定义data-src属性上获取src
            const src = el.dataset.src
            // 判断元素是否在可视区域
            if (entries[0].isIntersecting && src && !el.src) {
                el.src = src;
                el.removeAttribute('data-src');
                observer.unobserve(el);
            }
        });
        observer.observe(el);
    }
    static listenerScroll(el: HTMLImageElement) {
        const handler = throttle(() => {
            const isInViewport = LazyLoadImage.isInViewport(el, this.getClientHeight());
            // 判断元素是否可见
            if (isInViewport) {
                // 从自定义data-src属性上获取src
                const src = el.dataset.src
                if (src && !el.src) {
                    el.src = src;
                    el.removeAttribute('data-src');
                }
            }
        }, 10);
        el.addEventListener("scroll", handler);
    }
    // 获取容器可视区域高度
    static getClientHeight() {
        const clientH = document.documentElement.clientHeight;
        const bodyClientH = document.body.clientHeight;
        if (clientH && bodyClientH) {
            return bodyClientH < clientH ? bodyClientH : clientH
        }
        return bodyClientH > clientH ? bodyClientH : clientH;
    }
    // 判断元素是否可见,通过el.getBoundingClientRect().top < height 表示可见
    static isInViewport(el: HTMLElement, height: number) {
        if (typeof el.getBoundingClientRect !== "function") return true;
        const rect = el.getBoundingClientRect();
        return rect.top < height;
    }
}

export const lazyLoad: Directive = {
    beforeMount(el, binding) {
        LazyLoadImage.init(el, binding.value, defaultSrc);
    },
    mounted(el, binding) {
        "IntersectionObserver" in window
            ? LazyLoadImage.observeImage(el)
            : LazyLoadImage.listenerScroll(el);
    }
}

export function setupLazyLoadDirective(app: App) {
    // 获取Vue实例上的全局属性
    defaultSrc = app.config.globalProperties.defaultSrc;
    app.directive("lazyLoad", lazyLoad);
}