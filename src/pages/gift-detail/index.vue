<template>
  <div class="gift-detail-page">
    <van-tabs :active="activeTabIndex" @change="tabChange" color="#3ACF7A">
      <van-tab title="兑换记录">
        <div class="exchange-record-wrap">
        </div>
      </van-tab>
      <van-tab title="商品介绍">
        <div class="introduce">
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import wxParse from 'mpvue-wxparse'
export default {
  components: {
    wxParse
  }
}
</script>
<style lang="stylus" scoped>
</style>
