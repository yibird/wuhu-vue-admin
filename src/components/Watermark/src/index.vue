<template>
  <div :style="getStyle"></div>
</template>
<script setup lang="ts">
  import { ref, computed } from "vue";
  import type { WatermarkProps } from "./types";
  import { CSSProperties } from "vue";
  import { onMounted } from "vue";

  const {
    width = 120,
    height = 60,
    rotate = -22,
    image,
    imageWidth = 120,
    imageHeight = 64,
    zIndex = 2000,
    content = "",
    fontSize = 14,
    fontColor = "rgba(0,0,0,.15)",
    fontStyle = "normal",
    fontFamily = "PingFang SC",
    fontWeight = "normal",
    gapX = 24,
    gapY = 48,
    fullPage = false,
  } = defineProps<WatermarkProps>();

  const base64Url = ref("");

  function init(): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject("The current environment does not support canvas");
        return;
      }
      // 获取屏幕像素比、canvas宽高、水印宽高
      const ratio = window.devicePixelRatio || 1;
      const canvasWidth = `${(gapX + width) * ratio}px`,
        canvasHeight = `${(gapY + height) * ratio}px`;
      const markWidth = width * ratio,
        markHeight = height * ratio;

      canvas.setAttribute("width", canvasWidth);
      canvas.setAttribute("height", canvasHeight);

      // 处理图片水印
      if (image) {
        // 重新映射画布上的 (0,0) 位置
        ctx.translate(markWidth / 2, markHeight / 2);
        // 旋转指定角度
        ctx.rotate((Math.PI / 180) * Number(rotate));
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.referrerPolicy = "no-referrer";
        img.src = image;
        img.onload = () => {
          // 绘制图片
          ctx.drawImage(
            img,
            (-imageWidth * ratio) / 2,
            (-imageHeight * ratio) / 2,
            imageWidth * ratio,
            imageHeight * ratio,
          );
          // 恢复canvas
          ctx.restore();
          // 返回canvas转base64
          resolve(canvas.toDataURL());
        };
      }

      // 处理文字水印
      if (content) {
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.translate(markWidth / 2, markHeight / 2);
        ctx.rotate((Math.PI / 180) * Number(rotate));
        const markSize = Number(fontSize) * ratio;
        ctx.font = `${fontStyle} normal ${fontWeight} ${markSize}px/${markHeight}px ${fontFamily}`;
        ctx.fillStyle = fontColor;
        ctx.fillText(content, 0, 0);
        ctx.restore();
        resolve(canvas.toDataURL());
      }
    });
  }
  onMounted(() => {
    init().then((base64) => {
      base64Url.value = base64;
    });
  });

  const getStyle = computed<CSSProperties>(() => {
    return {
      position: fullPage ? "fixed" : "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      pointerEvents: "none",
      backgroundRepeat: "repeat",
      zIndex,
      backgroundSize: `${gapX + width}px`,
      backgroundImage: `url(${base64Url.value})`,
    };
  });
</script>
