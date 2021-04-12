<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="visibleFormCrudUpdate(true)">test</button>
    <Window :active="visibleFormCrud" title="Client 1" @clickClose="visibleFormCrudUpdate(false)" />
  </div>
</template>

<script>
import Window from '../components/element/Window.vue'

export default {
  name: 'About',
  data: () => ({
    visibleFormCrud: false
  }),
  components: {
    Window
  },
  methods: {
    visibleFormCrudUpdate: function (state) {
      this.visibleFormCrud = state
    }
  }
}
</script>
