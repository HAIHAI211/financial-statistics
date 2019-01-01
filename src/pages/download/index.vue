<template>
  <div class="page">
    <div class="title">由于小程序限制，如需下载，请复制链接后使用电脑或手机浏览器访问</div>
    <div class="fileurl">{{fileUrl}}</div>
    <button type="primary" style="width:600rpx;" @click="_copy">复制链接</button>
  </div>
</template>
<script>
export default {
  data () {
    return {
      fileUrl: ''
    }
  },
  methods: {
    async _copy () {
      await this.utils.copy(this.fileUrl)
      // this.utils.showToast('复制成功')
    }
  },
  onLoad (options) {
    this.fileUrl = options.fileUrl
  }
}
</script>
<style lang="stylus" scoped>
  @import "~@/common/style/mixin.styl"
  @import "~@/common/style/color.styl"
  .page{
    height:100%;
    display flex
    flex-direction column
    align-items center
    .title{
      font-size 40rpx
      color #000
      margin-top 200rpx
      margin-bottom 50rpx
      text-align center
      padding 0 30rpx
    }
    .fileurl{
      width 700rpx
      font-size 35rpx
      color #ccc
      margin-bottom 300rpx
      wrap(3)
    }
  }
</style>
