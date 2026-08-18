<template>
  <div class="w-loading-spinner">
    <span></span>
    <span></span>
  </div>
</template>

<style lang="less" scoped>
.w-loading-spinner {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid rgb(var(--w-color-primary) / 16%);
  border-radius: 50%;
  animation: w-loading-spinner-rotate 1.1s linear infinite;

  &::before {
    position: absolute;
    inset: 10px;
    content: '';
    border: 1px dashed rgb(var(--w-color-primary) / 24%);
    border-radius: 50%;
  }

  span {
    position: absolute;
    width: 10px;
    height: 10px;
    background: var(--w-loading-primary);
    border-radius: 50%;

    &:first-child {
      top: -5px;
      left: 50%;
      transform: translateX(-50%);
    }

    &:last-child {
      right: 5px;
      bottom: 5px;
      width: 7px;
      height: 7px;
      opacity: 0.56;
    }
  }
}

@keyframes w-loading-spinner-rotate {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .w-loading-spinner {
    animation: none !important;
  }
}
</style>
