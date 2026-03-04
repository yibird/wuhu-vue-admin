import { lightTheme, darkTheme, type GlobalThemeOverrides } from 'naive-ui'
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'
import { useIntervalFn } from '@vueuse/core'
import { appStore } from '@/store'
import { ThemeMode, type ThemeModeType } from '@/constant'

function isLight() {
  const hour = dayjs().hour()
  return hour >= 6 && hour < 18
}

export function useTheme() {
  const { app } = storeToRefs(appStore())
  const theme = ref(lightTheme)
  const themeMode = computed(() => app.value.themeMode)
  const themeColor = computed(() => app.value.themeColor)

  const themeConfig = computed(() => {
    return {
      common: {
        primaryColor: `rgb(${themeColor.value})`,
        primaryColorHover: `rgba(${themeColor.value}, 0.85)`,
        primaryColorPressed: `rgba(${themeColor.value}, 0.75)`,
      },
    } as GlobalThemeOverrides
  })

  const handleAutoChangeThemeMode = () => {
    if (themeMode.value !== ThemeMode.Auto) return
    theme.value = isLight() ? lightTheme : darkTheme
  }
  useIntervalFn(handleAutoChangeThemeMode, 1000)

  watch(themeMode, () => {
    if (themeMode.value === ThemeMode.Auto) {
      handleAutoChangeThemeMode()
      return
    }
    theme.value = themeMode.value === ThemeMode.Light ? lightTheme : darkTheme
  })

  const changeThemeMode = (mode: ThemeModeType) => {
    app.value.themeMode = mode
    const isDark = mode === ThemeMode.Dark
    theme.value = isDark ? darkTheme : lightTheme
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    handleAutoChangeThemeMode()
  }
  const toggleThemeMode = () => {
    const isDark = app.value.themeMode === ThemeMode.Dark
    changeThemeMode(isDark ? ThemeMode.Light : ThemeMode.Dark)
  }
  const changeThemeColor = (color: string) => {
    app.value.themeColor = color
    document.documentElement.style.setProperty(`--w-primary-color`, color)
  }

  const changeThemeWithAnimation = (e: Event, mode: ThemeModeType) => {
    if (!document.startViewTransition) {
      changeThemeMode(mode)
      return
    }
    const transition = document.startViewTransition(() => {
      const isDark = mode === ThemeMode.Dark
      document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
    })
    transition.ready.then(() => {
      const { clientX, clientY } = e as MouseEvent
      const endRadius = Math.hypot(
        Math.max(clientX, innerWidth - clientX),
        Math.max(clientY, innerHeight - clientY)
      )

      const clipPath = [
        `circle(0px at ${clientX}px ${clientY}px)`,
        `circle(${endRadius}px at ${clientX}px ${clientY}px)`,
      ]

      const isDark =
        document.documentElement.getAttribute('data-theme') === 'dark'

      document.documentElement
        .animate(
          {
            clipPath: isDark ? clipPath.reverse() : clipPath,
          },
          {
            duration: 450,
            easing: 'ease-in',
            pseudoElement: isDark
              ? '::view-transition-old(root)'
              : '::view-transition-new(root)',
          }
        )
        .addEventListener('finish', () => {
          changeThemeMode(mode)
        })
    })
  }

  onMounted(() => {
    changeThemeMode(themeMode.value)
    changeThemeColor(themeColor.value)
  })

  return {
    theme,
    themeConfig,
    themeMode,
    themeColor,
    changeThemeMode,
    changeThemeColor,
    changeThemeWithAnimation,
    toggleThemeMode,
  }
}
