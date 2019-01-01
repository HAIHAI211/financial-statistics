<template>
  <web-view :src="src"></web-view>
</template>
<script>
export default {
  data () {
    return {
      src: ''
    }
  },
  onLoad (options) {
    this.src = options.src
  }
}
</script>

<style lang="stylus" scoped>
  @import "~@/common/style/mixin.styl"
  @import "~@/common/style/color.styl"
</style>
