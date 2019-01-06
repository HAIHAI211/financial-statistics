/**
 ** 引入mixinPullToRefresh的页面
 * 需要自定义如下data或computed
 * data
 *   apis 请求函数数组 (必填)
 *   pageSize 一页多少条数据
 *   initPageNum pageNum的初始页码
 *   listKeyName 返回对象的list的键名
 *   pageCountKeyName 返回对象的pageCount的键名
 * computed
 *   params 自定义的请求参数 // 因为不确定是data还是computed，故在data里不声明
 *  components
 *   run-loading 加载组件（mpvue存在bug）
 * */
import {LOADING_STATE_ENUM} from '../enum'
// import {sleep} from '../rest'

export default {
  components: {
    // runLoading
  },
  data () {
    return {
      loadingState: LOADING_STATE_ENUM.NO_SHOW, // 0:不可见 1:正在加载 2:全部加载完毕 3:异常
      pageIndex: 0,
      apis: [],
      pages: [
        {
          pageNum: this.initPageNum, // 当前页
          pageSize: this.pageSize, // 一页多少条数据
          pageCount: 10, // 一共多少页
          list: []
        }
      ],
      pageSize: 10,
      initPageNum: 0, // pageNum的初始页码
      listKeyName: 'data',
      pageCountKeyName: 'pageCount'
    }
  },
  computed: {
    activePage () {
      return this.pages[this.pageIndex]
    },
    activeApi () {
      return this.apis[this.pageIndex]
    },
    compareResult () {
      let pageCount = this.activePage.pageCount
      let endPageNum = pageCount + this.initPageNum - 1
      let result = endPageNum - this.activePage.pageNum // >=0 表示还可以请求
      return result
    }
  },
  watch: {
    apis: {
      immediate: true,
      // deep: false,
      handler (newV, oldV) {
        console.log('newV', newV)
        let result = []
        for (let i = 0; i < newV.length; i++) {
          result.push({
            pageNum: this.initPageNum, // 当前页
            pageSize: this.pageSize, // 一页多少条数据
            pageCount: 10, // 一共多少页
            list: []
          })
        }
        this.pages = result
      }
    }
  },
  methods: {
    async fetchList (isRefresh = true) {
      // console.log('fetchList')
      if (isRefresh) {
        this.activePage.pageNum = this.initPageNum
        this.activePage.pageCount = 0
      } else {
        this.activePage.pageNum += 1
        if (this.compareResult < 0) {
          // todo 数据已经请求到了最后一页
          this.loadingState = LOADING_STATE_ENUM.ALL_OVER
          this.activePage.pageNum -= 1
          return
        }
      }
      let pageParams = {
        pageNum: this.activePage.pageNum,
        pageSize: this.activePage.pageSize
      }
      let params = this.params ? Object.assign(this.params, pageParams) : pageParams
      // 开始请求
      // console.log('请求列表的参数', params)
      this.loadingState = LOADING_STATE_ENUM.IS_LOADING
      try {
        const result = await this.activeApi(params)
        // console.log(this.activeApi, result)
        this.activePage.list = isRefresh ? result[this.listKeyName] : [...this.activePage.list, ...result[this.listKeyName]]
        this.activePage.pageCount = result[this.pageCountKeyName]
        // this.loadingState = this.activePage.pageNum < this.activePage.pageCount ? LOADING_STATE_ENUM.NO_SHOW : LOADING_STATE_ENUM.ALL_OVER // 0:不可见 1:正在加载 2:全部加载完毕 3:异常
        if (this.compareResult > 0) {
          this.loadingState = LOADING_STATE_ENUM.NO_SHOW
        } else {
          this.loadingState = LOADING_STATE_ENUM.ALL_OVER
        }
      } catch (e) {
        this.loadingState = LOADING_STATE_ENUM.ERROR
        throw e
      }
    }
  },
  async onPullDownRefresh () { // 下拉刷新
    // console.log('下拉刷新', this.listKeyName)
    try {
      await this.fetchList()
    } finally {
      wx.stopPullDownRefresh()
    }
  },
  async onReachBottom () { // 上拉加载
    // console.log('上拉加载')
    await this.fetchList(false)
  }
}
