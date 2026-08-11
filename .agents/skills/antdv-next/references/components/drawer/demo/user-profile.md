# Preview drawer

## Description (en-US)

Use Drawer to quickly preview details of an object, such as those in a list.

## Source

```vue
<script setup lang="ts">
import { defineComponent, h, ref } from 'vue'

const open = ref(false)

const users = [
  { id: 1, name: 'Lily', description: 'Progresser XTech' },
  { id: 2, name: 'Lily', description: 'Progresser XTech' },
]

const DescriptionItem = defineComponent({
  name: 'DescriptionItem',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  setup(props, { slots }) {
    return () => h('div', { class: 'site-description-item-profile-wrapper' }, [
      h('p', { class: 'site-description-item-profile-p-label' }, `${props.title}:`),
      slots.default?.(),
    ])
  },
})
</script>

<template>
  <ul class="user-list">
    <li v-for="item in users" :key="item.id" class="user-list-item">
      <div class="user-meta">
        <a-avatar src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
        <div>
          <a-typography-link href="https://ant.design/index-cn">
            {{ item.name }}
          </a-typography-link>
          <div class="user-desc">
            {{ item.description }}
          </div>
        </div>
      </div>
      <a-button type="link" @click="open = true">
        View Profile
      </a-button>
    </li>
  </ul>

  <a-drawer
    v-model:open="open"
    :size="640"
    placement="right"
    :closable="false"
    @close="open = false"
  >
    <p class="site-description-item-profile-p" style="margin-bottom: 24px;">
      User Profile
    </p>
    <p class="site-description-item-profile-p">
      Personal
    </p>
    <a-row>
      <a-col :span="12">
        <DescriptionItem title="Full Name">
          Lily
        </DescriptionItem>
      </a-col>
      <a-col :span="12">
        <DescriptionItem title="Account">
          AntDesign@example.com
        </DescriptionItem>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <DescriptionItem title="City">
          HangZhou
        </DescriptionItem>
      </a-col>
      <a-col :span="12">
        <DescriptionItem title="Country">
          China
        </DescriptionItem>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <DescriptionItem title="Birthday">
          February 2, 1900
        </DescriptionItem>
      </a-col>
      <a-col :span="12">
        <DescriptionItem title="Website">
          -
        </DescriptionItem>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <DescriptionItem title="Message">
          Make things as simple as possible but no simpler.
        </DescriptionItem>
      </a-col>
    </a-row>

    <a-divider />

    <p class="site-description-item-profile-p">
      Company
    </p>
    <a-row>
      <a-col :span="12">
        <DescriptionItem title="Position">
          Programmer
        </DescriptionItem>
      </a-col>
      <a-col :span="12">
        <DescriptionItem title="Responsibilities">
          Coding
        </DescriptionItem>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <DescriptionItem title="Department">
          XTech
        </DescriptionItem>
      </a-col>
      <a-col :span="12">
        <DescriptionItem title="Supervisor">
          <a href="https://ant.design">
            Lin
          </a>
        </DescriptionItem>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <DescriptionItem title="Skills">
          C / C ++, data structures, software engineering, operating systems, computer networks,
          databases, compiler theory, computer architecture, Microcomputer Principle and Interface
          Technology, Computer English, Java, ASP, etc.
        </DescriptionItem>
      </a-col>
    </a-row>

    <a-divider />

    <p class="site-description-item-profile-p">
      Contacts
    </p>
    <a-row>
      <a-col :span="12">
        <DescriptionItem title="Email">
          AntDesign@example.com
        </DescriptionItem>
      </a-col>
      <a-col :span="12">
        <DescriptionItem title="Phone Number">
          +86 181 0000 0000
        </DescriptionItem>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <DescriptionItem title="Github">
          <a href="http://github.com/ant-design/ant-design/" target="_blank" rel="noreferrer">
            github.com/ant-design/ant-design/
          </a>
        </DescriptionItem>
      </a-col>
    </a-row>
  </a-drawer>
</template>

<style scoped>
.user-list {
  margin: 0;
  padding: 0;
  list-style: none;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
}

.user-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
}

.user-list-item + .user-list-item {
  border-top: 1px solid #f0f0f0;
}

.user-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-desc {
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}

.site-description-item-profile-wrapper {
  margin-bottom: 7px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 1.5715;
}

.site-description-item-profile-p {
  display: block;
  margin-bottom: 16px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
  line-height: 1.5715;
}

.site-description-item-profile-p-label {
  display: inline-block;
  margin-inline-end: 8px;
  color: rgba(0, 0, 0, 0.85);
}
</style>
```
