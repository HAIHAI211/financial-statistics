/*
* fly配置文件
* by: Harrison 2018.10.25
* */
import config from '@/config'
import {pf} from '@/utils'

// 引入fly
const Fly = require('flyio/dist/npm/wx')
const fly = new Fly()

// 配置请求基地址
// //定义公共headers
// fly.config.headers={xx:5,bb:6,dd:7}
// //设置超时
fly.config.timeout = 12000
// //设置请求基地址
fly.config.baseURL = config.host

// 添加请求拦截器
fly.interceptors.request.use(async (request) => {
  // 给所有请求添加自定义header
  request.headers['X-Tag'] = 'flyio'
  // 打印出请求体
  // console.log(request.body)
  // 终止请求
  // const err=new Error("xxx")
  // err.request=request
  // return Promise.reject(new Error(""))
  // wx.showLoading({
  //   title: '加载中'
  // })
  // 可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
  await pf('showNavigationBarLoading')
  return request
})

// 添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
  (response) => {
    wx.hideNavigationBarLoading()
    // wx.hideLoading()
    // 只将请求结果的data字段返回
    let res = response.data
    if (res.code === 0) {
      return res
    } else {
      return Promise.reject(res)
    }
  },
  (er) => {
    wx.hideNavigationBarLoading()
    return er
    // wx.hideLoading()
    // 发生网络错误后会走到这里
    // console.log('错误', er)

    // 请求出错，根据返回状态码判断出错原因
    // wx.hideLoading()
    // let errMsg = ''
    // if (er.status === 0) {
    //   errMsg = '网络连接异常'
    // } else if (er.status === 1) {
    //   errMsg = '网络连接超时'
    // } else if (er.status === 401) {
    //   errMsg = '用户未登录'
    // } else {
    //   errMsg = '请求数据失败,请稍后再试'
    //   // if (er.response.data.message) {
    //   //   errMsg = er.response.data.message
    //   // } else {
    //   //   errMsg = '请求数据失败,请稍后再试'
    //   // }
    // }
    // wx.showToast({title: errMsg, icon: 'none'})
    // return errMsg
    // return Promise.resolve('xxx')
  }
)
// Vue.prototype.$http=fly //将fly实例挂在vue原型上

export default fly
