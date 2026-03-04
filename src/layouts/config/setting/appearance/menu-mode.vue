<template>
  <div>
    <n-divider>菜单模式</n-divider>
    <div class="grid grid-cols-3 gap-20">
      <div v-for="item in items" :key="item.value" class="cursor-pointer">
        <div
          :class="[
            'border-solid border-3 rounded-4 box-border overflow-hidden shadow-md transition',
            app.menuMode === item.value
              ? 'border-color-primary'
              : 'border-color-transparent',
          ]"
          @click="onClick(item.value)"
        >
          <img
            :src="item.img"
            class="w-full h-60 pointer-events-none select-none"
          />
        </div>
        <div class="mt-10 text-center text-sm">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { appStore } from '@/store'
import { MenuMode, type MenuModeType } from '@/constant'

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
