<template>
  <div>
    <n-divider>主题模式</n-divider>
    <div class="grid grid-cols-3 gap-20">
      <div v-for="item in items" :key="item.value" class="cursor-pointer">
        <div
          :class="[
            'border-solid border-3 rounded-4 box-border overflow-hidden shadow-md transition',
            themeMode === item.value
              ? 'border-color-primary'
              : 'border-color-transparent',
          ]"
          @click="changeThemeMode(item.value)"
        >
          <img :src="item.img" class="w-full h-60 select-none" />
        </div>
        <div class="mt-10 text-center text-sm">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useTheme } from '@/theme'
import { ThemeMode } from '@/constant'

const { themeMode, changeThemeMode } = useTheme()
const items = [
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
</script>
