<template>
  <div class="left-bar" id="left-bar">
    <div style="padding-left: 10px">
      <a href="">Агреггирующие устройства IPOE</a>
    </div>
    <div class="group-box-top">
      <div>
        <a class="modal" href="" title="Добавить устройство"><img src="/images/site/dev_add.png"/></a>
      </div>
      <div>
        <a class="modal" href="" title="Добавить группу устройств"><img src="/images/site/grp_add.png"/></a>
      </div>
      <div>
        <a class="modal" href="" title="Добавить пользователя"><img src="/images/site/user_add.png"/></a>
      </div>
      <div>
        <a class="modal" href="" title="Добавить роль"><img src="/images/site/role_add.png"/></a>
      </div>
      <div>
        <a class="modal" href="" title="Добавить группу ВЛАНов"><img src="/images/site/domain_add.png"/></a>
      </div>
    </div>
    <LeftRow v-for="(item, index) in groupDevicesBar" :data="item" :key="item" :is-selected="item.entity === groupSelect" @selected="select(index)" />
    <div class="group-box-bottom"></div>
  </div>
</template>

<script>
// import axios from 'axios'
import LeftRow from './element/LeftRow'

export default {
  name: 'LeftBar',
  components: {
    LeftRow
  },
  props: {
    groupDevicesBar: Object,
    groupSelect: {
      type: Number,
      default: 10
    }
  },
  // data: () => ({
  //   itemSelected: 0
  // }),
  methods: {
    select: function (index) {
      // this.itemSelected = index
      this.$emit('rowSelect', this.groupDevicesBar[index].entity)
    }
  }
  // mounted: async function () {
  //   try {
  //     const resp = await axios.get('https://device-darsan.mol.net.ua/meta/node-stat')
  //     this.groupDevices = resp.data
  //   } catch (err) {
  //     console.error('error in LeftBar mounted')
  //   }
  // }
}
</script>

<style>
ul {
  margin: 0;
  padding: 0;
}
</style>
