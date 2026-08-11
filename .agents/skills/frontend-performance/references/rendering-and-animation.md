# Browser Rendering Pipeline

Always analyze performance issues using the following model:

```text
JavaScript
    ↓
Style Calculation
    ↓
Layout (Reflow)
    ↓
Paint (Repaint)
    ↓
Composite
```

Performance cost:

```text
Composite < Paint < Layout
```

Prioritize eliminating unnecessary Layout operations.

---

# DOM Optimization Principles

## Batch DOM Updates

Avoid:

```js
for (const item of list) {
  container.appendChild(createItem(item))
}
```

Prefer:

```js
const fragment = document.createDocumentFragment()

for (const item of list) {
  fragment.appendChild(createItem(item))
}

container.appendChild(fragment)
```

---

## Reduce DOM Queries

Avoid:

```js
for (let i = 0; i < 1000; i++) {
  document.querySelector('.item')
}
```

Prefer:

```js
const el = document.querySelector('.item')

for (let i = 0; i < 1000; i++) {
  use(el)
}
```

---

## Avoid Frequent Inline Style Mutations

Avoid:

```js
el.style.width = '100px'
el.style.height = '100px'
el.style.color = 'red'
```

Prefer:

```js
el.classList.add('active')
```

---

# Forced Synchronous Layout

The following APIs may trigger Layout:

```js
offsetWidth
offsetHeight

clientWidth
clientHeight

scrollWidth
scrollHeight

scrollTop
scrollLeft

getBoundingClientRect()

getComputedStyle()
```

Avoid:

```js
el.style.width = '100px'

console.log(el.offsetWidth)
```

This causes:

```text
Layout Thrashing
```

Prefer:

```js
const width = el.offsetWidth

requestAnimationFrame(() => {
  el.style.width = '100px'
})
```

---

# Layout Thrashing

Avoid:

```js
for (const el of elements) {
  el.style.width = '100px'

  console.log(el.offsetWidth)
}
```

Prefer:

```js
const widths = elements.map(
  el => el.offsetWidth,
)

for (const el of elements) {
  el.style.width = '100px'
}
```

Follow:

```text
Read → Read → Read
Write → Write → Write
```

Avoid:

```text
Read → Write → Read → Write
```

---

# Event Optimization

## Event Delegation

Avoid:

```js
rows.forEach(row => {
  row.addEventListener('click', handler)
})
```

Prefer:

```js
table.addEventListener('click', e => {
  const row = e.target.closest('.row')

  if (!row) return

  handler(row)
})
```

---

## Scroll Optimization

Avoid:

```js
window.addEventListener(
  'scroll',
  expensiveHandler,
)
```

Prefer:

```js
window.addEventListener(
  'scroll',
  throttle(handler, 16),
)
```

---

## Resize Optimization

Always use:

```js
throttle()
```

or:

```js
requestAnimationFrame()
```

---

# requestAnimationFrame

Use requestAnimationFrame for animations.

Avoid:

```js
setInterval()
```

Recommended for:

```text
Dragging
Scroll synchronization
Animations
Chart rendering
Visual updates
```

---

# requestIdleCallback

Use for low-priority work:

```js
requestIdleCallback()
```

Suitable for:

```text
Analytics
Preloading
Caching
Telemetry
Background processing
```

Avoid blocking the main thread.

---

# CSS Animation Optimization

Prefer:

```css
transform
opacity
```

Avoid:

```css
width
height
left
top
margin
padding
```

Prefer:

```css
transform: translateX(100px);

transform: scale(1.2);

opacity: 0.5;
```

---

# GPU Acceleration

For animations:

```css
transform: translate3d(0, 0, 0);
```

or:

```css
will-change: transform;
```

Be careful:

Avoid excessive use of:

```css
will-change
```

as it increases memory consumption.

---
