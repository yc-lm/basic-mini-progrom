<template>
  <s-layout title="登录" class="account-login-page f-s-14">
    <view class="header-nav m-b-20">
      <s-login-nav></s-login-nav>
    </view>
    <view class="login-form">
      <s-login-form :school-list="schoolList" @handleSubmit="handleSubmit"></s-login-form>
    </view>
  </s-layout>
</template>
<script setup>
import {onBeforeMount, ref} from 'vue';
import {
  accountLogin,
  getSchoolList,
  refreshPlatformInfo,
  USER_KEY_OBJ,
  USER_LOGIN_TYPE_OBJ
} from '@/sheep/hooks/useLogin';
import sheep from '@/sheep';

const schoolList = ref([]);

onBeforeMount(() => {
  init();
});

async function init() {
  schoolList.value = await getSchoolList();
}

async function handleSubmit(params) {
  console.log('handleSubmit params', params);

  const openId = uni.getStorageSync(USER_KEY_OBJ.USER_OPENID);
  if(!openId) {
    return sheep.$helper.toast('缺少用户信息：open id');
  }

  const apiParams = {
    login_name: params.account,
    login_password: params.password,
    school_id: params.school_id,
    is_terminal: params.school_id,
    openid: openId,
  };
  const tokenInfo = await accountLogin(apiParams);
  const token = tokenInfo?.['Access-Token'];
  if (token) {
    console.log('token',token)
    // success
    sheep.$store('user').setToken(token);
    const userInfo = await sheep.$store('user').getInfo(true);
    if (!userInfo) {
      return sheep.$helper.toast('获取用户信息失败');
    }
    // 刷新平台信息
    refreshPlatformInfo(params);
    sheep.$store('user').updateLoginType(USER_LOGIN_TYPE_OBJ.ACCOUNT_LOGIN);
    // 跳转首页
    return sheep.$router.go('/pages/index/index');
  }
}
</script>
