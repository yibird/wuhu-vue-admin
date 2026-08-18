<template>
  <div
    class="workbench-skeleton min-h-full min-w-0 w-full flex flex-col gap-12 overflow-x-hidden p-12 lg:p-16"
  >
    <section
      class="workbench-skeleton__toolbar min-w-0 flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between"
    >
      <div class="min-w-0">
        <a-skeleton-input active class="!h-26 !w-72" />
      </div>

      <div class="flex flex-wrap items-center gap-8">
        <a-skeleton-button active class="!w-92" />
        <a-skeleton-button active class="!w-92" />
        <a-skeleton-button active shape="square" />
      </div>
    </section>

    <section
      class="workbench-skeleton__overview overflow-hidden rounded-4 border-1 border-color-2 border-solid bg-container"
    >
      <div class="grid gap-0 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div class="min-w-0 p-16 sm:p-20">
          <div class="flex flex-col gap-14 sm:flex-row sm:items-center">
            <a-skeleton-avatar active :size="54" class="shrink-0" />
            <div class="min-w-0 flex-1">
              <a-skeleton active :title="false" :paragraph="{ rows: 1 }" />
              <a-skeleton
                active
                class="mt-4"
                :title="false"
                :paragraph="{ rows: 1, width: '88%' }"
              />
            </div>
          </div>

          <div class="mt-18 flex flex-wrap items-center gap-8">
            <a-skeleton-button active class="!w-92" />
            <a-skeleton-button active class="!w-92" />
            <a-skeleton-button active class="!w-92" />
          </div>
        </div>

        <div
          class="grid grid-cols-2 border-color-2 border-t-1 border-t-solid sm:grid-cols-4 lg:grid-cols-2 lg:border-l-1 lg:border-l-solid lg:border-t-0"
        >
          <div
            v-for="item in 4"
            :key="item"
            class="min-w-0 border-color-2 border-r-1 border-b-1 border-r-solid border-b-solid p-14 sm:last:border-r-0 lg:nth-2:border-r-0 lg:nth-last-2:border-b-0 lg:last:border-b-0"
          >
            <div class="flex items-center justify-between gap-10">
              <a-skeleton-input active size="small" class="!w-72" />
              <a-skeleton-avatar active size="small" />
            </div>
            <a-skeleton-input active class="mt-10 !w-58" />
            <a-skeleton-input active size="small" class="mt-6 !w-84" />
          </div>
        </div>
      </div>
    </section>

    <a-row :gutter="[{ xs: 0, sm: 12, md: 12, lg: 12 }, 12]">
      <a-col :xs="24" :sm="24" :md="24" :lg="16" :xl="17" :xxl="17">
        <div class="flex flex-col gap-12">
          <section
            class="workbench-skeleton__section workbench-skeleton__projects min-w-0 overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container"
          >
            <div class="p-12">
              <div class="grid grid-cols-1 gap-10 p-12 xl:grid-cols-2">
                <article
                  v-for="item in 4"
                  :key="item"
                  class="workbench-skeleton__project-item min-w-0 overflow-hidden rounded-8 border-1 border-color-2 border-solid p-14"
                >
                  <div class="min-w-0 flex items-start justify-between gap-12">
                    <div class="min-w-0 flex items-center gap-10">
                      <a-skeleton-avatar active :size="46" class="shrink-0" />
                      <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-8">
                          <a-skeleton-input active class="!w-100" />
                          <a-skeleton-input active size="small" class="!w-56" />
                        </div>
                        <a-skeleton
                          active
                          class="mt-4"
                          :title="false"
                          :paragraph="{ rows: 2, width: ['100%', '76%'] }"
                        />
                      </div>
                    </div>
                    <a-skeleton-button active shape="square" size="small" />
                  </div>

                  <div class="mt-16">
                    <div class="mb-6 flex items-center justify-between gap-10">
                      <a-skeleton-input active size="small" class="!w-64" />
                      <a-skeleton-input active size="small" class="!w-40" />
                    </div>
                    <a-skeleton-input active class="!h-7 !w-full" />
                  </div>

                  <div class="mt-14 flex items-center justify-between gap-10">
                    <a-skeleton-input active size="small" class="!w-124" />
                    <a-skeleton-input active size="small" class="!w-96" />
                  </div>

                  <div class="mt-14 flex items-center justify-between gap-12">
                    <div class="flex items-center gap-3">
                      <a-skeleton-avatar
                        v-for="member in 3"
                        :key="member"
                        active
                        :size="28"
                      />
                    </div>
                    <a-skeleton-input active size="small" class="!w-96" />
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section
            class="workbench-skeleton__section workbench-skeleton__dynamic min-w-0 overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container"
          >
            <div class="p-12">
              <div class="flex flex-col p-12">
                <div
                  v-for="item in 4"
                  :key="item"
                  class="flex gap-20 rounded-4 px-8 py-12"
                >
                  <a-skeleton-avatar active :size="34" class="shrink-0" />
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-8">
                      <a-skeleton-input active size="small" class="!w-52" />
                      <a-skeleton-input active size="small" class="!w-44" />
                      <a-skeleton-input active size="small" class="!w-104" />
                    </div>
                    <a-skeleton
                      active
                      class="mt-4"
                      :title="false"
                      :paragraph="{ rows: 1, width: '92%' }"
                    />
                    <div class="mt-4 flex items-center gap-6">
                      <a-skeleton-input active size="small" class="!w-72" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            class="workbench-skeleton__section workbench-skeleton__data-analysis min-w-0 overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container"
          >
            <div class="p-12">
              <div class="p-12">
                <div class="grid grid-cols-2 gap-8">
                  <div
                    v-for="item in 2"
                    :key="item"
                    class="rounded-8 bg-fill-tertiary p-10"
                  >
                    <a-skeleton-input active size="small" class="!w-84" />
                    <a-skeleton-input active class="mt-6 !w-72" />
                    <a-skeleton-input active size="small" class="mt-4 !w-56" />
                  </div>
                </div>

                <div class="mt-16">
                  <div class="mb-10 flex items-center justify-between gap-10">
                    <a-skeleton-input active size="small" class="!w-104" />
                    <a-skeleton-input active size="small" class="!w-76" />
                  </div>
                  <div class="flex flex-col gap-10">
                    <div v-for="item in 4" :key="item">
                      <div class="mb-5 flex items-center justify-between gap-8">
                        <a-skeleton-input active size="small" class="!w-72" />
                        <a-skeleton-input active size="small" class="!w-40" />
                      </div>
                      <a-skeleton-input active class="!h-7 !w-full" />
                    </div>
                  </div>
                </div>

                <div
                  class="mt-16 flex items-center gap-8 rounded-8 border-1 border-color-2 border-solid p-12"
                >
                  <a-skeleton-avatar active size="small" class="shrink-0" />
                  <div class="min-w-0 flex-1">
                    <a-skeleton-input active size="small" class="!w-72" />
                    <a-skeleton-input active size="small" class="mt-4 !w-180" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </a-col>

      <a-col :xs="24" :sm="24" :md="24" :lg="8" :xl="7" :xxl="7">
        <div class="flex flex-col gap-12">
          <section
            class="workbench-skeleton__section workbench-skeleton__action min-w-0 overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container"
          >
            <div class="p-12">
              <div
                class="grid grid-cols-2 gap-8 p-12 sm:grid-cols-4 lg:grid-cols-2"
              >
                <div
                  v-for="item in 5"
                  :key="item"
                  class="min-w-0 rounded-8 border-1 border-color-2 border-solid p-12"
                >
                  <a-skeleton-avatar active :size="34" />
                  <a-skeleton-input active class="mt-10 !w-84" />
                  <a-skeleton-input active size="small" class="mt-4 !w-104" />
                </div>
              </div>
            </div>
          </section>

          <section
            class="workbench-skeleton__section workbench-skeleton__announcement min-w-0 overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container"
          >
            <div
              class="h-56 flex items-center justify-between gap-12 border-color-2 border-b-1 border-b-solid px-24"
            >
              <div class="flex items-center gap-8">
                <a-skeleton-input active class="!w-96" />
                <a-skeleton-input active size="small" class="!w-56" />
              </div>
              <a-skeleton-button active size="small" class="!w-72" />
            </div>
            <div class="p-12">
              <div class="flex flex-col gap-5">
                <div
                  v-for="item in 4"
                  :key="item"
                  class="flex items-start gap-10 rounded-6 px-8 py-10"
                >
                  <a-skeleton-avatar active :size="32" class="shrink-0" />
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-6">
                      <a-skeleton-input active size="small" class="!w-5" />
                      <a-skeleton-input active size="small" class="!w-160" />
                    </div>
                    <a-skeleton-input
                      active
                      size="small"
                      class="mt-4 !w-full"
                    />
                    <div class="mt-7 flex items-center gap-7">
                      <a-skeleton-input active size="small" class="!w-44" />
                      <a-skeleton-input active size="small" class="!w-76" />
                    </div>
                  </div>
                  <a-skeleton-input active size="small" class="mt-8 !w-12" />
                </div>
              </div>
              <div class="border-color-2 border-t-1 border-t-solid px-12 py-10">
                <a-skeleton-input active size="small" class="!w-120" />
              </div>
            </div>
          </section>

          <section
            class="workbench-skeleton__section workbench-skeleton__team min-w-0 overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container"
          >
            <div class="p-12">
              <div class="p-12">
                <div v-for="item in 3" :key="item" class="rounded-8 p-10">
                  <div class="flex items-start gap-10">
                    <a-skeleton-avatar active :size="38" class="shrink-0" />
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center justify-between gap-8">
                        <a-skeleton-input active size="small" class="w-104" />
                        <a-skeleton-input active size="small" class="w-64" />
                      </div>
                      <a-skeleton-input
                        active
                        size="small"
                        class="mt-4 !w-180"
                      />
                      <div class="mt-9 flex items-center gap-8">
                        <a-skeleton-input active class="!h-6 flex-1" />
                        <a-skeleton-input active size="small" class="!w-36" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
.workbench-skeleton__toolbar {
  min-height: 38px;
}

.workbench-skeleton__overview {
  height: 239px;
}

.workbench-skeleton__projects {
  height: 466px;
}

.workbench-skeleton__dynamic {
  height: 394px;
}

.workbench-skeleton__data-analysis {
  height: 457px;
}

.workbench-skeleton__action {
  height: 384px;
}

.workbench-skeleton__announcement {
  height: 507px;
}

.workbench-skeleton__team {
  height: 287px;
}

.workbench-skeleton__project-item {
  height: 203px;
}

@media (width <= 1279px) {
  .workbench-skeleton__projects {
    height: 866px;
  }

  .workbench-skeleton__project-item:nth-child(n + 3) {
    height: 190px;
  }
}

@media (width <= 991px) {
  .workbench-skeleton__toolbar {
    min-height: 84px;
  }

  .workbench-skeleton__overview {
    height: 282px;
  }

  .workbench-skeleton__action {
    height: 270px;
  }

  .workbench-skeleton__announcement {
    height: 451px;
  }
}

@media (width <= 639px) {
  .workbench-skeleton__overview {
    height: 529px;
  }

  .workbench-skeleton__projects {
    height: 988px;
  }

  .workbench-skeleton__project-item,
  .workbench-skeleton__project-item:nth-child(n + 3) {
    height: 227px;
  }

  .workbench-skeleton__dynamic {
    height: 466px;
  }

  .workbench-skeleton__action {
    height: 384px;
  }

  .workbench-skeleton__announcement {
    height: 507px;
  }
}

@media (width >= 1536px) {
  .workbench-skeleton__projects {
    height: 453px;
  }

  .workbench-skeleton__project-item:nth-child(n + 3) {
    height: 190px;
  }

  .workbench-skeleton__announcement {
    height: 451px;
  }
}
</style>
