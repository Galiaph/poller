<template>
  <div class="central-bar" id="central-bar">
    <div  id="tabs-device" class="ui-tabs ui-widget ui-widget-content ui-corner-all">
      <ul style="line-height: 1;" class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">
        <li class="ui-state-default ui-corner-top ui-tabs-active ui-state-active">
          <a href="" style="padding-top: 3px;padding-bottom: 3px;" class="ui-tabs-anchor" >Проводные</a>
        </li>
        <li class="ui-state-default ui-corner-top">
          <a href="" style="padding-left: 13px;padding-top: 3px;padding-bottom: 3px;" class="ui-corner-all">Радио</a>
        </li>
        <li class="ui-state-default ui-corner-top">
          <a href="" style="padding-left: 13px;padding-top: 3px;padding-bottom: 3px;" class="ui-corner-all">GPON</a>
        </li>
      </ul>
      <div id="wired" style="padding-left: 0px; padding-right: 0px;" class="ui-tabs-panel ui-widget-content ui-corner-bottom">
        <table id="item-table" class="sorted-table">
          <thead>
          <tr>
            <td class="item-box-left-stub"></td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td class="non-sorted num-key">CPU</td>
            <td class="sorted-asc alpha">Описание</td>
            <td class="non-sorted datetime">Время</td>
            <td class="non-sorted alpha">Тип</td>
            <td class="non-sorted numeric">IP-адрес</td>
            <td class="non-sorted num">VLAN</td>
            <td class="non-sorted num">VLAN2</td>
            <td>&nbsp;</td>
            <td class="item-box-right-stub"></td>
          </tr>
          </thead>
          <tbody>
            <CentralRow v-for="item in devicesBar" :data="item" :key="item" @selected="createWindow(item, $event)" />
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <template v-for="block in windows.content" :key="block">
    <component :is="block.component" @clickClose="closeWindow(block)" :block="block" :pageX="block.pageX" :pageY="block.pageY" :switch="block.switch" :port="block.port" @selectport="createWindowRRD(block, $event)"></component>
  </template>
</template>

<script>
// import axios from 'axios'
import CentralRow from './element/CentralRow.vue'
import Window from './element/Window.vue'
import WindowRRD from './element/WindowRRD.vue'

export default {
  name: 'CentralBar',
  components: {
    CentralRow,
    Window,
    WindowRRD
  },
  data: () => ({
    windows: {
      content: []
    }
  }),
  props: {
    devicesBar: Object,
    node: Number
  },
  methods: {
    createWindow: function (item, event) {
      if (this.windows.content.find((el) => el.switch === item.entity)) {
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
        switch: item.entity
      })
    },
    createWindowRRD: function (item, { event, swt, port }) {
      if (this.windows.content.find((el) => el.switch === swt && el.port === port)) {
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
    closeWindow: function (item) {
      const index = this.windows.content.indexOf(item)
      if (index > -1) {
        this.windows.content.splice(index, 1)
      }
    }
  }
  // mounted: async function () {
  //   try {
  //     const resp = await axios.get(`https://device-darsan.mol.net.ua/switch?query=node IN (${this.node})`)
  //     this.Devices = resp.data
  //   } catch (err) {
  //     console.error('error in CentralBar mounted')
  //   }
  // }
}
</script>

<style>
.ui-tabs {
  position: relative;
  padding: .2em;
}

.ui-tabs .ui-tabs-panel {
  display: block;
  border-width: 0;
  padding: 1em 1.4em;
  background: none;
}

.ui-tabs .ui-tabs-nav {
  margin: 0;
  padding: .2em .2em 0;
}

.ui-helper-reset {
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  line-height: 1.3;
  text-decoration: none;
  font-size: 100%;
  list-style: none;
}

.ui-helper-clearfix:before,
.ui-helper-clearfix:after {
  content: "";
  display: table;
}

.ui-helper-clearfix:after {
  clear: both;
}

.ui-helper-clearfix {
  min-height: 0; /* support: IE7 */
}

.ui-widget-header {
  border: 1px solid #aed0ea;
  background: #deedf7;
  /*background-image: url('../../public/images/ui-bg_highlight-soft_100_deedf7_1x100.png');*/
  /*background-repeat: repeat-x;*/
  /*background-size: 50%;*/
  color: #222222;
  font-weight: bold;
}

.ui-widget {
  font-family: Lucida Grande,Lucida Sans,Arial,sans-serif;
  font-size: 1.1em;
}

.ui-widget-content {
  border: 1px solid #dddddd;
  /*background: #f2f5f7 url(images/ui-bg_highlight-hard_100_f2f5f7_1x100.png) 50% top repeat-x;*/
  background: #f2f5f7;
  color: #362b36;
}

.ui-corner-all,
.ui-corner-top,
.ui-corner-left,
.ui-corner-tl {
  border-top-left-radius: 6px;
}
.ui-corner-all,
.ui-corner-top,
.ui-corner-right,
.ui-corner-tr {
  border-top-right-radius: 6px;
}
.ui-corner-all,
.ui-corner-bottom,
.ui-corner-left,
.ui-corner-bl {
  border-bottom-left-radius: 6px;
}
.ui-corner-all,
.ui-corner-bottom,
.ui-corner-right,
.ui-corner-br {
  border-bottom-right-radius: 6px;
}

.ui-state-default {
  border: 1px solid #cccccc;
  /*background: #f6f6f6 url(images/ui-bg_glass_100_f6f6f6_1x400.png) 50% 50% repeat-x;*/
  font-weight: bold;
  color: #1c94c4;
}

.ui-corner-top {
  -moz-border-radius-topleft: 4px;
  -webkit-border-top-left-radius: 4px;
  -khtml-border-top-left-radius: 4px;
  border-top-left-radius: 4px;
}

.ui-tabs .ui-tabs-nav li.ui-tabs-active {
  margin-bottom: -1px;
  margin-left: 4px;
  padding-bottom: 1px;
}

.ui-tabs .ui-tabs-nav li {
  list-style: none;
  float: left;
  position: relative;
  top: 0;
  margin: 1px .2em 0 0;
  border-bottom: 0;
  padding: 0;
  white-space: nowrap;
}

.ui-tabs .ui-tabs-nav li a {
  float: left;
  padding: .5em 1em;
  text-decoration: none;
}

.ui-state-default a,
.ui-state-default a:link,
.ui-state-default a:visited {
  color: #2779aa;
  text-decoration: none;
}

.ui-state-active a,
.ui-state-active a:link,
.ui-state-active a:visited {
  color: #ffffff;
  text-decoration: none;
}

.ui-state-default,
.ui-widget-content .ui-state-default,
.ui-widget-header .ui-state-default {
  border: 1px solid #aed0ea;
  /*background: #d7ebf9 url(images/ui-bg_glass_80_d7ebf9_1x400.png) 50% 50% repeat-x;*/
  background: #d7ebf9;
  font-weight: bold;
  color: #2779aa;
}

.ui-state-active,
.ui-widget-content .ui-state-active,
.ui-widget-header .ui-state-active {
  border: 1px solid #2694e8;
  /*background: #3baae3; url(images/ui-bg_glass_50_3baae3_1x400.png) 50% 50% repeat-x;*/
  background: #3baae3;
  font-weight: bold;
  color: #ffffff;
}

.ui-widget-content a {
  color: #362b36;
  margin: 0px;
  padding-right: 4px;
  padding-bottom: 4px;
}

</style>
