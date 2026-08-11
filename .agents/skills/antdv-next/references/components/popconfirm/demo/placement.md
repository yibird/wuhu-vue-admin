# Placement

## Description (en-US)

There are 12 `placement` options available. Set `arrow` with `pointAtCenter: true` if you want the arrow to point at the center of target.

## Source

```vue
<script setup lang="ts">
const title = 'Are you sure to delete this task?'
const description = 'Delete the task'
const buttonWidth = 80
</script>

<template>
  <a-config-provider :button="{ style: { width: `${buttonWidth}px`, margin: '4px' } }">
    <a-flex vertical justify="center" align="center" class="demo">
      <a-flex justify="center" align="center" style="white-space: nowrap">
        <a-popconfirm
          placement="topLeft"
          :title="title"
          :description="description"
          ok-text="Yes"
          cancel-text="No"
        >
          <a-button>TL</a-button>
        </a-popconfirm>
        <a-popconfirm
          placement="top"
          :title="title"
          :description="description"
          ok-text="Yes"
          cancel-text="No"
        >
          <a-button>Top</a-button>
        </a-popconfirm>
        <a-popconfirm
          placement="topRight"
          :title="title"
          :description="description"
          ok-text="Yes"
          cancel-text="No"
        >
          <a-button>TR</a-button>
        </a-popconfirm>
      </a-flex>
      <a-flex :style="{ width: `${buttonWidth * 5 + 32}px` }" justify="space-between" align="center">
        <a-flex align="center" vertical>
          <a-popconfirm
            placement="leftTop"
            :title="title"
            :description="description"
            ok-text="Yes"
            cancel-text="No"
          >
            <a-button>LT</a-button>
          </a-popconfirm>
          <a-popconfirm
            placement="left"
            :title="title"
            :description="description"
            ok-text="Yes"
            cancel-text="No"
          >
            <a-button>Left</a-button>
          </a-popconfirm>
          <a-popconfirm
            placement="leftBottom"
            :title="title"
            :description="description"
            ok-text="Yes"
            cancel-text="No"
          >
            <a-button>LB</a-button>
          </a-popconfirm>
        </a-flex>
        <a-flex align="center" vertical>
          <a-popconfirm
            placement="rightTop"
            :title="title"
            :description="description"
            ok-text="Yes"
            cancel-text="No"
          >
            <a-button>RT</a-button>
          </a-popconfirm>
          <a-popconfirm
            placement="right"
            :title="title"
            :description="description"
            ok-text="Yes"
            cancel-text="No"
          >
            <a-button>Right</a-button>
          </a-popconfirm>
          <a-popconfirm
            placement="rightBottom"
            :title="title"
            :description="description"
            ok-text="Yes"
            cancel-text="No"
          >
            <a-button>RB</a-button>
          </a-popconfirm>
        </a-flex>
      </a-flex>
      <a-flex justify="center" align="center" style="white-space: nowrap">
        <a-popconfirm
          placement="bottomLeft"
          :title="title"
          :description="description"
          ok-text="Yes"
          cancel-text="No"
        >
          <a-button>BL</a-button>
        </a-popconfirm>
        <a-popconfirm
          placement="bottom"
          :title="title"
          :description="description"
          ok-text="Yes"
          cancel-text="No"
        >
          <a-button>Bottom</a-button>
        </a-popconfirm>
        <a-popconfirm
          placement="bottomRight"
          :title="title"
          :description="description"
          ok-text="Yes"
          cancel-text="No"
        >
          <a-button>BR</a-button>
        </a-popconfirm>
      </a-flex>
    </a-flex>
  </a-config-provider>
</template>
```
