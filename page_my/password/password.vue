<template>
  <s-layout title="修改密码" :bgStyle="{ color: '#FFFFFF' }">
    <view class="p-16">
      <uni-forms ref="baseForm" v-model="state.model" :rules="state.rules" validateTrigger="bind">
        <uni-forms-item name="password">
          <uni-easyinput
            v-model.trim="state.model.password"
            placeholder="请输入当前密码"
            type="password"
            :inputBorder="false"
          />
        </uni-forms-item>
        <uni-forms-item name="newPassword">
          <uni-easyinput
            v-model.trim="state.model.new_password"
            :inputBorder="false"
            :placeholder="passwordStrong ? '请输入新密码,包含字母数字和符号' : '请输入新密码'"
            type="password"
          />
        </uni-forms-item>
        <uni-forms-item name="firmPassword">
          <uni-easyinput
            v-model.trim="state.model.new_confirm_password"
            :inputBorder="false"
            placeholder="请再次输入新密码"
            type="password"
          />
        </uni-forms-item>
      </uni-forms>
      <button class="bg-b-blue col-b-white f-w-600 m-b-24 f-s-16" @tap="submit('baseForm')"
        >提交</button
      >
    </view>
  </s-layout>
</template>

<script setup>
  import { ref, unref, reactive } from 'vue';
  import { confirmPassword } from '@/sheep/validate/form';
  import { getPasswordOption } from '@/sheep/hooks/userData';
  import { onShow } from '@dcloudio/uni-app';
  import sheep from '@/sheep';
  import { clone } from 'lodash';
  const baseForm = ref(null);
  let passwordStrong = ref(false);
  // 数据
  const state = reactive({
    model: {
      password: '',
      new_password: '',
      new_confirm_password: '',
    },
    rules: {
      password: confirmPassword,
      newPassword: confirmPassword,
      firmPassword: confirmPassword,
    },
    userInfo: {},
  });
  onShow(async () => {
    state.userInfo = clone(sheep.$store('user').userInfo);
    const result = await getPasswordOption({
      school_id: state.userInfo.school_id,
      opt_name: 'password-strong',
    });
    passwordStrong.value = result.value;
  });
  async function submit() {
    unref(baseForm)
      .validate(async (err, formData) => {
        if (!err) {
          console.log(formData);
          if (state.model.new_password !== state.model.new_confirm_password) {
            uni.showToast({
              title: `两次密码不一致`,
              icon: 'none',
              duration: 5000,
            });
            return;
          }
          const { error, data } = await sheep.$api.user.editUserPassword({
            password: state.model.password,
            new_password: state.model.new_password,
            school_id: state.userInfo.school_id,
          });
          if (error === 'OK') {
            uni.showToast({
              title: `操作成功`,
              icon: 'none',
              duration: 5000,
            });
            sheep.$router.back();
          } else {
            uni.showToast({
              title: data,
              icon: 'none',
              duration: 5000,
            });
          }
        }
      })
      .catch((error) => {
        console.log('error: ', error);
      });
  }
</script>

<style scoped lang="scss">
  :deep(.uni-easyinput__content-input) {
    padding-left: pxToRpx(10) !important;
  }
  :deep(.uni-forms-item__content) {
    background: #f2f3f7;
    border-radius: pxToRpx(6) !important;

    .uni-easyinput__content {
      height: pxToRpx(48);

      &.is-disabled {
        background-color: unset !important;
      }

      .uni-easyinput__content-input {
        padding-left: pxToRpx(13) !important;
        color: rgba(26, 29, 52, 0.5) !important;
        font-size: pxToRpx(17);
      }

      .uni-easyinput__placeholder-class {
        font-size: pxToRpx(17);
        color: rgba(26, 29, 52, 0.5) !important;
      }
    }
    :deep(.uni-error-message) {
      padding-left: pxToRpx(13) !important;
    }
  }
</style>
