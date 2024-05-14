<template>
  <scroll-view class="s-interaction" :scroll-y="true" :style="{ height: pageHeight + 'px' }">
    <view
      v-for="item in dataList"
      :key="item.id"
      class="flex h-88 bg-white m-t-16 p-16 item radius"
      @click="emit('toDetails', item)"
    >
      <view class="m-r-16">
        <image class="w-56 h-56" :src="sheep.$url.static(getImg(item))" />
      </view>
      <view class="flex-1">
        <view class="flex-space-b">
          <view class="f-s-17 f-w-400">{{ item.name }}</view>
          <view class="f-s-14" :class="{ 'col-b-blue': getFormatStatus(item) === '进行中' }">
            {{ getFormatStatus(item) }}
          </view>
        </view>
        <view class="m-t-8 f-s-14 col-b-title-7 flex-left">
          <view>{{ getInteractionText(item).name }}：</view>
          <view
            :class="{ 'col-b-red': !getInteractionText(item).isContent }"
            class="ss-line-1 flex1"
          >
            {{ getInteractionText(item).content }}
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script setup>
  import { formatStatus } from '@/sheep/helper/time';
  import { getInteractionText } from '@/sheep/business/course';
  import sheep from '@/sheep';
  import { computed, reactive, watch } from 'vue';

  const emit = defineEmits(['toDetails']);
  const props = defineProps({
    dataList: {
      type: Array,
      default: () => [],
    },
  });

  const { safeArea } = sheep.$platform.device;
  const pageHeight = computed(() => safeArea.height - 76 - 80);

  /* 获取状态*/
  function getFormatStatus({ status, start_time }) {
    return parseInt(status) === 1 ? '进行中' : formatStatus(start_time, false);
  }
  function getImg({ icon }) {
    return `/static/img/course/${icon}.png`;
  }
</script>

<style lang="scss" scoped>
  .s-interaction {
    .item {
      box-sizing: border-box;
    }
  }
</style>
