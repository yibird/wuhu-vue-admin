# Banner

## Description (en-US)

Display Alert as a banner at top of page.

## Source

```vue
<template>
  <a-alert title="Warning text" banner />
  <br>
  <a-alert
    title="Very long warning text warning text text text text text text text"
    banner
    closable
  />
  <br>
  <a-alert :show-icon="false" title="Warning text without icon" banner />
  <br>
  <a-alert type="error" title="Error text" banner />
</template>
```
