<template>
  <div class="run-loading">
    <span>{{ loadingMsg }}</span>
  </div>
</template>
<script>
  export default {
    props: {
      state: { // 0:不可见 1:正在加载 2:全部加载完毕 3:异常
        type: Number,
        default: 0
      }
    },
    computed: {
      loadingMsg () {
        let msg = ''
        if (this.state === this.$utils.harrisonEnum.LOADING_STATE_ENUM.IS_LOADING) {
          msg = '正在加载'
        } else if (this.state === this.$utils.harrisonEnum.LOADING_STATE_ENUM.ALL_OVER) {
          msg = '已显示全部'
        } else if (this.state === this.$utils.harrisonEnum.LOADING_STATE_ENUM.ERROR) {
          msg = '加载异常 请稍后重试'
        }
        return `${msg}`
      }
    }
  }
</script>
<style scoped lang="stylus">
  .run-loading{
    width 750rpx
    font-size 26rpx
    color #666
    height 70rpx
    letter-spacing 1rpx
    display flex
    justify-content center
    align-items center
  }
</style>
