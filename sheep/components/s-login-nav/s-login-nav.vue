<template>
  <view class="login-nav-wrap relative">
    <view class="img-box absolute absolute-center-x">
      <image :src="imgUrl" class="w-100p h-100p"></image>
    </view>
    <text class="type-title absolute absolute-center-x f-s-17 f-w-600">{{typeTitle}}</text>
    <view class="type-desc absolute absolute-center-x col-b-title-6">
      <uni-icons type="info" size="16" class="col-b-title-6 m-r-8"></uni-icons>
      <text>{{typeDesc}}</text>
    </view>
  </view>
</template>
<script setup>
import sheep from "@/sheep";
import {computed, watch, ref, reactive, unref, toRefs} from 'vue';

const props = defineProps({
  typeTitle: {
    type: String,
    default: '账号登录'
  },
  typeDesc: {
    default: '目前仅支持学生身份登录',
    type: String,
  }
});
// 属性
const {typeTitle,typeDesc} = toRefs(props)
const imgUrl = sheep.$url.static('/static/img/account-user@2x.png')

</script>
<style scoped lang="scss">
.login-nav-wrap {
  height: pxToRpx(211);
  .img-box {
    height: pxToRpx(72);
    width: pxToRpx(72);
    top: pxToRpx(46);
  }
  .type-title {
    top: pxToRpx(125);
  }
  .type-desc {
    top: pxToRpx(156);
  }
  .absolute-center-x {
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>