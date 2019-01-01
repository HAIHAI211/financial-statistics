<template>
  <div class="gift-detail-page">
    <div class="swiper-wrap">
      <swiper class="swiper" :current="current" @change="swiperChange" :interval="2000" autoplay>
        <swiper-item v-for="(imgUrl,imgUrlIndex) in InfoPicUrlListFormat" :key="imgUrlIndex">
          <image :src="imgUrl" class="slide-image"/>
        </swiper-item>
      </swiper>
      <div class="my-indicator">
        <span class="current">{{ current + 1 }}</span> /<span>{{ InfoPicUrlListFormat.length }}</span>
      </div>
    </div>
    <div class="gift-info">
      <div class="name">{{ name }}</div>
      <div class="middle">
        <div class="postage" v-if="type===2 && postage === 1">包邮</div>
        <div class="shengyu">今日剩余：{{ totalAmount }}份</div>
      </div>
      <div class="bottom">
        <div class="price">
          <div class="now">
            <span class="num">{{ price }}</span>
            <span class="suffix">数学币</span>
          </div>
          <div class="old" v-if="type===2">原价￥{{ originalPrice }}</div>
        </div>
        <div class="share">
          <button open-type="share" style="position:absolute;width:100%;height:100%;opacity: 0;"></button>
          <span class="share-title">分享好友</span>
          <span class="iconfont icon-fenxiang"/>
        </div>
      </div>
    </div>
    <van-tabs :active="activeTabIndex" @change="tabChange" color="#3ACF7A">
      <van-tab title="兑换记录">
        <div class="exchange-record-wrap">
          <div class="exchange-record" v-for="(record,recordIndex) in recordList" :key="recordIndex" v-if="recordList.length">
            <div class="user">
              <image :src="record.avatar_url" class="avatar"/>
              <div class="name">{{ record.pojoNickName }}</div>
            </div>
            <div class="info">兑换了{{ record.name }}</div>
            <div class="time">
              {{ record.pojoTime }}
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="商品介绍">
        <!--<div class="html-wrap">-->
          <!--<wxParse :content="info"/>-->
        <!--</div>-->
        <div class="introduce" style="padding-bottom: 130rpx;">
          <image :src="url" v-for="(url,urlIndex) in infoFormat" :key="urlIndex" class="introduce-img" mode="widthFix"/>
        </div>
      </van-tab>
    </van-tabs>
    <div class="confirm-btn-wrap">
      <div class="confirm-btn" @click="_change">立即兑换</div>
    </div>
  </div>
</template>
<script>
import { getGiftDetail, placeOrder, share } from '@/http/api'
import wxParse from 'mpvue-wxparse'
import runBtn from '@/components/run-btn'
import * as utils from '@/utils'
import {mapActions, mapState} from 'vuex'
export default {
  components: {
    runBtn,
    wxParse
  },
  data () {
    return {
      submitLoading: false,
      id: 0,
      price: 0,
      postage: 0, // 2
      originalPrice: 0, // 2
      InfoPicUrlListFormat: [],
      recordList: [], // 兑换记录
      type: 0,
      presentType: '',
      infoFormat: '', // 介绍图片列表
      activeTabIndex: 0,
      current: 0,
      name: '',
      totalAmount: 1 // 今日剩余数量
    }
  },
  computed: {
    ...mapState(['gift', 'mathCoin', 'openId'])
  },
  methods: {
    ...mapActions(['FETCH_USER_INFO']),
    swiperChange (res) {
      // console.log(res.mp.detail.current)
      this.current = res.mp.detail.current
    },
    tabChange (event) {
      this.activeTabIndex = event.mp.detail.index
    },
    _pojo (data) {
      console.log('礼品详情', data)
      this.name = data.name
      this.totalAmount = data.totalAmount // 剩余总数
      this.price = data.price
      this.infoFormat = data.infoFormat // 介绍
      this.InfoPicUrlListFormat = data.InfoPicUrlListFormat // 待定
      if (this.type === 0) {
        this.presentType = data.presentType
      }
      if (this.type === 2) {
        this.originalPrice = data.originalPrice
        this.postage = data.postage
      }
      this.recordList = []
      for (let i = 0; i < data.recordList.length; i++) {
        let record = data.recordList[i]
        record.pojoNickName = record.nick_name.slice(0, 1) + '**'
        // console.log('change_time', record.change_time)
        let date = new Date(record.change_time)
        // let date = new Date('2018/11/20 07:00')
        record.pojoTime = this.$utils.harrisonDate.timeGapFromNow(date, {showDetail: false})
        this.recordList.push(record)
      }
      // this.recordList = data.recordList
    },
    async _change () {
      let params = {
        type: this.type,
        presentId: this.id
      }
      if (this.type === 0) {
        params.presentType = this.presentType
      }
      // 点击兑换的处理
      if (this.totalAmount === 0) {
        utils.showError('商品已售罄', 1000)
        return
      }
      if (this.mathCoin < this.price) { // 数学币不够商品标价
        utils.showError('您的数学币余额不足', 1000)
        return
      }
      console.log('this.type=', this.type)
      if (this.type === 2) { // 实物礼品
        // console.log('实物礼品')
        wx.redirectTo({
          url: '/pages/order-confirm/main'
        })
      } else { // 虚拟礼品
        if (this.submitLoading) {
          return
        }
        this.submitLoading = true
        utils.showLoading()
        try {
          await placeOrder(params)
          // console.log('兑换虚拟礼品', result)
          this.submitLoading = false
          this.FETCH_USER_INFO()
          wx.hideLoading()
          wx.redirectTo({
            url: `/pages/change-success/main?giftId=${this.id}&giftType=${this.type}`
          })
        } catch (e) {
          // console.log('err', e)
          this.submitLoading = false
          wx.hideLoading()
          utils.showError(e.message)
        }
      }
    }
  },
  async onLoad (options) {
    // console.log('gift-detail页面onLoad', options)
    // 上报分享
    if (options.openId) {
      share({
        id: options.openId
      })
    }
    // this.id = this.gift.id
    // this.type = this.gift.type
    this.id = parseInt(options.giftId)
    this.type = parseInt(options.giftType)
    // console.log('id type', this.id, this.type)
    utils.showLoading()
    try {
      const { data } = await getGiftDetail({
        id: this.id,
        type: this.type
      })
      this._pojo(data)
      wx.hideLoading()
    } catch (e) {
      // console.log('yichang', e)
      wx.hideLoading()
      utils.showError()
    }
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: '极客数学帮',
      path: `pages/gift-detail/main?giftId=${this.id}&giftType=${this.type}&openId=${this.openId}`
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import "~@/common/style/mixin.styl"
  @import "~@/common/style/color.styl"
  @import url("~mpvue-wxparse/src/wxParse.css");
  .gift-detail-page{
    .html-wrap{
      padding 0 20rpx 130rpx 20rpx
    }
    .introduce{
      display flex
      flex-direction column
      .introduce-img{
        width 750rpx
      }
    }
    .swiper-wrap{
      position relative
      $swiper-width=750rpx
      $swiper-height=600rpx
      .swiper{
        width $swiper-width
        height $swiper-height
      }
      .slide-image{
        width $swiper-width
        height $swiper-height
      }
      .my-indicator{
        position absolute
        bottom 20rpx
        right 35rpx
        width 91rpx
        height 50rpx
        border-radius 24rpx
        color #fff
        background rgba(195,192,191,0.5)
        center()
        font-size 26rpx
        font-weight 400
        .current{
          font-size 32rpx
          transform scale(1, 1.2)
        }
      }
    }
    .gift-info{
      background #fff
      padding 0 25rpx
      display flex
      flex-direction column
      justify-content space-around
      height 206rpx
      margin-bottom 22rpx
      .name{
        color #333
        font-size 30rpx
        font-weight bolder
        wrap(2)
      }
      .middle{
        display flex
        align-items center
        .postage{
          background #FFEDD4
          color #F69307
          center()
          padding 1rpx
          font-size 24rpx
          margin-right 43rpx
        }
        .shengyu{
          background #FFEBE7
          border 1rpx solid #FFB2A3
          color #FF4520
          border-radius 16rpx
          font-size 24rpx
          padding 2rpx 3rpx
          center()
        }
      }
      .bottom{
        display flex
        justify-content space-between
        align-items center
        .price{
          display flex
          align-items center
          .now{
            margin-right 21rpx
            display flex
            align-items center
            .num{
              color main-color
              font-size 36rpx
              transform scale(1,1.1)
            }
            .suffix{
              font-size 26rpx
              color #333
            }
          }
          .old{
            text-decoration line-through
            color #999999
            font-size 26rpx
          }
        }
        .share{
          display flex
          align-items center
          color main-color
          position relative
          .btn-wrap{
            position absolute
            top 0
            left 0
            width 100%
            height 100%
          }
          .share-title{
            font-size 30rpx
            padding-right 6rpx
          }
        }
      }
    }
    .exchange-record-wrap{
      padding-bottom 130rpx
      .exchange-record{
        background #fff
        display flex
        align-items center
        justify-content space-between
        padding 20rpx
        .user{
          flex 0 0 auto
          display flex
          align-items center
          .avatar{
            width 60rpx
            height 60rpx
            border-radius 50%
            margin-right 16rpx
          }
          .name{
            font-size 26rpx
            color #333
          }
        }
        .info{
          font-size 26rpx
          color #999
          flex 0 0 400rpx
          no-wrap()
        }
        .time{
          font-size 26rpx
          color #999
        }
      }
    }

    .confirm-btn-wrap{
      width 750rpx
      position fixed
      bottom 15rpx
      left 0rpx
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
