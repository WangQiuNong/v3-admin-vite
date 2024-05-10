import { EChartsType } from 'echarts/core';
import { useDebounceFn, useEventListener } from '@vueuse/core';
import { ref } from 'vue';

export function useResize(chartInstance: EChartsType | null) {
  let sideEl: HTMLElement | null = null

  const resize = useDebounceFn(() => {
    console.log('useResize-Fn-resize');
    if (!chartInstance) return
    chartInstance.resize()
  }, 200)
  function sideResizeHandler(e) {
    if (e.propertyName === 'width') {
      resize()
    }
  }
  const listeners = ref<Array>([])
  function initListener() {
    // 监听窗口、侧边栏变化，echart自适应
    // window.addEventListener('resize', resize)
    listeners.value.push(useEventListener(window, 'resize', resize))
    sideEl = document.querySelector('.sidebar-container')
    // sideEl && sideEl.addEventListener('transitionend', sideResizeHandler)
    if (sideEl) {
      listeners.value.push(useEventListener(sideEl, 'transitionend', sideResizeHandler))
    }
  }
  function destroyListener() {
    listeners.value.forEach((listener) => {
      listener()
    })
    // window.removeEventListener('resize', resize)
    // sideEl && sideEl.removeEventListener('transitionend', sideResizeHandler)
  }

  return {
    initListener,
    destroyListener
  }
}
