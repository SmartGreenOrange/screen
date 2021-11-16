<template>
  <div class="screen-container" :style="innerStyle">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'BigScreen'
}
</script>
<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue'

const props = defineProps({
  width: {
    type: Number,
    default: 1920
  },
  height: {
    type: Number,
    default: 1080
  }
})

const winWidth = ref(window.innerWidth)
const winHeight = ref(window.innerHeight)
// opacity 用于首次进入时淡入效果
const innerStyle = ref({opacity: 0})
const emit = defineEmits(['onResize'])

let innerStyleTimer = null

function setWindowSize() {
  winWidth.value = window.innerWidth
  winHeight.value = window.innerHeight

  if (innerStyleTimer) clearTimeout(innerStyleTimer)
  innerStyleTimer = setTimeout(() => {
    const widthRatio = window.innerWidth / props.width
    const heightRatio = window.innerHeight / props.height
    // 最小比例
    const minRatio = Math.min(widthRatio, heightRatio)
    let fontSize = 1
    let style = {}

    // 约定 font-size 最小为 1px
    if (minRatio < 1) {
      style = {
        width: props.width + 'px',
        height: props.height + 'px',
        transform: `scale(${minRatio}) translate(-50%, -50%)`
      }
    } else {
      fontSize = minRatio

      if (widthRatio > heightRatio) {
        style = {
          width: heightRatio * props.width + 'px',
          height: window.innerHeight + 'px'
        }
      } else {
        style = {
          width: window.innerWidth + 'px',
          height: widthRatio * props.height + 'px'
        }
      }
      style.transform = 'translate(-50%, -50%)'
    }

    document.documentElement.style.fontSize = fontSize + 'px'
    innerStyle.value = style
    emit('onResize', fontSize)
  }, 500)
}

setWindowSize()
onMounted(() => {
  window.addEventListener('resize', setWindowSize)
})

onBeforeUnmount(() => {
  document.documentElement.style.fontSize = null
  window.removeEventListener('resize', setWindowSize)
})
</script>
<style scoped>
.screen-container {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 999;
  width: 100%;
  height: 100%;
  will-change: transition, transform;
  transform-origin: top left;
  transition: width 0.3s ease-in-out, height 0.3s ease-in-out, opacity .3s ease-in-out, transform .3s ease-in-out;
  transform: translate(-50%, -50%);
  overflow: hidden;
}
</style>
