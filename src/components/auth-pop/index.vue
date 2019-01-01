<template>
  <div class="auth-pop" @touchmove.stop="" @click.stop="" v-if="selfShow">
    <div class="overlay"></div>
    <div class="content">
      <div class="main">
        <div class="title">提示</div>
        <div class="sub-title">需要微信运动步数授权，才能兑换数学币哦~</div>
        <image class="icon" src="/static/img/auth.png"/>
        <div class="btn-wrap" @click="close">
          <run-btn openType="openSetting" title="确定" @opensetting="_openSetting"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import runBtn from '@/components/run-btn'
import { mixinShow } from '@/mixin'

export default {
  mixins: [mixinShow],
  components: {
    runBtn
  },
  methods: {
    close () {
      // this.selfShow = false
      // console.log('2')
    },
    _openSetting () {
      this.selfShow = false
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import "~@/common/style/mixin.styl"
  @import "~@/common/style/color.styl"
  .auth-pop{
    .overlay{
      overlay()
      z-index 999
    }
    .content{
      overlay()
      z-index 1000
      center()
      .main{
        width 640rpx
        height 800rpx
        background #fff
        border-radius 12rpx
        display flex
        flex-direction column
        align-items center
        .title{
          color #000
          font-weight 600
          font-size 45rpx
          margin 50rpx
        }
        .sub-title{
          color #8a8a8a
          font-size 35rpx
          padding 0 60rpx
          line-height 1.5
          margin-bottom 20rpx
        }
        .icon{
          width 369 * 1.35rpx
          height 259 * 1.35rpx
          margin-bottom 30rpx
        }
        .btn-wrap{
          width 500rpx
          height 100rpx
          border-radius 50rpx
          background main-color
          color #fff
        }
      }
    }
  }
</style>
