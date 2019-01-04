<template>
  <div class="rule-page">
    <wxParse :content="rule"/>
  </div>
</template>
<script>
import wxParse from 'mpvue-wxparse'
import {mapState} from 'vuex'
export default {
  components: {
    wxParse
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState(['rule'])
  }
}
</script>
<style lang="stylus" scoped>
  @import "~@/common/style/mixin.styl"
  @import "~@/common/style/color.styl"
  @import url("~mpvue-wxparse/src/wxParse.css");
</style>
