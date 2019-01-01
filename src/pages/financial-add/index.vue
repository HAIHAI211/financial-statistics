<template>
  <div class="financial-add-page">
    <picker
      mode="date"
      fields="month"
      :value="date"
      start="2015-09-01"
      end="2017-09-01"
      @change="_dateChange"
    ><div class="picker">当前选择: {{date}}</div></picker>
    <!--<picker bindchange="bindPickerChange" value="{{index}}" range="{{array}}">-->
      <!--<view class="picker">当前选择：{{array[index]}}</view>-->
    <!--</picker>-->
  </div>
</template>
<script>

export default {
  data () {
    return {
      date: '2019-01'
    }
  },
  methods: {
    _dateChange (e) {
      console.log('picker发送选择改变，携带值为', e)
      this.date = e.mp.detail.value
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~@/common/style/mixin.styl"
  @import "~@/common/style/color.styl"
  .financial-add-page{
    height 100%
  }
</style>
