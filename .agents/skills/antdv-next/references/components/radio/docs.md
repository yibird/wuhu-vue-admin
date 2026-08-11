---
title: Radio
description: Used to select a single state from multiple options.
---

## When To Use

- Used to select a single state from multiple options.
- The difference from Select is that Radio is visible to the user and can facilitate the comparison of choice, which means there shouldn't be too many of them.

```vue
<script lang="ts" setup>
import { ref } from 'vue'

const value = ref()
</script>

<template>
  <!-- When use RadioGroup, recommended ✅ -->
  <a-radio-group
    v-model:value="value"
    :options="[
      { value: 1, label: 'A' },
      { value: 2, label: 'B' },
      { value: 3, label: 'C' },
    ]"
  />
  <!--  No recommended 🙅🏻‍♀️  -->
  <a-radio-group v-model:value="value">
    <a-radio :value="1">
      A
    </a-radio>
    <a-radio :value="2">
      B
    </a-radio>
    <a-radio :value="3">
      C
    </a-radio>
  </a-radio-group>
</template>
```

## Examples

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| disabled | demo/disabled.md |
| Radio Group | demo/radiogroup.md |
| Vertical Radio.Group | demo/radiogroup-more.md |
| Block Radio.Group | demo/radiogroup-block.md |
| Radio.Group group - optional | demo/radiogroup-options.md |
| radio style | demo/radiobutton.md |
| Radio.Group with name | demo/radiogroup-with-name.md |
| Size | demo/size.md |
| Solid radio button | demo/radiobutton-solid.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Radio/RadioButton

#### Props 
| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| checked | Specifies whether the radio is selected, support `v-model:checked` | boolean | false |  | × |
| disabled | Disable radio | boolean | false |  | × |
| value | According to value for comparison, to determine whether the selected | any | - |  | × |

#### Methods 
| Name    | Description  |
| ------- | ------------ |
| blur()  | Remove focus |
| focus() | Get focus    |

### RadioGroup

Radio group can wrap a group of `Radio`.

#### Props 
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| block | Option to fit RadioGroup width to its parent width | boolean | false | - |
| buttonStyle | The style type of radio button | `outline` \| `solid` | `outline` |  |
| defaultValue | Default selected value | any | - |  |
| disabled | Disable all radio buttons | boolean | false |  |
| name | The `name` property of all `input[type="radio"]` children. If not set, it will fallback to a randomly generated name | string | - |  |
| options | Set children optional | string\[] \| number\[] \| Array&lt;[CheckboxOptionType](#checkboxoptiontype)> | - |  |
| optionType | Set Radio optionType | `default` \| `button` | `default` | - |
| orientation | Orientation | `horizontal` \| `vertical` | `horizontal` |  |
| size | The size of radio button style | `large` \| `middle` \| `small` | - |  |
| value | Used for setting the currently selected value, support `v-model:value` | any | - |  |
| vertical | If true, the Radio group will be vertical. Simultaneously existing with `orientation`, `orientation` takes priority | boolean | false |  |

#### Events 
| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | The callback function that is triggered when the state changes  | (e: RadioChangeEvent) =&gt; void | - |

#### Slots 
| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| labelRender | label render slot | (params: &#123; item: CheckboxOptionType, index: number &#125;) =&gt; any | - |

## Types

### CheckboxOptionType

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| label | The text used to display as the Radio option | `string` | - | - |
| value | The value associated with the Radio option | `string` \| `number` \| `boolean` | - | - |
| style | The style to apply to the Radio option | `CSSProperties` | - | - |
| class | class of the Radio option | `string` | - | - |
| disabled | Specifies whether the Radio option is disabled | `boolean` | `false` | - |
| title | Adds the Title attribute value | `string` | - | - |
| id | Adds the Radio Id attribute value | `string` | - | - |
| onChange | Triggered when the value of the Radio Group changes | `(e: CheckboxChangeEvent) => void;` | - | - |
| required | Specifies whether the Radio option is required | `boolean` | `false` | - |

## Semantic DOM

| _semantic | demo/_semantic.md |
