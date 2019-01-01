<template>
  <div class="focus-icon" @click="popShow=true">
    <image src="/static/img/box@2x.png" class="box"></image>
    <image src="/static/img/box_text@2x.png" class="box-text fade-scale-animation"></image>
    <image src="/static/img/content@2x.png" class="box-content rotate-animation"></image>
    <pic-pop :show.sync="popShow"/>
  </div>
</template>
<script>
import picPop from '@/components/pic-pop'
export default {
  components: {
    picPop
  },
  data () {
    return {
      popShow: false
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import "~@/common/style/mixin.styl"
  @import "~@/common/style/color.styl"
  .focus-icon{
    position fixed
    bottom 100rpx
    right 30rpx
    width 100rpx
    height 100rpx
    .box{
      position absolute
      top 0
      left 0
      z-index 1
      width 125rpx
      height 81rpx
    }
    .box-text{
      width 53rpx
      height 53rpx
      position absolute
      top 20rpx
      left 45rpx
      z-index 2
    }
    .box-content{
      position absolute
      width 107rpx
      height 75rpx
      top -40rpx
      left 10rpx
    }
  }
</style>
