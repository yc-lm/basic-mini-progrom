<template>
  <view class="account-form-wrap" :class="wrapClassObj">
    <!-- 表单项 -->
    <uni-forms
      ref="accountLoginRef"
      v-model="state.model"
      :rules="formRules"
      validateTrigger="bind"
      labelWidth="140"
      labelAlign="center"
      class="custom-account-form"
    >
      <uni-forms-item name="id" label="请选择学校">
        <!--        <uni-easyinput
          suffixIcon="right"
          v-model="schoolName"
          placeholder="请选择学校"
          @iconClick="handleIconClick"
          :inputBorder="false"
          :disabled="true"
        >
        </uni-easyinput>-->

        <view class="demo-input brs6 flex align-center" @tap="handleIconClick">
          <text v-show="!schoolName" class="col-b-title-5">请选择学校</text>
          <text v-show="schoolName" class="col-b-title">{{ schoolName }}</text>
          <uni-icons
            type="right"
            size="18"
            style="margin-left: auto"
            class="right-icon"
            color="rgba(26, 29, 52, 0.5)"
          ></uni-icons>
        </view>
      </uni-forms-item>

      <uni-forms-item name="nickname" label="请输入姓名" v-if="isRegisterStudent">
        <uni-easyinput
          placeholder="请输入姓名"
          v-model="state.model.nickname"
          :inputBorder="false"
        />
      </uni-forms-item>

      <uni-forms-item name="account" :label="accountLabel">
        <uni-easyinput
          :placeholder="accountLabel"
          v-model="state.model.account"
          :inputBorder="false"
        />
      </uni-forms-item>

      <uni-forms-item name="password" label="密码" v-if="!isRegisterStudent">
        <uni-easyinput
          type="password"
          placeholder="密码"
          v-model="state.model.password"
          :inputBorder="false"
        >
        </uni-easyinput>
      </uni-forms-item>
    </uni-forms>

    <view class="confirm-btn m-t-24">
      <button @tap="handleSubmit" class="bg-b-blue col-b-white f-w-600 f-s-17"
        >{{ submitBtnTitle }}
      </button>
    </view>

    <view class="page-modal">
      <!-- 选择学校弹窗 -->
      <s-school-modal :school-list="schoolList" @handleSelect="handleSelect"></s-school-modal>
    </view>
  </view>
</template>
<script>
  export default {
    options: { styleIsolation: 'shared' },
  };
</script>
<script setup>
  import { computed, watch, ref, reactive, unref, toRefs, defineEmits } from 'vue';
  import sheep from '@/sheep';
  import { password, realName, studentNum } from '@/sheep/validate/form';
  import { showSchoolModal, closeSchoolModal } from '@/sheep/hooks/useModal';
  import { getPlatformInfoById, isNetReachable } from '@/sheep/hooks/useLogin';

  const emits = defineEmits(['handleSubmit']);
  const props = defineProps({
    // 注册学生账号
    isRegisterStudent: {
      type: Boolean,
      default: false,
    },

    submitBtnTitle: {
      type: String,
      default: '登录',
    },
    wrapPadding: {
      default: 'p-l-24 p-r-24',
      type: String,
    },
    schoolList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    accountLabel: {
      type: String,
      default: '用户名',
    },

    // 是否开启校验
    isValidate: {
      type: Boolean,
      default: false,
    },
  });
  // 属性
  const { submitBtnTitle, wrapPadding, schoolList, isRegisterStudent, accountLabel } =
    toRefs(props);
  // ref对象
  const accountLoginRef = ref(null);
  // 盒子样式
  const wrapClassObj = computed(() => {
    return {
      [`${wrapPadding.value}`]: true,
    };
  });
  // 数据
  const state = reactive({
    isMobileEnd: false, // 手机号输入完毕
    model: {
      id: '',
      account: '',
      password: '',
      nickname: '',
    },
  });

  const otherRules = reactive({
    id: {
      rules: [
        {
          required: true,
          errorMessage: '请选择学校',
        },
      ],
    },
    password: {
      rules: [
        {
          required: true,
          errorMessage: '请输入密码',
        },
      ],
    },
    account: {
      rules: [
        {
          required: true,
          errorMessage: `请输入${accountLabel.value}`,
        },
      ],
    },
  });

  const studentRules = reactive({
    id: {
      rules: [
        {
          required: true,
          errorMessage: '请选择学校',
        },
      ],
    },
    account: studentNum,
    nickname: realName,
  });

  // 区分学生账号注册，以及其他类型
  const formRules = computed(() => {
    return isRegisterStudent.value ? studentRules : otherRules;
  });

  // 当前选中的id
  const currentSchool = computed(() => {
    return schoolList.value?.find((item) => item.id === state.model.id) || {};
  });

  // 学校名称
  const schoolName = computed(() => {
    return currentSchool.value?.name;
  });

  // 6.更改密码
  async function handleSubmit() {
    const validate = await unref(accountLoginRef)
      .validate()
      .catch((error) => {
        console.log('error: ', error);
      });
    if (!validate) return;

    // 先要刷新平台地址
    const platformInfo = await getPlatformInfoById(currentSchool.value?.pid);
    const domainName = platformInfo?.domain_name;
    if (!domainName) {
      return sheep.$helper.toast('获取平台信息失败');
    }
    // 检查当前是否可以ping通
    const isReachable = await isNetReachable();
    if (!isReachable) {
      return sheep.$helper.toast('请检查您的网络是否能访问校内平台');
    }
    emits('handleSubmit', {
      ...state.model,
      platform_id: currentSchool?.value?.pid,
      school_id: currentSchool?.value?.sid,
      domain_name: domainName
    });
    /*sheep.$api.user.changePassword(state.model).then((res) => {
  if (res.error === 0) {
    sheep.$store('user').getInfo();
    closeAuthModal();
  }
  });*/
  }

  function registerAccount() {}

  function handleIconClick() {
    showSchoolModal();
  }

  // 选择学校
  function handleSelect(item) {
    console.log('item', item);
    state.model.id = item.id;
  }
</script>

<style lang="scss" scoped>
  .account-form-wrap {
    ::v-deep .uni-forms {
      .uni-forms-item {
        .demo-input {
          height: pxToRpx(48);
          font-size: pxToRpx(17);
          padding: 0 pxToRpx(13);
        }

        .uni-forms-item__box {
          .uni-forms-item__inner {
            .uni-forms-item__label {
              display: none;
            }

            .uni-forms-item__content {
              background: #f2f3f7;
              border-radius: pxToRpx(6) !important;

              .uni-easyinput__content {
                height: pxToRpx(48);

                &.is-disabled {
                  background-color: unset !important;
                }

                .uni-easyinput__content-input {
                  padding-left: pxToRpx(13) !important;
                  color: $title !important;
                  font-size: pxToRpx(17);
                }

                .uni-easyinput__placeholder-class {
                  font-size: pxToRpx(17);
                  color: rgba(26, 29, 52, 0.5) !important;
                }

                .uni-icons {
                  padding-right: pxToRpx(8) !important;
                  font-size: 18px !important;
                }
              }
            }
          }

          .uni-error-message {
            padding-left: pxToRpx(13) !important;
          }
        }
      }
    }
  }
</style>
