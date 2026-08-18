import { MenuMode, ThemeMode } from '@/constants'

export const themeModeOptions = [
  {
    label: '亮色',
    value: ThemeMode.Light,
    img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAACSBAMAAADcJrmuAAAAD1BMVEXy8vX////29vj9/f34+Pox8uq3AAABTElEQVRo3u2VwW3EMAwEhcs1QKuBE5QCYlfg9N9UcjHyMUQQtlaASOz89jWwzCUTIYQQQgghhJCUPleBo9ueYoDVrTIAwMdBdEUMsLpvGQHg10F0ojBat6VU9YDWbe9Q9YDV5dc7PFY9QHXLkYoeoLqvI33oAap7HemhB6juP+qBull19qh4LoJdc89LzFzRvg/QH3GvOXXUzahLWKhrQB111P0SS1elj+2S7im97Fd0RXpZruhW6SVf0Uk/E+sAjznxqACKMHHNG0TamWeoo24OXe1sccJe8x2qK/YGtoAeoAzViYlnnf2YnkfFLoLnmjeItDPPUEfdHLoqd9igS8xmR65omwV5gGwy9LzauNDdfkwXo3K7CC5q3iDSzjxDHXVz6GpHj4FLbB+iKx07GHmA8hCdqETQ6Y8ZYVT0IkSoeYNIO/MMddQN1v0AFy9OBRBx85QAAAAASUVORK5CYII=',
  },
  {
    label: '暗色',
    value: ThemeMode.Dark,
    img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAACSBAMAAADcJrmuAAAAG1BMVEUnJyo/P0ZSUlxKSlNOTlc5OT8vLzJDQ0s0NDkX0J24AAABYElEQVRo3u2XMWrEMBBFVW47LM4BHEPqTZPeN3CzvQtD6uQCzs1j4lRGw2DPF2jEf900eqxW/w9OhBBCCCGEEEJS+pwEjm67iQFWN0kBHD8OqpvFAKv7kRI4/jqoThx4dN/j8KEPaN2933joA1g39huDPmB19/6Phz5AdV/7oW/6ANW974e+6gNUN+6HDvoA1fX/6ENknX2ZkZ+KHYTIMTdLLHZFGwso+nqljjrqJGGhLgN11FG30ZZuER/PU7qbeFnP6Gbx8nJGN4mX7oxO/FSsA1xmxU8FEISKY56hpc48Qh11degWZ4oTdpuvUN1sN7AFdAF1UJ2YRNbZlxn5qdhBiBzzDC115hHqqKtDt8gVntASs1mxFe1qbvznZAddrzYhdJcvM8RTuRyEEDHP0FJnHqGOujp0iyPHwBJbi+hmRwcjF1BXRCcqLej0y2zhqehBaCHmGVrqzCPUUVdY9wter4K58MOVTQAAAABJRU5ErkJggg==',
  },
  {
    label: '系统',
    value: ThemeMode.Auto,
    img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAACSBAMAAADcJrmuAAAAJFBMVEXy8vUREREzMzP////4+Pr19fgcHBz8/P0rKysyMjIwMDAjIyPGISqaAAABlElEQVRo3u3XsUoEMRAGYItdrNMc1hZhY5t7AMHCduEE67MSKyG+gM09iIX9vqFeooRwhGGTIZfk/umm+iA3/8ztVWKJtAIHDhw4cODAgQMHDhy4Orkno+N1m1ZxbdC6JGeKcoMuyu3Kcg9lOVOW02fiPubx8aSx3EGIV25u639I31juW/zWGzM3H5sxaBx3tz9ymy9Wbuvn1DeWk8LWCyv37rrroLHcp+NuWLl71w1BY7m94zas3Oy6MWgsJ/6Klftvg6Ybjn7MlkeFDkLLMaeXWNMrmjhArZ9XcODAaebPSXDgwIG7BO45b0WrwypuyL4Iyxpul83JNZzJ5qY1nM7mVMUcw2NWPCoMQag45p3vTHDg6uQiMfcppor3mi8kxLqiJStnKG5i5TTFqZY5+jFbHhU6CC3HvPOdCQ5cnVzCn/Yw/UW+zRfOFU2X5DxAdE2c55Uu1QSX/JhNjEpyEJqIeec7Exy4OrnTmIc5LvRtvpAA64qWJMB6gCYSYD2vqgcu/pg9jEo8CD3EvPOdCQ5cYe4H2qWIxMTt67gAAAAASUVORK5CYII=',
  },
]

export const themeColorOptions = [
  { label: '天空蓝', value: '24, 144, 255' },
  { label: '优雅紫', value: '90, 84, 249' },
  { label: '活力橙', value: '255, 103, 0' },
  { label: '葡萄紫', value: '158, 51, 159' },
  { label: '玫瑰粉', value: '237, 65, 146' },
  { label: '珊瑚红', value: '224, 40, 46' },
  { label: '落日黄', value: '242, 189, 39' },
  { label: '森林绿', value: '0, 185, 107' },
  { label: '湖水青', value: '0, 174, 185' },
  { label: '极光青', value: '54, 207, 201' },
  { label: '青柠绿', value: '82, 196, 26' },
  { label: '深海蓝', value: '0, 82, 204' },
  { label: '皇家蓝', value: '47, 84, 235' },
  { label: '莓果红', value: '196, 29, 72' },
  { label: '胭脂红', value: '207, 19, 34' },
  { label: '琥珀金', value: '250, 173, 20' },
  { label: '火山橙', value: '250, 84, 28' },
  { label: '薄荷青', value: '19, 194, 194' },
  { label: '明亮青柠', value: '160, 217, 17' },
  { label: '深紫罗兰', value: '114, 46, 209' },
] as const

export const menuModeOptions = [
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
