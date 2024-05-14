import { isEmpty } from '@/sheep/helper/utils';
import { apiSimpleWrapper } from '@/sheep/hooks/useApi';
import userApi from '@/sheep/api/course';
import { formatStatus, getTimeStamp } from '@/sheep/helper/time';
import sheep from '@/sheep';
import { openToast } from '@/sheep/hooks/useModal';

// 互动类型
export function getInteraction(type) {
  const interactionList = [
    { name: '签到', type: 1, icon: 'course-icon1' },
    { name: '投票', type: 2, icon: 'course-icon2' },
    { name: '观点收集', type: 3, icon: 'course-icon3' },
  ];
  if (type) {
    const find = interactionList.find((item) => item.type === parseInt(type));
    return find || {};
  } else {
    return interactionList;
  }
}
/*获取互动信息
 * my_content 我的操作相关数据
 * isContent  是否已提交操作
 * */
export function getInteractionText({ type, my_content }) {
  let name = '',
    content = '';
  switch (parseInt(type)) {
    case 1:
      name = '我的签到';
      content = isEmpty(my_content) ? '未签到' : getTimeStamp(my_content.created);
      break;
    case 2:
      name = '我的投票';
      content = isEmpty(my_content) ? '未提交' : my_content.opt_name;
      break;
    case 3:
      name = '我的观点';
      content = isEmpty(my_content) ? '未提交' : my_content.content;
      break;
  }
  return {
    name,
    content,
    isContent: !isEmpty(my_content),
  };
}
/*投票模板*/
export function voteModel(type = 1) {
  let list = [
    { value: 1, label: '赞成' },
    { value: 2, label: '反对' },
  ];
  if (type === 2) {
    list = [
      { value: 1, label: '正确' },
      { value: 2, label: '错误' },
    ];
  }
  if (type === 3) {
    list = [
      { value: 1, label: 'A' },
      { value: 2, label: 'B' },
    ];
  }
  if (type === 4) {
    list = [
      { value: 1, label: 'A' },
      { value: 2, label: 'B' },
      { value: 3, label: 'C' },
      { value: 4, label: 'D' },
    ];
  }
  return list;
}
//我的课程
export async function getMyCourse(apiParams) {
  return await apiSimpleWrapper({
    api: userApi.getMyCourseApi,
    params: apiParams,
    notifyError: false,
    defaultValue: [],
  });
}
//签到
export async function courseSign(apiParams) {
  const { error, value } = await userApi.courseSignApi(apiParams);
  if (error === 'ERROR') {
    // sheep.$helper.toast(value);
    openToast(value);
    return false;
  } else {
    return value;
  }
}
//投票
export async function courseVote(apiParams) {
  return await apiSimpleWrapper({
    api: userApi.courseVoteApi,
    params: apiParams,
    notifyError: true,
    defaultValue: false,
  });
}
//观点收集
export async function courseViewpoint(apiParams) {
  return await apiSimpleWrapper({
    api: userApi.courseViewpointApi,
    params: apiParams,
    notifyError: true,
    defaultValue: false,
  });
}
//获取我的观点
export async function getMyViewpoint(apiParams) {
  return await apiSimpleWrapper({
    api: userApi.getMyViewpointApi,
    params: apiParams,
    notifyError: false,
    defaultValue: [],
  });
}

//获取互动列表
export async function getInteractionList(apiParams) {
  return await apiSimpleWrapper({
    api: userApi.getInteractionListApi,
    params: apiParams,
    notifyError: false,
    defaultValue: {},
  });
}
//提问
export async function courseQuestion(apiParams) {
  return await apiSimpleWrapper({
    api: userApi.courseQuestionApi,
    params: apiParams,
    notifyError: false,
    defaultValue: false,
  });
}
//获取我的提问
export async function getMyQuestion(apiParams) {
  return await apiSimpleWrapper({
    api: userApi.getMyQuestionApi,
    params: apiParams,
    notifyError: false,
    defaultValue: [],
  });
}
//获取提问状态(是否允许)
export async function getQuestionStatus(apiParams) {
  return await apiSimpleWrapper({
    api: userApi.getQuestionStatusApi,
    params: apiParams,
    notifyError: false,
    defaultValue: false,
  });
}
//进入课程详情页
export async function addEnteringCourse(apiParams) {
  return await apiSimpleWrapper({
    api: userApi.addEnteringCourseAPI,
    params: apiParams,
    notifyError: false,
    defaultValue: false,
  });
}
