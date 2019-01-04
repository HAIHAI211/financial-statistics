import * as types from './mutation-types'
const mutations = {
  /*
  * state: 当前状态树
  * v: 提交matations时传的参数
  * */
  [types.SET_FINANCIAL_CATEGORY_LIST] (state, v) {
    state.financialCategoryList = v
  },
  [types.SET_FINANCIAL_USER_LIST] (state, v) {
    state.financialUserList = v
  }
}

export default mutations
