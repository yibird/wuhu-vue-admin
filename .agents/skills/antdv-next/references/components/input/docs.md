---
title: Input
description: Through mouse or keyboard input content, it is the most basic form field wrapper.
---

## When To Use 
- A user input in a form field is needed.
- A search input is required.

## Demos

| Demo | Path |
| --- | --- |
| Basic usage | demo/basic.md |
| Three sizes of Input | demo/size.md |
| Variants | demo/variant.md |
| Compact Style | demo/compact-style.md |
| Search box | demo/search-input.md |
| Search box with loading | demo/search-input-loading.md |
| TextArea | demo/textarea.md |
| Autosizing the height to fit the content | demo/autosize-textarea.md |
| OTP | demo/otp.md |
| Format Tooltip Input | demo/tooltip.md |
| prefix and suffix | demo/presuffix.md |
| Password box | demo/password-input.md |
| With clear icon | demo/allowClear.md |
| With character counting | demo/show-count.md |
| Custom count logic | demo/advance-count.md |
| Status | demo/status.md |
| Focus | demo/focus.md |
| Custom semantic dom styling | demo/style-class.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### Input

#### Props 
| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| allowClear | If allow to remove input content with clear icon | boolean \| &#123; clearIcon: VueNode &#125; | false | - | ✓ |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | Record&lt;[SemanticDOM](#semantic-input), string&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-input), string&gt; | - | - | ✓ |
| count | Character count config | [CountConfig](#countconfig) | - | - | × |
| defaultValue | The initial input content | string | - | - | × |
| disabled | Whether the input is disabled | boolean | false | - | × |
| id | The ID for input | string | - | - | × |
| maxlength | The maximum number of characters in Input | number | - | - | × |
| prefix | The prefix icon for the Input | VueNode | - | - | × |
| showCount | Whether to show character count | boolean \| &#123; formatter: (info: &#123; value: string, count: number, maxLength?: number &#125;) =&gt; VueNode &#125; | false | - | × |
| status | Set validation status | 'error' \| 'warning' | - | - | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record&lt;[SemanticDOM](#semantic-input), CSSProperties&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-input), CSSProperties&gt; | - | - | ✓ |
| size | The size of the input box. Note: in the context of a form, the `middle` size is used | `large` \| `middle` \| `small` | - | - | × |
| suffix | The suffix icon for the Input | VueNode | - | - | × |
| type | The type of input, see: [MDN](https://developer.mozilla.org/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types)( use `Input.TextArea` instead of `type="textarea"`) | string | `text` | - | × |
| value | The input content value, support `v-model:value` | string | - | - | × |
| variant | Variants of Input | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | - | ✓ |

> When `Input` is used in a `Form.Item` context, if the `Form.Item` has the `id` props defined then `value`, `defaultValue`, and `id` props of `Input` are automatically set.

The rest of the props of Input are exactly the same as the original [input](https://cn.vuejs.org/guide/essentials/forms.html).

#### Events 
| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Callback when user input | function(e) | - |
| pressEnter | The callback function that is triggered when Enter key is pressed | function(e) | - |
| clear | Callback when click the clear button | () =&gt; void | - |

#### Methods 
| Name | Description | Parameters | Version |
| --- | --- | --- | --- |
| blur | Remove focus | - | - |
| focus | Get focus | (option?: &#123; preventScroll?: boolean, cursor?: 'start' \| 'end' \| 'all' &#125;) | - |

#### Slots 
| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| prefix | Customize prefix icon | - | - |
| suffix | Customize suffix icon | - | - |
| clearIcon | Customize clear icon (to be used with allowClear attribute) | - | - |

### TextArea 
#### Props 
Same as Input, and more:

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| autoSize | Height auto size feature, can be set to true \| false or an object &#123; minRows: 2, maxRows: 6 &#125; | boolean \| object | false | - | × |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | Record&lt;[SemanticDOM](#semantic-textarea), string&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-textarea), string&gt; | - | - | ✓ |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record&lt;[SemanticDOM](#semantic-textarea), CSSProperties&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-textarea), CSSProperties&gt; | - | - | ✓ |

The rest of the props of `Input.TextArea` are the same as the original [textarea](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea).

### InputSearch 
#### Props 
| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | Record&lt;[SemanticDOM](#semantic-search), string&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-search), string&gt; | - | - | ✓ |
| enterButton | false displays the default button color, true uses the primary color, or you can provide a custom button. Conflicts with addonAfter. | VueNode | false | - | × |
| loading | Search box with loading | boolean | false | - | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record&lt;[SemanticDOM](#semantic-search), CSSProperties&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-search), CSSProperties&gt; | - | - | ✓ |

Supports all props of `Input`.

#### Events 
| Event | Description | Type | Version |
| --- | --- | --- | --- |
| search | The callback function triggered when you click on the search-icon, the clear-icon or press the Enter key | function(value, event, &#123; source: "input" \| "clear" &#125;) | - |

### InputPassword 
#### Props 
| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| classes | Semantic DOM class | Record&lt;[SemanticDOM](#semantic-password), string&gt; | - | - |
| iconRender | Custom toggle button | (visible) =&gt; VueNode | (visible) =&gt; (visible ? &lt;EyeOutlined /> : &lt;EyeInvisibleOutlined />) | - |
| styles | Semantic DOM style | Record&lt;[SemanticDOM](#semantic-password), CSSProperties&gt; | - | - |
| visibilityToggle | Whether show toggle button or control password visible | boolean \| [VisibilityToggle](#visibilitytoggle) | true | - |

### InputOTP 
Added in `5.16.0`.

> Notes for developers
>
> When the `mask` prop is string, we recommend receiving a single character or a single emoji. If multiple characters or multiple emoji are passed, a warning will be thrown.

#### Props 
| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | Record&lt;[SemanticDOM](#semantic-otp), string&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-otp), string&gt; | - | - | ✓ |
| defaultValue | Default value | string | - | - | × |
| disabled | Whether the input is disabled | boolean | false | - | × |
| formatter | Format display, blank fields will be filled with ` ` | (value: string) =&gt; string | - | - | × |
| separator | render the separator after the input box of the specified index | VueNode \| ((i: number) =&gt; VueNode) | - | - | × |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | Record&lt;[SemanticDOM](#semantic-otp), CSSProperties&gt; \| (info: &#123; props &#125;) =&gt; Record&lt;[SemanticDOM](#semantic-otp), CSSProperties&gt; | - | - | ✓ |
| mask | Custom display, the original value will not be modified | boolean \| string | `false` | - | × |
| length | The number of input elements | number | 6 | - | × |
| status | Set validation status | 'error' \| 'warning' | - | - | × |
| size | The size of the input box | `small` \| `middle` \| `large` | `middle` | - | × |
| variant | Variants of Input | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | - | ✓ |
| value | The input content value | string | - | - | × |

#### Events 
| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Trigger when all the fields are filled | (value: string) =&gt; void | - |
| input | Trigger when the input value changes | (value: string[]) =&gt; void | - |

### Types 
#### CountConfig

```tsx
interface CountConfig {
  // Max character count. Different from the native `maxLength`, it will be marked warning but not truncated
  max?: number
  // Custom character count, for example, the standard emoji length is greater than 1, you can customize the counting strategy to change it to 1
  strategy?: (value: string) => number
  // Same as `showCount`
  show?: boolean | ((args: { value: string, count: number, maxLength?: number }) => VueNode)
  // Custom clipping logic when the number of characters exceeds `count.max`, no clipping when not configured
  exceedFormatter?: (value: string, config: { max: number }) => string
}
```

#### VisibilityToggle

```tsx
interface VisibilityToggle {
  // tabIndex of the visibility toggle button (1.4.0)
  tabIndex?: number
  // Whether the password is show or hide
  visible?: boolean
  // Callback executed when visibility of the password is changed
  onVisibleChange?: (visible: boolean) => void
}
```

## Semantic DOM

### Input 
| _semantic | demo/_semantic.md |

### TextArea 
| _semantic-textarea | demo/_semantic-textarea.md |

### InputSearch 
| _semantic-search | demo/_semantic-search.md |

### InputPassword 
| _semantic-password | demo/_semantic-password.md |

### InputOTP 
| _semantic-otp | demo/_semantic-otp.md |
