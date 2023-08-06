<template>
  <div class="main">
    <Header />
    <LeftBar :groupDevicesBar="groupDevices" :groupSelect="selecteNode" :ponSelect="selectTab" @rowSelect="rowSelected" />
    <CentralBar :devicesBar="Devices" :node="selecteNode" :ponSelect="selectTab" @tabSelect="tabSelected($event)" />
    <RightBar />
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header'
import LeftBar from '@/components/LeftBar'
import CentralBar from '@/components/CentralBar'
import RightBar from '@/components/RightBar'
import axios from 'axios'
import Connects from '@/components/element/announcer.js'
import { useToast } from 'vue-toastification'

export default {
  // eslint-disable-next-line
  name: 'Main',
  components: {
    Header,
    LeftBar,
    CentralBar,
    RightBar
  },
  data: () => ({
    selecteNode: 10,
    selectTab: false,
    groupDevices: {},
    Devices: {},
    wss: null
  }),
  methods: {
    rowSelected: function (event) {
      this.selecteNode = event
      this.getDevices()

      history.pushState({}, null, `/${this.selectTab ? 'pon' : 'node'}/${event}`)
    },
    tabSelected: function (event) {
      this.selectTab = event

      if (this.selectTab && this.groupDevices.find((el) => el.entity === this.selecteNode).pon === '0') {
        this.selecteNode = 12
      }

      history.pushState({}, null, `/${this.selectTab ? 'pon' : 'node'}/${this.selecteNode}`)

      this.getDevices()
    },
    getGroup: async function () {
      const resp = await axios.get('https://device-darsan.mol.net.ua/meta/node-stat')
      this.groupDevices = resp.data
    },
    getDevices: async function () {
      const resp = await axios.get(`https://device-darsan.mol.net.ua/${this.selectTab ? 'pon' : 'switch'}?query=node IN (${this.selecteNode})`)
      this.Devices = resp.data.sort((a, b) => {
        if (a.name > b.name) {
          return 1
        } else if (a.name < b.name) {
          return -1
        }

        return 0
      })
    }
  },
  created: function () {
    if (this.$route.params.id) {
      this.selecteNode = Number(this.$route.params.id)
    }

    if (this.$route.href && this.$route.href.split('/')[1] === 'pon') {
      this.selectTab = true
    }

    const announcerEvents = {
      'poller.poll-completed': async (message) => {
        try {
          this.getGroup()
          this.getDevices()
        } catch (err) {
          console.error('error in poll-completed')
        }
      },
      'poller.loop': (message) => {
        console.log('poller.loop')
        console.log(message)
        toast.info(message.text)
      },
      'poller.loop-syslog': (message) => {
        console.log('poller.loop-syslog')
        console.log(message)
        toast.info(message.text)
      },
      'poller.in-errors': (message) => {
        console.log('poller.in-errors')
        console.log(message)
      },
      'poller.out-errors': (message) => {
        console.log('poller.out-errors')
        console.log(message)
      },
      'poller.notify': (message) => {
        console.log('poller.notify')
        console.log(message)
      },
      'announcer.alert': (message) => {
        console.log('announcer.alert')
        console.log(message)
      },
      'announcer.test': (message) => {
        console.log('announcer.test')
        console.log(message)
      }
    }

    const toast = useToast()
    Connects.Connect(this.wss, toast, announcerEvents)
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
