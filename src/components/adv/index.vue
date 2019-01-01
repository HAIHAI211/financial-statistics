<template>
  <div class="adv-component" v-if="selfShow">
    <div class="adv-wrap" v-if="adUrl && type !== 'modal'">
      <div class="adv" :style="{backgroundImage: 'url('+ adUrl +')'}" @click="_toWebView"></div>
    </div>
    <div class="index-pop" v-if="adUrl && type === 'modal'">
      <image :src="adUrl" class="adv-img" @click="_toWebView"/>
      <image src="/static/img/delete@2x.png" class="close" @click="selfShow=false"/>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  props: {
    show: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'index'
    }
  },
  data () {
    return {
      selfShow: this.show
    }
  },
  computed: {
    ...mapState(['advs', 'openId']),
    adUrl () {
      switch (this.type) {
        case 'index':
          return this.getPicUrlById(1)
        case 'modal':
          return this.getPicUrlById(2)
        case 'gift0':
          return this.getPicUrlById(3)
        case 'gift1':
          return this.getPicUrlById(4)
        case 'gift2':
          return this.getPicUrlById(5)
        case 'gift3':
          return this.getPicUrlById(6)
        case 'me':
          return this.getPicUrlById(7)
        case 'exchange':
          return this.getPicUrlById(8)
        default:
          return null
      }
    },
    jumpUrl () {
      switch (this.type) {
        case 'index':
          return this.getJumpUrlById(1)
        case 'modal':
          return this.getJumpUrlById(2)
        case 'gift0':
          return this.getJumpUrlById(3)
        case 'gift1':
          return this.getJumpUrlById(4)
        case 'gift2':
          return this.getJumpUrlById(5)
        case 'gift3':
          return this.getJumpUrlById(6)
        case 'me':
          return this.getJumpUrlById(7)
        case 'exchange':
          return this.getJumpUrlById(8)
      }
    },
    reportName () {
      switch (this.type) {
        case 'index':
          return 'index_adv'
        case 'modal':
          return 'modal_adv'
        case 'gift0':
          return 'gift1_adv'
        case 'gift1':
          return 'gift2_adv'
        case 'gift2':
          return 'gift3_adv'
        case 'gift3':
          return 'gift4_adv'
        case 'me':
          return 'me_adv'
        case 'exchange':
          return 'exchange_adv'
      }
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
    _toWebView () {
      wx.reportAnalytics(this.reportName, {
        user_openid: this.openId
      })
      wx.navigateTo({
        url: `/pages/web/main?src=${this.jumpUrl}`
      })
    },
    getJumpUrlById (id) {
      for (let i = 0; i < this.advs.length; i++) {
        let adv = this.advs[i]
        if (adv.id === id) {
          return adv.jumpUrl
        }
      }
      return ''
    },
    getPicUrlById (id) {
      for (let i = 0; i < this.advs.length; i++) {
        let adv = this.advs[i]
        if (adv.id === id) {
          return adv.picUrl
        }
      }
      return ''
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import "~@/common/style/mixin.styl"
  @import "~@/common/style/color.styl"
  .adv-wrap{
    padding-bottom main-gap
    display flex
    justify-content center
    .adv{
      border-radius 8rpx
      bg-size(main-width, 260rpx)
    }
  }
  .index-pop{
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    background rgba(0,0,0,0.3)
    center()
    flex-direction column
    .adv-img{
      border-radius 12rpx
      max-width 700rpx
    }
    .close{
      margin-top 20rpx
      width 60rpx
      height 60rpx
    }
  }
</style>
