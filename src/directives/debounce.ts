import type { App, Directive, DirectiveBinding } from 'vue';

let timer: NodeJS.Timeout | null = null;

function getHandlers(binding: DirectiveBinding) {
    const delay = Number.isInteger(parseInt(binding.arg!)) ? parseInt(binding.arg!) : 10;
    const handler = () => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            if (typeof binding.value === "function") {
                binding.value()
            }
        }, delay)
    }
    return { handler }
}

export const debounce: Directive = {
    beforeMount(el: HTMLElement, binding: DirectiveBinding) {
        if (binding.arg && !Number.isInteger(parseInt(binding.arg))) {
            console.error("v-debounce parameter error,The parameter should be a number");
        }
        const { handler } = getHandlers(binding);
        (el as any).clickEvent = handler;
        el.addEventListener("click", handler)
    },
    unmounted(el: HTMLElement) {
        el.removeEventListener("click", (el as any).clickEvent)
    }
}

export function setupDebounceDirective(app: App) {
    app.directive('debounce', debounce);
}