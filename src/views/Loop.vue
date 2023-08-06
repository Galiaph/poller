<template>
  <div class="loop">
    <Header />
      <div id="wired" style="padding-left: 0px; padding-right: 0px;" class="ui-tabs-panel ui-widget-content ui-corner-bottom">
        <table id="item-table" class="sorted-table">
          <thead>
            <tr>
              <td class="item-box-left-stub"></td>
              <td>&nbsp;</td>
              <td>Устройство</td>
              <td>Сообщение</td>
              <td class="item-box-right-stub"></td>
            </tr>
          </thead>
          <tbody>
            <LoopRow v-for="item in loopData" :data="item" :key="item" @selected="createWindow(item, $event)" />
          </tbody>
        </table>
      </div>
    <template v-for="block in windows.content" :key="block">
      <component :is="block.component" @clickClose="closeWindow(block)" :block="block" :pageX="block.pageX" :pageY="block.pageY" :switch="block.switch" :port="block.port" @selectport="createWindowRRD(block, $event)" @selectmac="createWindowMac(block, $event)" @selectoldmac="createWindowOldMac(block, $event)"></component>
    </template>
  </div>
</template>

<script>
import Header from '@/components/Header'
import LoopRow from '@/components/element/LoopRow.vue'
import axios from 'axios'
import Window from '@/components/element/Window.vue'
import WindowRRD from '@/components/element/WindowRRD.vue'
import WindowMac from '@/components/element/WindowMac.vue'
import WindowOldMac from '@/components/element/WindowOldMac.vue'
// import { useToast } from 'vue-toastification'

export default {
  // eslint-disable-next-line
  name: 'Loop',
  data: () => ({
    loopData: {},
    windows: {
      content: []
    }
  }),
  components: {
    Header,
    LoopRow,
    Window,
    WindowRRD,
    WindowMac,
    WindowOldMac
  },
  methods: {
    getLoop: async function () {
      const resp = await axios.get('https://device-darsan.mol.net.ua/srv/loop-log')
      this.loopData = resp.data
    },
    createWindow: function (item, event) {
      if (this.windows.content.find((el) => el.switch === item.device_id)) {
        return
      }

      const winW = window.innerWidth
      const winH = screen.height
      let x = event.pageX
      let y = event.pageY
      const width = 850
      // eslint-disable-next-line no-unused-vars
      let height = 245

      if (x > winW / 2) {
        x -= width
      }

      if (y - window.screenTop > winH / 2) {
        y -= height
      }

      if (x + width > winW) {
        x = winW - width - 10
      }

      if (y < 10) {
        height -= y + 10
        y = 10
      }

      this.windows.content.push({
        component: 'Window',
        pageX: x + 'px',
        pageY: y + 'px',
        switch: item.device_id
      })
    },
    createWindowRRD: function (item, { event, swt, port }) {
      if (this.windows.content.find((el) => el.switch === swt && el.port === port && el.component === 'WindowRRD')) {
        return
      }

      const winW = window.innerWidth
      const winH = screen.height
      let x = event.pageX
      let y = event.pageY
      const width = 630
      // eslint-disable-next-line no-unused-vars
      let height = 280

      if (x > winW / 2) {
        x -= width
      }

      if (y - window.screenTop > winH / 2) {
        y -= height
      }

      if (x + width > winW) {
        x = winW - width - 10
      }

      if (y < 10) {
        height -= y + 10
        y = 10
      }

      this.windows.content.push({
        component: 'WindowRRD',
        pageX: x + 'px',
        pageY: y + 'px',
        switch: swt,
        port: port
      })
    },
    createWindowMac: function (item, { event, swt, port }) {
      if (this.windows.content.find((el) => el.switch === swt && el.port === port && el.component === 'WindowMac')) {
        return
      }

      const winW = window.innerWidth
      const winH = screen.height
      let x = event.pageX
      let y = event.pageY
      const width = 630
      // eslint-disable-next-line no-unused-vars
      let height = 280

      if (x > winW / 2) {
        x -= width
      }

      if (y - window.screenTop > winH / 2) {
        y -= height
      }

      if (x + width > winW) {
        x = winW - width - 10
      }

      if (y < 10) {
        height -= y + 10
        y = 10
      }

      this.windows.content.push({
        component: 'WindowMac',
        pageX: x + 'px',
        pageY: y + 'px',
        switch: swt,
        port: port
      })
    },
    createWindowOldMac: function (item, { event, swt, port }) {
      if (this.windows.content.find((el) => el.switch === swt && el.port === port && el.component === 'WindowOldMac')) {
        return
      }

      const winW = window.innerWidth
      const winH = screen.height
      let x = event.pageX
      let y = event.pageY
      const width = 630
      // eslint-disable-next-line no-unused-vars
      let height = 280

      if (x > winW / 2) {
        x -= width
      }

      if (y - window.screenTop > winH / 2) {
        y -= height
      }

      if (x + width > winW) {
        x = winW - width - 10
      }

      if (y < 10) {
        height -= y + 10
        y = 10
      }

      this.windows.content.push({
        component: 'WindowOldMac',
        pageX: x + 'px',
        pageY: y + 'px',
        switch: swt,
        port: port
      })
    },
    closeWindow: function (item) {
      const index = this.windows.content.indexOf(item)
      if (index > -1) {
        this.windows.content.splice(index, 1)
      }
    }
  },
  created: async function () {
    try {
      this.getLoop()
    } catch (err) {
      console.error('error in Loop created')
    }
  }
}
</script>

<style>

</style>
