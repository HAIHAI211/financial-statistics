<template>
  <div class="pic-pop"  v-if="selfShow" @click.stop="" @touchmove.stop="" >
    <div class="overlay"></div>
    <div class="content" v-if="selfShow">
      <div class="box box-0" v-if="type===0">
        <div class="box-title">在客服会话回复<span class="num">“{{ type }}”</span>，扫码关注公众号</div>
        <div class="btn-wrap" @click="selfShow=false">
          <span>点击回复{{ type }}关注</span>
          <button open-type="contact" class="btn"></button>
        </div>
      </div>
      <div class="box box-1" v-else-if="type===1">
        <div class="box-title">在客服会话回复<span class="num">“{{ type }}”</span>，扫码进群</div>
        <div class="btn-wrap"  @click="selfShow=false">
          <span>点击回复{{ type }}进群</span>
          <button open-type="contact" class="btn"></button>
        </div>
      </div>
      <div class="box box-2" v-else-if="type===2">
        <div class="detail-type-sign">
          <div class="title">今日签到成功，获得<span class="coin"> {{ coin }} </span>数学币</div>
          <div class="sub-title">坚持签到可获得更多数学币哦~</div>
        </div>
      </div>
      <image src="/static/img/delete@2x.png" class="close-btn" @click="selfShow=false"/>
    </div>
  </div>
</template>
<script>
import { mixinShow } from '@/mixin'
export default {
  mixins: [mixinShow],
  props: {
    url: {
      type: String,
      default: ''
    },
    type: {
      type: Number,
      default: 0 // 0:关注公众号 1:去客服 2：签到
    },
    coin: {
      type: Number, // 签到时获得的奖励币
      default: 0
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import "~@/common/style/mixin.styl"
  @import "~@/common/style/color.styl"
  .pic-pop{
    .overlay{
      position fixed
      z-index 1000
      top 0
      left 0
      right 0
      bottom 0
      background rgba(0,0,0,.3)
    }
    .content{
      position fixed
      z-index 1001
      top 0
      left 0
      right 0
      bottom 0
      display flex
      flex-direction column
      center()
      .box{
        overflow hidden
        border-radius 30rpx
        display flex
        flex-direction column
        justify-content flex-end
        align-items center
        .btn-wrap{
          position relative
          height 80rpx
          padding 0 50rpx
          border-radius 40rpx
          font-size 30rpx
          letter-spacing 1rpx
          color #fff
          center()
          .btn{
            position absolute
            top 0
            left 0
            width 100%
            height 100%
            opacity 0
          }
        }
        .box-title{
          color #777
          font-size 32rpx
          .num{
            color main-color
            font-weight bold
            font-size 35rpx
          }
        }
        &.box-0{
          bg-image('Popup_window')
          bg-size(476 * 1.25rpx, 648 * 1.25rpx)
          .num{
            color #f16063
          }
          .btn-wrap{
            background #f16063
            margin-bottom 20rpx
            margin-top 20rpx
          }
        }
        &.box-1{
          bg-image('Dialog_q')
          bg-size(476 * 1.1rpx, 485 * 1.1rpx)
          .btn-wrap{
            background main-color
            margin-bottom 16rpx
            margin-top 30rpx
          }
        }
        &.box-2{
          bg-image('sign')
          bg-size(563rpx, 548rpx)
          .detail-type-sign{
            .title{
              color #fff
              font-size 33rpx
              .coin{
                font-weight bolder
                font-size 38rpx
              }
            }
            .sub-title{
              color #000
              font-weight 400
              font-size 28rpx
              margin-bottom 60rpx
              margin-top 90rpx
            }
          }
        }
      }
      .close-btn{
          margin-top 10rpx
          width 70rpx
          height 70rpx
      }
      .pic-wrap{
        position relative
        .close-btn{
          position absolute
          bottom -100rpx
          left 50%
          margin-left -35rpx
          width 70rpx
          height 70rpx
        }
        .detail{
          position absolute
          left 0rpx
          bottom 50rpx
          width 100%
          display flex
          flex-direction column
          align-items center
          .title{
            color #9b9b9b
            font-size 30rpx
            margin-bottom 20rpx
            .bold{
              color #000
              font-weight bolder
              font-size 35rpx
            }
          }
          .btn{
            width 250rpx
            height 80rpx
            border-radius 40rpx
            center()
            font-size 30rpx
            letter-spacing 1rpx
            color #fff
            &.btn-0{
              background #f16063
            }
            &.btn-1{
              background #3acf7b
            }
          }
        }

      }
    }
  }
</style>
