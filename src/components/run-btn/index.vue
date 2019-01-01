<template>
  <div class="run-btn">
    <span>{{ title }}</span>
    <button class="wx-btn" :open-type="openType" @opensetting="opensetting" @getuserinfo="getuserinfo"></button>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  props: {
    openType: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    ...mapMutations(['SET_AUTH_WE_RUN']),
    opensetting (e) {
      const authSetting = e.mp.detail.authSetting
      this.SET_AUTH_WE_RUN(!!authSetting['scope.werun'])
      this.$emit('opensetting', e)
    },
    getuserinfo (e) {
      this.$emit('getuserinfo', e.mp.detail)
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import "~@/common/style/mixin.styl"
  @import "~@/common/style/color.styl"
  .run-btn{
    position relative
    width 100%
    height 100%
    center()
    .wx-btn{
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      opacity 0
    }
  }
</style>
