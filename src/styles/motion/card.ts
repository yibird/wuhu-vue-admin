const cardListEase = [0.22, 1, 0.36, 1] as [number, number, number, number]

export const cardListMotionInitial = {
  opacity: 0,
  scale: 0.985,
  y: 4,
}

export const cardListMotionAnimate = {
  opacity: 1,
  scale: 1,
  y: 0,
}

export const cardListMotionExit = {
  opacity: 0,
  scale: 0.985,
  y: -2,
}

export const cardListMotionTransition = {
  layout: {
    type: 'spring' as const,
    stiffness: 440,
    damping: 36,
    mass: 0.65,
  },
  opacity: {
    type: 'tween' as const,
    duration: 0.15,
    ease: cardListEase,
  },
  scale: {
    type: 'tween' as const,
    duration: 0.18,
    ease: cardListEase,
  },
  y: {
    type: 'tween' as const,
    duration: 0.18,
    ease: cardListEase,
  },
}
