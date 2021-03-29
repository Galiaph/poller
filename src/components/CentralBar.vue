<template>
  <div class="central-bar" id="central-bar">
    <div  id="tabs-device" class="ui-tabs ui-widget ui-widget-content ui-corner-all">
      <ul style="line-height: 1;" class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header">
        <li><a href="#wired" style="padding-top: 3px;padding-bottom: 3px;" class="ui-corner-all" >Проводные</a></li>
        <li><a href="" style="padding-left: 0px;padding-top: 3px;padding-bottom: 3px;">Радио</a></li>
        <li><a href="" style="padding-left: 0px;padding-top: 3px;padding-bottom: 3px;">GPON</a></li>
<!--        <li>-->
<!--          <a href="#wired" style="padding-left: 0px;">-->
<!--            <a href="" style="padding-left: 0px;padding-top: 3px;padding-bottom: 3px;">Проводные</a>-->
<!--          </a>-->
<!--        </li>-->
<!--        <li><a href="#radio" style="padding-top: 3px;padding-bottom: 3px;">Радио</a></li>-->
<!--        <li><a style="padding-left: 0px; "><a href="" style="padding-left: 0px;padding-top: 3px;padding-bottom: 3px;">GPON</a></a></li>-->
<!--        <li>-->
<!--          <a href="#wired" style="padding-left: 0px;">-->
<!--            <a href="" style="padding-left: 0px;padding-top: 3px;padding-bottom: 3px;">Проводные</a>-->
<!--          </a>-->
<!--        </li>-->
<!--        <li><a style="padding-left: 0px; "> <a href="" style="padding-left: 0px;padding-top: 3px;padding-bottom: 3px;">Радио</a></a></li>-->
<!--        <li><a href="#gpon" style="padding-top: 3px;padding-bottom: 3px;">GPON</a></li>-->
      </ul>

<!--      <div>-->
<!--        <div id="wired" style="padding-left: 0px; padding-right: 0px; ">-->
<!--        </div>-->
<!--        <div id="radio" style="padding-left: 0px; padding-right: 0px; ">-->
<!--        </div>-->
<!--        <div id="gpon" style="padding-left: 0px; padding-right: 0px; ">-->
<!--        </div>-->
<!--      </div>-->
    </div>
  </div>
</template>

<script>
export default {
  name: 'CentralBar'
}
</script>

<style scoped>
.ui-tabs {
  position: relative;
  padding: .2em;
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
  background: #f2f5f7;
  /*background-repeat: repeat-x;*/
  color: #362b36;
}

.ui-corner-all {
  border-radius: 6px;
}
</style>
