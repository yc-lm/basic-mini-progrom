import { apiSimpleWrapper } from '@/sheep/hooks/useApi';
import messageApi from '@/sheep/api/message';

export const signType = {
  0: '未完成',
  1: '已完成',
};

export async function getMessageListData(apiParams) {
  return await apiSimpleWrapper({
    api: messageApi.userMessageList,
    params: apiParams,
    notifyError: true,
    defaultValue: { list: [], total: 0 },
  });
}

export async function getMessageDetailData(apiParams) {
  return await apiSimpleWrapper({
    api: messageApi.messageDetail,
    params: apiParams,
    notifyError: true,
    defaultValue: {},
  });
}

export async function getEnterMessageData(apiParams) {
  return await apiSimpleWrapper({
    api: messageApi.enterMessageDetail,
    params: apiParams,
    notifyError: true,
    defaultValue: {},
  });
}
