<template>
      <tr>
        <td class="item-box-left-stub" style=""></td>
        <td class="telnet">
          <a :href="'telnet://' + data.ip" class="telnet"></a>
        </td>
        <td class="item-box-title">
          <a class="details-link " href="" @click.prevent="select($event)" :title="data.device_name">{{ data.device_name }}</a>
        </td>
        <td class="item-box-title">
          {{ data.message }}
        </td>
        <td class="item-box-right-stub"></td>
      </tr>
</template>

<script>
export default {
  name: 'CentralRow',
  props: {
    data: Object
  },
  methods: {
    select: function (event) {
      this.$emit('selected', event)
    }
  }
}
</script>

<style>
a.telnet::before {
    width: 10px;
    margin-left: 5px;
    content: '\f120';
}
</style>
