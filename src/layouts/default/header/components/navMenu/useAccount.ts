import { Router } from 'vue-router';
import { useGo } from '/@/hooks/web/usePage';
enum Route {
  ACCOUNT = '/setting/account',
  LOGIN_OUT = '/',
}
export function useAccount(router: Router) {
  const go = useGo(router);

  const goAccount = () => {
    go(Route.ACCOUNT);
  };
  const loginOut = () => {};
  return {
    goAccount,
    loginOut,
  };
}
