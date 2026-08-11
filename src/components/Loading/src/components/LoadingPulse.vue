<template>
  <div class="w-loading-pulse">
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<style lang="less" scoped>
.w-loading-pulse {
  position: relative;
  width: 100%;
  height: 100%;

  span {
    position: absolute;
    inset: 0;
    border: 2px solid var(--w-loading-primary);
    border-radius: 50%;
    opacity: 0;
    animation: w-loading-pulse-wave 1.35s ease-out infinite;

    &:nth-child(2) {
      animation-delay: 0.28s;
    }

    &:nth-child(3) {
      animation-delay: 0.56s;
    }
  }
}

@keyframes w-loading-pulse-wave {
  0% {
    opacity: 0.72;
    transform: scale(0.25);
  }

  85%,
  100% {
    opacity: 0;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .w-loading-pulse span {
    opacity: 0.55;
    transform: scale(0.72);
    animation: none !important;
  }

  .w-loading-pulse span:not(:first-child) {
    display: none;
  }
}
</style>
