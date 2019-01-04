<template>
  <div class="index-page">
    <navigator class="add-btn" url="/pages/financial-add/main?type=add">+</navigator>
    <div class="card" v-for="(item,itemIndex) in activePage.list" :key="itemIndex">
      <div class="card-item">
        <div class="label">月份</div>
        <div class="value">{{item.financialDate}}</div>
      </div>
      <div class="card-item">
        <div class="label">负债总额</div>
        <div class="value">{{item.financialDebt}}</div>
      </div>
      <div class="card-item">
        <div class="label">待偿还</div>
        <div class="value">{{item.financialWaitDebt}}</div>
      </div>
      <div class="card-item">
        <div class="label">已偿还</div>
        <div class="value">{{item.financialClearDebt}}</div>
      </div>
      <div class="card-item">
        <div class="label">收入</div>
        <div class="value">{{item.financialIncome}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapActions} from 'vuex'
import {getMonthMasters} from '@/http/api'
import PullToRefreshMixin from '../../utils/harrison-mp-utils/mixin/pullToRefreshMixin'
export default {
  mixins: [PullToRefreshMixin],
  data () {
    return {
      apis: [getMonthMasters]
    }
  },
  methods: {
    ...mapActions(['FETCH_FINANCIAL_CATEGORY_LIST', 'FETCH_FINANCIAL_USER_LIST'])
  },
  async mounted () {
    this.FETCH_FINANCIAL_CATEGORY_LIST()
    this.FETCH_FINANCIAL_USER_LIST()
    // const result = await getMonthMasters({
    //   pageNum: 0,
    //   pageSize: 10
    // })
    // console.log('monthMasters', result)
  }
}
</script>

<style lang="stylus" scoped>
  @import "~@/common/style/mixin.styl"
  @import "~@/common/style/color.styl"
  .index-page{
    height 100%
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
      bottom 100rpx;
    }
    .card{
      border 1rpx solid black
      border-radius 8rpx
      .card-item{
        display flex
      }
    }
  }
</style>
