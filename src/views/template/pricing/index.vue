<template>
  <div class="min-h-screen bg-page">
    <!-- Header -->
    <header class="bg-white border-b border-[#eee]">
      <div
        class="max-w-1200 mx-auto px-24 py-15 flex items-center justify-between"
      >
        <div class="flex items-center gap-10">
          <Icon
            name="i-lucide:layout-template"
            :size="24"
            class="text-primary"
          />
          <span class="text-lg font-600 text-main">定价方案</span>
        </div>
        <nav class="flex items-center gap-20">
          <span
            class="text-sm text-regular cursor-pointer hover:text-main transition-colors"
            >功能</span
          >
          <span
            class="text-sm text-regular cursor-pointer hover:text-main transition-colors"
            >方案</span
          >
          <span
            class="text-sm text-regular cursor-pointer hover:text-main transition-colors"
            >常见问题</span
          >
          <n-button type="primary" size="small">开始使用</n-button>
        </nav>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="py-60 px-24">
      <div class="max-w-800 mx-auto text-center">
        <h1 class="text-3xl font-700 text-main mb-15">简单透明的定价</h1>
        <p class="text-base text-regular mb-30">
          选择最适合您团队规模的方案，所有方案均包含 14 天免费试用
        </p>

        <!-- Billing Toggle -->
        <div class="flex items-center justify-center gap-15">
          <span :class="isYearly ? 'text-regular' : 'text-main font-500'"
            >月付</span
          >
          <n-switch v-model:value="isYearly" />
          <span :class="isYearly ? 'text-main font-500' : 'text-regular'">
            年付
            <n-tag v-if="isYearly" size="small" type="success">省 20%</n-tag>
          </span>
        </div>
      </div>
    </section>

    <!-- Pricing Cards -->
    <section class="px-24 pb-60">
      <div class="max-w-1200 mx-auto">
        <div class="grid grid-cols-3 gap-20">
          <!-- Free Plan -->
          <div
            class="bg-white rounded-12 border border-[#eee] p-28 flex flex-col"
          >
            <div class="mb-20">
              <h3 class="text-lg font-600 text-main mb-8">免费版</h3>
              <p class="text-sm text-regular">适合个人学习使用</p>
            </div>
            <div class="mb-24">
              <span class="text-3xl font-700 text-main">¥0</span>
              <span class="text-sm text-regular">/永久</span>
            </div>
            <n-button type="default" block class="mb-24">免费开始</n-button>
            <ul class="flex-1">
              <li
                class="flex items-center gap-10 text-sm text-regular py-10 border-t border-placeholder first:border-t-0"
              >
                <Icon
                  name="i-lucide:check"
                  :size="16"
                  class="text-success shrink-0"
                />
                最多 3 个项目
              </li>
              <li
                class="flex items-center gap-10 text-sm text-regular py-10 border-t border-placeholder"
              >
                <Icon
                  name="i-lucide:check"
                  :size="16"
                  class="text-success shrink-0"
                />
                1GB 存储空间
              </li>
              <li
                class="flex items-center gap-10 text-sm text-regular py-10 border-t border-placeholder"
              >
                <Icon
                  name="i-lucide:check"
                  :size="16"
                  class="text-success shrink-0"
                />
                基础数据分析
              </li>
              <li
                class="flex items-center gap-10 text-sm text-regular py-10 border-t border-placeholder"
              >
                <Icon
                  name="i-lucide:check"
                  :size="16"
                  class="text-success shrink-0"
                />
                社区支持
              </li>
            </ul>
          </div>

          <!-- Pro Plan -->
          <div
            class="bg-white rounded-12 border-2 border-primary p-28 flex flex-col relative"
          >
            <div
              class="absolute -top-12 left-1/2 -translate-x-1/2 px-12 py-4 bg-primary text-white text-xs rounded-full"
            >
              最受欢迎
            </div>
            <div class="mb-20">
              <h3 class="text-lg font-600 text-main mb-8">专业版</h3>
              <p class="text-sm text-regular">适合中小团队</p>
            </div>
            <div class="mb-24">
              <span class="text-3xl font-700 text-main"
                >¥{{ isYearly ? '199' : '249' }}</span
              >
              <span class="text-sm text-regular"
                >/{{ isYearly ? '年' : '月' }}</span
              >
            </div>
            <n-button type="primary" block class="mb-24">立即升级</n-button>
            <ul class="flex-1">
              <li
                class="flex items-center gap-10 text-sm text-regular py-10 border-t border-placeholder first:border-t-0"
              >
                <Icon
                  name="i-lucide:check"
                  :size="16"
                  class="text-success shrink-0"
                />
                无限项目
              </li>
              <li
                class="flex items-center gap-10 text-sm text-regular py-10 border-t border-placeholder"
              >
                <Icon
                  name="i-lucide:check"
                  :size="16"
                  class="text-success shrink-0"
                />
                100GB 存储空间
              </li>
              <li
                class="flex items-center gap-10 text-sm text-regular py-10 border-t border-placeholder"
              >
                <Icon
                  name="i-lucide:check"
                  :size="16"
                  class="text-success shrink-0"
                />
                高级数据分析
              </li>
              <li
                class="flex items-center gap-10 text-sm text-regular py-10 border-t border-placeholder"
              >
                <Icon
                  name="i-lucide:check"
                  :size="16"
                  class="text-success shrink-0"
                />
                优先邮件支持
              </li>
              <li
                class="flex items-center gap-10 text-sm text-regular py-10 border-t border-placeholder"
              >
                <Icon
                  name="i-lucide:check"
                  :size="16"
                  class="text-success shrink-0"
                />
                API 访问权限
              </li>
              <li
                class="flex items-center gap-10 text-sm text-regular py-10 border-t border-placeholder"
              >
                <Icon
                  name="i-lucide:check"
                  :size="16"
                  class="text-success shrink-0"
                />
                自定义品牌
              </li>
            </ul>
          </div>

          <!-- Enterprise Plan -->
          <div
            class="bg-white rounded-12 border border-[#eee] p-28 flex flex-col"
          >
            <div class="mb-20">
              <h3 class="text-lg font-600 text-main mb-8">企业版</h3>
              <p class="text-sm text-regular">适合大型组织</p>
            </div>
            <div class="mb-24">
              <span class="text-3xl font-700 text-main">定制</span>
            </div>
            <n-button type="default" block class="mb-24">联系销售</n-button>
            <ul class="flex-1">
              <li
                class="flex items-center gap-10 text-sm text-regular py-10 border-t border-placeholder first:border-t-0"
              >
                <Icon
                  name="i-lucide:check"
                  :size="16"
                  class="text-success shrink-0"
                />
                无限一切
              </li>
              <li
                class="flex items-center gap-10 text-sm text-regular py-10 border-t border-placeholder"
              >
                <Icon
                  name="i-lucide:check"
                  :size="16"
                  class="text-success shrink-0"
                />
                无限存储空间
              </li>
              <li
                class="flex items-center gap-10 text-sm text-regular py-10 border-t border-placeholder"
              >
                <Icon
                  name="i-lucide:check"
                  :size="16"
                  class="text-success shrink-0"
                />
                SSO 单点登录
              </li>
              <li
                class="flex items-center gap-10 text-sm text-regular py-10 border-t border-placeholder"
              >
                <Icon
                  name="i-lucide:check"
                  :size="16"
                  class="text-success shrink-0"
                />
                SLA 保障
              </li>
              <li
                class="flex items-center gap-10 text-sm text-regular py-10 border-t border-placeholder"
              >
                <Icon
                  name="i-lucide:check"
                  :size="16"
                  class="text-success shrink-0"
                />
                专属客户成功经理
              </li>
              <li
                class="flex items-center gap-10 text-sm text-regular py-10 border-t border-placeholder"
              >
                <Icon
                  name="i-lucide:check"
                  :size="16"
                  class="text-success shrink-0"
                />
                私有化部署
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Feature Comparison -->
    <section class="px-24 pb-60">
      <div class="max-w-1200 mx-auto">
        <h2 class="text-xl font-600 text-main text-center mb-30">功能对比</h2>
        <div class="bg-white rounded-12 border border-[#eee] overflow-hidden">
          <!-- Table Header -->
          <div class="grid grid-cols-4 bg-page border-b border-[#eee]">
            <div class="p-15 font-500 text-sm text-main">功能</div>
            <div class="p-15 font-500 text-sm text-main text-center">
              免费版
            </div>
            <div
              class="p-15 font-500 text-sm text-primary text-center bg-primary/5"
            >
              专业版
            </div>
            <div class="p-15 font-500 text-sm text-main text-center">
              企业版
            </div>
          </div>
          <!-- Rows -->
          <div
            v-for="(feature, index) in features"
            :key="feature.name"
            class="grid grid-cols-4 border-b border-placeholder last:border-b-0"
            :class="{ 'bg-page/50': index % 2 === 1 }"
          >
            <div class="p-15 text-sm text-regular">{{ feature.name }}</div>
            <div class="p-15 text-center text-sm">
              <span v-if="typeof feature.free === 'string'" class="text-sm">{{
                feature.free
              }}</span>
              <Icon
                v-else-if="feature.free"
                name="i-lucide:check"
                :size="16"
                class="text-success inline"
              />
              <span v-else class="text-placeholder">-</span>
            </div>
            <div class="p-15 text-center text-sm bg-primary/5">
              <span v-if="typeof feature.pro === 'string'" class="text-sm">{{
                feature.pro
              }}</span>
              <Icon
                v-else-if="feature.pro"
                name="i-lucide:check"
                :size="16"
                class="text-success inline"
              />
              <span v-else class="text-placeholder">-</span>
            </div>
            <div class="p-15 text-center text-sm">
              <span
                v-if="typeof feature.enterprise === 'string'"
                class="text-sm"
                >{{ feature.enterprise }}</span
              >
              <Icon
                v-else-if="feature.enterprise"
                name="i-lucide:check"
                :size="16"
                class="text-success inline"
              />
              <span v-else class="text-placeholder">-</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="px-24 pb-60">
      <div class="max-w-800 mx-auto">
        <h2 class="text-xl font-600 text-main text-center mb-30">常见问题</h2>
        <div class="flex flex-col gap-12">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="bg-white rounded-8 border border-[#eee] overflow-hidden"
          >
            <button
              class="w-full p-15 flex items-center justify-between text-left"
              @click="toggleFaq(index)"
            >
              <span class="text-sm font-500 text-main">{{ faq.question }}</span>
              <Icon
                :name="
                  openFaqIndex === index
                    ? 'i-lucide:chevron-up'
                    : 'i-lucide:chevron-down'
                "
                :size="16"
                class="text-regular shrink-0"
              />
            </button>
            <div
              v-if="openFaqIndex === index"
              class="px-15 pb-15 text-sm text-regular leading-relaxed"
            >
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="px-24 pb-60">
      <div class="max-w-800 mx-auto bg-primary/5 rounded-12 p-48 text-center">
        <h2 class="text-xl font-600 text-main mb-8">准备好开始了吗？</h2>
        <p class="text-sm text-regular mb-24">加入数千个团队，使用我们的平台</p>
        <div class="flex items-center justify-center gap-10">
          <n-button type="primary" size="large">免费试用 14 天</n-button>
          <n-button size="large">预约演示</n-button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-[#eee] py-20 px-24">
      <div class="max-w-1200 mx-auto flex items-center justify-between">
        <div class="flex items-center gap-10 text-sm text-regular">
          <Icon
            name="i-lucide:layout-template"
            :size="18"
            class="text-primary"
          />
          <span>© 2024 Your Company. All rights reserved.</span>
        </div>
        <div class="flex items-center gap-20">
          <span
            class="text-sm text-regular cursor-pointer hover:text-main transition-colors"
            >隐私政策</span
          >
          <span
            class="text-sm text-regular cursor-pointer hover:text-main transition-colors"
            >服务条款</span
          >
          <span
            class="text-sm text-regular cursor-pointer hover:text-main transition-colors"
            >联系我们</span
          >
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isYearly = ref(false)
const openFaqIndex = ref<number | null>(null)

const features = [
  { name: '项目数量', free: '3 个', pro: '无限', enterprise: '无限' },
  { name: '存储空间', free: '1 GB', pro: '100 GB', enterprise: '无限' },
  { name: '团队成员', free: '1 人', pro: '10 人', enterprise: '无限' },
  { name: 'API 访问', free: false, pro: true, enterprise: true },
  { name: '自定义域名', free: false, pro: true, enterprise: true },
  { name: '高级分析', free: false, pro: true, enterprise: true },
  { name: '优先支持', free: false, pro: true, enterprise: true },
  { name: 'SSO 单点登录', free: false, pro: false, enterprise: true },
  { name: '私有化部署', free: false, pro: false, enterprise: true },
]

const faqs = [
  {
    question: '免费试用需要信用卡吗？',
    answer:
      '不需要。注册后即可直接使用全部功能，无需绑定信用卡。试用期满后如需继续使用，再选择合适的付费方案。',
  },
  {
    question: '我可以随时更换方案吗？',
    answer:
      '可以。您可以随时升级或降级您的方案。升级时将按剩余时间比例退还差价，降级时将自动延期您的订阅。',
  },
  {
    question: '年付可以退款吗？',
    answer:
      '在订阅开始后的 30 天内，如您不满意可以申请全额退款。超过 30 天后，将按剩余月份比例计算退款金额。',
  },
  {
    question: '企业版有什么特殊支持？',
    answer:
      '企业版客户享有专属客户成功经理、7x24 小时技术支持、SLA 服务保障，以及私有化部署选项。',
  },
  {
    question: '如何获取教育或非营利组织优惠？',
    answer:
      '教育机构和非营利组织可享受 50% 的年付折扣。请联系我们的销售团队并提供相应的资质证明。',
  },
]

function toggleFaq(index: number) {
  openFaqIndex.value = openFaqIndex.value === index ? null : index
}
</script>
