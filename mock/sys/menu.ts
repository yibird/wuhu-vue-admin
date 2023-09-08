import { ok } from "mock/_util";
import { menus } from "/@/common/menu";

export default [
  {
    url: "/basic-api/sys/getMenus",
    timeout: 200,
    method: "get",
    response: ({ body }: any) => ok(menus),
  },
];
