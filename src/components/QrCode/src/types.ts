import type { QRCodeOptions } from "qrcode";
export interface LogoOption {
  // logo图片
  src: string;
  // logo大小
  size: number;
  // 背景颜色
  bgColor: string;
  // logo圆角
  radius: number;
  // logo边距
  margin?: number;
}

type QrcodeDoneEventParams = {
  url: string;
  ctx?: CanvasRenderingContext2D;
};

export interface QrcodeProps {
  // 二维码URL地址
  value: string;
  // 二维码尺寸
  size?: number;
  // qrcode配置项
  options?: QRCodeOptions;
  // 二维码logo
  logo?: string | LogoOption;
  // 渲染标签
  tag?: "canvas" | "img";
  // 生成二维码完毕回调
  onDone?: (data: QrcodeDoneEventParams) => void;
  // 生成二维码错误回调
  onError?: (error: Error) => void;
}

export interface QrcodeEmits {
  (e: "onError", err: Error): void;
  (e: "onDone", data: { url: string }): void;
}
