// uno.config.ts
import { defineConfig } from 'unocss';
import presetUno from '@unocss/preset-uno';
import presetRemToPx from '@unocss/preset-rem-to-px';
import transformerVariantGroup from '@unocss/transformer-variant-group';
import transformerDirectives from '@unocss/transformer-directives';

const baseShortcuts = {
  full: 'w-full h-full',
};

const flexShortcuts = {
  'flex-center': 'flex justify-center items-center',
  'flex-row-center': 'flex justify-center',
  'flex-row-between': 'flex justify-between',
  'flex-col-center': 'flex items-center',
  'flex-col-stretch': 'flex items-stretch',
};

const gridShortcuts = {
  'grid-center': 'grid place-items-center',
};

const textSizes = {
  xs: {
    'font-size': '14px',
    'line-height': '20px',
  },
  sm: {
    'font-size': '16px',
    'line-height': '24px',
  },
  base: {
    'font-size': '20px',
    'line-height': '28px',
  },
  lg: {
    'font-size': '24px',
    'line-height': '32px',
  },
  xl: {
    'font-size': '28px',
    'line-height': '36px',
  },
  '2xl': {
    'font-size': '36px',
    'line-height': '44px',
  },
  '3xl': {
    'font-size': '48px',
    'line-height': '56px',
  },
  '4xl': {
    'font-size': '60px',
    'line-height': '68px',
  },
  '5xl': {
    'font-size': '72px',
    'line-height': '80px',
  },
};

const textSizeRules: Rule[] = [
  [/^text-([A-Za-z]+)$/, ([, s]) => textSizes[s] || {}],
];

export default defineConfig({
  rules: [...textSizeRules],
  shortcuts: {
    ...baseShortcuts,
    ...flexShortcuts,
    ...gridShortcuts,
  },
  presets: [
    presetUno(),
    presetRemToPx({
      baseFontSize: 4,
    }),
  ],
  transformers: [transformerVariantGroup(), transformerDirectives()],
});
