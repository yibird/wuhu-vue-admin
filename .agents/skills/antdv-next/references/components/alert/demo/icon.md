# Icon

## Description (en-US)

A relevant icon will make information clearer and more friendly.

## Source

```vue
<template>
  <a-alert title="Success Tips" type="success" show-icon />
  <br>
  <a-alert title="Informational Notes" type="info" show-icon />
  <br>
  <a-alert title="Warning" type="warning" show-icon closable />
  <br>
  <a-alert title="Error" type="error" show-icon />
  <br>
  <a-alert
    title="Success Tips"
    description="Detailed description and advice about successful copywriting."
    type="success"
    show-icon
  />
  <br>
  <a-alert
    title="Informational Notes"
    description="Additional description and information about copywriting."
    type="info"
    show-icon
  />
  <br>
  <a-alert
    title="Warning"
    description="This is a warning notice about copywriting."
    type="warning"
    show-icon
    closable
  />
  <br>
  <a-alert
    title="Error"
    description="This is an error message about copywriting."
    type="error"
    show-icon
  />
</template>
```
