import {pf} from '@/utils'
/**
 * 授权--微信运动步数 wx.getWeRunData
 * @param  {[type]} authHandler [description]
 * @return {[type]}             [description]
 */
export default {
  async auth (scope) {
    const scopeName = scope
    const getSettingRes = await pf('getSetting')
    if (!getSettingRes.authSetting[scopeName]) {
      try {
        await pf('authorize', {scope: scopeName})
        // console.log('申请授权werun，然后用户同意')
        return true
      } catch (e) {
        // console.log('申请授权werun，但是用户拒绝了')
        return false
      }
    }
    // console.log('已经授权werun')
    return true
  }
}
