<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="createWindow">test</button>
    <template v-for="block in windows.content" :key="block">
      <component :is="block.component" :block="block" @clickClose="closeWindow(block)" :active="block.active" :title="block.title"></component>
    </template>
  </div>
</template>

<script>
import Window from '../components/element/Window.vue'

export default {
  name: 'About',
  data: () => ({
    windows: {
      content: []
    },
    count: 1
  }),
  components: {
    Window
  },
  methods: {
    createWindow: function () {
      this.windows.content.push({
        component: 'Window',
        title: 'Client'
      })
    },
    closeWindow: function (item) {
      const index = this.windows.content.indexOf(item)
      if (index > -1) {
        this.windows.content.splice(index, 1)
      }
    }
  }
}
</script>
