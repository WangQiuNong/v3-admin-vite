<template>
  <div v-loading="loading" style="padding: 16px;">
    <p>动态路由测试1 -- 图表测试</p>
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ECOption } from '@/utils/echarts';
import { useEcharts } from "@/hooks/useEcharts";

const chart = ref<HTMLDivElement | null>(null)

interface ChartData {
  time: string[];
  value1: number[];
  value2: number[];
}
const data = ref<ChartData>({})
const loading = ref<Boolean>(true)

const lineOptions = computed((): ECOption => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  legend: {
    // data: ['销售额', '内容量']
  },
  grid: {
    left: '3%',
    right: '3%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: data.value.time
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '销售额',
      color: '#14D3BA',
      type: 'line',
      data: data.value.value1,
      smooth: true,
      emphasis: {
        focus: 'series'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0.15,
              color: '#14D3BA'
            },
            {
              offset: 1,
              color: '#fff'
            }
          ]
        }
      }
    },
    {
      color: '#0A78D2',
      name: '内容量',
      type: 'line',
      data: data.value.value2,
      smooth: true,
      emphasis: {
        focus: 'series'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0.25,
              color: '#0A78D2'
            },
            {
              offset: 1,
              color: '#fff'
            }
          ]
        }
      }
    }
  ]
}))
function getData() {
  loading.value = true
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      data.value = {
        time: ['6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        value1: [4444, 5555, 3333, 7477, 4800, 5551, 3978, 3888],
        value2: [2223, 4095, 2478, 5061, 2660, 3444, 2867]
      }
      console.log('data', data.value);
      loading.value = false
      resolve(data)
    }, 1000 * 2)
  })
}

getData()

onMounted(() => {
  useEcharts(chart as HTMLDivElement, lineOptions)
  console.log('onMounted-chart');
})
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 300px;
}
</style>
