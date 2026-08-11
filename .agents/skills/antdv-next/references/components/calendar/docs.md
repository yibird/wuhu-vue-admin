---
title: Calendar
description: A container that displays data in calendar form.
---

## When To Use 
When data is in the form of dates, such as schedules, timetables, prices calendar, lunar calendar. This component also supports Year/Month switch.

## Demos

| Demo | Path |
| --- | --- |
| Basic | demo/basic.md |
| Notice Calendar | demo/notice-calendar.md |
| Card | demo/card.md |
| Selectable Calendar | demo/select.md |
| Lunar Calendar | demo/lunar.md |
| Show Week | demo/week.md |
| Customize Header | demo/customize-header.md |
| Custom semantic dom styling | demo/style-class.md |

## API

### Props

Common props ref：[Common props](../../docs/vue/common-props.md)

| Property | Description | Type | Default | Version | [Global Config](../config-provider/docs.md#component-config) |
| --- | --- | --- | --- | --- | --- |
| prefixCls | - | string | - | - | × |
| rootClass | - | string | - | - | × |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | CalendarClassNamesType&lt;DateType&gt; | - | - | ✓ |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | CalendarStylesType&lt;DateType&gt; | - | - | ✓ |
| locale | The calendar's locale | typeof enUS | [(default)](https://github.com/ant-design/ant-design/blob/master../date-picker/docs.md/locale/example.json) | - | × |
| validRange | To set valid range | [DateType, DateType] | - | - | × |
| disabledDate | Function that specifies the dates that cannot be selected, `currentDate` is same dayjs object as `value` prop which you [shouldn't mutate it](https://github.com/ant-design/ant-design/issues/30987) | (date: DateType) =&gt; boolean | - | - | × |
| dateFullCellRender | Customize the display of the date cell, the returned content will override the cell | (date: DateType) =&gt; VueNode | - | - | × |
| dateCellRender | Deprecated. | (date: DateType) =&gt; VueNode | - | - | × |
| monthFullCellRender | Deprecated. | (date: DateType) =&gt; VueNode | - | - | × |
| monthCellRender | Deprecated. | (date: DateType) =&gt; VueNode | - | - | × |
| cellRender | Customize cell content | (date: DateType, info: any) =&gt; VueNode | - | - | × |
| fullCellRender | Customize cell content | (date: DateType, info: any) =&gt; VueNode | - | - | × |
| headerRender | Render custom header in panel | HeaderRender&lt;DateType&gt; | - | - | × |
| value | The current selected date, support `v-model:value` | DateType | - | - | × |
| defaultValue | The date selected by default | DateType | - | - | × |
| mode | The display mode of the calendar | CalendarMode | `month` | - | × |
| fullscreen | Whether to display in full-screen | boolean | true | - | × |
| showWeek | Whether to display week number | boolean | false | - | × |

### Events

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Callback for when date changes | (date: DateType) =&gt; void | - |
| update:value | - | (date: DateType) =&gt; void | - |
| panelChange | Callback for when panel changes | (date: DateType, mode: CalendarMode) =&gt; void | - |
| select | Callback for when a date is selected, include source info | (date: DateType, selectInfo: SelectInfo) =&gt; void | - |

### Slots

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| dateFullCellRender | Customize the display of the date cell, the returned content will override the cell | (ctx: &#123; date: AnyObject &#125;) =&gt; any | - |
| dateCellRender | - | (ctx: &#123; date: AnyObject &#125;) =&gt; any | - |
| monthFullCellRender | - | (ctx: &#123; date: AnyObject &#125;) =&gt; any | - |
| monthCellRender | - | (ctx: &#123; date: AnyObject &#125;) =&gt; any | - |
| cellRender | Customize cell content | (ctx: &#123; date: AnyObject, info: any &#125;) =&gt; any | - |
| fullCellRender | Customize cell content | (ctx: &#123; date: AnyObject, info: any &#125;) =&gt; any | - |
| headerRender | Render custom header in panel | (config: &#123; value: AnyObject, type: CalendarMode, onChange: (date: AnyObject) =&gt; void, onTypeChange: (type: CalendarMode) =&gt; void &#125;) =&gt; any | - |

## Semantic DOM 

| _semantic | demo/_semantic.md |
