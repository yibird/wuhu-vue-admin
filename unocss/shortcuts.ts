export const shortcuts = {
  full: 'w-full h-full',
  'full-flex': 'w-full min-h-0 flex-1',

  // flex layout
  'flex-center': 'flex justify-center items-center',
  'flex-x-center': 'flex justify-center',
  'flex-y-center': 'flex items-center',
  'flex-between': 'flex justify-between',
  'flex-between-center': 'flex justify-between items-center',
  'flex-center-between': 'flex justify-center items-stretch',

  // grid layout
  'grid-center': 'grid place-content-center',
  'grid-x-center': 'grid justify-center',
  'grid-y-center': 'grid items-center',
  'grid-stretch': 'grid items-stretch',
  'grid-between': 'grid justify-between',
  'grid-between-center': 'grid justify-between items-center',
  'grid-center-between': 'grid place-content-between',
  'grid-equal-cols': 'grid grid-cols-[repeat(auto-fit,minmax(0,1fr))]',

  // absolute layout
  'absolute-center':
    'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
  'absolute-x-center': 'absolute left-1/2 transform -translate-x-1/2',
  'absolute-y-center': 'absolute top-1/2 transform -translate-y-1/2',
  'fixed-center':
    'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
  'fixed-x-center': 'fixed left-1/2 transform -translate-x-1/2',
  'fixed-y-center': 'fixed top-1/2 transform -translate-y-1/2',

  // element
  button:
    'flex items-center justify-center grow-0 shrink-0 bg-transparent border-none outline-none appearance-none touch-none cursor-pointer',
  'icon-primary-soft':
    'bg-primary/8 text-primary border-1 border-primary/15 border-solid',

  'span-button':
    'p-0 m-0 bg-transparent border-none outline-none appearance-none touch-none cursor-pointer',
  // motion
  'motion-interactive':
    'transition-[background-color,border-color,box-shadow,color,transform,translate,scale,rotate] duration-motion-base ease-motion-standard motion-reduce:transition-none',
  'motion-press': 'active:scale-motion-pressed motion-reduce:active:scale-100',
}
