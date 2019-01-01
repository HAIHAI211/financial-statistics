<template>
  <div class="tab-wrap">
    <div class="tab">
      <div :class="['tab-item', {'active': tabIndex === selfActiveIndex}]"
           v-for="(item,tabIndex) in items" :key="tabIndex" @click="selfActiveIndex = tabIndex">
        {{ item }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['items', 'activeIndex'], // 数组 长度为2
  data () {
    return {
      selfActiveIndex: this.activeIndex
    }
  },
  watch: {
    activeIndex (v) {
      this.selfActiveIndex = v
    },
    selfActiveIndex (v) {
      this.$emit('update:activeIndex', v)
    }
  }
}
</script>
<style scoped lang="stylus">
  @import "~@/common/style/mixin.styl"
  @import "~@/common/style/color.styl"
  .tab-wrap{
    background #fff
    padding-bottom 13rpx
    border-bottom 0rpx solid #DBDBDB
    .tab{
      display flex
      width 370rpx
      height 69rpx
      box-sizing border-box
      border 1px solid main-color
      border-radius 6rpx
      overflow hidden
      margin 0 auto
      .tab-item{
        flex 1 0 0
        center()
        font-size 30rpx
        color main-color
        background #fff
        &.active{
          color  #fff
          background main-color
        }
      }
    }
  }
</style>
