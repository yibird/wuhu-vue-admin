<template>
  <div class="w-loading-ring">
    <span></span>
  </div>
</template>

<style lang="less" scoped>
.w-loading-ring {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;

  &::before,
  &::after,
  span {
    position: absolute;
    inset: 0;
    content: '';
    border-radius: 50%;
  }

  &::before {
    border: 4px solid rgb(var(--w-color-primary) / 12%);
  }

  &::after {
    border: 4px solid transparent;
    border-top-color: var(--w-loading-primary);
    border-right-color: var(--w-loading-primary);
    animation: w-loading-ring-rotate 0.78s linear infinite;
  }

  span {
    inset: 14px;
    background: rgb(var(--w-color-primary) / 10%);
    animation: w-loading-ring-core 1.1s ease-in-out infinite;
  }
}

@keyframes w-loading-ring-rotate {
  to {
    transform: rotate(360deg);
  }
}

@keyframes w-loading-ring-core {
  0%,
  100% {
    opacity: 0.46;
    transform: scale(0.78);
  }

  50% {
    opacity: 1;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .w-loading-ring::after,
  .w-loading-ring span {
    transform: none !important;
    animation: none !important;
  }
}
</style>
