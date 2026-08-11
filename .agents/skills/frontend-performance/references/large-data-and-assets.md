# Large List Optimization

When rendering:

```text
1000+ items
```

consider:

```text
Virtual Scrolling
Pagination
Infinite Scrolling
```

Avoid:

```vue
<div
  v-for="item in 100000"
  :key="item.id"
/>
```

Recommended libraries:

```text
vue-virtual-scroller
TanStack Virtual
react-window
react-virtualized
```

---

# Image Optimization

Prefer:

```html
<img loading="lazy" />
```

Use modern formats:

```text
WebP
AVIF
```

Avoid:

```text
Oversized original images
```

---

# Observer APIs

Prefer:

```js
IntersectionObserver
```

instead of:

```js
scroll + getBoundingClientRect()
```

---

Prefer:

```js
ResizeObserver
```

instead of:

```js
window.resize
```

---

Prefer:

```js
MutationObserver
```

instead of:

```js
Polling
```

---
