<template>
  <div style="text-align: center">
    <component :is="renderEl" />
  </div>
</template>
<script setup lang="ts">
import { h, onMounted, ref } from "vue";
import { QrcodeProps, QrcodeEmits, LogoOption } from "./types";
import QRcode from "qrcode";

type RoundRectOption = {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
};

const {
  size = 50,
  tag = "canvas",
  value,
  options,
  logo,
} = defineProps<QrcodeProps>();
const emits = defineEmits<QrcodeEmits>();
const elRef = ref<HTMLImageElement | HTMLCanvasElement>();
const renderEl = h(tag, { ref: elRef });

// 绘制矩形允许磨角
const drawRoundRect = ({ ctx, x, y, w, h, r }: RoundRectOption) => {
  const min_size = Math.min(w, h);
  if (r > min_size / 2) r = min_size / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};
// 绘制图片
// const drawRoundRectImage = (
//   option: RoundRectOption & { img: HTMLImageElement }
// ) => {
//   const { ctx, x, y, w, h, r, img } = option;
//   drawRoundRect({ ctx, x, y, w, h, r });
//   ctx.clip();
//   ctx.drawImage(img, x, y, w, h);
// };
// 绘制Logo
const drawLogo = (
  ctx: CanvasRenderingContext2D,
  logoOption: LogoOption,
  qrcodeSize: number
) => {
  const { size, bgColor, margin, radius: r } = logoOption;
  const img = new Image(size, size);
  img.src = logoOption.src;
  img.onload = () => {
    const x = (qrcodeSize - size) / 2 - (margin || 0) / 2;
    const w = size + (margin || 0);
    drawRoundRect({ ctx, x, y: x, w, h: w, r });
    ctx.fillStyle = bgColor;
    ctx.fill();
  };
};

const renderQrcode = () => {
  QRcode.toCanvas(
    elRef.value,
    value,
    { ...options, width: size },
    (error: Error | null | undefined) => {
      if (error) {
        emits("onError", error);
        return;
      }
      if (tag === "canvas" && logo) {
        const ctx = (elRef.value as HTMLCanvasElement).getContext("2d")!;
        const logoDefaultOptions = {
          size: 50,
          src: logo as string,
          radius: 4,
          margin: 10,
          bgColor: "#fff",
        };
        const options =
          typeof logo === "string"
            ? logoDefaultOptions
            : { ...logoDefaultOptions, ...logo };
        drawLogo(ctx, options, size!);
      }
      emits("onDone", { url: value });
    }
  );
};

onMounted(() => {
  elRef.value && renderQrcode();
});
</script>
