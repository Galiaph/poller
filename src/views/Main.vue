<template>
  <div class="main">
    <Header />
    <LeftBar :groupDevicesBar="groupDevices" @rowSelect="rowSelected" />
    <CentralBar :devicesBar="Devices" :node="selecteNode" />
    <RightBar />
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header'
import LeftBar from '@/components/LeftBar'
import CentralBar from '@/components/CentralBar.vue'
import RightBar from '@/components/RightBar'
import axios from 'axios'

export default {
  name: 'Main',
  components: {
    Header,
    LeftBar,
    CentralBar,
    RightBar
  },
  data: () => ({
    selecteNode: 10,
    groupDevices: {},
    Devices: {}
  }),
  methods: {
    rowSelected: function (event) {
      this.selecteNode = event
      this.getDevices()
    },
    getGroup: async function () {
      const resp = await axios.get('https://device-darsan.mol.net.ua/meta/node-stat')
      this.groupDevices = resp.data
    },
    getDevices: async function () {
      const resp = await axios.get(`https://device-darsan.mol.net.ua/switch?query=node IN (${this.selecteNode})`)
      this.Devices = resp.data
    }
  },
  mounted: async function () {
    try {
      this.getGroup()
      this.getDevices()
    } catch (err) {
      console.error('error in Main mounted')
    }
  }
}
</script>

<style>
</style>
