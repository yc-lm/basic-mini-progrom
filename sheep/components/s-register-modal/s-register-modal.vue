<template>
  <!-- 规格弹窗 -->
  <su-popup
      :show="isShow"
      type="center"
      round="16"
      :is-show-header="false"
      :is-mask-click="false"
      @close="closeRegisterModal"
  >
    <view class="content-box flex flex-col align-center">
      <view class="img-box">
        <image :src="imgUrl" class="w-100p h-100p"></image>
      </view>
      <text class="type-title f-s-17 f-w-600 m-t-16">注册成功，并与微信关联</text>
      <view class="type-desc w-100p brs6 m-t-40 flex flex-col f-s-17 col-b-title-7 p-16">
        <text class="user-info m-b-16">用户名：{{username}}</text>
        <text class="user-info">初始密码：{{password}}</text>
      </view>
      <button @click="handleConfirm" class="primary m-t-24 w-100p">知道了</button>
    </view>
  </su-popup>
</template>
<script setup>
import { computed, toRefs, ref } from 'vue';
import sheep from '@/sheep';
import { closeRegisterModal } from '@/sheep/hooks/useModal';

const emits = defineEmits(['handleAccountConfirm'])
const props = defineProps({
  username: {
    type: String,
    default: ''
  },
  password: {
    default: '',
    type: String,
  }
});
// 属性
const {username,password} = toRefs(props)
const modalStore = sheep.$store('modal');
// 弹窗显示
const isShow = computed(() => modalStore.isRegister);
const imgUrl = sheep.$url.static('/static/img/register-success@2x.png')

function handleConfirm() {
  // 触发
  emits('handleAccountConfirm')
  closeRegisterModal();
}

</script>
<style lang="scss" scoped>
.content-box {
  width: pxToRpx(312);
  height: pxToRpx(384);
  padding: pxToRpx(24);
  box-sizing: border-box;
  .img-box {
    height: pxToRpx(72);
    width: pxToRpx(72);
  }
  .type-desc {
    height: pxToRpx(96);
    background: #F2F3F7;
    box-sizing: border-box;
  }
}
</style>