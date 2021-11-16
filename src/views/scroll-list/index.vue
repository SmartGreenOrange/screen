<script setup>
import {ref} from 'vue'
import ScrollArea from '../../components/scroll-area/index.vue'

const list = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

</script>
<template>
  <ScrollArea class="scroll" :speed="5">
    <div class="list-item" v-for="item of list">{{ item }}</div>
  </ScrollArea>
</template>
<style scoped>
.scroll {
  height: 300px;
}

.list-item {
  width: 100%;
  height: 50px;
}
</style>
