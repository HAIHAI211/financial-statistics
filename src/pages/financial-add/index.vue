<template>
  <div class="financial-add-page">
    <picker
      mode="date"
      fields="month"
      :value="date"
      @cancel="more=!more"
      @change="_monthChange">
        <div class="picker date-picker" @click="more=!more">
          {{ financialMonth }}
          <div :class="['iconfont','icon-sanjiao', {'sanjiao-more': more}]"/>
        </div>
    </picker>
    <button plain class="save-btn" @click="_save">保存</button>
    <div class="card" v-for="(financialDetail, financialDetailIndex) in financialDTO.financialDetailList" :key="financialDetailIndex">
      <div class="head">
        <picker
          @change="_userChange($event, financialDetailIndex)"
          :value="selfDetailList[financialDetailIndex].userIndex"
          :range="financialUserList"
          range-key="userName"
          v-if="financialUserList.length">
          <div :class="['avatar',{'female': financialUserList[selfDetailList[financialDetailIndex].userIndex].userSex === ENUM.WOMEN}]">{{ financialUserList[selfDetailList[financialDetailIndex].userIndex].userName }}</div>
        </picker>
        <picker
          @change="_categoryChange($event, financialDetailIndex)"
          @cancel="selfDetailList[financialDetailIndex].categoryArrowDown=!selfDetailList[financialDetailIndex].categoryArrowDown"
          :value="selfDetailList[financialDetailIndex].categoryIndex"
          :range="financialCategoryList"
          range-key="categoryName"
          v-if="financialCategoryList.length">
          <div class="picker category-picker" @click="selfDetailList[financialDetailIndex].categoryArrowDown=!selfDetailList[financialDetailIndex].categoryArrowDown">
            {{ financialCategoryList[selfDetailList[financialDetailIndex].categoryIndex].categoryName }}
            <div :class="['iconfont','icon-sanjiao', {'sanjiao-more': selfDetailList[financialDetailIndex].categoryArrowDown}]"/>
          </div>
        </picker>
      </div>
      <div class="item">
        <div class="label">负债：</div>
        <div class="value" style="margin-right:30rpx;"><switch :checked="financialDetail.isDebt" @change="_debtSwitchChange($event,financialDetailIndex)" color="#990000" type="checkbox"/></div>
        <div class="label">金额：</div>
        <div class="value" style="display: flex; align-items: center">
          <span>{{ financialDetail.isDebt ? '-' : '+' }}</span>
          <input type="digit" :placeholder="financialPricePlaceholder" class="input" :value="selfDetailList[financialDetailIndex].price" @blur="_priceChange($event, financialDetailIndex)">
        </div>
      </div>
      <div class="item" v-if="financialDetail.isDebt">
        <div class="label">最迟还款日：</div>
        <div class="value" style="margin-right:30rpx;">
          <picker
            mode="date"
            fields="day"
            :value="deadline"
            @change="_deadlineChange">
            <div class="picker deadline-picker">
              {{deadline}}
            </div>
          </picker>
        </div>
        <div class="label">已还清：</div>
        <div class="value">
          <switch @change="_paySwitchChange" color="#990000"/>
        </div>
      </div>
    </div>
    <div class="add-btn">+</div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import ENUM from '@/enum'
export default {
  data () {
    return {
      ENUM: ENUM,
      isAdd: true,
      date: '2019-01',
      deadline: '2019-01-01',
      categoryIndex: 0,
      more: true,
      categoryArrowDown: true,
      isDebt: true,
      haspay: false,
      financialDTO: {
        masterId: null,
        financialDate: null,
        financialAmount: 0,
        financialDetailList: [
          {
            detailId: null,
            masterId: null,
            userId: null,
            categoryType: null,
            financialPrice: 0,
            isDebt: ENUM.DEBT,
            deadline: null,
            hasPay: ENUM.NO_PAY
          }
        ]
      },
      selfDetailList: [
        {
          categoryArrowDown: true,
          categoryIndex: 0,
          userIndex: 0,
          price: 0 // 永远是正值
        }
      ]
    }
  },
  computed: {
    ...mapState(['financialCategoryList', 'financialUserList']),
    financialPricePlaceholder () {
      return this.isDebt ? '请输入负债金额' : '请输入盈利金额'
    },
    financialMonth () {
      if (!this.financialDTO.financialDate) return null
      let fd = this.$utils.harrisonDate.getDate(this.financialDTO.financialDate, {showDetail: false})
      return fd.year + '-' + fd.addZeroMonth
    }
  },
  methods: {
    _save () {
      console.log(this.financialDTO)
    },
    _monthChange (e) {
      this.more = !this.more
      console.log('picker发送选择改变，携带值为', e)
      let monthStr = e.mp.detail.value
      let arr = monthStr.split('-')
      let resultDate = new Date()
      resultDate.setFullYear(arr[0])
      resultDate.setMonth(arr[1] - 1)
      resultDate.setDate(1)
      this.financialDTO.financialDate = resultDate
    },
    _userChange (e, financialDetailIndex) {
      console.log('userChange')
      let userIndex = e.mp.detail.value
      this.selfDetailList[financialDetailIndex].userIndex = userIndex
      this.financialDTO.financialDetailList[financialDetailIndex].userId = this.financialUserList[userIndex].userId
    },
    _categoryChange (e, financialDetailIndex) {
      this.selfDetailList[financialDetailIndex].categoryArrowDown = !this.selfDetailList[financialDetailIndex].categoryArrowDown
      console.log('picker发送选择改变，携带值为', e)
      this.selfDetailList[financialDetailIndex].categoryIndex = e.mp.detail.value
      this.financialDTO.financialDetailList[financialDetailIndex].categoryType = this.financialCategoryList[e.mp.detail.value].categoryType
    },
    _debtSwitchChange (e, finanicalDetailIndex) {
      console.log(e.mp.detail.value)
      let v = this.selfDetailList[finanicalDetailIndex].price
      let isDebt = e.mp.detail.value
      this.financialDTO.financialDetailList[finanicalDetailIndex].isDebt = isDebt ? 1 : 0
      this.financialDTO.financialDetailList[finanicalDetailIndex].financialPrice = isDebt ? -v : v
    },
    _paySwitchChange (e) {
      this.haspay = e.mp.detail.value
    },
    _priceChange (e, financialDetailIndex) {
      let v = Math.abs(e.mp.detail.value)
      let isDebt = this.financialDTO.financialDetailList[financialDetailIndex].isDebt
      this.selfDetailList[financialDetailIndex].price = v
      this.financialDTO.financialDetailList[financialDetailIndex].financialPrice = isDebt ? -v : v
      console.log(e.mp.detail.value)
    }
  },
  onLoad (options) {
    console.log(this.financialUserList[0].userName)
    this.isAdd = options.type === 'add'
    if (this.isAdd) { // init
      let now = new Date()
      this.financialDTO = {
        masterId: null,
        financialDate: now,
        financialAmount: 0,
        financialDetailList: [
          {
            detailId: null,
            masterId: null,
            userId: null,
            categoryType: this.financialCategoryList[0].categoryType,
            financialPrice: 0,
            isDebt: ENUM.DEBT,
            deadline: now,
            hasPay: ENUM.NO_PAY
          }
        ]
      }
      this.selfDetailList = [
        {
          categoryArrowDown: true,
          categoryIndex: 0,
          userIndex: 0,
          price: 0
        }
      ]
    }
    console.log(this.financialCategoryList)
  }
}
</script>

<style lang="stylus" scoped>
  @import "~@/common/style/mixin.styl"
  @import "~@/common/style/color.styl"
  .financial-add-page{
    height 100%
    .picker{
      center()
      &.date-picker{
        margin-bottom 100rpx
      }
      &.category-picker{
        padding 20rpx 0
        font-size 35rpx
        .iconfont{
          font-size 35rpx
        }
      }
      &.deadline-picker{
        font-size 30rpx
      }
    }
    .iconfont{
      font-size 50rpx
      transform rotate(180deg)
      transition all .5s
      &.sanjiao-more{
        transform rotate(0deg)
      }
    }
    .card{
      margin 0 auto
      width 700rpx
      border-radius 10rpx
      background #fff
      box-shadow: 0 2px 5px rgba(0,0,25,0.1), 0 5px 75px 1px rgba(0,0,50,0.2);
      transition: box-shadow 1s ease-out;
      transition-delay: 2s;
      .head{
        width 660rpx
        margin 0 auto
        border-bottom 1.3rpx solid #ddd
        height 150rpx
        position relative
        center()
        .avatar{
          width 100rpx
          height 100rpx
          font-size 36rpx
          border-radius 50%
          center()
          color #fff
          background lightskyblue
          position absolute
          top 25rpx
          left 0
          &.female{
            background lightpink
          }
        }
      }
      .line-item{
        display flex
      }
      .item{
        padding 15rpx 0
        width 660rpx
        margin 0 auto
        display flex
        align-items center
        .label{
          flex 0 0 auto
          font-size 28rpx
        }
      }
      .input{
        font-size 38rpx
        color #666
      }
    }
    .add-btn{
      center()
      width 80rpx
      height 80rpx
      background lightseagreen
      font-weight bold
      color #fff
      font-size 40rpx
      border-radius 50%
      margin 40rpx auto
    }
    .save-btn{
      position fixed
      bottom 0
      background lightseagreen
      width 750rpx
      border none
      color #fff
      border-radius 0rpx
    }
  }
</style>
