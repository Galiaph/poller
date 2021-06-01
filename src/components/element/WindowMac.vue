<template>
    <div
        :id="windowId"
        class="vue-window-modal"
        :style="{top, left, width, height}">
      <div class="vue-window-modal-header">
        <table style="margin: 0px;">
          <tbody>
            <tr>
              <td class="title">
                {{ `Port ${port} Абоненты ` }}
                (<span title="Известных маков" class="port-mac-authed">{{ usersCount }}</span> + <span title="Не известных маков" class="port-mac-non-authed">{{ fdbCount }}</span>)
              </td>
              <td :id="windowId + '-' + 'header'" class="window-header-spacer" style="width: 600px;"></td>
              <td class="close" @click.stop="$emit('clickClose')"></td>
            </tr>
          </tbody>
        </table>
        <!-- <img src="/images/site/popup_close.png" @click.stop="$emit('clickClose')"> -->
      </div>
      <div class="window-body" style="height: 215px;">
        <div id="mac-list">
            <table id="mac-list-table" class="sorted-table">
                <thead>
                    <tr>
                      <th>Ст</th>
                      <th class="sorted-asc alpha">Логин</th>
                      <th>MAC</th>
                      <th>vlan</th>
                      <th class="non-sorted numericus">Время</th>
                      <th onclick="$('.pingAllWs').trigger('click')" style="cursor: pointer;">Ping</th>
                    </tr>
                </thead>
                <tbody id="table-stuff">
                    <tr class="odd stuff" v-for="item in users" :data="item" :key="item">
                        <td class="image">
                            <img :src="'/images/site/st_' + userState(item) + '.png'" :title="item.connection_type">
                        </td>
                        <td class="login">
                          <a class="show-hidden" :href="'https://radix.mol.net.ua/client/' + item.uid" v-if="item.uid" target="_blank">{{  item.login }}</a>
                        </td>
                        <td class="mac">
                            {{ item.mac }}
                        </td>
                        <td>
                            {{ userVlan(item.mac) }}
                        </td>
                        <td class="since">
                          {{ time(item.duration) }}
                        </td>
                        <td class="ping-cell">
                            <span>-</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios'
import { formatUptime } from './timeFunc.js'

export default {
  name: 'WindowMAC',
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
      default: '630px'
    },
    height: {
      type: String,
      default: '255px'
    },
    switch: {
      type: Number,
      default: null
    },
    port: {
      type: Number,
      default: 0
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
      fdb: [],
      users: [],
      fdbCount: 0,
      usersCount: 0
    }
  },
  methods: {
    time: function (duration) {
      if (duration === 0) {
        return '-'
      }

      return formatUptime(duration, true)
    },
    userState: function (user) {
      if (user.duration > 0 && user.ip) {
        return 'on'
      }

      return 'off'
    },
    userVlan: function (mac) {
      return this.fdb.find(el => el.mac === mac).vlan
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
      const resp = await axios.get(`https://device-darsan.mol.net.ua/switch/${this.switch}/port/${this.port}/fdb`)
      this.fdb = resp.data
      const macs = []
      this.fdb.forEach(element => {
        macs.push(element.mac.replaceAll(':', ''))
      })
      const resp2 = await axios.post('https://client-darsan.mol.net.ua/clients-from-macs', 'macs=' + macs.join(','))
      this.users = resp2.data
      this.usersCount = this.users.length
      this.fdbCount = this.fdb.length - this.usersCount

      this.fdb.forEach(el => {
        const res = this.users.filter(el2 => el.mac === el2.mac)

        if (res.length === 0) {
          this.users.push({
            connection_type: '',
            duration: 0,
            ip: '',
            login: '',
            mac: el.mac,
            uid: 0
          })
        }
      })

      this.users.sort((a, b) => {
        if (a.login > b.login) {
          return 1
        } else if (a.login < b.login) {
          return -1
        }

        return 0
      })
    } catch (err) {
      console.error('error in WindowRRD mounted')
    }
  },
  mounted: function () {
    this.dragElement()
    const _window = this.getThisWindowAndHeaderElements().window
    _window.addEventListener('click', () => {
      this.sendWindowToHighest()
    })
    _window.style.zIndex = 9999
  }
}
</script>

<style lang="scss">
</style>
