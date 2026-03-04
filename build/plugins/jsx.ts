import VueJsxVapor from 'vue-jsx-vapor/vite';

export function jsxPlugin() {
  return VueJsxVapor({
    exclude: ['*/vdom.tsx', '*/interop.tsx'],
    macros: true,
  });
}
