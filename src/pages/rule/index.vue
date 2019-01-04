<template>
  <div class="rule-page">
    <wxParse content=""/>
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
  @import "~@/common/style/mixin.styl"
  @import "~@/common/style/color.styl"
  @import url("~mpvue-wxparse/src/wxParse.css");
</style>
