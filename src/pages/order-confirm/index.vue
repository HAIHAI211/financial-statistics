<template>
  <div class="order-confirm-page">
    <run-gift :gift="gift"/>
    <div class="confirm-address-title">确认收货地址</div>
    <address-form/>
    <div class="submit-btn" @click="_submitOrder">提交</div>
  </div>
</template>
<script>
  import runGift from '@/components/run-gift'
  import addressForm from '@/components/address-form'
  import {mapState, mapActions} from 'vuex'
  import {placeOrder} from '@/http/api'
  import {mixinaddressInfoSubmit} from '@/mixin'

  export default {
    mixins: [mixinaddressInfoSubmit],
    components: {
      runGift,
      addressForm
    },
    data () {
      return {
        submitLoading: false
      }
    },
    computed: {
      ...mapState(['gift'])
    },
    methods: {
      ...mapActions(['FETCH_USER_INFO']),
      async _submitOrder () {
        if (this.submitLoading) {
          return
        }
        this.submitLoading = true
        this.utils.showLoading()
        const hasErr = await this._checkErr()
        // console.log('hasErr', hasErr)
        if (hasErr) {
          return
        }
        let params = {
          type: this.gift.type,
          presentId: this.gift.id,
          ...this.addressInfo
        }
        // console.log('params', params)
        try {
          await placeOrder(params)
          this.FETCH_USER_INFO()
          this.submitLoading = false
          wx.hideLoading()
          wx.redirectTo({
            url: '/pages/change-success/main'
          })
        } catch (e) {
          // console.log(e)
          this.submitLoading = false
          wx.hideLoading()
          this.utils.showError(e.message, 1500)
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~@/common/style/mixin.styl"
  @import "~@/common/style/color.styl"
  .order-confirm-page{
    padding 20rpx
    .confirm-address-title{
      color #666
      font-size 30rpx
    }
    .submit-btn{
      background main-color
      width 685rpx
      height 97rpx
      border-radius 47rpx
      center()
      color #fff
      font-size 34rpx
      position fixed
      bottom 30rpx
    }
  }
</style>
