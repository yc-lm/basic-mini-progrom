<template>
  <s-layout title="学号" :bgStyle="{ color: '#FFFFFF' }">
    <view class="p-16">
      <uni-forms ref="baseForm" :rules="state.rules" validateTrigger="bind">
        <uni-forms-item name="name">
          <uni-easyinput
            v-model.trim="state.userInfo.code"
            placeholder="请输入学号"
            :inputBorder="false"
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
  import { studentNum } from '@/sheep/validate/form';
  import { onShow } from '@dcloudio/uni-app';
  import sheep from '@/sheep';
  import { clone } from 'lodash';
  const baseForm = ref(null);
  // 数据
  const state = reactive({
    userInfo: {},
    rules: {
      name: studentNum,
    },
  });
  onShow(async () => {
    state.userInfo = clone(sheep.$store('user').userInfo);
  });
  async function submit() {
    unref(baseForm)
      .validate(async (err, formData) => {
        if (!err) {
          const { error, value } = await sheep.$api.user.editUserInfo({
            user_id: state.userInfo.user_id,
            code: state.userInfo.code,
          });
          if (error === 'OK') {
            sheep.$store('user').updateUseInfo(state.userInfo);
            uni.showToast({
              title: `操作成功`,
              icon: 'none',
              duration: 5000,
            });
            sheep.$router.back();
          } else {
            uni.showToast({
              title: value,
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
