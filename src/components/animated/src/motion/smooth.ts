const smoothEase = [0.22, 1, 0.36, 1]

export const smoothMotion = {
  initial: {
    opacity: 0,
    scale: 0.985,
    y: 4,
  },

  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
  },

  exit: {
    opacity: 0,
    scale: 0.985,
    y: -2,
  },

  transition: {
    layout: {
      type: 'spring' as const,
      stiffness: 440,
      damping: 36,
      mass: 0.65,
    },
    opacity: {
      type: 'tween' as const,
      duration: 0.15,
      ease: smoothEase,
    },
    scale: {
      type: 'tween' as const,
      duration: 0.18,
      ease: smoothEase,
    },
    y: {
      type: 'tween' as const,
      duration: 0.18,
      ease: smoothEase,
    },
  },
}
