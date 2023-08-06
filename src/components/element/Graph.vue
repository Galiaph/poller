<template>
  <Chart :options="chartOptions" />
</template>

<script>
import { Chart } from 'highcharts-vue'

const num = new Intl.NumberFormat('en', {
  notation: 'compact',
  compactDisplay: 'short',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
})

export default {
  name: 'DeviceGraph',
  components: {
    Chart
  },
  props: {
    title: String,
    yAxisTitle: String,
    type: {
      type: String,
      default: 'line'
    },
    options: {
      type: Object,
      default () { return {} }
    },
    series0: {
      type: Object,
      default () { return {} }
    },
    series1: {
      type: Object,
      default () { return {} }
    },
    series2: {
      type: Object,
      default () { return {} }
    },
    values0: {
      type: Object,
      default () { return { start: 0, step: 0, data: [] } }
    },
    values1: {
      type: Object,
      default () { return { start: 0, step: 0, data: [] } }
    },
    values2: {
      type: Object,
      default () { return { start: 0, step: 0, data: [] } }
    },
    upside1: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      chartOptions: {
        time: {
          useUTC: false
        },
        accessibility: {
          enabled: false
        },
        title: {
          text: this.title,
          style: {
            fontSize: '10pt',
            fontWeight: 'bold',
            margin: 25
          }
        },
        chart: {
          type: this.type,
          width: 615,
          height: 250,
          borderWidth: 1,
          borderColor: 'lightgray',
          borderRadius: 5,
          zoomType: 'xy',
          panning: true,
          panKey: 'shift',
          events: {
            redraw: ev => { this.calcStat(ev.target) }
          }
          // style: {
          //   fontSize: "1.55rem",
          // },
        },
        credits: {
          enabled: false
        },
        legend: {
          layout: 'vertical',
          align: 'center',
          x: -230,
          style: {
          // fontSize: "10pt",
          }
        },
        tooltip: {
          shared: true,
          pointFormatter () {
            return `<span style="color: ${this.color}">&#x23fa;</span> ${this.series.name}: <b>${num.format(this.y)}</b>&thinsp;${this.series.userOptions.tooltip.valueSuffix}<br/>`
          }
        },
        xAxis: {
          type: 'datetime',
          gridLineWidth: 1,
          gridLineDashStyle: 'ShortDot',
          minorTicks: true,
          lineColor: 'black',
          minorGridLineColor: '#FFDDDD',
          minorTicksPerMajor: 3,
          gridLineColor: 'darkgray'
        },
        yAxis: {
          title: { text: this.yAxisTitle },
          gridLineWidth: 1,
          gridLineDashStyle: 'ShortDot',
          minorTicks: true,
          lineColor: 'black',
          minorGridLineColor: '#FFDDDD',
          minorTicksPerMajor: 3,
          gridLineColor: 'darkgray'
        },
        series: [
          {
            marker: { enabled: false },
            data: [],
            pointStart: 0,
            pointInterval: 0,
            showInLegend: false,
            ...this.series0
          },
          {
            marker: { enabled: false },
            data: [],
            pointStart: 0,
            pointInterval: 0,
            showInLegend: false,
            ...this.series1
          },
          {
            marker: { enabled: false },
            data: [],
            pointStart: 0,
            pointInterval: 0,
            showInLegend: false,
            ...this.series2
          }
        ],
        ...this.options
      }
    }
  },
  created () {
    for (const s of this.chartOptions.series) {
      if (s.name) s.showInLegend = true
    }
  },
  methods: {
    calcStat (chart) {
      for (const [i, item] of chart.legend.allItems.entries()) {
        let data = item.data.filter(point => point.isInside).map(point => point.y) // grab only points within the visible range
        let label = item.name

        if (data.length) {
          if (i === 1 && this.upside1) data = data.map(el => -el)

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
    values0: {
      // deep: true,
      handler (val) {
        if (val.start && val.step) {
          this.chartOptions.series[0].pointStart = val.start * 1000
          this.chartOptions.series[0].pointInterval = val.step * 1000
        }
        this.chartOptions.series[0].data = val.data
        this.chartOptions.yAxis = Math.max(...val.data)
      }
    },
    values1: {
      // deep: true,
      handler (val) {
        if (val.start && val.step) {
          this.chartOptions.series[1].pointStart = val.start * 1000
          this.chartOptions.series[1].pointInterval = val.step * 1000
        }

        const values = val.data || []

        if (this.upside1) {
          if (val.start) {
            values.forEach(el => { if (el[0]) el[0] *= -1 })
          } else {
            values.forEach(el => { if (el[1]) el[1] *= -1 })
          }
        }
        this.chartOptions.series[1].data = values
        this.chartOptions.yAxis = Math.min(...values)
      }
    },
    values2: {
      // deep: true,
      handler (val) {
        this.chartOptions.series[2].pointStart = val.start * 1000
        this.chartOptions.series[2].pointInterval = val.step * 1000
        this.chartOptions.series[2].data = val.data
      }
    },
    title (val) {
      this.chartOptions.title.text = val
    }
  }
}
</script>

<style>
.highcharts-container {
 display: inline-block !important
}
</style>
