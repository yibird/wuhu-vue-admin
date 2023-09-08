function isType(val: unknown, type: string) {
  return Object.prototype.toString.call(val) === `[object ${type}]`;
}

function isString(value: unknown): value is string {
  return isType(value, "String");
}

function isNumber(value: unknown): value is number {
  return isType(value, "Number");
}

function isBool(value: unknown): value is boolean {
  return isType(value, "Boolean");
}

function isDef<T = unknown>(value?: T): value is T {
  return typeof value !== "undefined";
}

function isUnDef<T = unknown>(value?: T): value is T {
  return !isDef(value);
}

function isNull(value: unknown): value is null {
  return value === null;
}

function isSymbol(value: unknown): value is symbol {
  return isType(value, "Symbol");
}

function isBigint(value: unknown): value is bigint {
  return isType(value, "Bigint");
}

function isFunc(value: Function): value is Function {
  return isType(value, "Function");
}

function isArray(value?: any): value is Array<any> {
  return value && Array.isArray(value);
}

function isObject(val?: any): val is Record<any, any> {
  return val !== null && typeof val === "object";
}

function isDate(val?: unknown): val is Date {
  return isType(val, "Date");
}

function isRegExp(val?: unknown): val is RegExp {
  return isType(val, "RegExp");
}

function isPromise<T = any>(val?: unknown): val is Promise<T> {
  return (
    isType(val, "Promise") &&
    isObject(val) &&
    isFunc(val.then) &&
    isFunc(val.catch)
  );
}

function isMap(val: unknown): val is Map<any, any> {
  return isType(val, "Map");
}

function isSet(val: unknown): val is Set<any> {
  return isType(val, "Set");
}

function isWindow(val: any): val is Window {
  return typeof window !== "undefined" && isType(val, "Window");
}

function isElement(val: unknown): val is Element {
  return isObject(val) && !!val.tagName;
}

function isUrl(path: string): boolean {
  const reg =
    /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
  return reg.test(path);
}

function isEmpty<T = unknown>(val: T): val is T {
  if (isArray(val) || isString(val)) return val.length === 0;
  if (val instanceof Map || val instanceof Set) return val.size === 0;
  if (isObject(val)) return Object.keys(val).length === 0;
  return false;
}

function isNullAndUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) && isNull(val);
}

function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val);
}

function isBrowser() {
  return !!(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
  );
}

export {
  isType,
  isString,
  isNumber,
  isBool,
  isDef,
  isUnDef,
  isNull,
  isSymbol,
  isBigint,
  isFunc,
  isArray,
  isObject,
  isDate,
  isRegExp,
  isPromise,
  isMap,
  isSet,
  isWindow,
  isElement,
  isUrl,
  isEmpty,
  isNullAndUnDef,
  isNullOrUnDef,
  isBrowser,
};
