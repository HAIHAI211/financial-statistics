import fly from './config'
import qs from 'qs'

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

// 获取财务类别
export const getFinancialCategory = (params) => {
  return get({
    url: '/financial/category'
  })
}

// 获取用户
export const getFinancialUser = (params) => {
  return get({
    url: '/financial/user'
  })
}

// 创建月报表
export const createFinancial = (params) => {
  return post({
    url: '/financial/create',
    data: params
  })
}

// 修改月报表
export const updateFinancial = (params) => {
  return post({
    url: '/financial/update',
    data: params
  })
}

// 获取月报表
export const getMonthMasters = (params) => {
  return get({
    url: '/financial/month',
    data: params
  })
}

// 获取月报表明细
export const getMonthDetails = (masterId) => {
  return get({
    url: '/financial/detail',
    data: {
      masterId
    }
  })
}
