import {
  courseMessageInfo,
  modalMessageInfo,
  openToast,
  showCourseModal,
} from '@/sheep/hooks/useModal';
import sheep from '@/sheep';
import { courseSign } from '@/sheep/business/course';
import { getTimeStamp } from '@/sheep/helper/time';
import { useMqtt } from '@/sheep/hooks/useMqtt';
const { sendMqSubscribe } = useMqtt();

export function onMessage(data, topic) {
  let modalStore = sheep.$store('modal');
  let { path, query } = getPathParams();
  const info = data.lesson_info;
  // 判断消息是否在当前课程
  const isCurrentPage =
    query.id === info['lesson_active_id'] || query.pid === info['lesson_active_id'];
  console.log(info['lesson_active_id'], '当前页面的路由：', query, isCurrentPage);
  // 打开弹窗
  const modal = [1, 3, 5, 7];
  let isModal = false;
  if (parseInt(data.type) === 1) {
    isModal = true;
  } else if (modal.includes(parseInt(data.type)) && topic.includes('web/course/user')) {
    let params = {
      id: data.action_id,
      status: 1,
      pid: info.lesson_active_id,
      type: data.type === 3 ? 1 : data.type === 5 ? 2 : 3,
      course: info.course_name,
      room: data.room_id,
    };
    if (isCurrentPage && [5, 7].includes(parseInt(data.type))) {
      // 直接进入对应活动
      if (data.model) {
        params.model = data.model;
      }
      const find = modalList().find((item) => data.type === item.type);
      console.log(params, 'routerParams');
      sheep.$router.go(`${find.view}`, {
        item: encodeURIComponent(JSON.stringify(params)),
      });
    } else if (isCurrentPage && [3].includes(parseInt(data.type))) {
      // 直接打开扫码签到
      scanCodeSign(params);
    } else {
      isModal = true;
    }
  }
  //下课移除订阅
  if (parseInt(data.type) === 2) {
    subscribeAction(data.lesson_info['room_id'], false);
  }
  if (!modalStore.isCourse && isModal) {
    modalMessageInfo(data);
    showCourseModal();
  }
  // 结束投票或观点收集，在当前详情页面时返回互动详情列表
  let isPath = path.includes('interactionDetails') || path.includes('viewpointCollection');
  if ([6, 8].includes(parseInt(data.type)) && isPath) {
    if (data.type === 6) sheep.$helper.toast('投票已结束');
    if (data.type === 8) sheep.$helper.toast('观点收集已结束');
    setTimeout(() => {
      // sheep.$router.back();
      toCourseDetails(data.lesson_info);
    }, 2000);
  }

  courseMessageInfo({ ...data, topic });
}
function subscribeAction(roomId, isSubscribe = true) {
  sendMqSubscribe({ msg: 'web/course/room/' + roomId, isSubscribe });
}
export function modalList() {
  return [
    {
      name: '开始上课',
      type: 1,
      ops: '去上课',
      view: '/page_course/courseDetails/courseDetails',
    },
    { name: '开始签到', type: 3, ops: '去签到', view: '', key: 1 },
    {
      name: '开始投票',
      type: 5,
      ops: '去投票',
      view: '/page_course/interactionDetails/interactionDetails',
    },
    {
      name: '开始观点收集',
      type: 7,
      ops: '去发表观点',
      view: '/page_course/viewpointCollection/viewpointCollection',
    },
  ];
}

// 获取页面路径和参数
export function getPathParams() {
  let pages = getCurrentPages();
  let curParam = pages[pages.length - 1].options;
  let query = {};
  let path = pages[pages.length - 1].$page;
  if (curParam && curParam.item) {
    query = JSON.parse(decodeURIComponent(curParam.item));
  }
  return { path: path.fullPath, query: query };
}
// 打开扫码-签到跳转课程详情
export function scanCodeSign(query) {
  uni.scanCode({
    scanType: ['qrCode'],
    // 扫码成功后的回调
    success: (res) => {
      courseSignIn(res.result, query);
    },
    fail: (fail) => {
      console.log(fail, 'fail');
    },
  });
}
// 签到
export async function courseSignIn(key, query) {
  const userInfo = sheep.$store('user').userInfo;
  let params = { school_id: userInfo.school_id, key };
  const value = await courseSign(params);
  console.log(value, 'value');
  if (value) {
    // sheep.$helper.toast('签到成功');
    openToast('签到成功');
    setTimeout(() => {
      if (query && query.type) {
        query = {
          content: getTimeStamp(value.time),
          status: 2,
          name: '我的签到',
          type: 1,
          pid: query.lesson_active_id,
        };
        toSignDetails(query);
      } else {
        toCourseDetails(value);
      }
    }, 1000);
  }
}
// 跳转课程详情
export function toCourseDetails({ lesson_active_id, course_name, room_id }, redirect = false) {
  const query = {
    id: lesson_active_id,
    name: course_name,
    room: room_id,
  };
  sheep.$router.go(
    `/page_course/courseDetails/courseDetails`,
    {
      item: encodeURIComponent(JSON.stringify(query)),
    },
    { redirect: redirect },
  );
}
// 课程详情扫码后跳转签到详情
export function toSignDetails(query) {
  sheep.$router.redirect(`/page_course/interactionDetails/interactionDetails`, {
    item: encodeURIComponent(JSON.stringify(query)),
  });
}
