import {
  computed,
  shallowRef,
  watch,
  type ComputedRef,
  type ShallowRef,
} from 'vue'
import {
  ALL_ICON_CATEGORY,
  FREQUENT_ICON_CATEGORY,
  getIconCategoryIcon,
  iconCategoryDefinitions,
  isFrequentIcon,
} from './data'
import type { IconCategoryItem, IconSelectorOption } from './types'

export interface UseIconCategoriesReturn {
  activeCategory: ShallowRef<string>
  activeCategoryItem: ComputedRef<IconCategoryItem | undefined>
  categoryItems: ComputedRef<IconCategoryItem[]>
  visibleOptions: ComputedRef<IconSelectorOption[]>
}

const categoryLabelMap = new Map(
  iconCategoryDefinitions.map((category) => [category.key, category.label])
)

/**
 * Shares category derivation between the Select and Modal presentations.
 * Keeping the active category here also lets a search that removes the
 * current category fall back to the complete icon list consistently.
 */
export function useIconCategories(
  filteredOptions: ComputedRef<IconSelectorOption[]>,
  showCategories: () => boolean
): UseIconCategoriesReturn {
  const activeCategory = shallowRef(ALL_ICON_CATEGORY)

  const categoryItems = computed<IconCategoryItem[]>(() => {
    const counts = new Map<string, number>()
    let frequentCount = 0

    for (const option of filteredOptions.value) {
      const key = option.category ?? 'other'
      counts.set(key, (counts.get(key) ?? 0) + 1)
      if (isFrequentIcon(option.value)) frequentCount += 1
    }

    const items: IconCategoryItem[] = [
      {
        count: filteredOptions.value.length,
        icon: getIconCategoryIcon(ALL_ICON_CATEGORY),
        key: ALL_ICON_CATEGORY,
        label: '全部图标',
      },
    ]

    if (frequentCount > 0) {
      items.push({
        count: frequentCount,
        icon: getIconCategoryIcon(FREQUENT_ICON_CATEGORY),
        key: FREQUENT_ICON_CATEGORY,
        label: '常用图标',
      })
    }

    for (const category of iconCategoryDefinitions) {
      const count = counts.get(category.key) ?? 0
      if (count === 0) continue

      items.push({
        ...category,
        count,
        icon: getIconCategoryIcon(category.key),
      })
      counts.delete(category.key)
    }

    for (const [key, count] of counts) {
      items.push({
        count,
        icon: getIconCategoryIcon(key),
        key,
        label: categoryLabelMap.get(key) ?? key,
      })
    }

    return items
  })

  const visibleOptions = computed(() => {
    if (!showCategories() || activeCategory.value === ALL_ICON_CATEGORY) {
      return filteredOptions.value
    }
    if (activeCategory.value === FREQUENT_ICON_CATEGORY) {
      return filteredOptions.value.filter((option) =>
        isFrequentIcon(option.value)
      )
    }
    return filteredOptions.value.filter(
      (option) => (option.category ?? 'other') === activeCategory.value
    )
  })

  const activeCategoryItem = computed(
    () =>
      (!showCategories()
        ? categoryItems.value[0]
        : categoryItems.value.find(
            (category) => category.key === activeCategory.value
          )) ?? categoryItems.value[0]
  )

  watch(categoryItems, (items) => {
    if (!items.some((category) => category.key === activeCategory.value)) {
      activeCategory.value = ALL_ICON_CATEGORY
    }
  })

  return {
    activeCategory,
    activeCategoryItem,
    categoryItems,
    visibleOptions,
  }
}
