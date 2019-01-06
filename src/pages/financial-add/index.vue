<template>
  <div class="financial-add-page">
    <picker
      v-if="financialDTO.financialDate"
      mode="date"
      fields="month"
      :value="financialMonth"
      @change="_monthChange">
        <div class="picker date-picker">
          {{ financialMonth }}
          <div class="iconfont icon-sanjiao sanjiao-more"/>
        </div>
    </picker>
    <div class="card"
         v-for="(financialDetail, financialDetailIndex) in financialDTO.financialDetailList"
         :key="financialDetailIndex">
      <div class="head">
        <my-picker
          :range="financialUserList"
          rangeKey="userName"
          valueKey="userId"
          v-model="financialDetail.userId">
          <div :class="['avatar',{'female': scope.userSex === 0}]">{{ scope.userName }}</div>
        </my-picker>
        <my-picker
          :range="financialCategoryList"
          rangeKey="categoryName"
          valueKey="categoryType"
          v-model="financialDetail.categoryType">
          <div class="picker category-picker">
            {{ scope.categoryName }}
            <div class="iconfont icon-sanjiao sanjiao-more"/>
          </div>
        </my-picker>
        <div class="close-btn" @click="_close(financialDetailIndex)">X</div>
      </div>
      <div class="item">
        <div class="label">负债：</div>
        <div class="value" style="margin-right:30rpx;">
          <switch :checked="financialDetail.debt" @change="_debtSwitchChange($event,financialDetailIndex)" color="#990000" type="checkbox"/>
        </div>
        <div class="label">金额：</div>
        <div class="value" style="display: flex; align-items: center">
          <span>{{ financialDetail.debt ? '-' : '+' }}</span>
          <input type="digit"
                 placeholder="请输入金额"
                 class="input"
                 :value="detailPrices[financialDetailIndex]"
                 @blur="_priceChange($event, financialDetailIndex)">
        </div>
      </div>
      <div class="item" v-if="financialDetail.debt">
        <div class="label">最迟还款日：</div>
        <div class="value" style="margin-right:30rpx;">
          <picker
            mode="date"
            fields="day"
            :value="financialDetail.deadline"
            @change="_deadlineChange($event, financialDetailIndex)">
            <div class="picker deadline-picker">
              {{financialDetail.deadline}}
            </div>
          </picker>
        </div>
        <div class="label">已还清：</div>
        <div class="value">
          <switch :checked="financialDetail.hasPay" @change="_paySwitchChange($event, financialDetailIndex)" color="#990000"/>
        </div>
      </div>
    </div>
    <div class="add-btn" @click="_add">+</div>
    <button plain class="save-btn" @click="_save" :loading="loading">保存</button>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import {createFinancial, updateFinancial, getMonthDetails} from '@/http/api'
import MyPicker from '@/components/my-picker'
import {getDate} from 'harrison-mp-utils/date'
export default {
  components: {
    MyPicker
  },
  props: {
  },
  data () {
    return {
      scope: {},
      isAdd: true,
      disabled: false, // 提交按钮是否不可用
      loading: false, // 提交按钮是否正在加载
      financialCategory: {
        categoryId: 5,
        categoryType: 5,
        categoryName: '平安信用卡'
      },
      financialDTO: {
        masterId: null,
        financialDate: null,
        financialAmount: 0,
        financialIncome: 0,
        financialDebt: 0,
        financialWaitDebt: 0,
        financialClearDebt: 0,
        financialDetailList: [
          {
            detailId: null,
            masterId: null,
            userId: null,
            categoryType: null,
            financialPrice: 0,
            debt: true,
            deadline: null,
            hasPay: false
          }
        ]
      },
      selfPrices: []
    }
  },
  computed: {
    ...mapState(['financialCategoryList', 'financialUserList']),
    financialMonth () {
      if (!this.financialDTO.financialDate) return null
      return this.financialDTO.financialDate.slice(0, -3)
    },
    detailPrices () {
      let result = this.financialDTO.financialDetailList.map(e => Math.abs(e.financialPrice))
      console.log('detailPrices', result)
      return result
    }
  },
  methods: {
    _financialMasterFactory () {
      return {
        masterId: null,
        financialDate: getDate(new Date()).formatDate,
        financialAmount: 0,
        financialIncome: 0,
        financialDebt: 0,
        financialWaitDebt: 0,
        financialClearDebt: 0
      }
    },
    _financialDetailFactory () {
      return {
        detailId: null,
        masterId: null,
        userId: this.financialUserList[0].userId,
        categoryType: this.financialCategoryList[0].categoryType,
        financialPrice: 0,
        deadline: getDate(new Date()).formatDate,
        debt: true,
        hasPay: false
      }
    },
    _monthChange (e) {
      console.log('picker发送选择改变，携带值为', e)
      let monthStr = e.mp.detail.value
      this.financialDTO.financialDate = monthStr + '-01'
    },
    _deadlineChange (e, financialDetailIndex) {
      console.log(financialDetailIndex)
      this.financialDTO.financialDetailList[financialDetailIndex].deadline = e.mp.detail.value
    },
    _debtSwitchChange (e, finanicalDetailIndex) {
      console.log(e.mp.detail.value)
      let debt = e.mp.detail.value
      let price = this.selfPrices[finanicalDetailIndex]
      this.financialDTO.financialDetailList[finanicalDetailIndex].debt = debt
      this.financialDTO.financialDetailList[finanicalDetailIndex].financialPrice = debt ? -price : price
    },
    _paySwitchChange (e, financialDetailIndex) {
      this.financialDTO.financialDetailList[financialDetailIndex].hasPay = e.mp.detail.value
    },
    _priceChange (e, financialDetailIndex) {
      let v = Math.abs(e.mp.detail.value)
      let debt = this.financialDTO.financialDetailList[financialDetailIndex].debt
      this.financialDTO.financialDetailList[financialDetailIndex].financialPrice = debt ? -v : v
      console.log(e.mp.detail.value)
    },
    _add () { // 新增financialDetail
      this.financialDTO.financialDetailList = [
        ...this.financialDTO.financialDetailList,
        this._financialDetailFactory()
      ]
    },
    _close (financialDetailIndex) { // 删除financialDetail
      wx.showModal({
        title: '提示',
        content: '是否删除该明细?',
        success: (res) => {
          if (res.confirm) {
            this.financialDTO.financialDetailList.splice(financialDetailIndex, 1)
          }
        }
      })
    },
    async _save () {
      console.log(this.financialDTO)
      try {
        let func = this.isAdd ? createFinancial : updateFinancial
        this.loading = true
        this.disabled = true
        const result = await func(this.financialDTO)
        this.utils.showToast('保存成功', 1000)
        console.log(result)
      } catch (e) {
        console.log('error', e)
        this.utils.showError(e.msg, 1000)
      } finally {
        this.loading = false
        this.disabled = true
      }
    }
  },
  async onLoad (options) {
    console.log(this.financialUserList[0].userName)
    this.isAdd = options.type === 'add'
    if (this.isAdd) { // init
      wx.setNavigationBarTitle({title: '新增'})
      this.financialDTO = {
        ...this._financialMasterFactory(),
        financialDetailList: [this._financialDetailFactory()]
      }
    } else { // edit
      wx.setNavigationBarTitle({title: '修改'})
      const result = await getMonthDetails(options.masterId)
      this.financialDTO = result.data
      console.log('明细', result)
    }
    console.log(this.financialCategoryList)
  }
}
</script>

<style lang="stylus" scoped>
  @import "~@/common/style/mixin.styl"
  @import "~@/common/style/color.styl"
  .financial-add-page{
    padding-top 50rpx
    padding-bottom 120rpx
    .picker{
      center()
      &.date-picker{
        font-size 40rpx
        font-weight 300
        color #222
        margin-bottom 50rpx
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
      margin-bottom 50rpx
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
        .close-btn{
          position absolute
          font-size 40rpx
          padding 15rpx
          transform scaleY(0.7)
          color #ddd
          top 0
          right 0
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
      z-index 500
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
