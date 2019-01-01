<template>
  <picker class="region-picker" mode="region" @change="_regionChange" :value="regionArr">
    <div class="picker">
      {{regionArr[0]}}-{{regionArr[1]}}-{{regionArr[2]}}
    </div>
  </picker>
</template>
<script>
export default {
  props: {
    regionStr: {
      type: String,
      default: ''
    }
  },
  computed: {
    regionArr: {
      get () {
        return this.regionStr.split('-')
      },
      set (arr) {
        this.regionStr = arr.join('-')
      }
    }
  },
  methods: {
    _regionChange (e) {
      // console.log('picker发送选择改变，携带值为', e.mp.detail.value)
      this.regionArr = e.mp.detail.value
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import "~@/common/style/mixin.styl"
  @import "~@/common/style/color.styl"
</style>
