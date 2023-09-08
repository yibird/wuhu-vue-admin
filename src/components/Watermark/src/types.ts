export interface WatermarkProps {
    /**
     * @desc 水印宽度
     * @default 120
     */
    width?: number;
    /**
     * @desc 水印高度
     * @default 60
     */
    height?: number;
    /**
     * @desc 绘制水印时旋转的角度
     * @default -22
     */
    rotate?: number;
    /**
     * @desc 图片源,优先使用图片渲染水印
     * @default
     */
    image?: string;
    /**
     * @desc 图片宽度
     * @default 120
     */
    imageWidth?: number;
    /**
     * @desc 图片高度
     * @default 64
     */
    imageHeight?: number;
    /**
     * @desc 水印元素的z-index
     * @default 2000
     */
    zIndex?: number;
    /**
     * @desc 水印文字内容
     * @default
     */
    content?: string;
    /**
     * @desc 水印文字大小
     * @default 14
     */
    fontSize?: number | string;
    /**
     * @desc 水印文字颜色
     * @default 'rgba(0,0,0,.15)'
     */
    fontColor?: string;
    /**
     * @desc 水印文字系列
     * @default 'PingFang SC'
     */
    fontFamily?: string;
    /**
     * @desc 水印文字样式
     * @default 'normal'
     */
    fontStyle?: string;
    /**
     * @desc 水印文字粗细
     * @default 'normal'
     */
    fontWeight?: string;
    /**
     * @desc 水印之间的水平间距
     * @default 24
     */
    gapX?: number;
    /**
     * @desc 水印之间的垂直间距
     * @default 48
     */
    gapY?: number;
    /**
     * @desc 是否覆盖整个页面
     * @default false
     */
    fullPage?: boolean;
}
