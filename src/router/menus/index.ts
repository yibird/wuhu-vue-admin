import { RouteRecordNormalized } from "vue-router";
import { Menu } from "../types";
import { PermissionModeEnum } from "/@/enums/appEnum";
import { useAppStore } from "/@/store";
import { usePermissionStore } from "/@/store/module/permission";
import { isUrl } from "/@/utils/is";

// 获取权限模式
const getPermissionMode = () => {
  const appStore = useAppStore();
  return appStore.getProjectConfig.permissionMode;
};

// 是否是后端权限模式
const isBackMode = () => {
  return getPermissionMode() === PermissionModeEnum.BACK;
};

// 是否是menus 路由映射模式
const isRouteMappingMode = () => {
  return getPermissionMode() === PermissionModeEnum.ROUTE_MAPPING;
};

// 是否是角色模式
const isRoleMode = () => {
  return getPermissionMode() === PermissionModeEnum.ROLE;
};

// 异步获取menus,根据配置信息返回前端、后端、静态menus
async function getAsyncMenus() {
  const permissionStore = usePermissionStore();
  if (isBackMode()) {
    return permissionStore.backMenus.filter((item) => !item.hidden);
  }
  if (isRouteMappingMode()) {
    return permissionStore.frontMenus.filter((item) => !item.hidden);
  }
  return [];
}

// 基础过滤器,用于过滤非法menu
function basicFilter(routes: RouteRecordNormalized[]) {
  return (menu: Menu) => {
    const matchRoute = routes.find((route) => {
      if (isUrl(menu.path)) return true;
    });
  };
}
