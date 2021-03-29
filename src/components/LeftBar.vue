<template>
  <div class="left-bar" id="left-bar">
    <div style="padding-left: 10px">
      <a href="/list/devices/ipoe-aggregate/1">Агреггирующие устройства IPOE</a>
    </div>
    <div class="group-box-top">
      <div>
        <a class="modal" href="/device/add" title="Добавить устройство"><img src="/images/site/dev_add.png"/></a>
      </div>
      <div>
        <a class="modal" href="/devicegroup/add" title="Добавить группу устройств"><img src="/images/site/grp_add.png"/></a>
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
    <div class="group-box">
      <div class="group-header">
        <div class="group-header-wrapper">
          <div class="group-status-min min-ok"></div>
          <div class="group-title">
            <a class="group-title-link" href="">group-title</a>
          </div><!-- end of group-title -->
          <div class="group-actions">
            <div><a class="modal" title="Свойства" href=""><img src="/images/site/edit_n.png"/></a></div>
            <div><a class="modal" title="Разрешения" href=""><img src="/images/site/perms_n.png"/></a></div>
            <div><a class="modal" title="Удалить" href=""><img src="/images/site/delete_n.png"/></a></div>
          </div><!-- end of group-actions -->
        </div><!-- end of group-header-wrapper -->
      </div><!-- end of group-header -->
      <div class="group-body">
        <div class="group-status">
          <img src=""/>
        </div><!-- end of group-status -->
        <div class="group-info">
          <div class="node-title-active">
            <a href="">group.nodes</a><br/>
          </div>
          [% END %]
          <div class="group-info-list">
            <ul>
              <li>
                Всего: total
              </li>
              <li>
                Отключено: off
              </li>
              <li>
                Недоступно: down
              </li>
            </ul>
          </div>
        </div><!-- end of group-info -->
      </div><!-- end of group-body -->
      <div class="group-footer">
      </div><!-- end of group-footer -->
    </div><!-- end of group-box -->
  </div>
</template>

<script>
export default {
  name: 'LeftBar'
}
</script>

<style lang="scss">
</style>
