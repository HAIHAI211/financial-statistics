<template>
  <div class="index-page">
    <navigator class="add-btn" url="/pages/financial-add/main?type=add">+</navigator>
    <div class="card" v-for="(item,itemIndex) in activePage.list" :key="itemIndex" @click="_monthCardClick(item.masterId)">
      <div class="row head">
        <div class="card-item">
          <div class="value month-value">{{formatDates[itemIndex]}}</div>
        </div>
        <div class="card-item vertical">
          <div class="label head-label">总资产(元)</div>
          <div :class="['value', 'head-value', 'green', {'red': item.financialAmount >= 0}]">{{item.financialAmount}}</div>
        </div>
      </div>
      <div class="row">
        <div class="card-item vertical first">
          <div class="label">负债总额</div>
          <div class="value">{{item.financialDebt}}</div>
        </div>
        <div class="card-item vertical">
          <div class="label">待偿还</div>
          <div class="value">{{item.financialWaitDebt}}</div>
        </div>
      </div>
      <div class="row">
        <div class="card-item vertical first">
          <div class="label">已偿还</div>
          <div class="value">{{item.financialClearDebt}}</div>
        </div>
        <div class="card-item vertical">
          <div class="label">收入</div>
          <div class="value">{{item.financialIncome}}</div>
        </div>
      </div>
    </div>
    <run-loading :state="loadingState"/>
  </div>
</template>
<script>
import {mapActions} from 'vuex'
import {getMonthMasters} from '@/http/api'
import PullToRefreshMixin from '../../utils/harrison-mp-utils/mixin/pullToRefreshMixin'
import RunLoading from '@/components/run-loading'
export default {
  mixins: [PullToRefreshMixin],
  components: {
    RunLoading
  },
  data () {
    return {
      apis: [getMonthMasters]
    }
  },
  computed: {
    formatDates () {
      let result = this.activePage.list.map(e => e.financialDate.slice(0, -3))
      return result
    }
  },
  methods: {
    ...mapActions(['FETCH_FINANCIAL_CATEGORY_LIST', 'FETCH_FINANCIAL_USER_LIST']),
    _monthCardClick (masterId) {
      wx.navigateTo({
        url: `/pages/financial-add/main?type=edit&masterId=${masterId}`
      })
    }
  },
  async mounted () {
    this.FETCH_FINANCIAL_CATEGORY_LIST()
    this.FETCH_FINANCIAL_USER_LIST()
  },
  onShow () {
    this.fetchList()
  }
}
</script>

<style lang="stylus" scoped>
  @import "~@/common/style/mixin.styl"
  @import "~@/common/style/color.styl"
  .index-page{
    padding 20rpx 0 100rpx 0
    .add-btn{
      width 100rpx;
      height 100rpx;
      background #fff;
      font-size 50rpx;
      box-shadow: 0 2px 5px rgba(0,0,25,0.1), 0 5px 75px 1px rgba(0,0,50,0.2);
      transition: box-shadow 1s ease-out;
      transition-delay: 2s;
      border-radius 50%;
      center();
      position fixed;
      left 325rpx;
      bottom 15rpx;
    }
    .card{
      background #fff
      margin 30rpx auto
      width 700rpx
      border-radius 8rpx
      .head{
        padding 20rpx 20rpx
      }
      .row{
        padding 10rpx 20rpx
        display flex
        align-items center
        justify-content space-between
        border-bottom 1rpx solid #eee
      }
      .card-item{
        display flex
        flex 1 0 0
        justify-content center
        &.vertical{
          align-items center
          flex-direction column
        }
        &.first{
          border-right 1rpx solid #eee
        }
        .label{
          font-size 30rpx
          padding-bottom 8rpx
          &.head-label{
            color #ccc
            font-size 35rpx
          }
        }
        .value{
          color #888
          font-size 28rpx
          &.month-value{
            color #000
            font-size 40rpx
            font-weight bold
          }
          &.head-value{
            font-size 45rpx
            font-weight bolder
            &.green{
              color lightseagreen
            }
            &.red{
              color darkred
            }
          }
        }
      }
    }
  }
</style>
