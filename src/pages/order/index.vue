<template>
  <div class="order-page">
    <van-tabs :active="pageIndex" @change="tabChange" color="#3ACF7A">
      <van-tab title="数学资料">
        <div class="order-list math">
          <div class="math-order" v-for="(morder,morderIndex) in activePage.list" :key="morderIndex">
            <div class="main">
              <!--<div class="icon type-doc"></div>-->
              <image class="icon" :src="morder.coverPicUrl"/>
              <div class="right">
                <div class="name">{{ morder.name }}</div>
                <div class="price">
                  <div class="num">{{ morder.price }}</div>
                  <div class="suffix">数学币</div>
                </div>
              </div>
            </div>
            <div class="bottom">
              <div class="btn btn-see" @click="_openOn(morder)">查看</div>
              <div class="btn btn-download" @click="_download(morder)">下载</div>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="实物礼品">
        <div class="order-list physical">
          <div class="physical-order" v-for="(porder,porderIndex) in activePage.list" :key="porderIndex">
            <div class="top" v-if="porder.status === 1">
              <span>运单号：{{ porder.waybillNo }}</span>
              <div class="copy" @click="_copy(porder.waybillNo)">复制运单号</div>
            </div>
            <div class="main">
              <image class="icon" :src="porder.coverPicUrl"/>
              <div class="right">
                <div class="title">{{ porder.name }}</div>
                <div class="info">
                  <div class="price">
                    <div class="num">{{ porder.price }}</div>
                    <div class="suffix">数学币</div>
                  </div>
                  <div :class="['state', 'state-' + porder.status]">{{ porder.status === 0 ? '待发货' : '已发货' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
    <run-loading :state="loadingState"/>
  </div>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
import runLoading from '@/components/run-loading'
import runBtn from '@/components/run-btn'
import PullToRefreshMixin from 'harrison-mp-utils/mixin/pullToRefreshMixin'
import {getDocOrder, getRealOrder} from '@/http/api'

export default {
  mixins: [PullToRefreshMixin],
  components: {
    runLoading,
    runBtn
  },
  data () {
    return {
      apis: [getDocOrder, getRealOrder],
      initPageNum: 1,
      params: {},
      fileKey: '',
      hintShow: false
    }
  },
  computed: {
    ...mapState(['gift'])
  },
  watch: {
    pageIndex (v) {
      wx.startPullDownRefresh()
    }
  },
  methods: {
    ...mapMutations(['SET_VIDEO_ORDER']),
    _download (morder) {
      wx.reportAnalytics('doc_download', {
        doc_id: morder.id,
        doc_name: morder.name
      })
      wx.navigateTo({
        url: `/pages/download/main?fileUrl=${morder.fileUrl}`
      })
      // this.fileKey = morder.fileKey
      // this.hintShow = true
    },
    tabChange (v) {
      console.log(v)
      this.pageIndex = v.mp.detail.index
    },
    async _copy (no) {
      await this.utils.copy(no)
      // this.utils.showToast('复制成功')
    },
    async _openOn (mathOrder) {
      wx.reportAnalytics('doc_preview', {
        doc_id: mathOrder.id,
        doc_name: mathOrder.name
      })
      if (mathOrder.type === 0) {
        if (mathOrder.presentType === 'rar' || mathOrder.presentType === 'zip') {
          wx.showModal({
            title: '提示',
            content: '文档为压缩包，无法在线预览，请复制链接到电脑端下载使用。如有问题，请加客服微信咨询。',
            success (res) {
              if (res.confirm) {
                // console.log('用户点击确定')
              } else if (res.cancel) {
                // console.log('用户点击取消')
              }
            }
          })
        } else {
          this.utils.showLoading()
          wx.downloadFile({
            url: mathOrder.fileUrl,
            success (res) {
              const filePath = res.tempFilePath
              wx.openDocument({
                filePath,
                success (res) {
                  // console.log('打开文档成功')
                  wx.hideLoading()
                },
                fail (e) {
                  wx.hideLoading()
                  this.utils.showError(e.message)
                  // console.log(e)
                }
              })
            },
            fail (e) {
              wx.hideLoading()
              this.utils.showError(e.message)
              // console.log(e)
            }
          })
        }
      } else if (mathOrder.type === 1) {
        this.SET_VIDEO_ORDER(mathOrder)
        wx.navigateTo({
          url: '/pages/video/main'
        })
      }
    }
  },
  onLoad (options) {
    // console.log(options)
    if (options.from === 'meMath') {
      this.pageIndex = 0
    } else if (options.from === 'mePhysical') {
      this.pageIndex = 1
    } else { // 是从礼品页面进来
      this.pageIndex = this.gift.type === 2 ? 1 : 0 // gift指的是正在走流程的礼物
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import "~@/common/style/mixin.styl"
  @import "~@/common/style/color.styl"
  .order-page{
    .hint{
      position: fixed;
      z-index: 1000;
      top:0;
      left:0;
      right:0;
      bottom:0;
      background:rgba(0,0,0,0.3);
      center()
      .content{
        width 600rpx
        height 300rpx
        background #fff
        border-radius 12rpx
        display flex
        flex-direction column
        .title{
          flex 0 0 auto
          text-align center
          padding 30rpx 0
          font-size 38rpx
          font-weight bold
        }
        .main{
          flex 1
          padding 0 50rpx
          font-size 32rpx
          color #999
          text-align center
        }
        .btn-wrap{
          border-top 1rpx solid #eee
          flex 0 0 auto
          height 90rpx
          color main-color
        }
      }
    }
    .order-list{
      padding 0 33rpx
      .math-order{
        background #fff
        margin-top 30rpx
        border-radius 5rpx
        width 694rpx
        height 300rpx
        box-sizing border-box
        display flex
        flex-direction column
        .main{
          bg-image('icon_yin')
          background-size 112rpx 83rpx
          background-position 510rpx 78rpx
          background-repeat no-repeat
          flex 0 0 auto
          border-bottom 1rpx solid #DBDBDB
          height 190rpx
          box-sizing border-box
          padding 23rpx 20rpx 10rpx 20rpx
          display flex
          .icon{
            flex 0 0 auto
            bg-size(108rpx,125rpx)
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
        .bottom{
          padding 0 10rpx
          flex 1 0 0
          display flex
          align-items center
          justify-content flex-end
          .btn{
            width 136rpx
            height 65rpx
            border-radius 32rpx
            box-sizing border-box
            center()
            font-size 26rpx
            letter-spacing 1rpx
            &.btn-see{
              background main-color
              color #fff
              margin-right 17rpx
            }
            &.btn-download{
              border 1rpx solid main-color
              color main-color
            }
          }
        }
      }
      .physical-order{
        background #fff
        margin-top 30rpx
        .top{
          padding-left 22rpx
          height 77rpx
          display flex
          justify-content space-between
          align-items center
          font-size 30rpx
          color #333
          border-bottom 1rpx solid #DBDBDB
          .copy{
            border 1rpx solid #b3b3b3
            border-radius 10rpx
            padding 5rpx 10rpx
            font-size 23rpx
            color #B3B3B3
            margin-right 20rpx
          }
        }
        .main{
          height 258rpx
          box-sizing border-box
          padding 22rpx
          display flex
          .icon{
            flex 0 0 auto
            width 205rpx
            height 205rpx
            margin-right 30rpx
          }
          .right{
            flex 1
            display flex
            flex-direction column
            justify-content space-between
            .title{
              wrap(2)
              font-size 30rpx
              color 333
            }
            .info{
              display flex
              justify-content space-between
              align-items center
              .price{
                display flex
                align-items center
                .num{
                  font-size 36rpx
                  color #43D17F
                }
                .suffix{
                  color #333
                  font-size 26rpx
                }
              }
              .state{
                font-size 30rpx
                &.state-0{
                  color #FF5409
                }
                &.state-1{
                  color #B3B3B3
                }
              }
            }
          }
        }
      }
    }
  }
</style>
