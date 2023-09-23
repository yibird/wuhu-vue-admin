import { defineComponent, PropType, computed, CSSProperties } from "vue";

export interface IconProps {
  name: string;
  color?: string;
  size?: string | number;
  hoverColor?: string;
}

const iconProps = {
  name: String,
  color: String,
  size: {
    type: [String, Number] as PropType<String | Number>,
    default: 14,
  },
  hoverColor: String,
};

export default defineComponent({
  name: "Icon",
  props: iconProps,
  setup(props) {
    return () => {
      const { name, color, size, hoverColor } = props;
      const fontSize = typeof size === "string" ? size : `${size}px`;
      return <i class={["icon", name]} style={{ color, fontSize }} />;
    };
  },
});
