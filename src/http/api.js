import fly from './config'
import qs from 'qs'
import store from '../store'

import config from '@/config'
const host = config.host
// const appKey = config.appKey
// const appid = config.appid

/**
 * 接口模版====post
 *
 * export const test = params => {return fly.post(`${root}/xx/xx`, qs.stringify(params))};
 *
 * 接口模版====get
 *
 * export const test1 = function(){return fly.get(`${root}/api/getNewsList`)}
 *
 *
 * 用法：
 * 在 页面用引入 test
 * import {test} from '../../http/api.js'
 *
 * test(params).then(res=>{ console.log(res) })
 */

// 通用的all请求
export const all = fly.all
export const spread = fly.spread

// 通用的get请求
export const get = (params) => {
  // console.log('params', qs.stringify(params.data, {indices: false}))
  return fly.get(`${host}${params.url}`, qs.stringify(params.data, {indices: false}))
}

// 通用的post请求
export const post = (params) => {
  return fly.post(`${host}${params.url}`, params.data)
}
// 封装的登录请求，根据后台接收方式选择是否加qs.stringify
export const login = params => {
  return post({
    url: '/user/login',
    data: params
  })
}

// 封装请求参数Params
const paramFactory = (url, params) => {
  return {
    url,
    data: {
      openId: store.state.openId,
      ...params
    }
  }
}

// 签到
export const sign = params => {
  return post(paramFactory('/user/sign', params))
}

// 解密
export const decrypt = params => {
  return post({
    url: '/user/decrypt',
    data: params
  })
}

// 排行榜
export const getRank = params => {
  return get({
    url: '/user/rank',
    data: params
  })
}

// 获取用户信息
export const getUserInfo = params => {
  return get({
    url: '/user/get',
    data: params
  })
}

// 更新用户信息
export const updateUserInfo = params => {
  // console.log('更新用户信息哦', store.getters.addressInfo)
  return post(paramFactory('/user/update', {
    ...store.getters.addressInfo,
    ...params
  }))
}

// 全部广告位
export const getAdvs = () => {
  return get({
    url: '/common/adv'
  })
}

// 获取首页礼品
export const getIndexPresent = params => {
  return get({
    url: '/common/indexPresent',
    data: params
  })
}

// 获取文档类礼品列表
export const getDocList = params => {
  return get(paramFactory('/common/getDocList', params))
}

// 获取实物礼品列表
export const getRealList = params => {
  return get(paramFactory('/common/getRealList', params))
}

// 礼品详情
export const getGiftDetail = params => {
  return get({
    url: '/common/getPresentDetail',
    data: params
  })
}

// 步数兑换
export const changeStep = () => {
  return post(paramFactory('/user/change/step'))
}

// 兑换礼品
export const placeOrder = (params) => {
  return post(paramFactory('/common/placeOrder', params))
}

// 随机获取6个被偷的靓仔
export const randomSteal = (params) => {
  return get(paramFactory('/user/get/randomSteal', params))
}

// 偷步数
export const stealStep = (params) => {
  return post({
    url: '/user/stealStep',
    data: {
      openIdSteal: store.state.openId,
      ...params
    }
  })
}

// 获取偷我步数的人列表
export const stealMeList = () => {
  return post(paramFactory('/user/get/stealMeList'))
}

// 获取我的文档类订单
export const getDocOrder = (params) => {
  return get(paramFactory('/common/getDocOrder', params))
}

// 获取我的实物类订单
export const getRealOrder = (params) => {
  return get(paramFactory('/common/getRealOrder', params))
}

// 上报分享
export const share = (params) => {
  return post(paramFactory('/user/share', params))
}

// 获取规则文本
export const getRule = (params) => {
  return get({
    url: '/common/activeRule'
  })
}
