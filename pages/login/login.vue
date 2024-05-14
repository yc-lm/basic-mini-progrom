<template>
  <s-layout title="登录" class="login-page f-s-14" navbar="">
    <view class="banner-box relative">
      <view class="img-box absolute l-24">
        <image class="w-100p h-100p" :src="sheep.$url.static('/static/img/logo@2x.png')" />
      </view>
      <text class="title absolute l-24 f-s-32 f-w-600">课搭子</text>
      <text class="welcome absolute l-24 f-s-16 col-b-title-7">课程学习小帮手</text>
    </view>

    <view class="form-box m-b-2 bg-b-white">
      <!--勾选隐私-->
      <view class="read-privacy flex align-center m-b-2">
        <radio
          :checked="privacyVal"
          style="transform: scale(0.7)"
          @tap.stop="onChange"
          color="#2cabf8"
          activeBackgroundColor="#2cabf8"
        />

        <text class="col-b-title-7">我已阅读并同意</text>
        <text class="col-b-blue m-l-6" @tap="handleGoPrivacy">用户协议及隐私政策</text>
      </view>

      <button @tap="handleWxLogin" class="primary m-b-24">微信登录</button>
      <button @click="handleAccountLogin" class="normal my-normal">账号登录</button>
    </view>
  </s-layout>
</template>

<script setup>
  import sheep from '@/sheep';
  import { ref } from 'vue';
  import { onShow, onLoad } from '@dcloudio/uni-app';
  import {
    getUserOpenInfo,
    isTokenValid,
    USER_KEY_OBJ,
    USER_LOGIN_TYPE_OBJ,
    WX_LOGIN_STATUS_OBJ,
  } from '@/sheep/hooks/useLogin';

  const privacyVal = ref(false);
  const headerBg = sheep.$url.css('/static/img/lesson-bg@2x.png');

  onLoad(() => {
    pageInit();
  });

  onShow(() => {
    // 获取openid
    getUserOpenId();
  });

  // 页面初始逻辑
  async function pageInit() {
    // 检查token是否有效
    const tokenFlag = await isTokenValid();
    // 有效
    if (tokenFlag) {
      // 跳转首页
      return sheep.$router.go('/pages/index/index');
    }
  }

  // 获取用户openid
  async function getUserOpenId() {
    // 获取code
    let codeStr = '';
    const loginResult = await uni.login();
    if (loginResult.errMsg === 'login:ok') {
      codeStr = loginResult.code;
    } else {
      return sheep.$helper.toast('获取用户信息失败');
    }
    await getUserOpenInfo(codeStr);
  }

  async function handleWxLogin() {
    if (!privacyVal.value) {
      sheep.$helper.toast('请阅读并同意用户协议及隐私政策');
      return;
    }
    const loginRes = await sheep.$platform.useProvider('wechat').login();
    console.log('loginRes', loginRes);
    if (loginRes === WX_LOGIN_STATUS_OBJ.NOT_BIND_PLATFORM) {
      // 未关联账号
      return sheep.$router.go('/pages/login/relationAccount');
    }
    // 获取用户信息
    if (loginRes === WX_LOGIN_STATUS_OBJ.SUCCESS) {
      const userInfo = await sheep.$store('user').getInfo(true);
      if (!userInfo) {
        return sheep.$helper.toast('获取用户信息失败');
      }
      sheep.$store('user').setToken(uni.getStorageSync(USER_KEY_OBJ.USER_TOKEN));
      sheep.$store('user').updateLoginType(USER_LOGIN_TYPE_OBJ.WX_LOGIN);
      // 跳转首页
      return sheep.$router.go('/pages/index/index');
    }
  }

  // 账号登录
  async function handleAccountLogin() {
    if (!privacyVal.value) {
      return sheep.$helper.toast('请阅读并同意用户协议及隐私政策');
    }
    const openId = uni.getStorageSync(USER_KEY_OBJ.USER_OPENID);
    if (!openId) {
      return sheep.$helper.toast('缺少用户信息：open id');
    }
    sheep.$router.go('/pages/login/accountLogin');
  }

  // 隐私
  function onChange() {
    privacyVal.value = !privacyVal.value;
  }

  function handleGoPrivacy() {
    sheep.$router.go('/pages/login/userPrivacy');
  }
</script>

<style scoped lang="scss">
  .login-page {
    position: relative;

    .banner-box {
      width: 100%;
      height: pxToRpx(420);
      background: $dark-5;
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      background: v-bind(headerBg) no-repeat;
      background-size: cover;

      .img-box {
        width: pxToRpx(64);
        height: pxToRpx(64);
        top: pxToRpx(132);
      }

      .title {
        top: pxToRpx(220);
      }

      .welcome {
        top: pxToRpx(265);
      }
    }

    .form-box {
      margin-top: pxToRpx(381);
      padding: pxToRpx(14) pxToRpx(24) 0;
      border-radius: pxToRpx(24) pxToRpx(24) 0 0;

      .read-privacy {
        height: pxToRpx(56);
      }

      .my-normal {
        border: 1px solid $blue;
        color: $blue;
      }
    }
  }
</style>
