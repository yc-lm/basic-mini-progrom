<template>
  <s-layout title="我的" navbar="" :bgStyle="{ color: '#F2F3F7' }" tabbar="/pages/my/my">
    <view class="my-bg-contain">
      <view class="p-l-16 p-r-16 p-t-100 p-b-20">
        <view class="person bg-white p-16">
          <view class="flex align-center">
            <view class="f-s-17 col-b-title f-s-22 f-w-600">{{ state.userInfo.nickname }}</view>
            <view class="tag m-l-16 col-b-green">学生</view>
          </view>
          <view class="m-t-8 f-s-17 col-b-title-7">{{ state.userInfo.school_name }}</view>
        </view>
        <view class="person m-t-16 bg-white p-16">
          <view class="col-b-title-6 f-s-14">个人资料</view>
          <view class="m-t-12 flex-space-b p-t-16 p-b-16">
            <view class="flex align-center">
              <image
                class="w-16 h-16"
                :src="sheep.$url.static('/static/img/my/userName.png')"
              ></image>
              <view class="f-s-17 col-b-title m-l-16">用户名</view>
            </view>
            <view class="flex align-center">
              <view class="f-s-14 col-b-title-4 m-r-8">{{ state.userInfo.login_name }}</view>
            </view>
          </view>
          <view class="flex-space-b p-t-16 p-b-16" @tap="setAccount">
            <view class="flex align-center">
              <image class="w-16 h-16" :src="sheep.$url.static('/static/img/my/name.png')"></image>
              <view class="f-s-17 col-b-title m-l-16">姓名</view>
            </view>
            <view class="flex align-center">
              <view class="f-s-14 col-b-title-4 m-r-8">{{ state.userInfo.nickname }}</view>
              <uni-icons type="right" size="12" color="rgba(26,29,52,0.45)"></uni-icons>
            </view>
          </view>
          <view class="flex-space-b p-t-16 p-b-16" @tap="setStudentNum">
            <view class="flex align-center">
              <image
                class="w-16 h-16"
                :src="sheep.$url.static('/static/img/my/number.png')"
              ></image>
              <view class="f-s-17 col-b-title m-l-16">学号</view>
            </view>
            <view class="flex align-center">
              <view class="f-s-14 col-b-title-4 m-r-8">{{ state.userInfo.code }}</view>
              <uni-icons type="right" size="12" color="rgba(26,29,52,0.45)"></uni-icons>
            </view>
          </view>
        </view>
        <view class="person m-t-16 bg-white p-16">
          <view class="col-b-title-6 f-s-14">账号安全</view>
          <view class="m-t-12 flex-space-b p-t-16 p-b-16" @tap="setPassword">
            <view class="flex align-center">
              <image
                class="w-16 h-16"
                :src="sheep.$url.static('/static/img/my/password.png')"
              ></image>
              <view class="f-s-17 col-b-title m-l-16">修改密码</view>
            </view>
            <view class="flex align-center">
              <uni-icons type="right" size="12" color="rgba(26,29,52,0.45)"></uni-icons>
            </view>
          </view>
          <view class="flex-space-b p-t-16" @tap="setWechatBindStatus">
            <view class="flex align-center">
              <image
                class="w-16 h-16"
                :src="sheep.$url.static('/static/img/my/wechat.png')"
              ></image>
              <view class="f-s-17 col-b-title m-l-16">关联微信</view>
            </view>
            <view class="flex align-center">
              <view class="f-s-14 col-b-title-4 m-r-8">{{
                state.bindStatus ? '已关联' : '未关联'
              }}</view>
              <uni-icons type="right" size="12" color="rgba(26,29,52,0.45)"></uni-icons>
            </view>
          </view>
        </view>
        <view class="edit m-t-16 f-w-600 f-s-17 col-b-red p-16" @tap="generalVisible = true">
          退出登录
        </view>
      </view>
    </view>
    <su-popup :show="generalVisible" type="center" :round="12" title="提示" :is-mask-click="false">
      <view class="general-content m-t-8">
        <view class="f-s-16 col-b-title-6 flex-center m-b-24">确定退出当前账号吗？</view>
        <view class="ss-m-t-24 ss-flex btn-content">
          <button
            class="ss-reset-button cancel-btn edit-btn border-right f-s-17 flex-center"
            @tap="generalVisible = false"
            >取消</button
          >
          <button
            class="ss-reset-button col-b-blue f-s-17 confirm-btn edit-btn f-s-17 flex-center"
            @tap="editLogin"
            >确认</button
          >
        </view>
      </view>
    </su-popup>
    <su-popup :show="wechatVisible" type="center" :round="12" title="提示" :is-mask-click="false">
      <view class="general-content m-t-8">
        <view class="f-s-16 col-b-title-6 flex-center m-b-24">确定关联微信吗？</view>
        <view class="ss-m-t-24 ss-flex btn-content">
          <button
            class="ss-reset-button cancel-btn edit-btn border-right f-s-17 flex-center"
            @tap="wechatVisible = false"
            >取消</button
          >
          <button
            class="ss-reset-button col-b-blue f-s-17 confirm-btn edit-btn f-s-17 flex-center"
            @tap="connectWechat"
            >确认</button
          >
        </view>
      </view>
    </su-popup>
    <su-popup
      :show="unBindWechatVisible"
      type="center"
      :round="12"
      title="提示"
      :is-mask-click="false"
    >
      <view class="general-content m-t-8">
        <view class="f-s-16 col-b-title flex-center">确定解除微信关联吗？</view>
        <view class="f-s-14 col-b-title-7 flex-center m-t-8 m-b-24"
          >解除后将无法用微信直接登录</view
        >
        <view class="ss-m-t-24 ss-flex btn-content">
          <button
            class="ss-reset-button cancel-btn edit-btn border-right f-s-17 flex-center"
            @tap="unBindWechatVisible = false"
            >取消</button
          >
          <button
            class="ss-reset-button col-b-blue f-s-17 confirm-btn edit-btn f-s-17 flex-center"
            @tap="connectUnbindWechat"
            >确认</button
          >
        </view>
      </view>
    </su-popup>
    <su-popup
      :show="hasWechatVisible"
      type="center"
      :round="12"
      title="提示"
      :is-mask-click="false"
    >
      <view class="p-24 general-content">
        <view class="f-s-17 m-t-8 col-b-title"
          >您的微信已关联以下账号；若要重新关联，请先登录以下账号解除微信；</view
        >
        <view class="flex col-b-title-7 m-t-16 f-s-14">
          <view>用户名：</view>
          <view class="m-l-8">{{ state.bindUserInfo?.login_name }}</view>
        </view>
        <view class="flex col-b-title-7 m-t-8 f-s-14" v-if="state.bindUserInfo.userName">
          <view>姓名：</view>
          <view class="m-l-8">{{ state.bindUserInfo.userName }}</view>
        </view>
        <button
          @click="hasWechatVisible = false"
          class="col-b-white bg-b-blue btn f-w-600 f-s-17 m-t-24"
          >知道了</button
        >
      </view>
    </su-popup>
  </s-layout>
</template>

<script setup>
  import { ref, reactive } from 'vue';
  import SuPopup from '@/sheep/ui/su-popup/su-popup.vue';
  import sheep from '@/sheep';
  import { onShow, onUnload, onHide } from '@dcloudio/uni-app';
  import { removeAllStorage, USER_KEY_OBJ } from '@/sheep/hooks/useLogin';
  import { getUserName, loginOut, setAccountBind } from '@/sheep/hooks/userData';

  let generalVisible = ref(false);
  let wechatVisible = ref(false);
  let hasWechatVisible = ref(false);
  let unBindWechatVisible = ref(false);
  let platformId = ref('');
  let openId = ref('');
  let state = reactive({
    userInfo: {},
    bindStatus: false,
    bindUserInfo: {},
  });
  //跳转只触发onShow生命周期
  onShow(async () => {
    await getUserInfo();
    platformId.value = uni.getStorageSync(USER_KEY_OBJ.USER_PLATFORM_ID);
    openId.value = uni.getStorageSync(USER_KEY_OBJ.USER_OPENID);
    await getUserBindStatus();
  });

  const initDialog = function () {
    generalVisible.value = false;
    wechatVisible.value = false;
    hasWechatVisible.value = false;
    unBindWechatVisible.value = false;
  };

  const getUserInfo = async function () {
    state.userInfo = sheep.$store('user').userInfo;
  };

  //获取当前用户微信绑定状态
  const getUserBindStatus = async function () {
    const result = await sheep.$api.user.getWechatBindStatus({
      platform_id: platformId.value,
      school_id: state.userInfo.school_id,
      login_name: state.userInfo.login_name,
    });
    state.bindStatus = result.value;
  };

  const setWechatBindStatus = async function () {
    console.log(state.bindStatus);

    //已绑定 进行解绑
    if (state.bindStatus) {
      console.log(1);
      unBindWechatVisible.value = true;
    } else {
      wechatVisible.value = true;
    }
  };

  //解绑
  const connectUnbindWechat = async function () {
    await sheep.$api.user.setWechatUnBind({
      openid: openId.value,
      login_name: state.userInfo.login_name,
    });
    unBindWechatVisible.value = false;
    await getUserBindStatus();
  };

  //关联微信
  const connectWechat = async function () {
    //判断是否绑定其他账号
    const result = await setAccountBind({
      openid: openId.value,
      platform_id: platformId.value,
      school_id: state.userInfo.school_id,
      login_name: state.userInfo.login_name,
    });
    wechatVisible.value = false;
    if (result.platform_id) {
      //判断返回的与当前学校是否为同一个
      if (
        Number(result.platform_id) === Number(platformId.value) &&
        Number(result.school_id) === Number(state.userInfo.school_id)
      ) {
        state.bindUserInfo.userName = await getUserName({
          school_id: result.school_id,
          login_name: result.login_name,
        });
      }
      state.bindUserInfo.login_name = result.login_name;
      hasWechatVisible.value = true;
    }
    await getUserBindStatus();
  };

  const setAccount = function () {
    uni.navigateTo({
      url: '/page_my/account/account',
    });
  };
  const setPassword = function () {
    uni.navigateTo({
      url: '/page_my/password/password',
    });
  };
  const setStudentNum = function () {
    uni.navigateTo({
      url: '/page_my/studentNum/studentNum',
    });
  };

  //退出登录
  const editLogin = async function () {
    await loginOut();
    generalVisible.value = false;
    removeAllStorage();
    uni.redirectTo({
      url: '/pages/login/login',
    });
  };
  onHide(() => {
    initDialog();
  });
</script>
<style scoped lang="scss">
  .my-bg-contain {
    width: 100%;
    background: linear-gradient(180deg, #c2e8ff 0%, #f2f3f7 pxToRpx(320));

    .tag {
      width: pxToRpx(44);
      height: pxToRpx(24);
      background: #e8ffeb;
      border-radius: pxToRpx(4);
      text-align: center;
      line-height: pxToRpx(24);
    }
    .person {
      border-radius: pxToRpx(8);
    }
    .edit {
      border-radius: pxToRpx(8);
      text-align: center;
      background: #ffffff;
    }
  }
  .general-content {
    width: pxToRpx(312);
  }
  .edit-btn {
    width: 50%;
    text-align: center;
  }
  .btn-content {
    border-top: pxToRpx(1) solid rgba(26, 29, 52, 0.1);
  }
  .border-right {
    border-right: pxToRpx(1) solid rgba(26, 29, 52, 0.1);
  }
  :deep(.uni-popup .uni-popup__wrapper .popup-header) {
    border-bottom: none !important;
  }
</style>
