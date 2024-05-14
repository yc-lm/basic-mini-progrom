import request from '@/sheep/request';
import { REQUEST_PLATFORM_TYPES, URL } from '@/sheep/hooks/useApi';
export default {
  // 我的课程
  getMyCourseApi: (params) =>
    request(
      {
        url: URL,
        method: 'GET',
        data: { api: 'getMyCourse', ...params },
        custom: {
          showLoading: false,
        },
      },
      REQUEST_PLATFORM_TYPES.REQUEST_PLATFORM_USER,
    ),
  // 签到
  courseSignApi: (params) =>
    request(
      {
        url: URL,
        method: 'POST',
        data: { api: 'courseSign', ...params },
        custom: {
          showLoading: false,
        },
      },
      REQUEST_PLATFORM_TYPES.REQUEST_PLATFORM_USER,
    ),
  // 投票
  courseVoteApi: (params) =>
    request(
      {
        url: URL,
        method: 'POST',
        data: { api: 'courseVote', ...params },
        custom: {
          showLoading: true,
        },
      },
      REQUEST_PLATFORM_TYPES.REQUEST_PLATFORM_USER,
    ),
  // 观点收集
  courseViewpointApi: (params) =>
    request(
      {
        url: URL,
        method: 'POST',
        data: { api: 'courseViewpoint', ...params },
        custom: {
          showLoading: true,
        },
      },
      REQUEST_PLATFORM_TYPES.REQUEST_PLATFORM_USER,
    ),
  //获取我的观点
  getMyViewpointApi: (params) =>
    request(
      {
        url: URL,
        method: 'GET',
        data: { api: 'getMyViewpoint', ...params },
        custom: {
          showLoading: true,
        },
      },
      REQUEST_PLATFORM_TYPES.REQUEST_PLATFORM_USER,
    ),
  // 获取互动列表
  getInteractionListApi: (params) =>
    request(
      {
        url: URL,
        method: 'GET',
        data: { api: 'getInteractionList', ...params },
        custom: {
          showLoading: true,
        },
      },
      REQUEST_PLATFORM_TYPES.REQUEST_PLATFORM_USER,
    ),

  // 提问
  courseQuestionApi: (params) =>
    request(
      {
        url: URL,
        method: 'POST',
        data: { api: 'courseQuestion', ...params },
        custom: {
          showLoading: true,
        },
      },
      REQUEST_PLATFORM_TYPES.REQUEST_PLATFORM_USER,
    ),
  // 获取我的提问
  getMyQuestionApi: (params) =>
    request(
      {
        url: URL,
        method: 'GET',
        data: { api: 'getMyQuestion', ...params },
        custom: {
          showLoading: true,
        },
      },
      REQUEST_PLATFORM_TYPES.REQUEST_PLATFORM_USER,
    ),
  // 获取提问状态(是否允许)
  getQuestionStatusApi: (params) =>
    request(
      {
        url: URL,
        method: 'GET',
        data: { api: 'getQuestionStatus', ...params },
        custom: {
          showLoading: true,
        },
      },
      REQUEST_PLATFORM_TYPES.REQUEST_PLATFORM_USER,
    ),
  //
  // 进入课程详情页
  addEnteringCourseAPI: (params) =>
    request(
      {
        url: URL,
        method: 'POST',
        data: { api: 'addEnteringCourse', ...params },
        custom: {
          showLoading: true,
        },
      },
      REQUEST_PLATFORM_TYPES.REQUEST_PLATFORM_USER,
    ),
};
