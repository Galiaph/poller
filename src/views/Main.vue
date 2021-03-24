<template>
  <div class="main">
    <Header />
    <LeftBar />
    <CentralBar />
    <RightBar />
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header'
import LeftBar from '@/components/LeftBar'
import CentralBar from '@/components/CentralBar.vue'
import RightBar from '@/components/RightBar'

export default {
  name: 'Main',
  components: {
    Header,
    LeftBar,
    CentralBar,
    RightBar
  }
}
</script>

<style>
</style>
