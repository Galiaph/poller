<template>
   <div class="header">
     <div id="header-menu">
       <div id="main-menu">
         <div id="main-menu-left">
           <span id="ws-star" title="Уведомления недоступны">&#x2731;</span>
           <a class="main-menu-item" href="/list/index">
             Устройства
           </a>
           <a href="#menu-data-dropdown" class="fg-button-icon-right ui-widget ui-corner-all main-menu-item" id="menu-data">
             Списки
           </a>
           <div id="menu-data-dropdown" style="display: none">
             <ul>
               <li><a id="menu-data-users" href="/list/userindex">Локальные пользователи</a></li>
               <li><a id="menu-data-domains" href="/list/domain_index">Домены</a></li>
               <li><a id="menu-data-domains" href="/list/node_index">Узлы</a></li>
               <li><a id="menu-data-domains" href="/list/devicedomain_index">Пулы вланов</a></li>
               <li><a id="menu-data-domains" href="/list/l2service_index">Сервисы L2</a></li>
             </ul>
           </div>
           <div id="menu-view-dropdown" style="display: none">
             <ul>
               <li><a id="menu-view-districts" href="#" onclick="showDistricts()">Показать районы</a></li>
               <li><a id="menu-view-devices" href="#" onclick="showDevices()">Показать устройства</a></li>
             </ul>
           </div>

           <a href="#menu-reports-dropdown" class="fg-button-icon-right ui-widget ui-corner-all main-menu-item" id="menu-reports">
             Прочее
           </a>
           <div id="menu-reports-dropdown" style="display: none">
             <ul>
               <li><a href="#">Отчеты</a>
                 <ul>
                   <li><a href="/reports/by-vlan/1">По ВЛАНам</a></li>
                   <li><a href="/reports/devices">По устройствам</a></li>
                   <li><a href="/reports/top-ports/all/day">По портам</a></li>
                 </ul>
               </li>
               <li><a href="/reports/top-ports/all/day">По портам</a></li>
               <li><a href="/reports/dev-changes">Изменения устройств</a></li>
               <li><a href="/reports/loops">Петли</a></li>
               <li><a href="/other/map">Карта</a></li>
               <li><a href="/other/poller-news">Что нового?</a></li>
             </ul>
           </div>
         </div>
         <div id="main-menu-right">
           <div id="site-search">
             <form id="site-search-form" action="/searching/index" method="POST">
               <input type="text" name="search-field"/>
               <a href="javascript:$('#site-search-form').submit()" style="color: white; text-decoration: none">&nbsp;Искать</a>
             </form>
           </div>
           <div id="logout-link" class="main-menu-item" align="right">
             <img :src="login_img" width="16" height="16">
             <a @click="logout" href=""><img src="/images/site/turnoff.png" style="margin-top: 5px" title="Выход"></a>
           </div>
         </div>
       </div>
     </div>
     <div id="global-actions"></div>
   </div>
</template>

<script>
export default {
  name: 'Header',
  computed: {
    login_img () {
      const login = localStorage.getItem('login')
      const token = encodeURIComponent(localStorage.getItem('token'))
        .replace(/\\'/g, '%27')
        // .replace(/\\-/g, '%2D')
        // .replace(/\\_/g, '%5F')
        // .replace(/\\./g, '%2E')
        // .replace(/\\!/g, '%21')
        // .replace(/\\~/g, '%7E')
      return 'https://worker-darsan.mol.net.ua/worker/' + login + '/avatar?darsan2=' + token
    }
  },
  methods: {
    logout: function () {
      this.$store.dispatch('logout').then(() => { this.$router.push('/login') })
    }
  }
}
</script>

<style lang="scss">
</style>
