<template>
  <div class="w-loading-bars">
    <span v-for="item in 5" :key="item"></span>
  </div>
</template>

<style lang="less" scoped>
.w-loading-bars {
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  span {
    --stagger-time: 0.08s;

    width: 6px;
    height: 34px;
    background: var(--w-loading-primary);
    border-radius: 999px;
    animation: w-loading-bars-jump 0.86s ease-in-out infinite;
  }
}

@supports (animation-delay: calc(sibling-index() * 0.1s)) {
  .w-loading-bars span {
    animation-delay: calc(sibling-index() * var(--stagger-time));
  }
}

@supports not (animation-delay: calc(sibling-index() * 0.1s)) {
  .w-loading-bars span:nth-child(2) {
    animation-delay: 0.08s;
  }

  .w-loading-bars span:nth-child(3) {
    animation-delay: 0.16s;
  }

  .w-loading-bars span:nth-child(4) {
    animation-delay: 0.24s;
  }

  .w-loading-bars span:nth-child(5) {
    animation-delay: 0.32s;
  }
}

@media (prefers-reduced-motion: reduce) {
  .w-loading-bars span {
    animation: none;
  }
}

@keyframes w-loading-bars-jump {
  0%,
  100% {
    opacity: 0.45;
    transform: scaleY(0.46);
  }

  50% {
    opacity: 1;
    transform: scaleY(1);
  }
}
</style>
