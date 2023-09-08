export function lazyLoad(path: string, subPath: string) {
  return () => import(`/@/${path}/${subPath}`);
}

export function lazyLoadLayout(path: string, enableSuffix: boolean = true) {
  return lazyLoad("layouts", enableSuffix ? `${path}/index.vue` : path);
}

export function lazyLoadView(path: string, enableSuffix: boolean = true) {
  return lazyLoad("views", enableSuffix ? `${path}/index.vue` : path);
}
