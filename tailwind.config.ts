/** @type {import('tailwindcss').Config} */

function createSpacing(len: number = 800, unit: string = "px") {
  const spacing = { px: `1${unit}`, 0: `0${unit}` };
  for (let i = len; i > 0; i--) {
    if (i % 2 === 0 || i % 5 === 0) {
      Reflect.set(spacing, i, i + unit);
    }
  }
  return spacing;
}

export default {
  content: ["./src/**/*.{vue,tsx}"],
  theme: {
    extend: {
      spacing: createSpacing(),
    },
  },
  plugins: [],
};
