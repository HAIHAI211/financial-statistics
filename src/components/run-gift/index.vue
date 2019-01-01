<template>
  <div :class="['run-gift', {'hasChanged': gift.hasChanged}]" @click="_giftClick">
    <div class="math-gift" v-if="gift.type === 0 || gift.type === 1">
      <div :class="['left', 'type-' + gift.presentType, {'type-player': gift.type === 1}]" :style="[{backgroundImage: 'url('+ gift.coverPicUrl + ')'}]"></div>
      <div class="right">
        <div class="name">{{ gift.name }}</div>
        <div class="price">
          <div class="num">{{ gift.price }}</div>
          <div class="suffix">数学币</div>
        </div>
      </div>
    </div>
    <div class="physical-gift" v-if="gift.type === 2">
      <div class="left"
           :style="{backgroundImage: 'url(' + gift.coverPicUrl + ')'}"></div>
      <div class="right">
        <div class="right-top">{{ gift.name }}</div>
        <div class="right-middle">
          <div class="postage" v-if="gift.postage">包邮</div>
        </div>
        <div class="right-bottom">
          <div class="price">
            <span class="num">{{ gift.price }}</span>
            <span class="suffix">数学币</span>
          </div>
          <div class="old-price">
            原价￥{{gift.originalPrice}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapMutations} from 'vuex'
export default {
  props: {
    gift: {
      type: Object,
      default () {
        return {
          id: 0,
          name: '',
          type: 0, // 礼品类型 0:文档 1:视频 2:实物
          coverPicUrl: '', // 封面图
          presentType: 'doc', // 文件类型
          price: 0,
          postage: 1, // 是否包邮
          originalPrice: 0 // 原价
        }
      }
    }
  },
  methods: {
    ...mapMutations(['SET_GIFT']),
    _giftClick () {
      // console.log('gift click')
      this.SET_GIFT(this.gift)
      wx.navigateTo({
        url: `/pages/gift-detail/main?giftId=${this.gift.id}&giftType=${this.gift.type}`
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import "~@/common/style/mixin.styl"
  @import "~@/common/style/color.styl"
  .run-gift{
    &.hasChanged{
      .math-gift,.physical-gift{
        bg-image('icon_yin')
        background-size 112rpx 83rpx
        background-position 516rpx 110rpx
        background-repeat no-repeat
      }
    }
    .math-gift{
      height 255rpx
      background #fff
      border-radius 6rpx
      box-sizing border-box
      padding 24rpx 18rpx 18rpx 23rpx
      display flex
      margin-bottom main-gap
      .left{
        flex 0 0 auto
        bg-size(200rpx,200rpx)
        margin-right 39rpx
        &.type-doc{
          bg-image('wps')
        }
        &.type-pdf{
          bg-image('pdf')
        }
        &.type-player{
          bg-image('player')
        }
      }
      .right{
        flex 1
        display flex
        flex-direction column
        justify-content space-between
        .name{
          wrap(2)
          font-size 30rpx
          color #333
        }
        .price{
          display flex
          align-items center
          .num{
            color #43D17F
            font-size 36rpx
          }
          .suffix{
            color #333
            font-size 26rpx
          }
        }
      }
    }
    .physical-gift{
      margin-bottom main-gap
      width 685rpx
      height 255rpx
      border-radius 6rpx
      background #fff
      box-sizing border-box
      padding 22rpx 22rpx 31rpx 22rpx
      display flex
      .left{
        flex 0 0 auto
        bg-size(200rpx,200rpx)
        margin-right 31rpx
      }
      .right{
        position relative
        flex 1 0 0
        display flex
        flex-direction column
        justify-content space-between
        .right-top{
          width 367rpx
          color #333
          font-size 30rpx
          wrap(2)
        }
        .right-middle{
          .postage{
            width 72rpx
            height 35rpx
            background #FFEDD4
            border-radius 16rpx
            color #F69307
            font-size 24rpx
            center()
          }
        }
        .right-bottom{
          display flex
          align-items center
          .price{
            margin-right 35rpx
            display flex
            align-items center
            .num{
              color #43D17F
              font-size 36rpx
            }
            .suffix{
              color #333
              font-size 26rpx
            }
          }
          .old-price{
            color #999
            font-size 26rpx
            text-decoration line-through
          }
        }
        .count{
          position absolute
          top 0rpx
          right 0rpx
          font-size 30rpx
          transform scale(1,1.1)
          color #333333
        }
        .state{
          position absolute
          bottom 0rpx
          right 0rpx
          font-size 30rpx
          .state-0{
            color #FF5409
          }
          .state-1{
            color #B3B3B3
          }
        }
      }
    }
  }
</style>
