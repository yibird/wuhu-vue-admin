<template>
  <div>
    <a-drawer title="项目配置" :visible="visible" @close="closeHandle">
      <a-divider>主题</a-divider>
      <Theme />
      <a-divider>导航栏模式</a-divider>
      <NavbarMode />
      <a-divider>导航栏风格</a-divider>
      <NavbarStyle />
      <a-divider>系统主题</a-divider>
      <SysTheme />
      <a-divider>顶栏主题</a-divider>
      <SysTheme />
      <a-divider>菜单主题</a-divider>
      <SysTheme />
      <a-divider>界面功能</a-divider>
      <UIFunction />
      <a-divider>界面显示</a-divider>
      <UIDisplay />
      <a-divider>动画</a-divider>
      <Animation />
      <a-space direction="vertical" class="w-full">
        <a-button type="primary" block>拷贝</a-button>
        <a-button type="dashed" danger block>重置配置</a-button>
        <a-button type="primary" danger block>清空缓存并返回登录页</a-button>
      </a-space>
    </a-drawer>
  </div>
</template>
<script setup lang="ts">
  import Theme from "./components/Theme.vue";
  import SysTheme from "./components/SysTheme.vue";
  import NavbarMode from "./components/NavbarMode.vue";
  import NavbarStyle from "./components/NavbarStyle.vue";
  import UIFunction from "./components/UIFunction.vue";
  import UIDisplay from "./components/UIDisplay.vue";
  import Animation from "./components/Animation.vue";

  interface Props {
    visible?: boolean;
  }
  interface Emits {
    (e: "update:visible", visible: boolean): void;
  }

  const { visible = false } = defineProps<Props>();
  const emit = defineEmits<Emits>();

  const closeHandle = () => {
    emit("update:visible", false);
  };
</script>
