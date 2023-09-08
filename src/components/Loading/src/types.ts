export interface LoadingProps {
    /**
     * @desc loading 文字提示
     * @default 
     */
    tip?: string;
    /**
     * @desc loading 大小
     * @default "default"
     */
    size?: "small" | "default" | "large";
    /**
     * @desc 是否全屏显示loading
     * @default false
     */
    fullscreen?: boolean;
    /**
     * @desc loading状态
     * @default false
     */
    loading?: boolean;
    /**
     * @desc loading背景色
     * @default 
     */
    background?: string;
    /**
     * @desc 主题
     * @default 
     */
    theme?: 'dark' | 'light';
}