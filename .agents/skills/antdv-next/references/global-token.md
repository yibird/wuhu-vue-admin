# Global Theme Tokens

Use these variables through `ConfigProvider` `theme.token` to define global Design Tokens. This table lists definitions only and does not include values.

```vue
<a-config-provider
  :theme="{
    token: {
      // Global token configuration
    },
  }"
>
  ...
</a-config-provider>
```

## Token List

| Token | Type | Source | Description |
| --- | --- | --- | --- |
| `colorPrimary` | `string` | Seed | Brand color is one of the most direct visual elements to reflect the characteristics and communication of the product. After you have selected the brand color, we will automatically generate a complete color palette and assign it effective design semantics. |
| `colorSuccess` | `string` | Seed | Used to represent the token sequence of operation success, such as Result, Progress and other components will use these map tokens. |
| `colorWarning` | `string` | Seed | Used to represent the warning map token, such as Notification, Alert, etc. Alert or Control component(like Input) will use these map tokens. |
| `colorError` | `string` | Seed | Used to represent the visual elements of the operation failure, such as the error Button, error Result component, etc. |
| `colorInfo` | `string` | Seed | Used to represent the operation information of the Token sequence, such as Alert, Tag, Progress, and other components use these map tokens. |
| `colorTextBase` | `string` | Seed | Used to derive the base variable of the text color gradient. In v5, we added a layer of text color derivation algorithm to produce gradient variables of text color gradient. But please do not use this Seed Token directly in the code! |
| `colorBgBase` | `string` | Seed | Used to derive the base variable of the background color gradient. In v5, we added a layer of background color derivation algorithm to produce map token of background color. But PLEASE DO NOT USE this Seed Token directly in the code! |
| `colorLink` | `string` | Seed | Control the color of hyperlink. |
| `fontFamily` | `string` | Seed | The font family of Ant Design prioritizes the default interface font of the system, and provides a set of alternative font libraries that are suitable for screen display to maintain the readability and readability of the font under different platforms and browsers, reflecting the friendly, stable and professional characteristics. |
| `fontFamilyCode` | `string` | Seed | Code font, used for code, pre and kbd elements in Typography |
| `fontSize` | `number` | Seed | The most widely used font size in the design system, from which the text gradient will be derived. |
| `lineWidth` | `number` | Seed | Border width of base components |
| `lineType` | `string` | Seed | Border style of base components |
| `borderRadius` | `number` | Seed | Border radius of base components |
| `sizeUnit` | `number` | Seed | The unit of size change, in Ant Design, our base unit is 4, which is more fine-grained control of the size step |
| `sizeStep` | `number` | Seed | The base step of size change, the size step combined with the size change unit, can derive various size steps. By adjusting the step, you can get different layout modes, such as the size step of the compact mode of V5 is 2 |
| `sizePopupArrow` | `number` | Seed | The size of the component arrow |
| `controlHeight` | `number` | Seed | The height of the basic controls such as buttons and input boxes in Ant Design |
| `zIndexBase` | `number` | Seed | The base Z axis value of all components, which can be used to control the level of some floating components based on the Z axis value, such as BackTop, Affix, etc. |
| `zIndexPopupBase` | `number` | Seed | Base zIndex of component like FloatButton, Affix which can be cover by large popup |
| `opacityImage` | `number` | Seed | Control image opacity |
| `motionUnit` | `number` | Seed | The unit of animation duration change |
| `motionBase` | `number` | Seed | Animation Base Duration. |
| `motionEaseOutCirc` | `string` | Seed | Preset motion curve. |
| `motionEaseInOutCirc` | `string` | Seed | Preset motion curve. |
| `motionEaseInOut` | `string` | Seed | Preset motion curve. |
| `motionEaseOutBack` | `string` | Seed | Preset motion curve. |
| `motionEaseInBack` | `string` | Seed | Preset motion curve. |
| `motionEaseInQuint` | `string` | Seed | Preset motion curve. |
| `motionEaseOutQuint` | `string` | Seed | Preset motion curve. |
| `motionEaseOut` | `string` | Seed | Preset motion curve. |
| `wireframe` | `boolean` | Seed | Used to change the visual effect of the component to wireframe, if you need to use the V4 effect, you need to enable the configuration item |
| `motion` | `boolean` | Seed | Used to configure the motion effect, when it is `false`, the motion is turned off |
| `blue` | `color` | Seed | Preset blue color |
| `purple` | `color` | Seed | Preset purple color |
| `cyan` | `color` | Seed | Preset cyan color |
| `green` | `color` | Seed | Preset green color |
| `magenta` | `color` | Seed | Preset magenta color |
| `pink` | `color` | Seed | Preset pink color |
| `red` | `color` | Seed | Preset red color |
| `orange` | `color` | Seed | Preset orange color |
| `yellow` | `color` | Seed | Preset yellow color |
| `volcano` | `color` | Seed | Preset volcano color |
| `geekblue` | `color` | Seed | Preset geekblue color |
| `lime` | `color` | Seed | Preset lime color |
| `gold` | `color` | Seed | Preset gold color |
| `colorWhite` | `string` | Map | Pure white color don't changed by theme |
| `colorBgMask` | `string` | Map | The background color of the mask, used to cover the content below the mask, Modal, Drawer and other components use this token |
| `colorText` | `string` | Map | Default text color which comply with W3C standards, and this color is also the darkest neutral color. |
| `colorTextSecondary` | `string` | Map | The second level of text color is generally used in scenarios where text color is not emphasized, such as label text, menu text selection state, etc. |
| `colorTextTertiary` | `string` | Map | The third level of text color is generally used for descriptive text, such as form supplementary explanation text, list descriptive text, etc. |
| `colorTextQuaternary` | `string` | Map | The fourth level of text color is the lightest text color, such as form input prompt text, disabled color text, etc. |
| `colorBorder` | `string` | Map | Default border color, used to separate different elements, such as: form separator, card separator, etc. |
| `colorBorderSecondary` | `string` | Map | Slightly lighter than the default border color, this color is the same as `colorSplit`. Solid color is used. |
| `colorBorderDisabled` | `string` | Map | Control the border color of the element in the disabled state. |
| `colorFill` | `string` | Map | The darkest fill color is used to distinguish between the second and third level of fill color, and is currently only used in the hover effect of Slider. |
| `colorFillSecondary` | `string` | Map | The second level of fill color can outline the shape of the element more clearly, such as Rate, Skeleton, etc. It can also be used as the Hover state of the third level of fill color, such as Table, etc. |
| `colorFillTertiary` | `string` | Map | The third level of fill color is used to outline the shape of the element, such as Slider, Segmented, etc. If there is no emphasis requirement, it is recommended to use the third level of fill color as the default fill color. |
| `colorFillQuaternary` | `string` | Map | The weakest level of fill color is suitable for color blocks that are not easy to attract attention, such as zebra stripes, color blocks that distinguish boundaries, etc. |
| `colorBgLayout` | `string` | Map | This color is used for the background color of the overall layout of the page. This token will only be used when it is necessary to be at the B1 visual level in the page. Other usages are wrong. |
| `colorBgContainer` | `string` | Map | Container background color, e.g: default button, input box, etc. Be sure not to confuse this with `colorBgElevated`. |
| `colorBgElevated` | `string` | Map | Container background color of the popup layer, in dark mode the color value of this token will be a little brighter than `colorBgContainer`. E.g: modal, pop-up, menu, etc. |
| `colorBgSpotlight` | `string` | Map | This color is used to draw the user's strong attention to the background color, and is currently only used in the background color of Tooltip. |
| `colorBgBlur` | `string` | Map | Control the background color of frosted glass container, usually transparent. |
| `colorBgSolid` | `string` | Map | Solid background color, currently only used for the default solid button background color. |
| `colorBgSolidActive` | `string` | Map | Solid background color active state, currently only used in the active effect of the default solid button. |
| `colorBgSolidHover` | `string` | Map | Solid background color hover state, currently only used in the hover effect of the default solid button. |
| `colorPrimaryBg` | `string` | Map | Light background color of primary color, usually used for weak visual level selection state. |
| `colorPrimaryBgHover` | `string` | Map | The hover state color corresponding to the light background color of the primary color. |
| `colorPrimaryBorder` | `string` | Map | The stroke color under the main color gradient, used on the stroke of components such as Slider. |
| `colorPrimaryBorderHover` | `string` | Map | The hover state of the stroke color under the main color gradient, which will be used when the stroke Hover of components such as Slider and Button. |
| `colorPrimaryHover` | `string` | Map | Hover state under the main color gradient. |
| `colorPrimaryActive` | `string` | Map | Dark active state under the main color gradient. |
| `colorPrimaryTextHover` | `string` | Map | Hover state of text color under the main color gradient. |
| `colorPrimaryText` | `string` | Map | Text color under the main color gradient. |
| `colorPrimaryTextActive` | `string` | Map | Active state of text color under the main color gradient. |
| `colorSuccessBg` | `string` | Map | Light background color of success color, used for Tag and Alert success state background color |
| `colorSuccessBgHover` | `string` | Map | Light background color of success color, but antd does not use this token currently |
| `colorSuccessBorder` | `string` | Map | Border color of success color, used for Tag and Alert success state border color |
| `colorSuccessBorderHover` | `string` | Map | Hover state color of success color border |
| `colorSuccessHover` | `string` | Map | Hover state color of dark success color |
| `colorSuccessActive` | `string` | Map | Active state color of dark success color |
| `colorSuccessTextHover` | `string` | Map | Hover state color of success color text |
| `colorSuccessText` | `string` | Map | Default state color of success color text |
| `colorSuccessTextActive` | `string` | Map | Active state color of success color text |
| `colorWarningBg` | `string` | Map | The background color of the warning state. |
| `colorWarningBgHover` | `string` | Map | The hover state background color of the warning state. |
| `colorWarningBorder` | `string` | Map | The border color of the warning state. |
| `colorWarningBorderHover` | `string` | Map | The hover state border color of the warning state. |
| `colorWarningHover` | `string` | Map | The hover state of the warning color. |
| `colorWarningActive` | `string` | Map | The active state of the warning color. |
| `colorWarningTextHover` | `string` | Map | The hover state of the text in the warning color. |
| `colorWarningText` | `string` | Map | The default state of the text in the warning color. |
| `colorWarningTextActive` | `string` | Map | The active state of the text in the warning color. |
| `colorWarningAffix` | `string` | Map | The warning color used inside input affix areas; defaults to colorWarning. |
| `colorErrorBg` | `string` | Map | The background color of the error state. |
| `colorErrorBgHover` | `string` | Map | The hover state background color of the error state. |
| `colorErrorBgFilledHover` | `string` | Map | The wrong color fills the background color of the suspension state, which is currently only used in the hover effect of the dangerous filled button. |
| `colorErrorBgActive` | `string` | Map | The active state background color of the error state. |
| `colorErrorBorder` | `string` | Map | The border color of the error state. |
| `colorErrorBorderHover` | `string` | Map | The hover state border color of the error state. |
| `colorErrorHover` | `string` | Map | The hover state of the error color. |
| `colorErrorActive` | `string` | Map | The active state of the error color. |
| `colorErrorTextHover` | `string` | Map | The hover state of the text in the error color. |
| `colorErrorText` | `string` | Map | The default state of the text in the error color. |
| `colorErrorTextActive` | `string` | Map | The active state of the text in the error color. |
| `colorErrorAffix` | `string` | Map | The error color used inside input affix areas; defaults to colorError. |
| `colorInfoBg` | `string` | Map | Light background color of information color. |
| `colorInfoBgHover` | `string` | Map | Hover state of light background color of information color. |
| `colorInfoBorder` | `string` | Map | Border color of information color. |
| `colorInfoBorderHover` | `string` | Map | Hover state of border color of information color. |
| `colorInfoHover` | `string` | Map | Hover state of dark color of information color. |
| `colorInfoActive` | `string` | Map | Active state of dark color of information color. |
| `colorInfoTextHover` | `string` | Map | Hover state of text color of information color. |
| `colorInfoText` | `string` | Map | Default state of text color of information color. |
| `colorInfoTextActive` | `string` | Map | Active state of text color of information color. |
| `colorLinkHover` | `string` | Map | Control the color of hyperlink when hovering. |
| `colorLinkActive` | `string` | Map | Control the color of hyperlink when clicked. |
| `sizeXXL` | `number` | Map | Largest size |
| `sizeXL` | `number` | Map | Extra-large size |
| `sizeLG` | `number` | Map | Large size |
| `sizeMD` | `number` | Map | Medium-large size |
| `sizeMS` | `number` | Map | Same as `size`, but could be larger in compact mode |
| `size` | `number` | Map | Medium size |
| `sizeSM` | `number` | Map | Medium-small size |
| `sizeXS` | `number` | Map | Small size |
| `sizeXXS` | `number` | Map | Smallest size |
| `controlHeightXS` | `number` | Map | XS component height |
| `controlHeightSM` | `number` | Map | SM component height |
| `controlHeightLG` | `number` | Map | LG component height |
| `lineWidthBold` | `number` | Map | The default line width of the outline class components, such as Button, Input, Select, etc. |
| `borderRadiusXS` | `number` | Map | XS size border radius, used in some small border radius components, such as Segmented, Arrow and other components with small border radius. |
| `borderRadiusSM` | `number` | Map | SM size border radius, used in small size components, such as Button, Input, Select and other input components in small size |
| `borderRadiusLG` | `number` | Map | LG size border radius, used in some large border radius components, such as Card, Modal and other components. |
| `borderRadiusOuter` | `number` | Map | Outer border radius |
| `fontSizeSM` | `number` | Map | Small font size |
| `fontSizeLG` | `number` | Map | Large font size |
| `fontSizeXL` | `number` | Map | Super large font size |
| `fontSizeHeading1` | `string \| number` | Map | Font size of h1 tag. |
| `fontSizeHeading2` | `string \| number` | Map | Font size of h2 tag. |
| `fontSizeHeading3` | `string \| number` | Map | Font size of h3 tag. |
| `fontSizeHeading4` | `string \| number` | Map | Font size of h4 tag. |
| `fontSizeHeading5` | `string \| number` | Map | Font size of h5 tag. |
| `lineHeight` | `number` | Map | Line height of text. |
| `lineHeightLG` | `number` | Map | Line height of large text. |
| `lineHeightSM` | `number` | Map | Line height of small text. |
| `lineHeightHeading1` | `number` | Map | Line height of h1 tag. |
| `lineHeightHeading2` | `number` | Map | Line height of h2 tag. |
| `lineHeightHeading3` | `number` | Map | Line height of h3 tag. |
| `lineHeightHeading4` | `number` | Map | Line height of h4 tag. |
| `lineHeightHeading5` | `number` | Map | Line height of h5 tag. |
| `motionDurationFast` | `string` | Map | Motion speed, fast speed. Used for small element animation interaction. |
| `motionDurationMid` | `string` | Map | Motion speed, medium speed. Used for medium element animation interaction. |
| `motionDurationSlow` | `string` | Map | Motion speed, slow speed. Used for large element animation interaction. |
| `colorFillContentHover` | `string` | Alias | Control the style of background color of content area when mouse hovers over it. |
| `colorFillAlter` | `string` | Alias | Control the alternative background color of element. |
| `colorFillContent` | `string` | Alias | Control the background color of content area. |
| `colorBgContainerDisabled` | `string` | Alias | Control the background color of container in disabled state. |
| `colorBgTextHover` | `string` | Alias | Control the background color of text in hover state. |
| `colorBgTextActive` | `string` | Alias | Control the background color of text in active state. |
| `colorBorderBg` | `string` | Alias | Control the color of background border of element. |
| `colorSplit` | `string` | Alias | Used as the color of separator, this color is the same as colorBorderSecondary but with transparency. |
| `colorTextPlaceholder` | `string` | Alias | Control the color of placeholder text. |
| `colorTextDisabled` | `string` | Alias | Control the color of text in disabled state. |
| `colorTextHeading` | `string` | Alias | Control the font color of heading. |
| `colorTextLabel` | `string` | Alias | Control the font color of text label. |
| `colorTextDescription` | `string` | Alias | Control the font color of text description. |
| `colorTextLightSolid` | `string` | Alias | Control the highlight color of text with background color, such as the text in Primary Button components. |
| `colorIcon` | `string` | Alias | Weak action. Such as `allowClear` or Alert close button |
| `colorIconHover` | `string` | Alias | Weak action hover color. Such as `allowClear` or Alert close button |
| `colorHighlight` | `string` | Alias | Control the color of page element when highlighted. |
| `controlOutline` | `string` | Alias | Control the outline color of input component. |
| `colorWarningOutline` | `string` | Alias | Control the outline color of input component in warning state. |
| `colorErrorOutline` | `string` | Alias | Control the outline color of input component in error state. |
| `fontSizeIcon` | `number` | Alias | Control the font size of operation icon in Select, Cascader, etc. Normally same as fontSizeSM. |
| `fontWeightStrong` | `number` | Alias | Control the font weight of heading components (such as h1, h2, h3) or selected item. |
| `controlOutlineWidth` | `number` | Alias | Control the outline width of input component. |
| `controlItemBgHover` | `string` | Alias | Control the background color of control component item when hovering. |
| `controlItemBgActive` | `string` | Alias | Control the background color of control component item when active. |
| `controlItemBgActiveHover` | `string` | Alias | Control the background color of control component item when hovering and active. |
| `controlInteractiveSize` | `number` | Alias | Control the interactive size of control component. |
| `controlItemBgActiveDisabled` | `string` | Alias | Control the background color of control component item when active and disabled. |
| `lineWidthFocus` | `number` | Alias | Control the width of the line when the component is in focus state. |
| `paddingXXS` | `number` | Alias | Control the extra extra small padding of the element. |
| `paddingXS` | `number` | Alias | Control the extra small padding of the element. |
| `paddingSM` | `number` | Alias | Control the small padding of the element. |
| `padding` | `number` | Alias | Control the padding of the element. |
| `paddingMD` | `number` | Alias | Control the medium padding of the element. |
| `paddingLG` | `number` | Alias | Control the large padding of the element. |
| `paddingXL` | `number` | Alias | Control the extra large padding of the element. |
| `paddingContentHorizontalLG` | `number` | Alias | Control the horizontal padding of content element, suitable for large screen devices. |
| `paddingContentHorizontal` | `number` | Alias | Control the horizontal padding of content element. |
| `paddingContentHorizontalSM` | `number` | Alias | Control the horizontal padding of content element, suitable for small screen devices. |
| `paddingContentVerticalLG` | `number` | Alias | Control the vertical padding of content element, suitable for large screen devices. |
| `paddingContentVertical` | `number` | Alias | Control the vertical padding of content element. |
| `paddingContentVerticalSM` | `number` | Alias | Control the vertical padding of content element, suitable for small screen devices. |
| `marginXXS` | `number` | Alias | Control the margin of an element, with the smallest size. |
| `marginXS` | `number` | Alias | Control the margin of an element, with a small size. |
| `marginSM` | `number` | Alias | Control the margin of an element, with a medium-small size. |
| `margin` | `number` | Alias | Control the margin of an element, with a medium size. |
| `marginMD` | `number` | Alias | Control the margin of an element, with a medium-large size. |
| `marginLG` | `number` | Alias | Control the margin of an element, with a large size. |
| `marginXL` | `number` | Alias | Control the margin of an element, with an extra-large size. |
| `marginXXL` | `number` | Alias | Control the margin of an element, with the largest size. |
| `opacityLoading` | `number` | Alias | Control the opacity of the loading state. |
| `boxShadow` | `string` | Alias | Control the box shadow style of an element. |
| `boxShadowSecondary` | `string` | Alias | Control the secondary box shadow style of an element. |
| `boxShadowTertiary` | `string` | Alias | Control the tertiary box shadow style of an element. |
| `linkDecoration` | `CSSProperties` | Alias | Control the text decoration style of a link. |
| `linkHoverDecoration` | `CSSProperties` | Alias | Control the text decoration style of a link on mouse hover. |
| `linkFocusDecoration` | `CSSProperties` | Alias | Control the text decoration style of a link on focus. |
| `controlPaddingHorizontal` | `number` | Alias | Control the horizontal padding of an element. |
| `controlPaddingHorizontalSM` | `number` | Alias | Control the horizontal padding of an element with a small-medium size. |
| `screenXS` | `number` | Alias | Control the screen width of extra small screens. |
| `screenXSMin` | `number` | Alias | Control the minimum width of extra small screens. |
| `screenXSMax` | `number` | Alias | Control the maximum width of extra small screens. |
| `screenSM` | `number` | Alias | Control the screen width of small screens. |
| `screenSMMin` | `number` | Alias | Control the minimum width of small screens. |
| `screenSMMax` | `number` | Alias | Control the maximum width of small screens. |
| `screenMD` | `number` | Alias | Control the screen width of medium screens. |
| `screenMDMin` | `number` | Alias | Control the minimum width of medium screens. |
| `screenMDMax` | `number` | Alias | Control the maximum width of medium screens. |
| `screenLG` | `number` | Alias | Control the screen width of large screens. |
| `screenLGMin` | `number` | Alias | Control the minimum width of large screens. |
| `screenLGMax` | `number` | Alias | Control the maximum width of large screens. |
| `screenXL` | `number` | Alias | Control the screen width of extra large screens. |
| `screenXLMin` | `number` | Alias | Control the minimum width of extra large screens. |
| `screenXLMax` | `number` | Alias | Control the maximum width of extra large screens. |
| `screenXXL` | `number` | Alias | Control the screen width of extra extra large screens. |
| `screenXXLMin` | `number` | Alias | Control the minimum width of extra extra large screens. |
| `screenXXLMax` | `number` | Alias | Control the maximum width of extra extra large screens. |
| `screenXXXL` | `number` | Alias | Control the screen width of XXXL screens. |
| `screenXXXLMin` | `number` | Alias | Control the minimum width of XXXL screens. |
