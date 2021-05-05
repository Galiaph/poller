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
      <div class="window-body" style="height: 205px;">
        <img :src="src"/>
      </div>
    </div>
</template>

<script>
// import axios from 'axios'

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
      default: '280px'
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
      left: this.pageX
    }
  },
  computed: {
    src: function () {
      const token = encodeURIComponent(this.$store.getters.getToken)
      return `https://device-darsan.mol.net.ua/switch/${this.switch}/port/${this.port}/graph/traffic?period=2day&darsan2=${token}`
    }
  },
  methods: {
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
        pos3 = e.clientX
        pos4 = e.clientY
        document.onmouseup = closeDragElement
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag
        // _windowHeader.style.cursor = '-webkit-grabbing'
      }

      function elementDrag (e) {
        e = e || window.event
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX
        pos2 = pos4 - e.clientY
        pos3 = e.clientX
        pos4 = e.clientY
        // set the element's new position:
        if (_window.offsetTop < (window.innerHeight - 35)) {
          _window.style.top = (_window.offsetTop - pos2) + 'px'
          context.top = _window.style.top
        } else context.centerWindow()
        if (_window.offsetLeft < (window.innerWidth - 35)) {
          _window.style.left = (_window.offsetLeft - pos1) + 'px'
          context.left = _window.style.left
        } else context.centerWindow()
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
    },
    centerWindow () {
      const myElement = this.getThisWindowAndHeaderElements().window
      const pageWidth = window.innerWidth
      const pageHeight = window.innerHeight
      const myElementWidth = myElement.offsetWidth
      const myElementHeight = myElement.offsetHeight
      const diff = this.activeWindows() * 20
      myElement.style.top = (pageHeight / 2) - (myElementHeight / 2) + diff + 'px'
      myElement.style.left = (pageWidth / 2) - (myElementWidth / 2) + diff + 'px'
    },
    checkTheresIsAnyAnotherCenteredWindow () {
      // not being used anymore but working well...
      const windows = Array.from(window.document.getElementsByClassName('vue-window-modal'))
      const centeredWindows = windows.filter(el => {
        const myElement = el
        const pageWidth = window.innerWidth
        const pageHeight = window.innerHeight
        const myElementWidth = myElement.offsetWidth
        const myElementHeight = myElement.offsetHeight
        return el.style.top === (pageHeight / 2) - (myElementHeight / 2) + 'px' &&
                      el.style.left === (pageWidth / 2) - (myElementWidth / 2) + 'px'
      })

      return centeredWindows
    },
    activeWindows () {
      const windows = Array.from(window.document.getElementsByClassName('vue-window-modal'))
      const openedWindows = windows.filter(el => {
        return el.style.display === 'block'
      })
      return openedWindows.length
    }
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
    // try {
    //   const resp = await axios.get(`https://device-darsan.mol.net.ua/switch/${this.switch}/port/${this.port}/graph/traffic?period=2day`)
    //   this.data = resp.data
    //   // console.log(resp.data)
    // } catch (err) {
    //   console.error('error in Window mounted')
    // }
  },
  mounted: function () {
    this.dragElement()
    const _window = this.getThisWindowAndHeaderElements().window
    _window.addEventListener('mousedown', () => {
      this.sendWindowToHighest()
    })
    _window.style.zIndex = 9999
  }
}
</script>

<style lang="scss">
.vue-window-modal {
    position: fixed;
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
