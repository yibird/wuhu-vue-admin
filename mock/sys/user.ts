import { Random } from "mockjs";
import { ok, error } from "../_util";

type Role = {
  roleName: string;
  value: string;
};

export interface User {
  id: number;
  username: string;
  realName: string;
  avatar: string;
  password: string;
  roles: Role[];
}

const roles: Role[] = [
  {
    roleName: "Admin",
    value: "admin",
  },
  {
    roleName: "Staff",
    value: "test",
  },
];

function mockUserList(): User[] {
  return Array.from({ length: 10 }).map((_, index) => {
    return {
      id: Random.integer(1, 1000),
      username: "wuhu_" + (index + 1),
      realName: Random.cname(),
      avatar: Random.image("50x50"),
      // password: Random.paragraph(0, 8),
      password: "123123",
      roles: [Random.pick(roles)],
    };
  });
}

const userList: { token: string; user: User }[] = [];

/**
 * 登录
 */
function login() {
  return {
    url: "/basic-api/sys/login",
    timeout: 200,
    method: "post",
    response: ({ body }: any) => {
      const { account, password } = body;
      const user = mockUserList().find(
        (item) => item.username === account && item.password === password
      )!;
      if (!user) return error();

      const token = "xxxxx-xxxx";
      const index = userList.findIndex((item) => item.token === token);
      index === -1
        ? userList.push({ token, user })
        : userList.splice(index, 1, { token, user });
      return ok({ token });
    },
  }
}

/**
 * 获取用户信息
 */
function getUserInfo() {
  return {
    url: "/basic-api/sys/getUserInfo",
    timeout: 200,
    method: "get",
    response: ({ body }: any) => {
      const { token } = body;
      const user = userList.find((item) => item.token === token);
      return user ? ok(user) : error();
    },
  }
}


export default [
  login(),
  getUserInfo()
];
