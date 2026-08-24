<template>
  <div class="h-full overflow-hidden rounded-4 bg-container" aria-busy="true">
    <div
      class="grid grid-cols-[260px_100px_150px_180px_160px_100px_180px_120px] border-b-1 border-color-2 border-b-solid px-12 py-14"
    >
      <a-skeleton-input
        v-for="item in 8"
        :key="item"
        active
        size="small"
        class="!w-72"
      />
    </div>
    <div
      v-for="row in 8"
      :key="row"
      class="grid min-w-1150 grid-cols-[260px_100px_150px_180px_160px_100px_180px_120px] items-center border-b-1 border-color-2 border-b-solid px-12 py-14"
    >
      <a-skeleton-input
        v-for="cell in 8"
        :key="cell"
        active
        size="small"
        class="!w-76"
      />
    </div>
  </div>
</template>
