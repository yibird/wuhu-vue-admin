import {
  defineComponent,
  PropType,
  ExtractPropTypes,
  computed,
  CSSProperties,
  VNode,
  Fragment,
} from "vue";
export type SpaceAlign = "start" | "end" | "center" | "baseline";
export type SpaceDirection = "vertical" | "horizontal";
export type SpaceSize = number | string | number[] | string[];

export const spaceProps = {
  // 对齐方式
  align: String as PropType<SpaceAlign>,
  // 间距方向,默认:"horizontal"
  direction: {
    type: String as PropType<SpaceDirection>,
    default: "horizontal",
  },
  // 间距大小,默认:8
  size: {
    type: [Number, String, Array] as PropType<SpaceSize>,
    default: 8,
  },
  // 是否让 Space 变为一个块级元素,填充整个父元素,默认:false
  fill: Boolean,
  // 是否换行,默认:false
  wrap: Boolean,
};
export type SpaceProps = ExtractPropTypes<typeof spaceProps>;

/**
 * 根据Vnode过滤,返回一个布尔值
 * @param node
 */
const filterEmptyNode = (node: VNode): boolean => {
  if (typeof node === "function") return false;
  // 判断节点是否是注解节点
  if (typeof Comment !== "undefined" && node.type === Comment) return false;
  // 判断节点是否是Fragment节点,并且Fragment节点中没有子节点
  if (node.type === Fragment && node.children?.length === 0) return false;
  // 判断节点是文件节点,如果是文本节点则判断去除空格后是否为""
  if (node.type === Text && (node.children as string).trim() === "") return false;
  return true;
};

/**
 * 过滤指定VNode数组的空节点
 * @param children VNode数组
 */
const filterEmptyVNode = (children: VNode[] = []): VNode[] => {
  const nodes: VNode[] = [];
  children.forEach((child) => {
    if (Array.isArray(child)) {
      nodes.push(...child);
    } else if (child.type === Fragment) {
      nodes.push(...filterEmptyVNode(child.children as VNode[]));
    } else {
      nodes.push(child);
    }
  });
  return nodes.filter((n) => filterEmptyNode(n));
};

export default defineComponent({
  name: "space",
  props: spaceProps,
  setup(props, { slots }) {
    const { align, direction, size, fill, wrap } = props;
    const mergedAlign = computed(() => {
      return align ?? (direction === "horizontal" ? "center" : "");
    });
    const getMargin = (size: number | string) => {
      return typeof size === "number" ? `${size}px` : size;
    };
    /**
     * 获取margin样式
     * @param isLast 是否是最后一个元素
     */
    const getMarginStyle = (isLast: boolean): CSSProperties => {
      const style: CSSProperties = {};
      const marginRight = getMargin(Array.isArray(size) ? size[0] : size);
      const marginBottom = getMargin(Array.isArray(size) ? size[1] : size);
      // 如果当前是最后一个元素且需要换行,则直接设置下边距,无需设置右边距
      if (isLast) {
        return wrap ? { marginBottom } : {};
      }
      if (direction === "horizontal") {
        style.marginRight = marginRight;
      }
      if (direction === "vertical" || wrap) {
        style.marginBottom = marginBottom;
      }
      return style;
    };

    return () => {
      const children = filterEmptyVNode(slots.default?.());
      const containerStyle: CSSProperties = {
        display: fill ? "flex" : "inline-flex",
        flexDirection: direction === "horizontal" ? "row" : "column",
        flexWrap: wrap ? "wrap" : undefined,
        alignItems: mergedAlign.value,
      };
      return (
        <div style={containerStyle}>
          {children.map((c, i) => {
            return (
              <div key={"item_" + i} style={getMarginStyle(i === children.length - 1)}>
                {c}
              </div>
            );
          })}
        </div>
      );
    };
  },
});
