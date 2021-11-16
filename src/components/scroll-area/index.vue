<template>
  <div
      class="scroll-area"
      @mouseenter="stopAnimation"
      @mouseleave="reverseAnimation"
  >
    <div class="scroll-area-inner">
      <div ref="first" class="scroll-area-child">
        <slot></slot>
      </div>
      <div v-if="showBrother" ref="last" class="scroll-area-child">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScrollArea',
  props: {
    // 动画时长
    duration: {
      type: Number,
      default: 1000
    },
    // 动画方向
    direction: {
      type: String,
      default: 'top',
      validator: val => {
        return ['top', 'bottom'].includes(val)
      }
    },
    // 每毫秒多少像素
    speed: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      resizeObserver: null,
      showBrother: false,
      firstAnimate: null,
      lastAnimate: null
    }
  },
  computed: {
    allProps() {
      return this.duration + this.direction + this.speed
    }
  },
  watch: {
    allProps() {
      this.cancelAnimation()
      this.setAnimation()
    }
  },
  mounted() {
    this.resizeObserver = new ResizeObserver(() => {
      this.cancelAnimation()
      this.setAnimation()
    })

    this.resizeObserver.observe(this.$el.querySelector('.scroll-area-inner'))
  },
  unmounted() {
    this.resizeObserver.unobserve(this.$el.querySelector('.scroll-area-inner'))
  },
  methods: {
    setAnimation() {
      const firstChild = this.$refs.first
      const lastChild = this.$refs.last
      const {height: elH} = this.$el.getBoundingClientRect()
      const {height: firstH} = firstChild.getBoundingClientRect()

      this.showBrother = elH < firstH

      if (this.showBrother && firstChild && lastChild) {
        let y = this.direction === 'top' ? '-100%' : '100%'
        let duration = this.duration

        if (this.speed) {
          duration = (firstH / this.speed) * 100 * 2
        }

        const keyframes = [
          {transform: 'translate3d(0,0,0)'},
          {transform: `translate3d(0,${y},0)`}
        ]
        const options = {
          duration,
          iterations: Infinity
        }
        this.firstAnimate = firstChild.animate(keyframes, options)
        this.lastAnimate = lastChild.animate(keyframes, options)

        if (this.direction === 'bottom') {
          this.$el.querySelector('.scroll-area-inner').style.transform =
              'translate(0,-50%)'
        } else {
          this.$el.querySelector('.scroll-area-inner').style = null
        }
      }
    },
    stopAnimation() {
      this.firstAnimate && this.firstAnimate.pause()
      this.lastAnimate && this.lastAnimate.pause()
    },
    reverseAnimation() {
      this.firstAnimate && this.firstAnimate.play()
      this.lastAnimate && this.lastAnimate.play()
    },
    cancelAnimation() {
      this.firstAnimate && this.firstAnimate.cancel()
      this.lastAnimate && this.lastAnimate.cancel()
    }
  }
}
</script>
<style scoped>
.scroll-area {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
