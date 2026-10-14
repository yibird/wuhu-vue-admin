<template>
  <div class="flex flex-col">
    <Sider />
    <Header />
    <Breadcrumb />
    <Tabs />
    <Widget />
    <Footer />
    <Copyright />
  </div>
</template>
<script lang="ts" setup>
import Sider from './sider.vue'
import Header from './header.vue'
import Breadcrumb from './breadcrumb.vue'
import Tabs from './tab.vue'
import Widget from './widget.vue'
import Footer from './footer.vue'
import Copyright from './copyright.vue'
</script>
