<template>
  <tr>
    <td class="item-box-left-stub" style=""></td>
    <td class="item-box-image" style="position: relative">
      <img :src="'/images/site/obj_' + state + '.png'">
    </td>
    <td width="30px"></td>
    <td class="item-box-image">
      <img class="tooltip" src="/images/site/picture.png" title="2015-04-15 12:40:52<br/><img src='/device/photo/654' width='200'/>" onclick="showPhoto(654)">
    </td>
    <td v-if="data.cpu != null" :title="data.cpu + '%'" :key="data.cpu">
      <div class="cpu-bar">
        <a class="details-cpu" href="#">
          <div class="cpu-bar-progress" :style="{ 'width': data.cpu + '%' }"></div>
        </a>
      </div>
    </td>
    <td v-else></td>
    <td class="item-box-title">
      <a class="details-link " href="/about" :title="data.name">{{ data.name }}</a>
    </td>
    <td class="item-box-data" title="Время непрерывной работы">
      <span class="off" v-if="data.state === 'disabled'">---</span>
      <span :class="data.state === 'down' ? 'down' : 'ok'" v-else>{{ upTime }}</span>
    </td>
    <td class="item-box-data">
      {{ data.type }}
    </td>
    <td class="item-box-data device-ip">
      <a :href="'telnet://' + data.ip">{{ data.ip }}</a>
    </td>
    <td class="item-box-data device-vlan" align="right">
      {{ data.access_vlan }}
    </td>
    <td class="item-box-data device-vlan2" align="right">
      <!--0-->
    </td>
    <td class="item-box-actions">
      <a class="modal" title="Свойства" href="#"><img src="/images/site/edit_n.png"></a>
      <a class="modal" title="Разрешения" href="#"><img src="/images/site/perms_n.png"></a>
      <a class="modal" title="Удалить" href="#"><img src="/images/site/delete_n.png"></a>
    </td>
    <td class="item-box-right-stub"></td>
  </tr>
</template>

<script>
import moment from 'moment'

export default {
  name: 'CentralRow',
  props: {
    data: Object
  },
  computed: {
    upTime () {
      return this.data.down ? this.formatUptimeFromStart(this.data.down_from, true) : this.formatUptime(this.data.uptime, true, (this.data.uptime > 864000))
    },
    state () {
      if (this.data.state === 'disabled') {
        return 'off'
      } else if (this.data.state === 'down') {
        return 'down'
      }

      return 'ok'
    }
  },
  methods: {
    zeroPad: function (number, digits) {
      var num = number + ''
      while (num.length < digits) {
        num = '0' + num
      }
      return num
    },
    formatUptime: function (seconds, withoutSeconds, withoutHours) {
      const numdays = Math.floor(seconds / 86400)
      const numhours = Math.floor((seconds % 86400) / 3600)
      const numminutes = Math.floor(((seconds % 86400) % 3600) / 60)
      const numseconds = Math.floor((seconds % 3600) % 60)

      // let res = '' + this.zeroPad(numminutes, 2)
      let res = ''

      if (!withoutHours) {
        res = this.zeroPad(numhours, 2) + ':'
        res += this.zeroPad(numminutes, 2)
      }

      if (!withoutSeconds) {
        res += ':' + this.zeroPad(numseconds, 2)
      }

      if (numdays) {
        res = numdays + 'д ' + res
      }

      return res
    },
    formatUptimeFromStart: function (datetime, withoutSeconds) {
      const a = moment()
      const b = moment(datetime)
      return this.formatUptime(a.diff(b, 'seconds'), withoutSeconds, (this.data.uptime > 864000)) // 86400000
    }
  }
}
</script>

<style scoped>
</style>
