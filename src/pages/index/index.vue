<template>
  <div class="index-page">
    <navigator class="add-btn" url="/pages/financial-add/main">+</navigator>
  </div>
</template>
<script>
import {mapActions} from 'vuex'
export default {
  methods: {
    ...mapActions(['FETCH_FINANCIAL_CATEGORY_LIST'])
  },
  mounted () {
    this.FETCH_FINANCIAL_CATEGORY_LIST()
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
      background lightseagreen;
      border-radius 50%;
      center();
      position fixed;
      left 325rpx;
      bottom 100rpx;
    }
  }
</style>
