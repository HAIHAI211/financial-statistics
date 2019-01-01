<template>
  <div class="change-success-page" :style="{height:systemInfo.windowHeight + 'px'}">
    <image class="icon" src="/static/img/success@2x.png"/>
    <div class="success-info">{{ orderTypeStr }}兑换成功</div>
    <div class="btn btn-continue" @click="_continueChange">继续兑换</div>
    <div class="btn btn-order" @click="_toOrderPage">查看订单</div>
    <adv type="exchange"/>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import adv from '@/components/adv'
export default {
  components: {
    adv
  },
  computed: {
    ...mapState(['gift', 'systemInfo']),
    orderTypeStr () {
      if (this.gift.type === 2) {
        return '礼品'
      } else {
        return '资料'
      }
    }
  },
  methods: {
    _continueChange () {
      wx.switchTab({
        url: '/pages/gift/main'
      })
    },
    _toOrderPage () {
      wx.redirectTo({
        url: `/pages/order/main`
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import "~@/common/style/mixin.styl"
  @import "~@/common/style/color.styl"
  .change-success-page{
    display flex
    flex-direction column
    align-items center
    background #fff
    >*{
      flex 0  0 auto
    }
    .icon{
      width 140rpx
      height 140rpx
      margin-top 53rpx
      margin-bottom 28rpx
    }
    .success-info{
      fon-size 30rpx
      color #333
      margin-bottom 60rpx
    }
    .btn{
      width 685rpx
      height 97rpx
      margin-bottom main-gap
      box-sizing border-box
      center()
      border-radius 47rpx
      font-size 34rpx
      &.btn-continue{
        background main-color
        color #ffffff
        margin-bottom 18rpx
      }
      &.btn-order{
        background #ffffff
        color main-color
        border 1rpx solid main-color
      }
    }
  }
</style>
