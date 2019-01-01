<template>
  <div class="step-page">
    <div class="bg" @touchstart.stop="">
      <div class="step-info">
        <open-data type="userAvatarUrl" class="avatar"></open-data>
        <div class="step-num">{{ todayAllStep }}</div>
      </div>
    </div>
    <div :class="['news',{'more': more}]"  :style="{height: systemInfo.windowHeight + 'px'}"  @touchmove="_touchmove" @touchstart="_touchstart" @touchend="_touchend">
      <div class="news-title"  @click="more=!more" style="height:50px;">
        <span>最新动态</span>
        <div class="news-more"><div :class="['iconfont','icon-sanjiao', {'sanjiao-more': more}]"/></div>
      </div>
      <div class="avatar-wall" v-if="avatars.length" style="height:80px;box-sizing: border-box">
      <div class="avatar" v-for="(item, avatarIndex) in avatars" :key="avatarIndex">
        <image class="avatar-img" :src="item.avatarUrl"/>
        <div class="steal-num">{{ item.stealStepNum }}</div>
      </div>
    </div>
    <scroll-view  class="content" :style="{height: (systemInfo.windowHeight - 130) + 'px'}" scroll-y v-if="stealMeFormatList">
      <div class="wrap">
        <div class="steal-me-item" v-for="(item, stealMeIndex) in stealMeFormatList" :key="stealMeIndex">
          <div class="date-label" v-if="item.dateLabel">{{item.dateLabel}}</div>
          <div class="steal-me-item-inner" @click="_itemInnerClick(item)">
            <div class="item-title">{{ item.nickName }} <span class="item-title-suffix">偷走你 </span><span class="item-step">{{ item.stealStepNum }}步</span></div>
            <div class="item-time">{{ item.time }}</div>
            <div class="item-steal" v-if="item.canBeSteal && item.isTodayBeStolen"></div>
          </div>
        </div>
      </div>
    </scroll-view>
    </div>
    <div class="bubble-container" v-for="(bubble,bubbleIndex) in bubbleClicks" :key="bubbleIndex">
      <div :class="['bubble-wrap', 'bubble-wrap-' + bubbleIndex,{'up-down-animation': !bubble.hasClick},{'scale-disappear-animation': bubble.hasClick}]">
        <button open-type="getUserInfo" @getuserinfo="_getuserinfo($event,bubbleIndex)" style="width:100%;height:100%;opacity:0;"></button>
      </div>
      <div :class="['plus-step', 'plus-step-' + bubbleIndex, {'move-disappear-animation': bubble.hasClick}]">
        +{{ bubble.stolenStepNum }}
      </div>
    </div>
    <auth-pop :show.sync="werunPopShow"/>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import {mixinLoginWerun} from '@/mixin'
import tabBar from '@/components/tab-bar'
import authPop from '@/components/auth-pop'
import * as api from '@/http/api'
import RUN_ENUM from '@/enum'
export default {
  mixins: [mixinLoginWerun],
  components: {
    tabBar,
    // accreditPop,
    authPop
  },
  data () {
    return {
      stealMeList: [],
      bubbles: [],
      bubbleClicks: [],
      hasUpdateUserInfo: false,
      more: false,
      startY: 0,
      startTime: 0,
      nowY: 0,
      nowTime: 0,
      lastY: 0,
      werunPopShow: false,
      hasMove: false, // 如果是在scrollview中滑动，父元素的touchmove是被拦截的
      userinfo: null
    }
  },
  computed: {
    ...mapState(['authWerun', 'authUserInfo', 'systemInfo']),
    stealMeFormatList () {
      let result = []
      let dateLabels = []
      for (let i = 0; i < this.stealMeList.length; i++) {
        let stealItem = this.stealMeList[i]
        let stealDate = new Date(stealItem.stealTime)
        let detailStealDate = this.$utils.harrisonDate.getDate(stealDate)
        console.log('isToday', detailStealDate)
        let dateLabel = detailStealDate.isToday ? RUN_ENUM.TODAY : detailStealDate.isYesterday ? RUN_ENUM.YESTERDAY : detailStealDate.formatDate
        let time = detailStealDate.formatTime
        if (!dateLabels.includes(dateLabel)) {
          // console.log('dateLabels不包含' + dateLabel + '，现在将其收纳入库')
          dateLabels.push(dateLabel)
        } else {
          dateLabel = ''
        }
        result.push({
          ...stealItem,
          dateLabel,
          time
        })
      }
      return result
    },
    avatars () {
      let result = []
      for (let i = 0; i < this.stealMeList.length; i++) {
        if (i < 5) {
          result.push({
            ...this.stealMeList[i]
          })
        }
      }
      return result
    }
  },
  watch: {
    async bubbleClicks (v) {
      if (!v || !v.length) {
        this.utils.pf('showModal', {
          title: '提示',
          showCancel: false,
          content: '今天泡泡用完啦，明天再来吧'
        })
        return
      }
      for (let i = 0; i < v.length; i++) {
        if (!v[i].hasClick) {
          return
        }
      }
      await this.$utils.rest.sleep(500)
      this._load('正在收集新泡泡')
    }
  },
  methods: {
    ...mapMutations(['SET_AUTH_WE_RUN', 'SET_USER_INFO', 'SET_AUTH_USER_INFO']),
    ...mapActions(['FETCH_USER_INFO', 'AUTH_OF_USER_INFO']),
    _touchstart (e) {
      this.startY = e.mp.touches[0].pageY
      this.startTime = Date.now()
    },
    _touchmove (e) {
      this.hasMove = true
      this.lastY = this.nowY
      this.nowY = e.mp.touches[0].pageY
      this.nowTime = Date.now()
    },
    _touchend () {
      if (this.hasMove) {
        let distance = this.nowY - this.startY
        let time = (this.nowTime - this.startTime) / 1000
        let speed = distance / time
        if (speed < -110 && !this.more) {
          this.more = true
        }
        if (speed > 110 && this.more) {
          this.more = false
        }
        // console.log(speed > 0 ? '下拉' : '上滑', speed)
      }
      this.hasMove = false
    },
    async _itemInnerClick (item) {
      // console.log('item', item)
      if (item.canBeSteal && item.isTodayBeStolen) { // 回偷
        // console.log('可以回偷他！！')
        try {
          this.utils.showLoading()
          const stealStepResult = await api.stealStep({
            openIdBeStolen: item.openIdSteal,
            stolenStepNum: item.stealStepNum,
            type: 'stealBack'
          })
          wx.hideLoading()
          this.utils.pf('showModal', {
            title: '提示',
            showCancel: false,
            content: `成功偷取${stealStepResult.data.stolenStepNum}步`
          })
          this.FETCH_USER_INFO()
          this._fetchStealMeList()
          // console.log('回偷结果', stealStepResult)
        } catch (e) {
          wx.hideLoading()
          this.utils.showError(e.message, 1000)
          // console.log('错误', e)
        }
      }
    },
    _setNavigationStyle () {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#2056dd',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
    },
    async _getuserinfo (e, index) { // 点击泡泡
      // console.log('userinfo', e.mp.detail.userInfo)
      this.userinfo = e.mp.detail.userInfo
      this.SET_AUTH_USER_INFO(!!this.userinfo)
      if (!this.authUserInfo) {
        return
      }
      if (!this.authWerun) {
        this.werunPopShow = true
        return
      }
      // 修改数组
      let result = [
        ...this.bubbleClicks
      ]
      result[index].hasClick = true
      this.bubbleClicks = result
      // 上报服务器告知
      await api.stealStep({
        openIdBeStolen: this.bubbles[index].openId,
        stolenStepNum: this.bubbles[index].stolenStepNum,
        type: 'steal'
      })
      this.FETCH_USER_INFO()
      this._fetchStealMeList()
      if (!this.hasUpdateUserInfo) {
        api.updateUserInfo(this.userinfo) // 更新用户信息
        this.hasUpdateUserInfo = true
      }
    },
    async _fetchRandomSteal () {
      const {data} = await api.randomSteal() // 获取6个随机被偷的靓仔
      this.bubbles = data
      let result = []
      for (let i = 0; i < this.bubbles.length; i++) {
        result.push({
          hasClick: false,
          stolenStepNum: this.bubbles[i].stolenStepNum
        })
      }
      this.bubbleClicks = result
    },
    async _fetchStealMeList () {
      const stealMeResult = await api.stealMeList()
      this.stealMeList = stealMeResult.data
      // console.log('stealMeResult', stealMeResult)
    },
    async _load (msg) {
      this.hasUpdateUserInfo = false
      try {
        this.utils.showLoading(msg)
        await this._fetchRandomSteal()
        await this._fetchStealMeList()
        wx.hideLoading()
      } catch (e) {
        // console.log(e)
        wx.hideLoading()
        this.utils.showError()
      }
    }
  },
  onLoad () {
    this._setNavigationStyle()
  },
  onShow () {
    // console.log('windowHeight', this.systemInfo.windowHeight)
    // 权限
    this.AUTH_OF_USER_INFO()
    // console.log('步数权限', this.authWerun) // 必须
    // console.log('用户权限', this.authUserInfo) // 可选
    this._load()
  }
  // onHide () {
  //   wx.showTabBar()
  // }
}
</script>

<style scoped lang="stylus">
  @import "~@/common/style/mixin.styl"
  @import "~@/common/style/color.styl"
  $bg-height=950rpx
  .step-page{
    height: 100%;
    $bubble-0-top=500rpx
    $bubble-0-left=50rpx
    $bubble-1-top=200rpx
    $bubble-1-left=500rpx
    $bubble-2-top=300rpx
    $bubble-2-left=640rpx
    $bubble-3-top=20rpx
    $bubble-3-left=380rpx
    $bubble-4-top=430rpx
    $bubble-4-left=570rpx
    $bubble-5-top=500rpx
    $bubble-5-left=390rpx
    .bg{
      height 100%
      // bg-size(750rpx, $bg-height)
      background-color #2056dd
      // bg-image('step-bg', 'jpg')
      simple-bg-image('sss', 'png')
      background-size cover
      background-position 0rpx 0rpx
      background-repeat no-repeat
    }
    .bg-img{
      // scale = 1931/1125
      width 750rpx
    }
    .step-info{
      position absolute
      top 0
      right 20rpx
      background rgba(255,255,255,0.95)
      display flex
      align-items center
      border-radius 45rpx
      box-sizing border-box
      height 75rpx
      padding-left 5rpx
      padding-right 15rpx
      .avatar{
        flex 0 0 auto
        width 70rpx
        height 70rpx
        border-radius 50%
        overflow hidden
        margin-right 13rpx
      }
      .step-num{
        flex 1
        font-size 42rpx
        color main-color
        font-weight bold
        transform scale(1,1.2)
      }
    }
    .news{
      opacity 0
      &.more{
        transform translateY(0)
        opacity .98
      }
      transition all .5s
      position fixed
      z-index 2
      width 750rpx
      height 100%
      display flex
      flex-direction column
      border-top-left-radius 30rpx
      border-top-right-radius 30rpx
      overflow hidden
      top 0
      left 0
      transform translateY(79%)
      opacity 1
      background rgba(245,245,245,1)
      background rgba(255,255,255,1)
      .news-title{
        flex 0 0 auto
        background rgba(245,245,245,1)
        height 50px
        display flex
        justify-content space-between
        align-items center
        color #000
        font-size 32rpx
        font-weight bold
        padding 0 30rpx
        letter-spacing 1.5rpx
        .news-more{
          /*background #fff*/
          font-size 28rpx
          padding 5rpx 8rpx
          border-radius 8rpx
          color #000
          center()
          .iconfont{
            font-size 50rpx
            transform rotate(180deg)
            transition all .5s
            &.sanjiao-more{
              transform rotate(0deg)
            }
          }
        }
      }
      .avatar-wall{
        flex 0 0 auto
        display flex
        padding 30rpx 0
        .avatar{
          position relative
          .avatar-img{
            width 90rpx
            height 90rpx
            margin 0 30rpx
            border-radius 15rpx
          }
          .steal-num{
            width 42rpx
            height 42rpx
            border-radius 50%
            background lightseagreen
            position absolute
            right 20rpx
            bottom 0rpx
            font-size 17rpx
            color #fff
            center()
          }
        }
      }
      .content{
        flex 1
        .wrap{
          /*height:100%;*/
          width 100%;
          display: flex;
          flex-direction: column;
          /*flex-wrap: wrap;*/
          box-sizing border-box
          /*padding-top 30rpx*/
          .steal-me-item{
            width 750rpx
            box-sizing border-box
            padding 0rpx 30rpx
            .date-label{
              margin-top 15rpx
              font-size 32rpx
              font-weight bolder
              color #333
            }
            .steal-me-item-inner{
/*              &:hover{
                background #ddd
              }*/
              position relative
              box-sizing border-box
              padding 0 10rpx
              height 86rpx
              background #fff
              display flex
              justify-content space-between
              align-items center
              .item-title{
                color #000
                font-weight bold
                font-size 28rpx
                .item-title-suffix{
                  font-size 25rpx
                  color #999
                  font-weight 400
                }
              }
              .item-step{
                color lightseagreen
                font-size 30rpx
              }
              .item-time{
                color #999999
                font-size 26rpx
                padding-right 40rpx
              }
              .item-steal{
                bg-image('hand-up-copy')
                bg-size(45rpx, 45rpx)
                position absolute
                bottom 20rpx
                right 0
              }
            }
          }
        }
      }
    }
    .bubble-wrap{
      position fixed
      z-index 1
      border-radius 50%
      overflow hidden
      bg-size(110rpx, 110rpx)
      bg-image('bul')
/*      .bubble-btn{
        width 100%
        height 100%
        opacity 0
      }*/
      &.bubble-wrap-0{
        top $bubble-0-top
        left $bubble-0-left
      }
      &.bubble-wrap-1{
        top $bubble-1-top
        left $bubble-1-left
        animation-delay .5s
      }
      &.bubble-wrap-2{
        top $bubble-2-top
        left $bubble-2-left
        animation-delay .7s
      }
      &.bubble-wrap-3{
        top $bubble-3-top
        left $bubble-3-left
        animation-delay .8s
      }
      &.bubble-wrap-4{
        top $bubble-4-top
        left $bubble-4-left
        animation-delay .6s
      }
      &.bubble-wrap-5{
        top $bubble-5-top
        left $bubble-5-left
        animation-delay .9s
      }
    }
    .plus-step{
      font-size 66rpx
      color main-color
      opacity 0
      font-weight bold
      position fixed
      transform scale(1.1,1.1)
      /*transition transform .8s ease .2s
      &.active{
        transform scale(0,0)
        opacity 1
        z-index 2
      }*/
      &.plus-step-0{
        top $bubble-0-top
        left $bubble-0-left
      }
      &.plus-step-1{
        top $bubble-1-top
        left $bubble-1-left
      }
      &.plus-step-2{
        top $bubble-2-top
        left $bubble-2-left - 60rpx
      }
      &.plus-step-3{
        top $bubble-3-top
        left $bubble-3-left
      }
      &.plus-step-4{
        top $bubble-4-top
        left $bubble-4-left
      }
      &.plus-step-5{
        top $bubble-5-top
        left $bubble-5-left
      }
    }
  }
</style>
