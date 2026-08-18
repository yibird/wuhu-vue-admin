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
    width: 6px;
    height: 34px;
    background: var(--w-loading-primary);
    border-radius: 999px;
    animation: w-loading-bars-jump 0.86s ease-in-out infinite;

    &:nth-child(2) {
      animation-delay: 0.08s;
    }

    &:nth-child(3) {
      animation-delay: 0.16s;
    }

    &:nth-child(4) {
      animation-delay: 0.24s;
    }

    &:nth-child(5) {
      animation-delay: 0.32s;
    }
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

@media (prefers-reduced-motion: reduce) {
  .w-loading-bars span {
    opacity: 0.72;
    transform: scaleY(0.72);
    animation: none !important;
  }
}
</style>
