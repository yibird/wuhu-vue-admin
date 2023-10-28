import { reactive, toRefs } from 'vue';

export function useTable() {
  const state = reactive({
    loding: false,
  });

  const refresh = () => {};

  return {
    ...toRefs(state),
    refresh,
  };
}
