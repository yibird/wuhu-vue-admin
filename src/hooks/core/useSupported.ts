import { ref, Ref } from 'vue';

export function useSupported(callback: () => unknown, sync = false) {
  const isSupported = ref() as Ref<boolean>;
  const update = () => (isSupported.value = Boolean(callback()));
  update();
  return isSupported;
}
