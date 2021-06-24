<template>
    <div
        :id="windowId"
        class="vue-window-modal"
        :style="{top, left, width, height}">
      <div class="vue-window-modal-header">
        <table style="margin: 0px;">
          <tbody>
            <tr>
              <td class="title">{{ `Port ${port}` }}</td>
              <td :id="windowId + '-' + 'header'" class="window-header-spacer" style="width: 600px;"></td>
              <td class="close" @click.stop="$emit('clickClose')"></td>
            </tr>
          </tbody>
        </table>
        <!-- <img src="/images/site/popup_close.png" @click.stop="$emit('clickClose')"> -->
      </div>
      <div class="window-body" style="height: 215px;">
        <div id="drop-down-header">
          <div style="margin-bottom: 5px;">
            <a class="title-link" title="Кликните для изменения" @click="isEditTag = !isEditTag" v-if="!isEditTag">{{ tag }}</a>
            <input type="text" name="tag-text" v-model="tag" v-if="isEditTag" @keydown.esc="tagEsc" @keypress.enter="tagEdit" autofocus/>
          </div>
          <select id="graph-duration" v-model="period">
            <option value="hour6">6 часов</option>
            <option value="day">1 день</option>
            <option value="2day" selected>2 дня</option>
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
            <option value="month3">3 Месяца</option>
          </select>
        </div>
        <div>
          <img :src="traffic" alt="График недоступен"/>
        </div>
        <div>
          <img :src="error" alt="График недоступен"/>
        </div>
        <div>
          <img :src="unicast" alt="График недоступен"/>
        </div>
        <div>
          <img :src="multicast" alt="График недоступен"/>
        </div>
        <div>
          <img :src="broadcast" alt="График недоступен"/>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'WindowRRD',
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
      tag: '',
      tagOld: '',
      isEditTag: false,
      period: '2day',
      temp: '2day'
    }
  },
  computed: {
    broadcast: function () {
      const token = encodeURIComponent(this.$store.getters.getToken)
      return `https://device-darsan.mol.net.ua/switch/${this.switch}/port/${this.port}/graph/broadcast?period=${this.period}&darsan2=${token}`
    },
    multicast: function () {
      const token = encodeURIComponent(this.$store.getters.getToken)
      return `https://device-darsan.mol.net.ua/switch/${this.switch}/port/${this.port}/graph/multicast?period=${this.period}&darsan2=${token}`
    },
    unicast: function () {
      const token = encodeURIComponent(this.$store.getters.getToken)
      return `https://device-darsan.mol.net.ua/switch/${this.switch}/port/${this.port}/graph/unicast?period=${this.period}&darsan2=${token}`
    },
    traffic: function () {
      const token = encodeURIComponent(this.$store.getters.getToken)
      return `https://device-darsan.mol.net.ua/switch/${this.switch}/port/${this.port}/graph/traffic?period=${this.period}&darsan2=${token}`
    },
    error: function () {
      const token = encodeURIComponent(this.$store.getters.getToken)
      return `https://device-darsan.mol.net.ua/switch/${this.switch}/port/${this.port}/graph/error?period=${this.period}&darsan2=${token}`
    }
  },
  methods: {
    tagEsc (event) {
      if (this.isEditTag) {
        this.isEditTag = false
        this.tag = this.tagOld
      }
    },
    async tagEdit () {
      this.isEditTag = false
      try {
        await axios.put(`https://device-darsan.mol.net.ua/switch/${this.switch}/port/${this.port}/tag`, { port: this.port, tag: this.tag })
      } catch (err) {
        console.error('error in WindowRRD mounted')
      }
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
      const resp = await axios.get(`https://device-darsan.mol.net.ua/switch/${this.switch}/port/${this.port}/tag`)
      this.tag = resp.data.tag || 'empty'
      this.tagOld = resp.data.tag || 'empty'
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
// .vue-window-modal {
//     position: fixed;
//     background-color:#ffffff;
//     box-shadow: 6px 6px 10px 0px #707070;
//     border: solid 2px gray;
//     // border-radius: 3px;
//     // display: none;
//     padding: 0.5em;
//     max-height: 90vh;
//     max-width: 90vw;
// }

// .vue-window-modal .vue-window-modal-header {
//     background-color: rgb(114, 152, 195);
//     padding: 0.3em;
//     // border-top-left-radius: 3px;
//     // border-top-right-radius: 3px;
//     color: white;
//     // eight: 40px;
//     font-weight: bold;
//     // cursor: -webkit-grab;
//     // user-select: none;
// }

// td.close::before {
//     cursor: pointer;
//     width: 10px;
//     content: '\00d7';
// }

// td.title {
//   white-space: pre;
// }
</style>
