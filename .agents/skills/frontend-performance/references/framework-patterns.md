# Vue Performance Optimization

## v-for

Always use:

```vue
:key="item.id"
```

Avoid:

```vue
:key="index"
```

---

## Computed

Prefer:

```js
computed()
```

instead of repeated calculations inside:

```js
methods
```

---

## Large Tables

Prefer:

```text
Virtual Scrolling
Pagination
Lazy Loading
```

---

## Watchers

Avoid deep-watching large objects:

```js
watch(
  state,
  handler,
  {
    deep: true,
  },
)
```

Prefer watching specific fields.

---

# React Performance Optimization

Prefer:

```js
memo()
```

```js
useMemo()
```

```js
useCallback()
```

---

Avoid unnecessary parent re-renders causing:

```text
Child component re-render cascades
```

---
