<template>
  <div>
    <a-divider>菜单模式</a-divider>
    <div class="grid grid-cols-4 gap-7">
      <button
        v-for="item in items"
        :key="item.value"
        type="button"
        class="group min-w-0 cursor-pointer border-0 bg-transparent p-0 text-main outline-none"
        :aria-label="`切换${item.label}菜单模式`"
        :aria-pressed="app.menuMode === item.value"
        @click="onClick(item.value)"
      >
        <span
          :class="[
            'relative box-border block h-60 w-full overflow-hidden rounded-7 border-2 border-solid bg-container shadow-[0_4px_12px_rgb(var(--w-shadow-color-1))] transition-[transform,border-color,box-shadow] duration-180 ease-out group-hover:(-translate-y-1 shadow-[0_8px_20px_rgb(var(--w-shadow-color-1))]) group-focus-visible:shadow-[0_0_0_2px_rgb(var(--w-color-primary)_/_24%)] group-active:translate-y-0 motion-reduce:(transform-none transition-none)',
            app.menuMode === item.value
              ? 'border-primary shadow-[0_6px_18px_rgb(var(--w-color-primary)_/_15%)]'
              : 'border-color-1',
          ]"
        >
          <img
            :src="item.img"
            :alt="`${item.label}菜单预览`"
            class="h-full w-full pointer-events-none select-none object-cover"
            draggable="false"
          />
          <span
            v-if="app.menuMode === item.value"
            class="absolute right-5 top-5 size-18 flex items-center justify-center rounded-full bg-primary text-white shadow-[0_3px_8px_rgb(var(--w-color-primary)_/_28%)]"
          >
            <Icon name="i-lucide:check" :size="12" />
          </span>
        </span>
        <span
          :class="[
            'mt-8 block truncate text-center text-sm font-600 transition-colors duration-180 motion-reduce:transition-none',
            app.menuMode === item.value
              ? 'text-primary'
              : 'text-secondary group-hover:text-main',
          ]"
        >
          {{ item.label }}
        </span>
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { appStore } from '@/store'
import { MenuMode, type MenuModeType } from '@/constants'

const items = [
  {
    label: '垂直',
    value: MenuMode.Vertical,
    img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAACSBAMAAADcJrmuAAAAFVBMVEXy8vX6+vrd3d339/jx8fLu7vHj4+RfzH3aAAABXUlEQVRo3u2bwW3DMAxFCdgdgOAGBpqztIEPGqDoCNl/iDZBgVhpAsogJdvyfzeeHv4hMBlSBAAAAGR8XKeMyxfV5Ht64pNqcn3WXagm0z9oAXRrdbwAui50ka3ICt3A0Uwo10VhM1KuY452yn/mImxH0yEd0iHdlukii51y3eCQLpTrKIqZHX9eb0AH3Xl0fU9Ap9QpM4K46vQZIbjqorA9nmevQjqevQrSbZ+OF7im03VI10M6fUbw1OkzQvDU6TPCsT+vN6Bz040pzUrhqBvTL7NS+OnSHaVw043pzvy+OLIu/fG+gK7FHkHW6wZ2WCA02iOIa6+i49qr6CBdi3Q51dPlIF0P6Wx7BHrQYI8Q6EGDPcIR2loi6Hb+1zd00EGn7BFMiKqrfmuU43xrhJsHpEO6U6bjBfXS6XsEO5rO+dZI0+HWCLr9jCQd60oedxz36cqLhzkAAAC25QfLWMrPbjC6qQAAAABJRU5ErkJggg==',
  },
  {
    label: '水平',
    value: MenuMode.Horizontal,
    img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAACSBAMAAADcJrmuAAAAGFBMVEXy8vX4+Pjd3d36+vrx8fL09Pbu7vHj4+RNYWVgAAABPElEQVRo3u3XMUoEQRCFYQPHvCi8wAQaF7K5wRzAvoF4BO8fKI3giF3gMPPKWfi/rDfYx6MYuusGALDZ3fus9fi6jnub1R7Wcdpyvd46btYjjrgriXtamw/8iTjiiPt0is/8B+KIO0NcwcOv+Flb/WgHAOCXyWReBnHNQuV+EGduKjGK07WzQZzL2rkP27mI1baL2tnVtvPa2Vltu6idnZW289rZmQ3bNVG7iLgML6CQ6BcQvt0uy3N+EKT1f00Px1q6/CAo10tkh2uOW77kB+KI+2Pc+T+ESbHq5JpJVp1OtAHFhjgTrDo5d8mq02leYlbbLmpnV9vOa2dnte2idna17bx2drapXXPBqpObjFUHAPAPJsW2k2t2wLaj24BiZ5wJtp2c0452tKPdjnb7N6DL3gvIt2DbAQAg9wFGfUhczPxdQQAAAABJRU5ErkJggg==',
  },
  {
    label: '混合',
    value: MenuMode.Mix,
    img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAACSBAMAAADcJrmuAAAAFVBMVEXy8vX6+vrd3d3x8fL4+Pjf39/l5eb3qVelAAABVUlEQVRo3u2bUQqCQBRFB2wDA65AqG9h6L+2UNACgva/hUSC1FfdzPto1Hv+xvdxeILvPoQJQgghRlPcqh6XOniyrwacgyfXoW5nmp6AeV+nYXVrmp6AeV+2+myaxA7rThWPLdZVTP6qix2kW4huUMBP7CPpPHV9pFuIbhGJIN2ydP6rkd/iB0a041prdfylHejYSNci3ThdH+mky1x3jATKb3WbSOGAdaY5QntIF0msTtctSyeddA3sIZbniCYFUK7xavDXFSnV4EDUFamhBgeeLrWAA01XpJb6/WHOuvTg/UG6zyNaOqKO+iFg3cQAKn/UbUh5Sl0ecHveq9G4z1w66aRbjc5tiBl8R7RhUgDl9+tbOumky+hXQAjSSUcLIExJjVfMgbk8YEqsi0zWpOtWpJNOugaXIZbdiGYGUIbxygRcXTG4XsyxzPba0YtLVUIIkT93VIcamQMOVTAAAAAASUVORK5CYII=',
  },
  {
    label: '双列',
    value: MenuMode.Split,
    img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAACSBAMAAADcJrmuAAAAFVBMVEXy8vX4+Pjd3d36+vru7u7x8fLj4+QsU3hHAAABqElEQVRo3u2bUU6EMBRFO4n+c/N2QIzfEjdgjAvghw24/0VYh0xqqqFyaV+AueevXydnmikQHkEIIdqAxHX98NnfeH6rbrsg0YXIe594qq4DsrwYl/La6/qfSNdABxpGd4GRoPul+5hJuteZpIOBZACjw0BijM7YOoNRdcYBz7rrHnjuHeBZZxHHvUOE+JuzdUOE0LF751tn31B1xgCy7oKB3boX7gLEbt0RLq/SSbd0REsnnXSRc/zN96fDMoyOf75DV1cHwxKGyrpCXWWdFepMdaoj6tgjmqrjdaqrX1d+vrOuri4U6vZ886B7FemkW9ZNY7jxOGWLFrppTIJ80UI3hZkpki2a6MbUky9OoJvSz5cvKh/RSYf1sDruDRc6XgfDWgwbdETdBp0RdcbpRt+60bcusHXkEc3WcRcgz7q4pusoneoKdR5vuKzjdYGoO8CNn3Q7f5yUTjrpTn+q3L0O/2KXE4wF3cYJRkaHgcQI3aYJRqrOOOBbt2YKThOMy8C3bvCdPvWtM9+9A1FXaYKxrNMEo3R70v35Yc5RPzsqfFQlhBDCny+6r+IVe0J7SwAAAABJRU5ErkJggg==',
  },
]

const { app } = storeToRefs(appStore())

const onClick = (mode: MenuModeType) => {
  app.value.menuMode = mode
}
</script>
