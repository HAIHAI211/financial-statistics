import { mapActions, mapState, mapGetters } from 'vuex'
export const mixinShow = {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selfShow: this.show
    }
  },
  watch: {
    show (v) {
      this.selfShow = v
    },
    selfShow (v) {
      this.$emit('update:show', v)
    }
  }
}

export const mixinLoginWerun = {
  computed: {
    ...mapState(['authWerun', 'isLogin', 'openId', 'todayCanChangeStep', 'todayAllStep'])
  },
  methods: {
    ...mapActions(['LOGIN', 'AUTH_OF_WERUN', 'REPORT_OF_WERUN', 'FETCH_USER_INFO']),
    async _getSteps () {
      await this.LOGIN() // 登录
      await this.AUTH_OF_WERUN() // 申请授权
      await this.REPORT_OF_WERUN() // 上报微信运动数据给后台，返回是否成功的标志
      await this.FETCH_USER_INFO() // 获取用户信息
      await this._getRank()
      // console.log('getSteps成功')
    }
  }
}
export const mixinaddressInfoSubmit = {
  computed: {
    ...mapGetters(['addressInfo', 'addressInfoErr'])
  },
  methods: {
    async _checkErr () {
      await this.$utils.rest.sleep(300) // 避免submit早于blur事件
      if (this.addressInfoErr) {
        this.utils.showToast(this.addressInfoErr)
        return true
      }
      return false
    }
  }
}
