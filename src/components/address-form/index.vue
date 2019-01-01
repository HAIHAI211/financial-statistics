<template>
  <div class="address-form">
    <div class="field-item">
      <div class="wrap">
        <div class="label">联 系  人</div>
        <input class="input"
               placeholder="请输入联系人姓名"
               type="text"
               maxlength="12"
               :focus="focus"
               :value="contactsName"
               @blur="_inputHandler($event,'contactsName')"/>
      </div>
    </div>
    <div class="field-item">
      <div class="wrap">
        <div class="label">手机号码</div>
        <input class="input"
               :focus="focus"
               placeholder="请输入联系人手机号"
               maxlength="11"
               type="number"
               :value="telNo"
               @blur="_inputHandler($event,'telNo')"/>
      </div>
    </div>
    <div class="field-item">
      <div class="wrap">
        <div class="label">选择地区</div>
        <picker class="input picker-wrap" mode="region" @change="_regionChange" :value="region">
          <div class="picker">
            {{region[0]}}-{{region[1]}}-{{region[2]}}
          </div>
        </picker>
      </div>
    </div>
    <div class="field-item field-item-address">
      <div class="wrap">
        <div :class="['label', {'label-ios': isIos}]">详细地址</div>
        <textarea class="input textarea"
                  placeholder="如小区几栋几单元门牌号"
                  :focus="focus" :value="address" @blur="_inputHandler($event, 'address')"/>
      </div>
    </div>
  </div>
</template>
<!--
由于小程序+vant的限制，这里无法使用v-model（事件的参数被包裹）
:value相当于初始值
@input相当于事件触发(还不能在input中修改:value对应变量，会重复赋值造成input闪烁)
-->
<script>
  import {mapState, mapGetters, mapMutations} from 'vuex'
  export default {
    props: {
      focus: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapState(['contactsName', 'telNo', 'addressArea', 'address', 'systemInfo']),
      ...mapGetters(['addressInfo', 'addressInfoErr', 'isIos']),
      region: {
        get () {
          return this.addressArea.split('-')
        },
        set (arr) {
          let addressArea = arr.join('-')
          this.SET_USER_INFO({
            addressArea
          })
        }
      }
    },
    methods: {
      ...mapMutations(['SET_USER_INFO']),
      _regionChange (e) {
        // console.log('picker发送选择改变，携带值为', e.mp.detail.value)
        this.region = e.mp.detail.value
      },
      _inputHandler (e, key) {
        // console.log(key, e.mp.detail.value)
        // console.log('_inputHandler')
        this.SET_USER_INFO({
          [key]: e.mp.detail.value
        })
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~@/common/style/mixin.styl"
  @import "~@/common/style/color.styl"
  .address-form{
    padding-top 22rpx
    .area-picker{
      width 750rpx
    }
    .field-item{
      background #fff
      padding-left 35rpx
      &.field-item-address{
        .wrap{
          .label{
            padding-top 30rpx
            align-self flex-start
            &.label-ios{
              padding-top 45rpx
              width 191rpx
            }
          }
        }
      }
      .wrap{
        padding-right 35rpx
        box-sizing border-box
        border-bottom 1rpx solid line-color
        display flex
        justify-content space-between
        align-items center
        .label{
          width 200rpx
          font-size 30rpx
          color #222
          font-weight 300
        }
        .input{
          height 100rpx
          flex 1
          color #333
          font-size 30rpx
          font-weight 00
        }
        .picker-wrap{
          .picker{
            height 100rpx
            display flex
            align-items center
          }
        }
        .textarea{
          box-sizing border-box
          height 120rpx
          margin 30rpx 0
        }
      }
    }
  }
</style>
