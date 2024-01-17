<template>
    <div
        :id="windowId"
        class="vue-window-modal"
        :style="{top, left, width, height}">
      <div class="vue-window-modal-header">
        <table style="margin: 0px;">
          <tbody>
            <tr>
              <td class="title">{{ `Port ${port}` }}</td>
              <td :id="windowId + '-' + 'header'" class="window-header-spacer" style="width: 600px;"></td>
              <td class="close" @click.stop="$emit('clickClose')"></td>
            </tr>
          </tbody>
        </table>
        <!-- <img src="/images/site/popup_close.png" @click.stop="$emit('clickClose')"> -->
      </div>
      <div class="window-body" style="height: 215px;">
        <div id="drop-down-header">
          <div style="margin-bottom: 5px;">
            <a class="title-link" title="Кликните для изменения" @click="isEditTag = !isEditTag" v-if="!isEditTag">{{ tag }}</a>
            <input type="text" name="tag-text" v-model="tag" v-if="isEditTag" @keydown.esc="tagEsc" @keypress.enter="tagEdit" autofocus/>
          </div>
          <select id="graph-duration" v-model="period">
            <option value="day">1 день</option>
            <option value="default" selected>По умолчанию</option>
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
            <option value="month3">3 Месяца</option>
          </select>
        </div>
        <div>
          <graph title="Трафик" yAxisTitle="Трафик (бит/c)" type="area" :series0="seriesTraffic0" :series1="seriesTraffic1" :values0="valuesTraffic0" :values1="valuesTraffic1" :upside1="true" />
        </div>
        <div>
          <graph title="Ошибки" yAxisTitle="Ошибки (пак/c)" type="area" :series0="seriesError0" :series1="seriesError1" :values0="valuesError0" :values1="valuesError1" :upside1="true" />
        </div>
        <div>
          <graph title="Сброшенные пакеты" yAxisTitle="Пакеты/c" type="area" :series0="seriesDiscard0" :series1="seriesDiscard1" :values0="valuesDiscard0" :values1="valuesDiscard1" :upside1="true" />
        </div>
        <div>
          <graph title="Unicast" yAxisTitle="Пакеты/c" type="area" :series0="seriesUnicast0" :series1="seriesUnicast1" :values0="valuesUnicast0" :values1="valuesUnicast1" :upside1="true" />
        </div>
        <div>
          <graph title="Multicast" yAxisTitle="Пакеты/c" type="area" :series0="seriesMulticast0" :series1="seriesMulticast1" :values0="valuesMulticast0" :values1="valuesMulticast1" :upside1="true" />
        </div>
        <div>
          <graph title="Broadcast" yAxisTitle="Пакеты/c" type="area" :series0="seriesBroadcast0" :series1="seriesBroadcast1" :values0="valuesBroadcast0" :values1="valuesBroadcast1" :upside1="true" />
        </div>
      </div>
    </div>
</template>

<script>
// import moment from 'moment'
import axios from 'axios'
import Graph from './Graph.vue'

const num = new Intl.NumberFormat('en', {
  notation: 'compact',
  compactDisplay: 'short',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
})

export default {
  name: 'WindowRRD',
  components: {
    Graph
  },
  props: {
    pageX: {
      type: String,
      default: '0px'
    },
    pageY: {
      type: String,
      default: '0px'
    },
    width: {
      type: String,
      default: '630px'
    },
    height: {
      type: String,
      default: '255px'
    },
    switch: {
      type: Number,
      default: null
    },
    port: {
      type: Number,
      default: 0
    },
    isPon: Boolean
  },
  data () {
    return {
      windowId: (function () {
        const one = Math.floor((Math.random() * 1000000) + 1) + ''
        const two = Math.floor((Math.random() * 1000000) + 1) + ''
        const three = Math.floor((Math.random() * 1000000) + 1) + ''
        return one + two + three
      })(),
      top: this.pageY,
      left: this.pageX,
      tag: '',
      tagOld: '',
      isEditTag: false,
      period: 'default',
      seriesTraffic0: {
        name: 'Входящий',
        color: 'green',
        tooltip: {
          valueDecimals: 0,
          valueSuffix: ' бит/c'
        }
      },
      seriesTraffic1: {
        name: 'Исходящий',
        color: 'blue',
        tooltip: {
          valueDecimals: 0,
          valueSuffix: ' бит/c'
        }
      },
      seriesError0: {
        name: 'Ошибки RX',
        color: 'orange',
        tooltip: {
          valueDecimals: 0,
          valueSuffix: ' пак/c'
        }
      },
      seriesError1: {
        name: 'Ошибки TX',
        color: 'red',
        tooltip: {
          valueDecimals: 0,
          valueSuffix: ' пак/c'
        }
      },
      seriesDiscard0: {
        name: 'Входящие',
        color: 'mediumpurple',
        tooltip: {
          valueDecimals: 0,
          valueSuffix: ' пак/c'
        }
      },
      seriesDiscard1: {
        name: 'Исходящие',
        color: 'goldenrod',
        tooltip: {
          valueDecimals: 0,
          valueSuffix: ' пак/c'
        }
      },
      seriesUnicast0: {
        name: 'Входящие',
        color: 'mediumpurple',
        tooltip: {
          valueDecimals: 0,
          valueSuffix: ' пак/c'
        }
      },
      seriesUnicast1: {
        name: 'Исходящие',
        color: 'goldenrod',
        tooltip: {
          valueDecimals: 0,
          valueSuffix: ' пак/c'
        }
      },
      seriesMulticast0: {
        name: 'Входящие',
        color: 'khaki',
        tooltip: {
          valueDecimals: 0,
          valueSuffix: ' пак/c'
        }
      },
      seriesMulticast1: {
        name: 'Исходящие',
        color: 'firebrick',
        tooltip: {
          valueDecimals: 0,
          valueSuffix: ' пак/c'
        }
      },
      seriesBroadcast0: {
        name: 'Входящие',
        color: 'darkgreen',
        tooltip: {
          valueDecimals: 0,
          valueSuffix: ' пак/c'
        }
      },
      seriesBroadcast1: {
        name: 'Исходящие',
        color: 'darkcyan',
        tooltip: {
          valueDecimals: 0,
          valueSuffix: ' пак/c'
        }
      },
      valuesTraffic0: { start: 0, step: 0, data: [] },
      valuesTraffic1: { start: 0, step: 0, data: [] },
      valuesError0: { start: 0, step: 0, data: [] },
      valuesError1: { start: 0, step: 0, data: [] },
      valuesDiscard0: { start: 0, step: 0, data: [] },
      valuesDiscard1: { start: 0, step: 0, data: [] },
      valuesUnicast0: { start: 0, step: 0, data: [] },
      valuesUnicast1: { start: 0, step: 0, data: [] },
      valuesMulticast0: { start: 0, step: 0, data: [] },
      valuesMulticast1: { start: 0, step: 0, data: [] },
      valuesBroadcast0: { start: 0, step: 0, data: [] },
      valuesBroadcast1: { start: 0, step: 0, data: [] }
      // trafficData: {
      //   chart: {
      //     type: 'area',
      //     width: 615,
      //     height: 250,
      //     borderWidth: 1,
      //     borderColor: 'lightgray',
      //     borderRadius: 5,
      //     zoomType: 'xy',
      //     panning: true,
      //     panKey: 'shift',
      //     events: {
      //       redraw: ev => { this.calcStat(ev.target) }
      //     }
      //     // style: {
      //     //   fontSize: '1.55rem'
      //     // },
      //   },
      //   lang: {
      //     months: ['Janvier', 'F├®vrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Ao├╗t', 'Septembre', 'Octobre', 'Novembre', 'D├®cembre'],
      //     weekdays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
      //   },
      //   time: {
      //     useUTC: false,
      //     timezone: 'Europe/Moscow'
      //   },
      //   accessibility: {
      //     enabled: false
      //   },
      //   title: {
      //     text: 'Трафик',
      //     style: {
      //       fontSize: '10pt',
      //       fontWeight: 'bold',
      //       margin: 25
      //     }
      //   },
      //   xAxis: {
      //     type: 'datetime',
      //     gridLineWidth: 1,
      //     gridLineDashStyle: 'ShortDot',
      //     minorTicks: true,
      //     lineColor: 'black',
      //     minorGridLineColor: '#FFDDDD',
      //     minorTicksPerMajor: 3,
      //     gridLineColor: 'darkgray',
      //     dateTimeLabelFormats: {
      //       day: '%a %d %b'
      //     }
      //   },
      //   yAxis: {
      //     title: {
      //       text: 'Трафик (бит/c)'
      //     },
      //     gridLineWidth: 1,
      //     gridLineDashStyle: 'ShortDot',
      //     minorTicks: true,
      //     lineColor: 'black',
      //     minorGridLineColor: '#FFDDDD',
      //     minorTicksPerMajor: 3,
      //     gridLineColor: 'darkgray'
      //   },
      //   credits: {
      //     enabled: false
      //   },
      //   legend: {
      //     layout: 'vertical',
      //     align: 'center',
      //     x: -230
      //   },
      //   series: [{
      //     name: 'Входящий',
      //     data: [],
      //     color: 'green',
      //     marker: {
      //       enabled: false
      //     },
      //     pointStart: 0,
      //     pointInterval: 0,
      //     showInLegend: true,
      //     tooltip: {
      //       valueDecimals: 0,
      //       valueSuffix: ' бит/c'
      //     }
      //   }, {
      //     name: 'Исходящий',
      //     data: [],
      //     color: 'blue',
      //     marker: {
      //       enabled: false
      //     },
      //     pointStart: 0,
      //     pointInterval: 0,
      //     showInLegend: true,
      //     tooltip: {
      //       valueDecimals: 0,
      //       valueSuffix: ' бит/c'
      //     }
      //   }]
      // }
    }
  },
  methods: {
    tagEsc () {
      if (this.isEditTag) {
        this.isEditTag = false
        this.tag = this.tagOld
      }
    },
    async getTraffic () {
      try {
        const resp = await axios.get(`https://device-darsan.mak.htel.cc/${this.isPon ? 'pon' : 'switch'}/${this.switch}/port/${this.port}/data/traffic?period=${this.period}`)

        this.valuesTraffic0 = { data: resp.data.series.input, start: resp.data.start, step: resp.data.step }
        this.valuesTraffic1 = { data: resp.data.series.output, start: resp.data.start, step: resp.data.step }

        this.valuesError0 = { data: resp.data.series.inerrors, start: resp.data.start, step: resp.data.step }
        this.valuesError1 = { data: resp.data.series.outerrors, start: resp.data.start, step: resp.data.step }

        this.valuesDiscard0 = { data: resp.data.series.indiscard, start: resp.data.start, step: resp.data.step }
        this.valuesDiscard1 = { data: resp.data.series.outdiscard, start: resp.data.start, step: resp.data.step }

        this.valuesUnicast0 = { data: resp.data.series.inucast, start: resp.data.start, step: resp.data.step }
        this.valuesUnicast1 = { data: resp.data.series.outucast, start: resp.data.start, step: resp.data.step }

        this.valuesMulticast0 = { data: resp.data.series.inmucast, start: resp.data.start, step: resp.data.step }
        this.valuesMulticast1 = { data: resp.data.series.outmucast, start: resp.data.start, step: resp.data.step }

        this.valuesBroadcast0 = { data: resp.data.series.inbrcast, start: resp.data.start, step: resp.data.step }
        this.valuesBroadcast1 = { data: resp.data.series.outbrcast, start: resp.data.start, step: resp.data.step }
      } catch (err) {
        console.error('error in getTraffic')
      }
    },
    async tagEdit () {
      this.isEditTag = false
      try {
        await axios.put(`https://device-darsan.mak.htel.cc/${this.isPon ? 'pon' : 'switch'}/${this.switch}/port/${this.port}/tag`, { port: this.port, tag: this.tag })
      } catch (err) {
        console.error('error in WindowRRD mounted')
      }
    },
    getThisWindowAndHeaderElements () {
      return {
        window: window.document.getElementById(this.windowId),
        windowHeader: window.document.getElementById(this.windowId + '-' + 'header')
      }
    },
    dragElement () {
      const context = this
      let pos1 = 0
      let pos2 = 0
      let pos3 = 0
      let pos4 = 0
      const _window = this.getThisWindowAndHeaderElements().window
      const _windowHeader = this.getThisWindowAndHeaderElements().windowHeader
      _windowHeader.onmousedown = dragMouseDown
      function dragMouseDown (e) {
        e = e || window.event
        // get the mouse cursor position at startup:
        pos3 = e.pageX
        pos4 = e.pageY
        document.onmouseup = closeDragElement
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag
        // _windowHeader.style.cursor = '-webkit-grabbing'
      }

      function elementDrag (e) {
        e = e || window.event
        // calculate the new cursor position:
        pos1 = pos3 - e.pageX
        pos2 = pos4 - e.pageY
        pos3 = e.pageX
        pos4 = e.pageY
        // set the element's new position:
        // set the element's new position:
        _window.style.top = (_window.offsetTop - pos2) + 'px'
        context.top = _window.style.top

        _window.style.left = (_window.offsetLeft - pos1) + 'px'
        context.left = _window.style.left
      }

      function closeDragElement () {
        // stop moving when mouse button is released:
        document.onmouseup = null
        document.onmousemove = null
        // _windowHeader.style.cursor = '-webkit-grab'
      }
    },
    getHighestWindow () {
      const windows = Array.from(window.document.getElementsByClassName('vue-window-modal'))
      const zIndexs = windows.map(el => Number(el.style.zIndex))
      const highest = Math.max.apply(Math, zIndexs)
      return highest
    },
    sendWindowToHighest () {
      this.getThisWindowAndHeaderElements().window.style.zIndex = this.getHighestWindow() + 1
    },
    // centerWindow () {
    //   const myElement = this.getThisWindowAndHeaderElements().window
    //   const pageWidth = window.innerWidth
    //   const pageHeight = window.innerHeight
    //   const myElementWidth = myElement.offsetWidth
    //   const myElementHeight = myElement.offsetHeight
    //   const diff = this.activeWindows() * 20
    //   myElement.style.top = (pageHeight / 2) - (myElementHeight / 2) + diff + 'px'
    //   myElement.style.left = (pageWidth / 2) - (myElementWidth / 2) + diff + 'px'
    // },
    // checkTheresIsAnyAnotherCenteredWindow () {
    //   // not being used anymore but working well...
    //   const windows = Array.from(window.document.getElementsByClassName('vue-window-modal'))
    //   const centeredWindows = windows.filter(el => {
    //     const myElement = el
    //     const pageWidth = window.innerWidth
    //     const pageHeight = window.innerHeight
    //     const myElementWidth = myElement.offsetWidth
    //     const myElementHeight = myElement.offsetHeight
    //     return el.style.top === (pageHeight / 2) - (myElementHeight / 2) + 'px' &&
    //                   el.style.left === (pageWidth / 2) - (myElementWidth / 2) + 'px'
    //   })

    //   return centeredWindows
    // },
    // activeWindows () {
    //   const windows = Array.from(window.document.getElementsByClassName('vue-window-modal'))
    //   const openedWindows = windows.filter(el => {
    //     return el.style.display === 'block'
    //   })
    //   return openedWindows.length
    // }
    // hide () {
    //   this.getThisWindowAndHeaderElements().window.style.display = 'none'
    // },
    // show () {
    //   this.getThisWindowAndHeaderElements().window.style.display = 'block'
    // }
    calcStat (chart) {
      for (const [i, item] of chart.legend.allItems.entries()) {
        let data = item.data.filter(point => point.isInside).map(point => point.y) // grab only points within the visible range
        let label = item.name

        if (data.length) {
          if (i === 1) data = data.map(el => -el)

          const last = data[data.length - 1]
          const max = Math.max(...data)
          const min = Math.min(...data)
          const avg = data.reduce((a, b) => a + b, 0) / data.length

          label += `: мин. ${num.format(min)};  макс. ${num.format(max)}; сред. ${num.format(avg)}; посл. ${num.format(last)}`
        }

        item.legendItem.label.element.innerHTML = label
      }
    }
  },
  watch: {
    period: {
      deep: true,
      handler () {
        this.getTraffic()
      }
    }
  //   active (newValue) {
  //     if (newValue) {
  //       this.show()
  //       this.sendWindowToHighest()
  //       this.centerWindow()
  //     } else {
  //       this.hide()
  //     }
  //   }
  },
  created: async function () {
    try {
      const resp = await axios.get(`https://device-darsan.mak.htel.cc/${this.isPon ? 'pon' : 'switch'}/${this.switch}/port/${this.port}/tag`)
      this.tag = resp.data.tag || 'empty'
      this.tagOld = resp.data.tag || 'empty'
    } catch (err) {
      console.error('error in WindowRRD mounted')
    }
  },
  mounted: function () {
    this.getTraffic()
    this.dragElement()
    const _window = this.getThisWindowAndHeaderElements().window
    _window.addEventListener('click', () => {
      this.sendWindowToHighest()
    })
    _window.style.zIndex = 9999
  }
}
</script>

<style lang="scss">
// .vue-window-modal {
//     position: fixed;
//     background-color:#ffffff;
//     box-shadow: 6px 6px 10px 0px #707070;
//     border: solid 2px gray;
//     // border-radius: 3px;
//     // display: none;
//     padding: 0.5em;
//     max-height: 90vh;
//     max-width: 90vw;
// }

// .vue-window-modal .vue-window-modal-header {
//     background-color: rgb(114, 152, 195);
//     padding: 0.3em;
//     // border-top-left-radius: 3px;
//     // border-top-right-radius: 3px;
//     color: white;
//     // eight: 40px;
//     font-weight: bold;
//     // cursor: -webkit-grab;
//     // user-select: none;
// }

// td.close::before {
//     cursor: pointer;
//     width: 10px;
//     content: '\00d7';
// }

// td.title {
//   white-space: pre;
// }
</style>
