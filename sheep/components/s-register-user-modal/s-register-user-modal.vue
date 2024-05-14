<template>
  <!-- 规格弹窗 -->
  <su-popup
      :show="isShow"
      round="16"
      :showClose="true"
      :space="27"
      :is-mask-click="false"
      @close="closeRegisterUserModal"
      @change="handlePopShow"
      title="填写注册信息"
  >
    <view class="model-content p-t-16">
      <view class="col-b-title-5 p-l-16 p-r-16">
        <uni-icons type="info" size="16" class="col-b-title-6 m-r-8"></uni-icons>
        <text class="f-s-14">目前仅支持注册学生身份；注册后可随时修改个人信息</text>
      </view>

      <view class="register-form m-t-20">
        <s-login-form
            submit-btn-title="确定"
            account-label="请输入学号"
            :school-list="schoolList"
            :is-register-student="true"
            @handleSubmit="handleSubmit"
        ></s-login-form>
      </view>
    </view>
  </su-popup>
</template>

<script setup>
import {computed, toRefs, ref, onMounted, defineEmits} from 'vue';
import sheep from '@/sheep';
import {closeRegisterUserModal} from '@/sheep/hooks/useModal';
import {getSchoolList, studentRegister, USER_KEY_OBJ} from '@/sheep/hooks/useLogin';

const modalStore = sheep.$store('modal');

// 事件
const emits = defineEmits(['handleRegisterSuccess']);
// 弹窗显示
const isShow = computed(() => modalStore.isRegisterUser);

const schoolList = ref([]);

async function init() {
  schoolList.value = await getSchoolList('', true);
}

async function handleSubmit(params) {
  console.log('handleSubmit params', params);

  const apiParams = {
    code: params.account,
    nickname: params.nickname,
    school_id: params.school_id,
    platform_id: params.platform_id,
    openid: uni.getStorageSync(USER_KEY_OBJ.USER_OPENID),
  };

  const userTip = await studentRegister(apiParams);
  // 注册成功
  if (Object.keys(userTip).length) {
    emits('handleRegisterSuccess', {
      ...userTip,
      platform_id: params?.platform_id,
      school_id: params.school_id,
      domain_name: params.domain_name
    });
    closeRegisterUserModal();
  }
}

// 打开弹窗触发
async function handlePopShow({show}) {
  if (show) {
    await init();
  }
}
</script>
<style lang="scss" scoped>
.model-content {
  box-sizing: border-box;
  height: pxToRpx(630);
}
</style>
