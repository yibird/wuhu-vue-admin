// uno.config.ts
import { defineConfig } from 'unocss';
import presetUno from '@unocss/preset-uno';
import presetRemToPx from '@unocss/preset-rem-to-px';
import transformerVariantGroup from '@unocss/transformer-variant-group';
import transformerDirectives from '@unocss/transformer-directives';

const baseShortcuts = {
    'full': 'w-full h-full'
}

const flexShortcuts = {
    'flex-center': 'flex justify-center items-center',
    'flex-row-center': 'flex justify-center',
    'flex-row-between': 'flex justify-between',
    'flex-col-center': "flex items-center",
    'flex-col-stretch': 'flex items-stretch'
}

const gridShortcuts = {
    'grid-center': 'grid place-items-center'
}


export default defineConfig({
    rules: [
        [/^text-(\d+)$/, ([, d]: Array<any>) => ({ 'font-size': `${d}px` })]
    ],
    shortcuts: {
        ...baseShortcuts,
        ...flexShortcuts,
        ...gridShortcuts
    },
    presets: [
        presetUno(),
        presetRemToPx({
            baseFontSize: 4
        }),
    ],
    transformers: [
        transformerVariantGroup(),
        transformerDirectives(),
    ],
})