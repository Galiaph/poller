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
import CentralBar from '@/components/CentralBar'
import RightBar from '@/components/RightBar'
import axios from 'axios'
import { Announcer } from '../components/element/announcer.js'

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
    Devices: {},
    wss: null
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
    const announcerEvents = {
      'poller.poll-completed': async (message) => {
        console.log('poller.poll-completed')
        try {
          this.getGroup()
          this.getDevices()
        } catch (err) {
          console.error('error in Main mounted')
        }
      },
      'poller.loop': (message) => {
        console.log('poller.loop')
        console.log(message)
      },
      'poller.loop-syslog': (message) => {
        console.log('poller.loop-syslog')
        console.log(message)
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
        console.log('poller.alert')
        console.log(message)
      },
      'announcer.test': (message) => {
        console.log('poller.test')
        console.log(message)
      }
    }

    this.wss = new Announcer(['poller.*', 'announcer.*'], announcerEvents, {
      onOpen: () => {
        console.log('Уведомления включены')
      },
      onError: (err) => {
        console.log('wssError' + err)
      },
      onClose: () => {
        console.log('Соединение с сервером "+url+" потеряно. Уведомления будут недоступны')
      }
    })
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
