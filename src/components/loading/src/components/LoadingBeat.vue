<template>
  <div class="w-loading-beat"></div>
</template>

<style lang="less" scoped>
.w-loading-beat {
  position: relative;
  width: 100%;
  height: 100%;

  &::before,
  &::after {
    position: absolute;
    left: 0;
    content: '';
  }

  &::before {
    top: calc(var(--w-loading-size) + 10px);
    width: var(--w-loading-size);
    height: 6px;
    background: rgb(var(--w-color-primary) / 20%);
    border-radius: 50%;
    transform-origin: center;
    animation: w-loading-beat-shadow 0.58s ease-in-out infinite;
  }

  &::after {
    top: 0;
    width: 100%;
    height: 100%;
    background:
      linear-gradient(135deg, rgb(255 255 255 / 24%), transparent 45%),
      var(--w-loading-primary);
    border-radius: var(--w-loading-radius);
    box-shadow: inset 0 0 0 1px rgb(255 255 255 / 18%);
    animation: w-loading-beat-jump 0.58s ease-in-out infinite;
  }
}

@keyframes w-loading-beat-jump {
  15% {
    border-bottom-right-radius: calc(var(--w-loading-radius) * 0.5);
  }

  25% {
    transform: translateY(8px) rotate(22.5deg);
  }

  50% {
    border-bottom-right-radius: 50%;
    transform: translateY(16px) scale(1, 0.9) rotate(45deg);
  }

  75% {
    transform: translateY(8px) rotate(67.5deg);
  }

  100% {
    transform: translateY(0) rotate(90deg);
  }
}

@keyframes w-loading-beat-shadow {
  0%,
  100% {
    opacity: 0.78;
    transform: scale(0.96, 1);
  }

  50% {
    opacity: 0.36;
    transform: scale(1.28, 0.82);
  }
}

@media (prefers-reduced-motion: reduce) {
  .w-loading-beat::before,
  .w-loading-beat::after {
    transform: none !important;
    animation: none !important;
  }
}
</style>
