---
name: frontend-performance
description: MUST be used for frontend performance, 性能瓶颈, 性能优化, 卡顿, 加载慢, slow UI, rendering jank, animation stutter, large lists, memory leaks, Core Web Vitals, Vue rendering performance, or React rendering performance requests. Prefer this over the general performance-optimization skill when the bottleneck is in the browser UI layer.
---

# Frontend Performance Expert

Use this skill for browser-side performance work: slow pages, interaction lag, large lists, animation stutter, memory leaks, and Vue/React rendering issues.

## Default Workflow

1. Reproduce the symptom and identify whether it is load, interaction, animation, memory, or rendering related.
2. Measure before changing code: use browser Performance traces, FPS/paint indicators, bundle analysis, or targeted timing logs depending on the symptom.
3. Inspect the smallest relevant surface first: component tree, event handlers, reactive state, watchers, DOM size, list rendering, and animation styles.
4. Fix the measured bottleneck with the smallest maintainable change. Prefer reducing work over hiding work.
5. Verify the improvement with the same measurement path and note any residual risk.

## Priority Model

Use the browser pipeline as the main mental model:

```text
JavaScript -> Style Calculation -> Layout -> Paint -> Composite
```

Optimize in this order unless profiling proves otherwise:

1. Avoid repeated layout reads after writes.
2. Reduce unnecessary rendering, watchers, subscriptions, and event listeners.
3. Virtualize large lists and tables.
4. Move animation work to transform and opacity.
5. Reduce bundle, image, and network cost for load-time issues.

## Reference Selection

Load only the reference that matches the active bottleneck:

- For layout thrashing, DOM work, scroll/resize handlers, requestAnimationFrame, requestIdleCallback, CSS animation, or GPU compositing: read [rendering-and-animation.md](references/rendering-and-animation.md).
- For large lists, tables, images, ResizeObserver, IntersectionObserver, or MutationObserver: read [large-data-and-assets.md](references/large-data-and-assets.md).
- For Vue or React render tuning, computed values, watchers, memoization, and component update boundaries: read [framework-patterns.md](references/framework-patterns.md).
- For memory leaks, investigation workflow, checklists, and review priority: read [investigation-checklist.md](references/investigation-checklist.md).

## Output Expectations

When reporting findings, lead with measured or strongly evidenced bottlenecks. For each fix, mention the affected file, why it helps, and how it was verified. If measurement tooling could not run, say so clearly and distinguish evidence from inference.
