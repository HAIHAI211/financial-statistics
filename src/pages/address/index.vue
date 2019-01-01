<template>
  <div class="address-page">
    <address-form/>
    <div class="confirm-btn-wrap">
      <div class="confirm-btn" @click="_save">保存</div>
    </div>
  </div>
</template>
<script>
import addressForm from '@/components/address-form'
import { updateUserInfo } from '@/http/api'
import {mapActions} from 'vuex'
import {mixinaddressInfoSubmit} from '@/mixin'

export default {
  mixins: [mixinaddressInfoSubmit],
  data () {
    return {
      focus: true
    }
  },
  components: {
    addressForm
  },
  methods: {
    ...mapActions(['FETCH_USER_INFO', 'LOGIN']),
    async _save () {
      // console.log('save')
      this.utils.showLoading()
      const hasErr = await this._checkErr()
      if (hasErr) {
        return
      }
      try {
        await updateUserInfo()
        this.utils.showToast('保存成功')
      } catch (e) {
        // console.log('保存失败的真实原因', e)
        this.utils.showError()
      }
    }
  },
  async onShow () {
    this.utils.showLoading()
    try {
      await this.FETCH_USER_INFO()
    } finally {
      wx.hideLoading()
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import "~@/common/style/mixin.styl"
  @import "~@/common/style/color.styl"
  .address-page{
    .confirm-btn-wrap{
      margin-top 50rpx
      display flex
      justify-content center
      .confirm-btn{
        background main-color
        center()
        width 685rpx
        height 97rpx
        border-radius 47rpx
        color #fff
        font-size 34rpx
        letter-spacing 1rpx
      }
    }
  }
</style>
