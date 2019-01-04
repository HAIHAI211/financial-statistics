import * as types from './mutation-types'
import * as api from '@/http/api'

const actions = {
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
