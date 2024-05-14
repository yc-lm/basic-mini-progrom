<template>
  <s-layout title="关联账号" class="account-login-page f-s-14">
    <view class="header-nav m-b-20">
      <s-login-nav type-title="关联账号" type-desc="目前仅支持关联学生账号"></s-login-nav>
    </view>
    <view class="login-form">
      <s-login-form
        submit-btn-title="确定"
        :school-list="schoolList"
        @handleSubmit="handleSubmit"
      ></s-login-form>
    </view>

    <!--提示注册账号-->
    <view class="register-tip absolute b-40">
      <text class="f-s-14 f-w-600 col-b-blue" @tap="showRegisterUserModal">暂无账号，去注册</text>
    </view>

    <view class="page-modal">
      <!--提示注册成功-->
      <s-register-modal
        :username="accountTip.login_name"
        :password="accountTip.password"
        @handleAccountConfirm="handleAccountConfirm"
      ></s-register-modal>

      <!--注册账号-->
      <s-register-user-modal
        @handleRegisterSuccess="handleRegisterSuccess"
      ></s-register-user-modal>
    </view>
  </s-layout>
</template>
<script setup>
  import { showRegisterModal, showRegisterUserModal } from '@/sheep/hooks/useModal';
  import { onBeforeMount, ref } from 'vue';
  import {
    accountLogin,
    getSchoolList, getToken, refreshPlatformInfo,
    USER_KEY_OBJ,
    USER_LOGIN_TYPE_OBJ, WX_LOGIN_STATUS_OBJ,
    wxBindUser,
  } from '@/sheep/hooks/useLogin';
  import sheep from '@/sheep';
  // 学校列表
  const schoolList = ref([]);
  // 账号注册成功的提示
  const accountTip = ref({});
  onBeforeMount(() => {
    init();
  });

  async function init() {
    schoolList.value = await getSchoolList();
  }

  async function handleSubmit(params) {
    console.log('handleSubmit params', params);
    const apiParams = {
      login_name: params.account,
      login_password: params.password,
      school_id: params.school_id,
      platform_id: params.platform_id,
      openid: uni.getStorageSync(USER_KEY_OBJ.USER_OPENID),
    };
    // 绑定成功，返回token
    const tokenInfo = await wxBindUser(apiParams);
    const token = tokenInfo?.['Access-Token'];
    if (token) {
      // 刷新token
      sheep.$store('user').setToken(token);
      // 获取用户信息
      const userInfo = await sheep.$store('user').getInfo(true);
      if (!userInfo) {
        return sheep.$helper.toast('获取用户信息失败');
      }
      // 刷新平台信息
      refreshPlatformInfo(params);
      sheep.$store('user').updateLoginType(USER_LOGIN_TYPE_OBJ.WX_LOGIN);
      sheep.$helper.toast('关联成功');
      // 跳转首页
      return sheep.$router.go('/pages/index/index');
    }
  }

  // 注册成功，提示用户名密码
  function handleRegisterSuccess(item) {
    accountTip.value = item;

    showRegisterModal();
  }

  // 点击知道了，直接登录
  async function handleAccountConfirm() {
    // 处理登录的逻辑
    // 1.获取token
    const token = await getToken(accountTip.value?.login_name, accountTip.value?.school_id);
    if (!token) {
      return sheep.$helper.toast('获取token错误');
    }
    sheep.$store('user').setToken(token);
    // 2.获取用户信息
    const userInfo = await sheep.$store('user').getInfo(true);
    if (!userInfo) {
      return sheep.$helper.toast('获取用户信息失败');
    }
    // 刷新平台信息
    refreshPlatformInfo(accountTip.value);
    sheep.$store('user').updateLoginType(USER_LOGIN_TYPE_OBJ.WX_LOGIN);
    // 跳转首页
    return sheep.$router.go('/pages/index/index');
  }
</script>
<style lang="scss" scoped>
  .register-tip {
    left: 50%;
    transform: translateX(-50%);
  }
</style>
