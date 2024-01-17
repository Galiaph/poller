<template>
   <div class="header">
     <div id="header-menu">
       <div id="main-menu">
         <div id="main-menu-left">
           <a class="main-menu-item" href="/">
             Устройства
           </a>
           <a href="/loop" class="main-menu-item">
             Петли
           </a>
           <!-- <a href="#menu-data-dropdown" class="fg-button-icon-right ui-widget ui-corner-all main-menu-item" id="menu-data">
             Списки
           </a>
           <div id="menu-data-dropdown" style="display: none">
             <ul>
               <li><a id="menu-data-users" href="">Локальные пользователи</a></li>
               <li><a id="menu-data-domains" href="">Домены</a></li>
               <li><a id="menu-data-domains" href="">Узлы</a></li>
               <li><a id="menu-data-domains" href="">Пулы вланов</a></li>
               <li><a id="menu-data-domains" href="">Сервисы L2</a></li>
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
                   <li><a href="">По ВЛАНам</a></li>
                   <li><a href="">По устройствам</a></li>
                   <li><a href="">По портам</a></li>
                 </ul>
               </li>
               <li><a href="">По портам</a></li>
               <li><a href="">Изменения устройств</a></li>
               <li><a href="">Петли</a></li>
               <li><a href="">Карта</a></li>
               <li><a href="">Что нового?</a></li>
             </ul>
           </div> -->
         </div>
         <div id="main-menu-right">
           <div id="site-search">
             <form id="site-search-form" action="" method="POST">
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
  // eslint-disable-next-line
  name: 'Header',
  computed: {
    login_img () {
      return 'https://radix.mak.htel.cc/avatar/' + this.$store.getters.getLogin
    }
  },
  methods: {
    logout: async function () {
      await this.$store.dispatch('logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss">
</style>
