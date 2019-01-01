<template>
  <div class="accredit-pop" @touchmove.stop="" @click.stop="" v-if="selfShow">
    <div class="overlay"></div>
    <div class="content">
      <div class="dialog">
        <image class="bg" src="/static/img/shouquan@2x.png"/>
        <div class="dialog-bottom">
          <div class="dialog-item" @click="_cancel">再想想</div>
          <div class="dialog-item active">
            好，授权吧
            <button class="btn" open-type="getUserInfo" @getuserinfo="bindGetUserInfo"></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'both' // both userinfo werun
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
  },
  methods: {
    ...mapMutations(['SET_AUTH_USER_INFO']),
    bindGetUserInfo (e) {
      const userInfo = e.mp.detail.userInfo
      this.SET_AUTH_USER_INFO(!!userInfo)
      this.$emit('getuserinfo', userInfo)
      this.selfShow = false
    },
    _cancel () {
      this.$emit('cancel')
      this.selfShow = false
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import "~@/common/style/mixin.styl"
  @import "~@/common/style/color.styl"
  .accredit-pop{
    .overlay{
      overlay()
      z-index 99
    }
    .content{
      overlay()
      z-index 100
      center()
      .dialog{
        border-radius 10rpx
        position relative
        width 544rpx
        height 544rpx
        overflow hidden
        display flex
        flex-direction column
        justify-content flex-end
        .bg{
          position absolute
          width 100%
          height 100%
          z-index -1
        }
        .dialog-bottom{
          margin-bottom 32rpx
          height 56rpx
          display flex
          .dialog-item{
            flex 1
            center()
            color #bbb
            font-size 30rpx
            &.active{
              color main-color
              font-size 38rpx
              position relative
              .btn{
                position absolute
                width 100%
                height 100%
                top 0
                left 0
                opacity 0
              }
            }
          }
        }
      }
    }
  }
</style>
