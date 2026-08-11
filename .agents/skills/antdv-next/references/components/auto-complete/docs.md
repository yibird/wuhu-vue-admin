---
title: AutoComplete
description: Autocomplete function of input field.
---

## When To Use 
- When you need an input box instead of a selector.
- When you need input suggestions or helping text.

The differences with Select are:

- AutoComplete is an input box with text hints, and users can type freely. The keyword is aiding **input**.
- Select is selecting among given choices. The keyword is **select**.

## Demos

| Demo | Path |
| --- | --- |
| Basic Usage | demo/basic.md |
| Customized Options | demo/options.md |
| Custom Input Component | demo/custom.md |
| Non-case-sensitive AutoComplete | demo/non-case-sensitive.md |
| Lookup-Patterns - Certain Category | demo/certain-category.md |
| Lookup-Patterns - Uncertain Category | demo/uncertain-category.md |
| Status | demo/status.md |
| Variants | demo/variant.md |
| Customize clear button | demo/allowClear.md |
| Custom semantic dom styling | demo/style-class.md |
| Disabled custom input debug | demo/disabled-custom-debug.md |

## API

### Props

Common props ref：[Common props](../../docs/vue/common-props.md)

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| allowClear | Show clear button | boolean \| &#123; clearIcon?: VueNode &#125; | false | - | × |
| backfill | If backfill selected item the input when using keyboard | boolean | false | - | × |
| defaultActiveFirstOption | Whether active first option by default | boolean | true | - | × |
| disabled | Whether disabled select | boolean | false | - | × |
| getPopupContainer | Parent node of the dropdown. Default to body, if you encountered positioning problems during scroll, try changing to the scrollable area and position relative to it | (triggerNode: HTMLElement) =&gt; HTMLElement | () =&gt; document.body | - | × |
| labelRender | Customize selected label render | (props: LabelInValueType) =&gt; VueNode | - | - | × |
| notFoundContent | Specify content to show when no result matches | VueNode | - | - | × |
| open | Controlled open state of dropdown | boolean | - | - | × |
| options | Select options. Will get better perf than jsx definition | &#123; label: VueNode; value: string &#125;[] | - | - | × |
| optionRender | Customize the rendering dropdown options | (option: FlattenOptionData&lt;BaseOptionType&gt;, info: &#123; index: number &#125;) =&gt; VueNode | - | - | × |
| placeholder | The placeholder of input | string | - | - | × |
| popupMatchSelectWidth | Determine whether the dropdown menu and the select input are the same width. Default set `min-width` same as input. Will ignore when value less than select width. `false` will disable virtual scroll | boolean \| number | true | - | × |
| popupRender | Customize dropdown content | (menu: VueNode) =&gt; VueNode | - | - | × |
| showSearch | Search configuration | boolean \| [SearchConfig](#showsearch) | true | - | × |
| size | The size of the input box | `large` \| `middle` \| `small` | - | - | × |
| status | Set validation status | `error` \| `warning` | - | - | × |
| value | Selected option, support `v-model:value` | string | - | - | × |
| variant | Variants of input | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | - | × |
| virtual | Disable virtual scroll when set to false | boolean | true | - | × |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| blur | Called when blur | (e: FocusEvent) =&gt; void | - |
| change | Called when selecting an option or changing input value | (value: string) =&gt; void | - |
| clear | Called when clear | () =&gt; void | - |
| focus | Called when focus | (e: FocusEvent) =&gt; void | - |
| inputKeydown | Called when key pressed | (e: KeyboardEvent) =&gt; void | - |
| openChange | Called when dropdown open | (open: boolean) =&gt; void | - |
| popupScroll | Called when dropdown scrolls | (e: UIEvent) =&gt; void | - |
| search | Called when searching items | (value: string) =&gt; void | - |
| select | Called when an option is selected, the params are option's value (or key) and option instance | (value: string, option: Option) =&gt; void | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| default | Customize input element, or provide `AutoComplete.Option` children | () =&gt; VueNode | - |
| labelRender | Customize selected label render | (props: LabelInValueType) =&gt; VueNode | - |
| notFoundContent | Specify content to show when no result matches | () =&gt; VueNode | - |
| optionRender | Customize the rendering dropdown options | (option: FlattenOptionData&lt;BaseOptionType&gt;, info: &#123; index: number &#125;) =&gt; VueNode | - |
| popupRender | Customize dropdown content | (menu: VueNode) =&gt; VueNode | - |
| prefix | The custom prefix | () =&gt; VueNode | - |
| suffixIcon | The custom suffix icon | () =&gt; VueNode | - |

## Types

### showSearch

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| filterOption | If true, filter options by input, if function, filter options against it. The function will receive two arguments, `inputValue` and `option`, if the function returns true, the option will be included in the filtered set; Otherwise, it will be excluded | boolean \| (inputValue: string, option?: Option) =&gt; boolean | true | - |
| onSearch | Called when searching items | (value: string) =&gt; void | - | - |

## Semantic DOM

| _semantic | demo/_semantic.md |

## FAQ

### Why doesn't the text composition system work well with onSearch in controlled mode? 
Please use `onChange` to manage control state. `onSearch` is used for searching input which is not the same as `onChange`. Besides, clicking on the option will not trigger the `onSearch` event.

Related issue: [#18230](https://github.com/ant-design/ant-design/issues/18230) [#17916](https://github.com/ant-design/ant-design/issues/17916)

### Why won't a controlled open AutoComplete display a drop-down menu when options are empty? 
The AutoComplete component is essentially an extension of the Input form element. When the `options` property is empty, displaying empty text could mislead the user into believing the component is not operational, when in fact they are still able to input text. To avoid confusion, the `open` property will not display the drop-down menu when set to `true` and in combination with an empty `options` property. The `open` property must be used in conjunction with the `options` property.
