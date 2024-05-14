<template>
  <view class="p-16">
    <view class="s-vote flex-center m-24">
      <view
        v-for="item in state.modelList"
        class="vote-item w-64 h-64 radius flex-center"
        @click="select(item)"
        :class="{ 'is-active': item.value === state.active }"
      >
        {{ item.label }}
      </view>
    </view>
    <view
      class="flex-center h-48 bg-blue radius"
      @click="submit"
      :class="{ 'is-disabled': !state.active }"
      >提交</view
    >
  </view>
</template>

<script setup>
  import { reactive, onMounted, watch } from 'vue';
  import { voteModel } from '@/sheep/business/course';
  import sheep from '@/sheep';
  const emit = defineEmits(['submit']);
  const props = defineProps({
    modelType: {
      type: Number,
      default: 1,
    },
    value: {
      type: [String, Number],
      default: '',
    },
  });
  const state = reactive({
    modelList: [],
    active: '',
  });
  onMounted(() => {
    state.modelList = voteModel(props.modelType);
    const find = state.modelList.find((item) => item.label === props.value);
    if (find) state.active = find.value;
  });
  function select(item) {
    state.active = item.value;
  }
  function submit() {
    if (!state.active) return;
    emit('submit', state.active);
  }
</script>

<style lang="scss" scoped>
  .s-vote {
    //gap: pxToRpx(26);
    margin-bottom: pxToRpx(72);
    .vote-item {
      border: 1px solid rgba(26, 29, 52, 0.1);
      margin: 0 pxToRpx(13);
    }
    .is-active {
      background: $blue;
      color: $white;
    }
  }
  .is-disabled {
    background-color: rgba(26, 29, 52, 0.15) !important;
  }
</style>
