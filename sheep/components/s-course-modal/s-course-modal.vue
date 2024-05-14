<template>
  <!-- 规格弹窗 -->
  <su-popup
    :show="isShow"
    type="center"
    round="16"
    :is-show-header="false"
    :is-mask-click="false"
    @close="closeCourseModal"
  >
    <view class="course-modal">
      <view class="f-s-17 f-w-600 flex-center m-t-24">{{ state.typeInfo.name }}</view>
      <view class="m-24 h-72">
        <view class="f-s-17 m-b-8">{{ modalMessage['course_name'] }}</view>
        <view class="f-s-14 col-b-title-7 flex-left">
          <view class="m-r-8">{{ modalMessage['teacher_name'] }} </view>
          <view class="">{{ modalMessage['class_names_no_jxb'] }}</view>
        </view>
      </view>
      <view class="flex-center h-56 f-s-17 btn-modal">
        <view class="flex-1 flex-center close h-100p" @click="closeCourseModal">关闭</view>
        <view class="flex-1 flex-center col-b-blue h-100p" @click="toView">{{
          state.typeInfo.ops
        }}</view>
      </view>
    </view>
  </su-popup>
</template>
<script setup>
  import { computed, reactive } from 'vue';
  import { closeCourseModal } from '@/sheep/hooks/useModal';
  import sheep from '@/sheep';
  import { isEmpty } from '@/sheep/helper/utils';
  import { modalList, scanCodeSign } from '@/sheep/business/courseMessage';

  const props = defineProps({
    courseInfo: {
      type: Object,
      default: () => {},
    },
  });
  const state = reactive({
    typeList: modalList(),
    typeInfo: {},
    itemInfo: {},
  });
  const modalStore = sheep.$store('modal');
  const isShow = computed(() => modalStore.isCourse);
  const modalMessage = computed(() => {
    const info = modalStore.modalMessage;
    if (isEmpty(info)) return {};
    const type = parseInt(info.type);
    state.typeInfo = state.typeList.find((item) => item.type === type) || {};
    state.itemInfo = info;
    return info.lesson_info;
  });

  function toView() {
    // 扫码签到
    if (state.typeInfo.type === 3) {
      scanCodeSign();
    } else {
      // 跳转投票/观点手机收集详情页面
      const query = {
        id: state.itemInfo.action_id,
        status: parseInt(modalMessage?.value.status),
        pid: modalMessage?.value.lesson_active_id,
        course: modalMessage?.value.course_name,
        room: modalMessage?.value.room_id,
      };
      console.log(query, 'routerParams');
      if (state.typeInfo.type === 1) {
        query.id = modalMessage?.value.lesson_active_id;
        query.name = modalMessage?.value.course_name;
      }
      if (state.itemInfo.model) {
        query.model = state.itemInfo.model;
      }
      if (state.typeInfo.type === 5) query.type = 2;
      if (state.typeInfo.type === 7) query.type = 3;
      sheep.$router.redirect(`${state.typeInfo.view}`, {
        item: encodeURIComponent(JSON.stringify(query)),
      });
    }
    closeCourseModal();
  }
</script>
<style lang="scss" scoped>
  .course-modal {
    width: pxToRpx(312);
    //height: pxToRpx(224);
    .btn-modal {
      border-top: 1px solid rgba(26, 29, 52, 0.1);
      .close {
        border-right: 1px solid #e7e7e7;
      }
    }
  }
  :deep(.popup-header) {
    display: none;
  }
</style>
