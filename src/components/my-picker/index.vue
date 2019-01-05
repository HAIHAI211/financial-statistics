<template>
  <picker
    @change="_change"
    :value="index"
    :range="range"
    :range-key="rangeKey"
    v-if="range.length">
    <slot></slot>
  </picker>
</template>
<script>
 export default { // value -> selfValue -> index
   props: {
     rangeKey: {
       type: String,
       default: ''
     },
     range: {
       type: Array,
       default: []
     },
     valueKey: {
       type: String,
       default: ''
     },
     value: {
       type: Object,
       default: {}
     }
   },
   data () {
     return {
       selfValue: this.value,
       scope: null
     }
   },
   computed: {
     index: {
       get () {
         for (let i = 0; i < this.range.length; i++) {
           let item = this.range[i]
           if (this.selfValue === item[this.valueKey]) {
             return i
           }
         }
         return -1
       },
       set (v) {
         let item = this.range[v]
         this.selfValue = item[this.valueKey]
       }
     }
   },
   watch: {
     value (v) {
       this.selfValue = v
     },
     selfValue (v) {
       this.$emit('input', v)
     },
     index: {
       immediate: true,
       handler (newV, oldV) {
         this.scope = this.range[newV]
       }
     }
   },
   methods: {
     _change (e) {
       console.log('组件e', e.mp.detail.value)
       this.index = e.mp.detail.value // 实际改变的是selfValue
     }
   }
 }
</script>
<style lang="stylus" scoped>

</style>
