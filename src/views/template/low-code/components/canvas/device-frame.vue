<template>
  <div
    class="lc-device-frame"
    :class="[
      props.kind ? `is-${props.kind}` : 'is-plain',
      props.landscape ? 'is-landscape' : 'is-portrait',
    ]"
  >
    <template v-if="props.kind">
      <span class="lc-device-frame__shell" aria-hidden="true" />
      <span
        v-if="props.kind === 'phone'"
        class="lc-device-frame__notch"
        aria-hidden="true"
      />
      <span v-else class="lc-device-frame__camera" aria-hidden="true" />
      <span
        class="lc-device-frame__button lc-device-frame__button--power"
        aria-hidden="true"
      />
      <span
        v-if="props.kind === 'phone'"
        class="lc-device-frame__button lc-device-frame__button--mute"
        aria-hidden="true"
      />
      <span
        class="lc-device-frame__button lc-device-frame__button--volume-up"
        aria-hidden="true"
      />
      <span
        class="lc-device-frame__button lc-device-frame__button--volume-down"
        aria-hidden="true"
      />
    </template>

    <div class="lc-device-frame__screen">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'DeviceFrame' })
/**
 * 机型外壳装饰
 *
 * 外壳（边框/听筒/按键）作为真实的内边距占据画布尺寸，
 * 屏幕（默认插槽）位于内边距之内，因此：
 * - 外壳不会被画布视口裁剪，切换设备时画布会为其留出边距；
 * - 屏幕自身的尺寸与位置不受影响，画布内的坐标计算保持一致。
 */
const props = withDefaults(
  defineProps<{
    kind?: 'phone' | 'tablet'
    landscape?: boolean
  }>(),
  { kind: undefined, landscape: false }
)
</script>

<style scoped lang="less">
.lc-device-frame {
  /* 屏幕四周的边框厚度，按机型在下方覆写；横屏时上下与左右互换 */
  --lc-bezel-top: 0px;
  --lc-bezel-right: 0px;
  --lc-bezel-bottom: 0px;
  --lc-bezel-left: 0px;
  --lc-frame-radius: 12px;
  --lc-screen-radius: 4px;
  --lc-shell-gradient: linear-gradient(
    150deg,
    #454b55 0%,
    #16191e 42%,
    #2b3038 100%
  );

  position: relative;
  width: fit-content;
  padding: var(--lc-bezel-top) var(--lc-bezel-right) var(--lc-bezel-bottom)
    var(--lc-bezel-left);
}

.lc-device-frame__shell {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: var(--lc-shell-gradient);
  border-radius: var(--lc-frame-radius);
  box-shadow:
    0 26px 60px rgb(15 23 42 / 30%),
    inset 0 0 0 1px rgb(255 255 255 / 10%);
}

.lc-device-frame__screen {
  position: relative;
  z-index: 1;
  border-radius: var(--lc-screen-radius);
}

/* 非模拟机型（PC/自定义）保持原有画布外观，不做任何包裹 */
.is-plain {
  width: auto;
}

.is-plain .lc-device-frame__screen {
  overflow: visible;
}

.is-phone .lc-device-frame__screen,
.is-tablet .lc-device-frame__screen {
  overflow: hidden;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 45%);
}

/* 听筒与前置摄像头画在边框内，不遮挡屏幕内容 */
.lc-device-frame__notch,
.lc-device-frame__camera {
  position: absolute;
  z-index: 2;
  display: block;
  pointer-events: none;
  background: #0b0d10;
}

.lc-device-frame__notch {
  border-radius: 999px;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 6%);
}

.lc-device-frame__camera {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  box-shadow:
    inset 0 0 0 1px rgb(255 255 255 / 8%),
    0 0 0 1px rgb(0 0 0 / 35%);
}

/* 侧边按键：贴着外壳内侧边缘绘制，不占用屏幕空间 */
.lc-device-frame__button {
  position: absolute;
  z-index: 0;
  display: block;
  pointer-events: none;
  background: linear-gradient(180deg, #3b414a 0%, #14171c 100%);
  border-radius: 2px;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 8%);
}

/* 竖屏：听筒/摄像头在上边框居中 */
.is-portrait .lc-device-frame__notch {
  top: 9px;
  left: 50%;
  width: 92px;
  height: 15px;
  transform: translateX(-50%);
}

.is-portrait .lc-device-frame__camera {
  top: calc((var(--lc-bezel-top) - 8px) / 2);
  left: 50%;
  transform: translateX(-50%);
}

/* 横屏：听筒/摄像头移到左边框 */
.is-landscape .lc-device-frame__notch {
  top: 50%;
  left: 9px;
  width: 15px;
  height: 92px;
  transform: translateY(-50%);
}

.is-landscape .lc-device-frame__camera {
  top: 50%;
  left: calc((var(--lc-bezel-left) - 8px) / 2);
  transform: translateY(-50%);
}

/* ---------------- iPhone ---------------- */
.is-phone {
  --lc-bezel-top: 34px;
  --lc-bezel-right: 13px;
  --lc-bezel-bottom: 26px;
  --lc-bezel-left: 13px;
  --lc-frame-radius: 54px;
  --lc-screen-radius: 42px;
  --lc-shell-gradient: linear-gradient(
    148deg,
    #7c828a 0%,
    #3a3f46 16%,
    #16181c 46%,
    #101216 68%,
    #4a5058 100%
  );
}

.is-phone.is-landscape {
  --lc-bezel-top: 13px;
  --lc-bezel-right: 26px;
  --lc-bezel-bottom: 13px;
  --lc-bezel-left: 34px;
}

.is-phone .lc-device-frame__button {
  width: 4px;
}

.is-phone.is-portrait .lc-device-frame__button--power {
  top: 24%;
  right: 3px;
  height: 66px;
}

.is-phone.is-portrait .lc-device-frame__button--mute {
  top: 15%;
  left: 3px;
  height: 22px;
}

.is-phone.is-portrait .lc-device-frame__button--volume-up {
  top: 21%;
  left: 3px;
  height: 42px;
}

.is-phone.is-portrait .lc-device-frame__button--volume-down {
  top: 30%;
  left: 3px;
  height: 42px;
}

.is-phone.is-landscape .lc-device-frame__button--power {
  top: 3px;
  right: 24%;
  width: 66px;
  height: 4px;
}

.is-phone.is-landscape .lc-device-frame__button--mute {
  bottom: 3px;
  left: 15%;
  width: 22px;
  height: 4px;
}

.is-phone.is-landscape .lc-device-frame__button--volume-up {
  bottom: 3px;
  left: 21%;
  width: 42px;
  height: 4px;
}

.is-phone.is-landscape .lc-device-frame__button--volume-down {
  bottom: 3px;
  left: 30%;
  width: 42px;
  height: 4px;
}

/* ---------------- iPad ---------------- */
.is-tablet {
  --lc-bezel-top: 36px;
  --lc-bezel-right: 24px;
  --lc-bezel-bottom: 32px;
  --lc-bezel-left: 24px;
  --lc-frame-radius: 36px;
  --lc-screen-radius: 22px;
  --lc-shell-gradient: linear-gradient(
    150deg,
    #9aa1a9 0%,
    #4a5058 14%,
    #1d2025 46%,
    #14171b 70%,
    #5c636b 100%
  );
}

.is-tablet.is-landscape {
  --lc-bezel-top: 24px;
  --lc-bezel-right: 32px;
  --lc-bezel-bottom: 24px;
  --lc-bezel-left: 36px;
}

.is-tablet .lc-device-frame__button {
  width: 3px;
}

.is-tablet.is-portrait .lc-device-frame__button--power {
  top: 10%;
  right: 4px;
  height: 52px;
}

.is-tablet.is-portrait .lc-device-frame__button--volume-up {
  top: 19%;
  left: 4px;
  height: 34px;
}

.is-tablet.is-portrait .lc-device-frame__button--volume-down {
  top: 26%;
  left: 4px;
  height: 34px;
}

.is-tablet.is-landscape .lc-device-frame__button--power {
  top: 4px;
  right: 10%;
  width: 52px;
  height: 3px;
}

.is-tablet.is-landscape .lc-device-frame__button--volume-up {
  bottom: 4px;
  left: 19%;
  width: 34px;
  height: 3px;
}

.is-tablet.is-landscape .lc-device-frame__button--volume-down {
  bottom: 4px;
  left: 26%;
  width: 34px;
  height: 3px;
}
</style>
