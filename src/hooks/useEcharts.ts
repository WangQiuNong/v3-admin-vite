import echarts, { type ECOption } from '@/utils/echarts';
import { watch, onBeforeUnmount, markRaw, Ref } from 'vue';
import { useResize } from './useResize'

export function useEcharts(elRef: Ref<HTMLDivElement>, options: Ref<ECOption>) {
  let myChart: echarts.ECharts | null = null

  function initChart() {
    if (!elRef.value) {
      console.error('initchart: elRef is null')
      return
    }
    // markRaw 非响应式数据
    myChart = markRaw(echarts.init(elRef.value));
    setOptions(options.value)
  }

  function setOptions(option: ECOption) {
    if (!myChart) {
      console.error('setOptions: myChart is null')
      return
    }
    myChart.setOption({ ...option, backgroundColor: 'transparent' })
  }

  initChart()

  // 监听options变化，处理数据返回较慢的场景
  watch(options, (newValue) => {
    if (myChart) {
      setOptions(newValue)
    } else {
      initChart()
    }
  }, {
    deep: true
  })

  const { initListener, destroyListener } = useResize(myChart)

  initListener()

  onBeforeUnmount(() => {
    if (!myChart) return
    destroyListener()
    myChart.dispose()
  })
  return {
    myChart
  }
}
