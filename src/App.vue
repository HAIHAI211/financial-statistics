<script>
export default {
}
</script>

<style lang="stylus">
  page{
    background:#F5F5F5;
    height: 100%;
    // animation: name duration timing-function delay iteration-count direction;
    .up-down-animation{
      animation: up-down-animation .5s ease-in 0s infinite alternate;
    }
    .fade-scale-animation{
      animation fade-scale-animation .9s ease-in 0s infinite alternate;
    }
    .scale-animation{
      animation scale-animation .5s ease-in 0s infinite alternate;
    }
    .rotate-animation{
      animation rotate-animation .5s ease-in 0s infinite alternate;
    }
    .move-disappear-animation{
      animation move-disappear-animation 1s ease-in .3s 1 normal;
      animation-fill-mode: forwards;
    }
    .scale-disappear-animation{
      animation scale-disappear-animation .5s ease-in 0s 1 normal;
      animation-delay 0s!important;
      animation-fill-mode: forwards;
    }
  }
</style>
