# Memory Leak Prevention

Always clean up:

```js
removeEventListener

clearTimeout

clearInterval

cancelAnimationFrame

disconnect()

unsubscribe()

mitt.off()
```

---

# Performance Investigation Workflow

When the UI becomes slow:

1. Open Chrome Performance Panel
2. Check FPS
3. Check Long Tasks
4. Analyze Layout
5. Analyze Paint
6. Analyze Composite
7. Detect Layout Thrashing
8. Detect Large Lists
9. Detect Forced Synchronous Layout
10. Detect Memory Leaks

---

# Code Review Checklist

Before approving code:

* Check for Layout Thrashing
* Check excessive offsetWidth/offsetHeight access
* Check excessive getBoundingClientRect usage
* Check repeated DOM queries
* Check large-list rendering
* Check event delegation usage
* Check virtual scrolling opportunities
* Check unremoved event listeners
* Check timer leaks
* Check transform usage instead of top/left
* Check requestAnimationFrame usage
* Check main-thread blocking

---

# Review Priority

When performance issues are found, prioritize analysis from:

```text
1. DOM Count
2. Layout Cost
3. Paint Cost
4. Main Thread Time
```

Focus on measurable bottlenecks and provide concrete optimization strategies with expected performance impact.
