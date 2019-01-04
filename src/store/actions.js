import * as types from './mutation-types'
import {pf} from '@/utils'
import * as api from '@/http/api'
import auths from '@/utils/auths'
async function reLogin (commit) {
  try {
    const loginResult = await pf('login') // 重新登录
    const result = await api.login({ code: loginResult.code }) // 将code发送给后台获取openid
    commit(types.SET_IS_LOGIN, true)
    commit(types.SET_OPEN_ID, result.data.openId)
  } catch (e) {
    commit(types.SET_IS_LOGIN, false)
    return Promise.reject(new Error('登录失败'))
  }
}

const actions = {
  [types.SET_SYSTEM_INFO] ({commit}) {
    wx.getSystemInfo({
      success (res) {
        commit(types.SET_SYSTEM_INFO, res)
      }
    })
  },
  async LOGIN ({commit, state}) {
    wx.checkSession({
      success: async () => {
        if (!state.openId) { // 本地openid缓存被清
          await reLogin(commit) // 不让reLogin抛出异常，否则会执行下面的【2次登陆】
        }
      },
      fail: async () => {
        await reLogin(commit)
      }
    })
  },
  async AUTH_OF_WERUN ({commit}) {
    const isAuthOfWerun = await auths.auth('scope.werun')
    commit(types.SET_AUTH_WE_RUN, isAuthOfWerun)
  },
  async AUTH_OF_USER_INFO ({commit}) {
    const isAuthOfUI = await auths.auth('scope.userInfo')
    commit(types.SET_AUTH_USER_INFO, isAuthOfUI)
  },
  async FETCH_FINANCIAL_CATEGORY_LIST ({commit}) {
    const result = await api.getFinancialCategory()
    console.log('financial category list:', result)
    commit(types.SET_FINANCIAL_CATEGORY_LIST, result.data)
  },
  async FETCH_FINANCIAL_USER_LIST ({commit}) {
    const result = await api.getFinancialUser()
    console.log('financial user list:', result)
    commit(types.SET_FINANCIAL_USER_LIST, result.data)
  }
}
export default actions
