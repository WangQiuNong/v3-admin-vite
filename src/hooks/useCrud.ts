import { reactive, ref } from 'vue'

interface TableResult<T = any> {
  total: number;
  list: T[];
}

interface IOptions<T = any> {
  // api
  apiFn: (params: any) => Promise<ApiResponseData>;
  // api请求参数
  params?: Recordable;
  // api返回值不是约定的TableResult的处理
  callback?: (data: any) => TableResult<T>;
  // 显示分页数据
  isPageable?: boolean;
  // 立即执行getList函数
  immediate?: boolean;
}
export function useCrud(options: IOptions) {
  const loading = ref<Boolean>(false)
  const tableData = ref<T[]>([])
  const paramsInit = JSON.parse(JSON.stringify(options.params || {}));
  const search_screen = {}
  const page = reactive({
    pageNum: 1,
    pageSize: 10,
    total: 0,
    pageSizes: [10, 20, 50],
    layout: "total, sizes, prev, pager, next, jumper"
  })

  function currentChange(val) {
    page.pageNum = val
    getTableList()
  }
  // 条数
  function sizeChange(val) {
    page.pageNum = 1
    page.pageSize = val
    getTableList()
  }
  function handleSearch() {
    page.pageNum = 1
    Object.assign(search_screen, JSON.parse(JSON.stringify(options.params)))
    getTableList()
  }
  async function getTableList() {
    let list = []
    let total = 0
    loading.value = true
    try {
      const isPageable  = options.isPageable  ?? true
      const pageParam = isPageable ? {pageNum: page.pageNum, pageSize: page.pageSize} : {}
      const params = Object.assign({}, search_screen, pageParam)
      const res =  await options.apiFn(params)
      options.callback && (res.data = options.callback(res.data))
      list = (isPageable ? res.data?.list : res.data) || []
      total = res.data?.total || 0
    } catch (error) { 
      console.error('---getTableList请求失败---', error)
    }
    loading.value = false
    tableData.value = list
    page.total = total
  }
  function resetSearch() {
    page.pageNum = 1
    page.pageSize = 10
    Object.keys(paramsInit).forEach((item) => {
      options.params![item] = paramsInit[item];
    })
    handleSearch()
  }

  if (options.immediate ?? true) handleSearch()

  return {
    loading,
    tableData,
    page,
    currentChange,
    sizeChange,
    handleSearch,
    getTableList,
    resetSearch
  }
}