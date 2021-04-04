<template>
  <div :class="isSelected ? 'group-box-selected' : 'group-box'">
    <div class="group-header">
      <div class="group-header-wrapper">
        <div class="group-status-min" :class="minState" v-if="!isSelected"></div>
        <div class="group-title">
          <a class="group-title-link" @click="select" v-if="!isSelected">{{ data.name }}</a>
          <span class="group-title-stub" v-else>{{ data.name }}</span>
        </div><!-- end of group-title -->
        <div class="group-actions">
          <div><a class="modal" title="Свойства" href=""><img src="/images/site/edit_n.png"/></a></div>
          <div><a class="modal" title="Разрешения" href=""><img src="/images/site/perms_n.png"/></a></div>
          <div><a class="modal" title="Удалить" href=""><img :src="'/images/site/delete_' + (!isSelected ? 'n' : 's') + '.png'"/></a></div>
        </div><!-- end of group-actions -->
      </div><!-- end of group-header-wrapper -->
    </div><!-- end of group-header -->
    <div class="group-body">
      <div class="group-status">
        <img :src="'/images/site/grp_' + groupState + '.png'"/>
      </div><!-- end of group-status -->
      <div class="group-info">
        <div class="node-title">
          <a href="" @click.prevent="">{{ data.name }}</a>
          <br/>
        </div>
        <div class="group-info-list">
          <ul>
            <li>
              Всего: {{ data.total }}
            </li>
            <li>
              Отключено: {{ data.disabled }}
            </li>
            <li v-if="isDown">
              Недоступно: {{ data.down }}
            </li>
          </ul>
        </div>
      </div><!-- end of group-info -->
    </div><!-- end of group-body -->
    <div class="group-footer">
    </div><!-- end of group-footer -->
  </div><!-- end of group-box -->
</template>

<script>
export default {
  name: 'LeftRow',
  props: {
    isSelected: Boolean,
    data: Object
  },
  computed: {
    isDown () {
      return this.data.down > 0
    },
    minState () {
      if (this.data.down > 0 && this.data.down < this.data.total) {
        return 'min-warn'
      } else if (this.data.down > 0 && this.data.down >= this.data.total) {
        return 'min-down'
      }

      return 'min-ok'
    },
    groupState () {
      if (this.data.down > 0 && this.data.down < this.data.total) {
        return 'warn'
      } else if (this.data.down > 0 && this.data.down >= this.data.total) {
        return 'down'
      }

      return 'ok'
    }
  },
  methods: {
    select: function () {
      this.$emit('selected')
    }
  }
}
</script>

<style scoped>

</style>
