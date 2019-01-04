const getter = {
  // addressInfoErr (state) {
  //   if (!state.contactsName) {
  //     return '请输入联系人姓名'
  //   } else if (!state.telNo) {
  //     return '请输入联系人手机号'
  //   } else if (state.telNo.length !== 11) {
  //     return '请输入正确的手机号格式'
  //   } else if (!state.addressArea) {
  //     return '请选择所在地区'

  isIos (state) { // 是否是IOS
    return state.systemInfo.platform === 'ios'
  }
}
export default getter
