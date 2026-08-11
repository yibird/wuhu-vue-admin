---
title: TimePicker
description: To select/input a time.
---

## When To Use

By clicking the input box, you can select a time from a popup panel.

## Examples

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Under Control | demo/value.md |
| Value Format | demo/value-format.md |
| Three Sizes | demo/size.md |
| Need Confirm | demo/need-confirm.md |
| disabled | demo/disabled.md |
| Hour and minute | demo/hide-column.md |
| interval option | demo/interval-options.md |
| Addon | demo/addon.md |
| 12 hours | demo/12hours.md |
| Change on scroll | demo/change-on-scroll.md |
| Time Range Picker | demo/range-picker.md |
| Variants | demo/variant.md |
| Status | demo/status.md |
| Prefix and Suffix | demo/suffix.md |
| Custom semantic dom styling | demo/style-class.md |

## API

Common props ref：[Common props](../../docs/vue/common-props.md)

### TimePicker

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| allowClear | Customize clear icon | boolean \| \{ clearIcon?: VueNode \} | true | 5.8.0: Support object type | ✓ |
| cellRender | Custom rendering function for picker cells | (current: number, info: \{ originNode: VueNode, today: dayjs, range?: 'start' \| 'end', subType: 'hour' \| 'minute' \| 'second' \| 'meridiem' \}) => VueNode | - | 5.4.0 | × |
| changeOnScroll | Trigger selection when scroll the column | boolean | false | 5.14.0 | × |
| defaultValue | To set default time | [dayjs](http://day.js.org/) | - |  | × |
| disabled | Determine whether the TimePicker is disabled | boolean | false |  | × |
| disabledTime | To specify the time that cannot be selected | [DisabledTime](#disabledtime) | - | 4.19.0 | × |
| format | To set the time format | string | `HH:mm:ss` |  | × |
| valueFormat | Set the binding value format. After setting, `value`, `defaultValue`, and `v-model:value` can use formatted strings, and `change` returns strings in the same format. Demo: [Value Format](#time-picker-demo-value-format) | string | - |  | × |
| getPopupContainer | To set the container of the floating layer, while the default is to create a div element in body | function(trigger) | - |  | × |
| hideDisabledOptions | Whether hide the options that can not be selected | boolean | false |  | × |
| hourStep | Interval between hours in picker | number | 1 |  | × |
| inputReadOnly | Set the `readonly` attribute of the input tag (avoids virtual keyboard on touch devices) | boolean | false |  | × |
| minuteStep | Interval between minutes in picker | number | 1 |  | × |
| needConfirm | Need click confirm button to trigger value change | boolean | - | 5.14.0 | × |
| open | Whether to popup panel | boolean | false |  | × |
| placeholder | Display when there's no value | string \| \[string, string] | `Select a time` |  | × |
| placement | The position where the selection box pops up | `bottomLeft` `bottomRight` `topLeft` `topRight` | bottomLeft |  | × |
| ~~popupClassName~~ | The className of panel, please use `classes.popup` instead | string | - |  | × |
| ~~popupStyle~~ | The style of panel, please use `styles.popup` instead | CSSProperties | - |  | × |
| prefix | The custom prefix | VueNode | - | 5.22.0 | × |
| previewValue | When the user selects the time hover option, the value of the input field undergoes a temporary change | false \| hover | hover | 6.0.0 | × |
| renderExtraFooter | Called from time picker panel to render some addon to its bottom | () => VueNode | - |  | × |
| secondStep | Interval between seconds in picker | number | 1 |  | × |
| showNow | Whether to show `Now` button on panel | boolean | - | 4.4.0 | × |
| size | To determine the size of the input box, the height of `large` and `small`, are 40px and 24px respectively, while default size is 32px | `large` \| `middle` \| `small` | - |  | × |
| status | Set validation status | 'error' \| 'warning' \| 'success' \| 'validating' | - | 4.19.0 | × |
| suffixIcon | The custom suffix icon | VueNode | - |  | ✓ |
| use12Hours | Display as 12 hours format, with default format `h:mm:ss a` | boolean | false |  | × |
| value | To set time, support `v-model:value` | [dayjs](http://day.js.org/) | - |  | × |
| variant | Variants of picker | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | 5.13.0 \| `underlined`: 5.24.0 | ✓ |
| onChange | A callback function, can be executed when the selected time is changing | function(time: dayjs, timeString: string): void | - |  | × |
| onOpenChange | A callback function which will be called while panel opening/closing | (open: boolean) => void | - |  | × |

#### DisabledTime

```typescript
type DisabledTime = (now: Dayjs) => {
  disabledHours?: () => number[]
  disabledMinutes?: (selectedHour: number) => number[]
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[]
  disabledMilliseconds?: (
    selectedHour: number,
    selectedMinute: number,
    selectedSecond: number,
  ) => number[]
}
```

Note: `disabledMilliseconds` is added in `5.14.0`.

## Methods

| Name    | Description  | Version |
| ------- | ------------ | ------- |
| blur()  | Remove focus |         |
| focus() | Get focus    |         |

### RangePicker

Same props from [RangePicker](../date-picker/docs.md/#rangepicker) of DatePicker. And includes additional props:

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| disabledTime | To specify the time that cannot be selected | [RangeDisabledTime](#rangedisabledtime) | - | 4.19.0 |
| order | Order start and end time | boolean | true | 4.1.0 |

### RangeDisabledTime

```typescript
type RangeDisabledTime = (
  now: Dayjs,
  type = 'start' | 'end',
) => {
  disabledHours?: () => number[]
  disabledMinutes?: (selectedHour: number) => number[]
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[]
}
```

## Semantic DOM

| _semantic | demo/_semantic.md |

## FAQ

- [How to use TimePicker with customize date library like dayjs](../../docs/vue/use-custom-date-library.md#timepicker)
