<template>
    <div
        :id="windowId"
        class="vue-window-modal"
        :style="{top, left, width, height}">
        <div class="vue-window-modal-header">
            <table style="margin: 0px;">
              <tbody>
                <tr>
                  <td class="screen">
                    <div class="cursor-pointer">
                      <i class="fa fa-camera"></i>
                    </div>
                  </td>
                  <td class="window-menu-link" style="width: 0px;"></td>
                  <td class="title">{{ `${data.name} - ${data.type} ${data.ip}` }}</td>
                  <td :id="windowId + '-' + 'header'" class="window-header-spacer" style="width: 828px;"></td>
                  <td class="close" @click.stop="$emit('clickClose')"></td>
                </tr>
              </tbody>
            </table>
            <!-- <img src="/images/site/popup_close.png" @click.stop="$emit('clickClose')"> -->
        </div>
        <div class="window-body" style="height: 205px;">
          <img src="/images/site/vinyl.png" width="20" @click="isShowOldMacs = !isShowOldMacs" />
          <table class="device-details">
            <tbody>
              <tr>
                <td>
                  <div id="device-common-info">
                    <div :class="statusDev()">{{ data.state === 'disabled' ? '365 д.' : upTime() }}</div>
                  </div>
                </td>
                </tr>
                <tr id="device-port-info">
                  <td class="device-port-cell" v-for="index in ports.length" :key="index">
                    <template v-if="index % 2">
                      <div class="device-port-entity">
                        <div class="device-port-num drop-down-win">
                          <a class="graph-link" :class="portStatus(index - 1)" href="" @click.prevent.stop="select(index, $event)" :title="index">{{ index }}</a>
                          <!-- <a href="[%c.config.billing_client%][%uid%]" title="a[%uid%]" class="ok" target="_blank">&#x25CF;</a>
                          <a class="triangle" href="/device/details/[%link.id%]" title="[%link.ip _ link.comment%]">&#x25B3;</a> -->
                        </div>
                        <div class="device-port-items-count drop-down-win">
                          <a class="macs-count" href="" @click.prevent.stop="selectMac(index, $event)">{{ currentMacsCount(index) }}</a>
                          <!-- <a class="macs-count" href="[% '/device/currmacs/' _ fields.device_id _ '/' _ loop.count %]">[% item.number -%]</a> -->
                        </div>
                        <div class="device-port-olditems-count drop-down-win" v-if="isShowOldMacs">
                          <a class="oldmacs-count" href="#">{{ oldMacsCount(index) }}</a>
                        </div>
                      </div>
                      <div class="device-port-entity">
                        <div class="device-port-olditems-count drop-down-win" v-if="isShowOldMacs">
                          <a class="oldmacs-count" href="#">{{ oldMacsCount(index + 1) }}</a>
                        </div>
                        <div class="device-port-items-count drop-down-win">
                          <a class="macs-count" href="" @click.prevent.stop="selectMac(index + 1, $event)">{{ currentMacsCount(index + 1) }}</a>
                        </div>
                        <div class="device-port-num drop-down-win">
                          <a class="graph-link" :class="portStatus(index)" href="" @click.prevent.stop="select(index + 1, $event)" :title="index">{{ index + 1 }}</a>
                        </div>
                      </div>
                    </template>
                  </td>
                </tr>
            </tbody>
          </table>
        </div>
        <!-- <slot name="default"></slot> -->
    </div>
</template>

<script>
import axios from 'axios'
import { formatUptime, formatUptimeFromStart } from './timeFunc.js'

export default {
  name: 'Window',
  props: {
    // active: Boolean,
    pageX: {
      type: String,
      default: '0px'
    },
    pageY: {
      type: String,
      default: '0px'
    },
    width: {
      type: String,
      default: '850px'
    },
    height: {
      type: String,
      default: '245px'
    },
    switch: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      windowId: (function () {
        const one = Math.floor((Math.random() * 1000000) + 1) + ''
        const two = Math.floor((Math.random() * 1000000) + 1) + ''
        const three = Math.floor((Math.random() * 1000000) + 1) + ''
        return one + two + three
      })(),
      top: this.pageY,
      left: this.pageX,
      data: {},
      isShowOldMacs: false
      // windows: {
      //   content: []
      // }
    }
  },
  computed: {
    ports: function () {
      if (this.data.portmap) {
        return this.data.portmap.split(',')
      }
      return {}
    }
  },
  methods: {
    select: function (port, event) {
      const swt = this.switch
      this.$emit('selectport', { event, swt, port })
    },
    selectMac: function (port, event) {
      const swt = this.switch
      this.$emit('selectmac', { event, swt, port })
    },
    upTime () {
      return this.data.down ? formatUptimeFromStart(this.data.down_from, true) : formatUptime(this.data.uptime, true, (this.data.uptime > 864000))
    },
    currentMacsCount: function (index) {
      return this.data.current_macs_count[index] === 0 ? '' : this.data.current_macs_count[index]
    },
    oldMacsCount: function (index) {
      return this.data.old_macs_count[index] === 0 ? '' : this.data.old_macs_count[index]
    },
    statusDev () {
      if (this.data.state === 'down') {
        return 'status-down'
      } else if (this.data.state === 'up') {
        return 'status-ok'
      }

      return 'status-off'
    },
    portStatus (index) {
      if (this.data.ports_on[index] === '1') {
        if (this.data.untagged_ports[index] === '1') {
          return 'port-access'
        } else {
          return 'port-trunk'
        }
      }
      return 'port-off'
    },
    getThisWindowAndHeaderElements () {
      return {
        window: window.document.getElementById(this.windowId),
        windowHeader: window.document.getElementById(this.windowId + '-' + 'header')
      }
    },
    dragElement (elmnt) {
      const context = this
      let pos1 = 0
      let pos2 = 0
      let pos3 = 0
      let pos4 = 0
      const _window = this.getThisWindowAndHeaderElements().window
      const _windowHeader = this.getThisWindowAndHeaderElements().windowHeader
      _windowHeader.onmousedown = dragMouseDown
      function dragMouseDown (e) {
        e = e || window.event
        // get the mouse cursor position at startup:
        pos3 = e.pageX
        pos4 = e.pageY
        document.onmouseup = closeDragElement
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag
        // _windowHeader.style.cursor = '-webkit-grabbing'
      }

      function elementDrag (e) {
        e = e || window.event
        // calculate the new cursor position:
        pos1 = pos3 - e.pageX
        pos2 = pos4 - e.pageY
        pos3 = e.pageX
        pos4 = e.pageY

        // set the element's new position:
        _window.style.top = (_window.offsetTop - pos2) + 'px'
        context.top = _window.style.top

        _window.style.left = (_window.offsetLeft - pos1) + 'px'
        context.left = _window.style.left
      }

      function closeDragElement () {
        // stop moving when mouse button is released:
        document.onmouseup = null
        document.onmousemove = null
        // _windowHeader.style.cursor = '-webkit-grab'
      }
    },
    getHighestWindow () {
      const windows = Array.from(window.document.getElementsByClassName('vue-window-modal'))
      const zIndexs = windows.map(el => Number(el.style.zIndex))
      const highest = Math.max.apply(Math, zIndexs)
      return highest
    },
    sendWindowToHighest () {
      this.getThisWindowAndHeaderElements().window.style.zIndex = this.getHighestWindow() + 1
    }
    // centerWindow () {
    //   const myElement = this.getThisWindowAndHeaderElements().window
    //   const pageWidth = window.innerWidth
    //   const pageHeight = window.innerHeight
    //   const myElementWidth = myElement.offsetWidth
    //   const myElementHeight = myElement.offsetHeight
    //   const diff = this.activeWindows() * 20
    //   myElement.style.top = (pageHeight / 2) - (myElementHeight / 2) + diff + 'px'
    //   myElement.style.left = (pageWidth / 2) - (myElementWidth / 2) + diff + 'px'
    // },
    // checkTheresIsAnyAnotherCenteredWindow () {
    //   // not being used anymore but working well...
    //   const windows = Array.from(window.document.getElementsByClassName('vue-window-modal'))
    //   const centeredWindows = windows.filter(el => {
    //     const myElement = el
    //     const pageWidth = window.innerWidth
    //     const pageHeight = window.innerHeight
    //     const myElementWidth = myElement.offsetWidth
    //     const myElementHeight = myElement.offsetHeight
    //     return el.style.top === (pageHeight / 2) - (myElementHeight / 2) + 'px' &&
    //                   el.style.left === (pageWidth / 2) - (myElementWidth / 2) + 'px'
    //   })

    //   return centeredWindows
    // },
    // activeWindows () {
    //   const windows = Array.from(window.document.getElementsByClassName('vue-window-modal'))
    //   const openedWindows = windows.filter(el => {
    //     return el.style.display === 'block'
    //   })
    //   return openedWindows.length
    // }
    // hide () {
    //   this.getThisWindowAndHeaderElements().window.style.display = 'none'
    // },
    // show () {
    //   this.getThisWindowAndHeaderElements().window.style.display = 'block'
    // }
  },
  // watch: {
  //   active (newValue) {
  //     if (newValue) {
  //       this.show()
  //       this.sendWindowToHighest()
  //       this.centerWindow()
  //     } else {
  //       this.hide()
  //     }
  //   }
  // },
  created: async function () {
    try {
      const resp = await axios.get(`https://device-darsan.mol.net.ua/switch/${this.switch}`)
      this.data = resp.data
      // console.log(resp.data)
    } catch (err) {
      console.error('error in Window mounted')
    }
  },
  mounted: function () {
    this.dragElement()
    const _window = this.getThisWindowAndHeaderElements().window
    _window.addEventListener('click', () => {
      this.sendWindowToHighest()
    })
    _window.style.zIndex = 999
  }
}
</script>

<style lang="scss">
.vue-window-modal {
    position: absolute;
    background-color:#ffffff;
    box-shadow: 6px 6px 10px 0px #707070;
    border: solid 2px gray;
    // border-radius: 3px;
    // display: none;
    padding: 0.5em;
    max-height: 90vh;
    max-width: 90vw;
}

.vue-window-modal .vue-window-modal-header {
    background-color: rgb(114, 152, 195);
    padding: 0.3em;
    // border-top-left-radius: 3px;
    // border-top-right-radius: 3px;
    color: white;
    // eight: 40px;
    font-weight: bold;
    // cursor: -webkit-grab;
    // user-select: none;
}

td.close::before {
    cursor: pointer;
    width: 10px;
    content: '\00d7';
}

td.title {
  white-space: pre;
}
</style>
