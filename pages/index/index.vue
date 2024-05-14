<template>
  <s-layout title="课程" class="course" :bgStyle="{ color: '#F2F3F7' }" tabbar="/pages/index/index">
    <uni-section class="m-b-16" title="我的课程">
      <template v-slot:right>
        <image
          class="w-22 h-22"
          :src="sheep.$url.static('/static/img/course/sign-in.png')"
          @click="scanCodeSign()"
        />
      </template>
    </uni-section>
    <scroll-view :scroll-y="true" :style="{ height: pageHeight + 'px' }">
      <view class="p-b-16">
        <view
          class="m-t-16 m-l-16 m-r-16 radius bg-b-white p-16"
          v-for="(item, index) in state.dataList"
          :key="index"
          @click="toCourseDetails(item)"
        >
          <view class="flex-space-b">
            <view class="f-s-17 f-w-400">{{ item.course_name }}</view>
            <view class="f-s-14 col-b-blue">{{ getFormatStatus(item.status) }}</view>
          </view>
          <view class="f-s-14 m-t-8 col-b-title-7 flex-left">
            <view class="ss-line-1 flex-1" :class="'class_name' + index"
              >{{ item.teacher_name }} {{ item.class_names_no_jxb }}</view
            >
            <view>{{ getClassNum(item.class_names_no_jxb) }}</view>
          </view>
        </view></view
      >
    </scroll-view>
    <s-empty
      text="暂时没有上课中的课程"
      :icon="sheep.$url.static('/static/img/course/noCourse.png')"
      v-if="state.dataList.length === 0"
    ></s-empty>
  </s-layout>
</template>

<script setup>
  import { reactive, computed, watch } from 'vue';
  import sheep from '@/sheep';
  import { getMyCourse } from '@/sheep/business/course';
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import { scanCodeSign, toCourseDetails } from '@/sheep/business/courseMessage';
  const state = reactive({
    dataList: [],
  });
  onLoad(() => {
    uni.hideTabBar({
      success: () => {},
      //捕获报错，勿删
      fail: (error) => {
        console.log(error);
      },
    });
  });
  onShow(() => {
    init();
  });
  const { safeArea } = sheep.$platform.device;
  const pageHeight = computed(() => safeArea.height - 70 - 100);

  const modalStore = sheep.$store('modal');
  const courseMessage = computed(() => modalStore.courseMessage);
  // 监听推送消息
  watch(courseMessage, (newValue, oldValue) => {
    // 收到消息操作数据
    handleMessage(newValue);
  });
  const userInfo = sheep.$store('user').userInfo;
  async function init() {
    let params = { school_id: userInfo.school_id || 3 };
    const { list } = await getMyCourse(params);
    state.dataList = list || [];
  }
  function getFormatStatus(status) {
    return parseInt(status) === 1 ? '上课中' : '已下课';
  }
  function getClassNum(value) {
    if (value.length < 20 || !value) {
      return '';
    } else {
      const list = value.split(',');
      return `等${list.length}个班级`;
    }
  }
  function handleMessage({ lesson_info, type, topic }) {
    if (!topic.includes('web/course/user')) return;
    if (type === 1) {
      // 增加数据
      state.dataList.unshift(lesson_info);
    } else if (type === 2) {
      state.dataList = state.dataList.filter(
        (item) => item.lesson_active_id !== lesson_info.lesson_active_id,
      );
    }
  }
</script>

<style scoped lang="scss">
  .course {
    .sign-in {
      background: linear-gradient(270deg, #2cabf8 0%, #2cf8e9 100%);
      width: pxToRpx(84);
      height: pxToRpx(32);
    }
    :deep(.uni-section-header) {
      padding: 16px;
      .distraction {
        font-weight: bold !important;
        font-size: pxToRpx(22) !important;
      }
    }
  }
</style>
