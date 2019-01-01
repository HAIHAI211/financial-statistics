<template>
  <div :class="['tab-bar', {'fix': fix}]">
    <div v-for="(item,index) in items"
               open-type="redirect"
               :key="index"
               hover-class="none"
               :class="['bar-item',{'active': index === activeIndex}]"
               @click.stop="toPage(index === activeIndex, item.url)">
      <span :class="['iconfont',item.icon]"/>
      <span class="text">{{ item.label }}</span>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      activeIndex: {
        type: Number,
        default: 0
      },
      fix: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        items: [
          {
            label: '首页',
            icon: 'icon-shouye1',
            url: '/pages/index/main'
          },
          {
            label: '礼品',
            icon: 'icon-lipin',
            url: '/pages/gift/main'
          },
          {
            label: '偷步数',
            icon: 'icon-xiezi',
            url: '/pages/step/main'
          },
          {
            label: '我的',
            icon: 'icon-wode',
            url: '/pages/me/main'
          }
        ]
      }
    },
    methods: {
      toPage (isCurrentPage, toUrl) {
        if (!isCurrentPage) {
          wx.switchTab({
            url: toUrl
          })
        }
      }
    }
  }
</script>
<style scoped lang="stylus">
  .tab-bar{
    width: 100%;
    height: 100rpx;
    box-sizing border-box
    border-top: 1px solid #c8c8c8
    display: flex;
    background: #fff;
    -webkit-backdrop-filter: blur(6px);
    .bar-item{
      flex: 1;
      display flex
      flex-direction column
      align-items center
      justify-content center
      .text{
        color #999999
        font-size 25rpx
      }
      .iconfont{
        color #B3B3B3
        font-size 40rpx
      }
      .icon-xiezi{
        font-size 46rpx
      }
      &.active{
        .text, .iconfont{
          color: #3ACF7A
        }
      }
    }
  }
  .fix{
    left 0
    bottom 0
    position fixed
    z-index 1000
  }
</style>
