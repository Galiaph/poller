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
        <a class="modal" href="/user/add" title="Добавить пользователя"><img src="/images/site/user_add.png"/></a>
      </div>
      <div>
        <a class="modal" href="/userrole/add" title="Добавить роль"><img src="/images/site/role_add.png"/></a>
      </div>
      <div>
        <a class="modal" href="/devicedomain/add" title="Добавить группу ВЛАНов"><img src="/images/site/domain_add.png"/></a>
      </div>
    </div>
    <div v-for="(item, index) in groupDevices" :key="item" v-bind:class="selected === index ? 'group-box-selected' : 'group-box'">
      <div class="group-header">
        <div class="group-header-wrapper">
          <div class="group-status-min min-ok" v-if="selected !== index"></div>
          <div class="group-title">
            <a class="group-title-link" @click="selected = index" v-if="selected !== index">{{ item.name }}</a>
            <span class="group-title-stub" v-else>{{ item.name }}</span>
          </div><!-- end of group-title -->
          <div class="group-actions">
            <div><a class="modal" title="Свойства" href=""><img src="/images/site/edit_n.png"/></a></div>
            <div><a class="modal" title="Разрешения" href=""><img src="/images/site/perms_n.png"/></a></div>
            <div><a class="modal" title="Удалить" href=""><img v-bind:src="selected !== index ? '/images/site/delete_n.png' : '/images/site/delete_s.png'"/></a></div>
          </div><!-- end of group-actions -->
        </div><!-- end of group-header-wrapper -->
      </div><!-- end of group-header -->
      <div class="group-body">
        <div class="group-status">
          <img src="/images/site/grp_ok.png"/>
        </div><!-- end of group-status -->
        <div class="group-info">
          <div class="node-title-active">
            <a href="">{{ item.name }}</a><br/>
          </div>
          <div class="group-info-list">
            <ul>
              <li>
                Всего: {{ item.total }}
              </li>
              <li>
                Отключено: {{ item.disabled }}
              </li>
              <li>
                Недоступно: {{ item.down }}
              </li>
            </ul>
          </div>
        </div><!-- end of group-info -->
      </div><!-- end of group-body -->
      <div class="group-footer">
      </div><!-- end of group-footer -->
    </div><!-- end of group-box -->
    <div class="group-box-bottom"></div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LeftBar',
  data: () => ({
    selected: 0,
    groupDevices: {}
  }),
  mounted: async function () {
    try {
      const resp = await axios.get('https://device-darsan.mol.net.ua/meta/node-stat')
      this.groupDevices = resp.data
    } catch (err) {
      console.error('error in LeftBar mounted')
    }
  }
}
</script>

<style lang="scss">
</style>
