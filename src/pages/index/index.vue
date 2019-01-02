<template>
  <div class="index-page">
    <navigator class="add-btn" url="/pages/financial-add/main?type=add">+</navigator>
  </div>
</template>
<script>
import {mapActions} from 'vuex'
export default {
  methods: {
    ...mapActions(['FETCH_FINANCIAL_CATEGORY_LIST', 'FETCH_FINANCIAL_USER_LIST'])
  },
  mounted () {
    this.FETCH_FINANCIAL_CATEGORY_LIST()
    this.FETCH_FINANCIAL_USER_LIST()
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
  }
</style>
