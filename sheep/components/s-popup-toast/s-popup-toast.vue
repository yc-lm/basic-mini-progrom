<template>
  <view v-show="isToast" class="open-toast radius f-s-14 col-b-white-9">{{ isToast }}</view>
</template>
<script setup>
  import { computed } from 'vue';
  import sheep from '@/sheep';

  const modalStore = sheep.$store('modal');
  const isToast = computed(() => modalStore.isToast);
</script>
<style lang="scss" scoped>
  .open-toast {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
    padding: pxToRpx(10) pxToRpx(16);
    background: rgba(0, 0, 0, 0.7);
  }
</style>
