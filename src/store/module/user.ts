import { defineStore } from "pinia";
import { accountLogin, getUserInfo } from "/@/apis/sys";
import { User } from "../../../mock/sys/user";

type State = {
  token: string;
  user: User | null;
};

const initialState = (): State => {
  return {
    token: "",
    user: null,
  };
};

export const useUserStore = defineStore("user", {
  state: initialState,
  getters: {
    getToken() {
      return this.getToken;
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setUser(user: User) {
      this.user = user;
    },
    async login(data: object) {
      const [err, res] = await accountLogin(data);
      if (err || res?.code !== 200) return Promise.reject(err);
      this.setToken(res.data.token);
      return this.loginAfterAction(true);
    },
    // 登录后处理
    async loginAfterAction(goHome?: boolean): Promise<User | undefined> {
      if (!this.token) return;
      const userInfo = await this.getUserInfoAction();
      return userInfo;
    },
    // 获取用户详情
    async getUserInfoAction(): Promise<User | undefined> {
      if (!this.token) return;
      const [err, res] = await getUserInfo(this.token);
      if (err || res?.code !== 200) return;
      const { user } = res.data;
      this.setUser(user);
      return user;
    },
  },
});
