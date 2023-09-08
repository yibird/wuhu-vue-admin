/** Promise相关工具函数 */
export function asyncTo<T = any, E = Error>(
  promise: Promise<any>,
  fn?: () => void
) {
  return new Promise<[Nullable<E>, T]>((resolve, reject) => {
    return promise
      .then((data: T) => resolve([null, data]))
      .catch((err: E) => reject([err, null]))
      .finally(() => fn && fn());
  });
}
