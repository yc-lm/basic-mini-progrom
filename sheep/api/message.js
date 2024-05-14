import request from '@/sheep/request';
import { REQUEST_PLATFORM_TYPES } from '@/sheep/hooks/useApi';
import { URL } from '@/sheep/hooks/useApi'

export default {
  //消息列表
  userMessageList: (params) =>
    request(
      {
        url: URL,
        method: 'GET',
        data: { api: 'getMessageListByUserId', ...params },
        custom: {
          showLoading: true,
        },
      },
      REQUEST_PLATFORM_TYPES.REQUEST_PLATFORM_USER,
    ),
  //消息详情
  messageDetail: (params) =>
    request(
      {
        url: URL,
        method: 'GET',
        data: { api: 'getStudentMessageByUuid', ...params },
        custom: {
          showLoading: true,
        },
      },
      REQUEST_PLATFORM_TYPES.REQUEST_PLATFORM_USER,
    ),
  //进入消息详情
  enterMessageDetail: (params) =>
    request(
      {
        url: URL+'?api=addEnteringCourse',
        method: 'POST',
        data: params,
        custom: {
          showLoading: true,
        },
      },
      REQUEST_PLATFORM_TYPES.REQUEST_PLATFORM_USER,
    ),

}
