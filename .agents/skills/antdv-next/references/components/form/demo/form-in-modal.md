# Form in Modal to Create

## Description (en-US)

Use form inside modal.

## Source

```vue
<script setup lang="ts">
import type { FormInstance } from 'antdv-next'
import { reactive, ref, shallowRef } from 'vue'

interface Values {
  title?: string
  description?: string
  modifier?: string
}

const formRef = shallowRef<FormInstance>()
const open = ref(false)
const formValues = ref<Values>()

const model = reactive({
  title: '',
  description: '',
  modifier: 'public',
})

function handleCreate(values: Values) {
  console.log('Received values of form: ', values)
  formValues.value = values
  open.value = false
}
</script>

<template>
  <a-space direction="vertical" style="width: 100%">
    <a-button type="primary" @click="open = true">
      New Collection
    </a-button>
    <pre>{{ JSON.stringify(formValues, null, 2) }}</pre>
  </a-space>

  <a-modal
    v-model:open="open"
    title="Create a new collection"
    ok-text="Create"
    cancel-text="Cancel"
    :ok-button-props="{ autoFocus: true, htmlType: 'submit' }"
    @cancel="open = false"
    @ok="formRef?.submit?.()"
  >
    <a-form
      ref="formRef"
      layout="vertical"
      name="form_in_modal"
      :model="model"
      clear-on-destroy
      @finish="handleCreate"
    >
      <a-form-item
        name="title"
        label="Title"
        :rules="[{ required: true, message: 'Please input the title of collection!' }]"
      >
        <a-input v-model:value="model.title" />
      </a-form-item>
      <a-form-item name="description" label="Description">
        <a-textarea v-model:value="model.description" />
      </a-form-item>
      <a-form-item name="modifier" class="collection-create-form_last-form-item">
        <a-radio-group v-model:value="model.modifier">
          <a-radio value="public">
            Public
          </a-radio>
          <a-radio value="private">
            Private
          </a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
```
