import request from '@/sheep/request';
import $platform from '@/sheep/platform';
import { REQUEST_PLATFORM_TYPES, REQUEST_PLATFORM_USER } from '@/sheep/hooks/useApi';
import { AUTH_PLATFORM_TOKEN, USER_KEY_OBJ } from '@/sheep/hooks/useLogin';

export default {
  token: (data) =>
    request(
      {
        url: '/bmd/userCenterApi.php',
        method: 'GET',
        data: { api: 'getUserTokenByLoginName', c: 'User', ...data },
        custom: {
          showLoading: true,
        },
      },
      REQUEST_PLATFORM_TYPES.REQUEST_PLATFORM_USER,
    ),

  profile: () =>
    request(
      {
        url: '/bmd/userCenterApi.php',
        method: 'GET',
        data: { api: 'getUserBriefInfo', c: 'User' },
        custom: {
          showLoading: true,
        },
      },
      REQUEST_PLATFORM_TYPES.REQUEST_PLATFORM_USER,
    ),
  // 检测网络是否可达
  checkNetwork: () =>
    request(
      {
        url: '/bmd/userCenterApi.php',
        method: 'HEAD',
        data: { api: 'getUserBriefInfo', c: 'User' },
        custom: {
          showLoading: true,
        },
      },
      REQUEST_PLATFORM_TYPES.REQUEST_PLATFORM_USER,
    ),
  // 获取小程序的openid
  getOpenId: (data) =>
    request({
      url: 'wx-login',
      method: 'POST',
      data,
    }),
  // 获取用户隐私协议
  getPrivacy: () =>
    request({
      url: 'get-privacy',
      method: 'GET',
      custom: {
        showLoading: true,
      },
    }),
  // 绑定账号
  bindUser: (data) =>
    request(
      {
        url: '/bmd/userCenterApi.php?api=wxUserBind&c=User',
        method: 'POST',
        data: data,
        custom: {
          showLoading: true,
        },
      },
      REQUEST_PLATFORM_TYPES.REQUEST_PLATFORM_USER,
    ),
  // 获取mqtt配置
  getPlatformConfig: (data) =>
    request(
      {
        url: '/bmd/jsonApi.php?api=getPlatformConfig',
        method: 'GET',
        data: data,
      },
      REQUEST_PLATFORM_TYPES.REQUEST_PLATFORM_USER,
    ),
  // 账号登录
  accountLogin: (data) =>
    request(
      {
        url: '/bmd/userCenterApi.php?api=loginForMobile&c=User',
        method: 'POST',
        data: data,
        custom: {
          showLoading: true,
        },
      },
      REQUEST_PLATFORM_TYPES.REQUEST_PLATFORM_USER,
    ),
  // 学生账号注册
  studentRegister: (data) =>
    request(
      {
        url: '/bmd/userCenterApi.php?api=studentRegister&c=User',
        method: 'POST',
        data: data,
        custom: {
          showLoading: true,
        },
      },
      REQUEST_PLATFORM_TYPES.REQUEST_PLATFORM_USER,
    ),
  //获取微信绑定状态
  getWechatBindStatus: (data) =>
    request({
      url: 'get-bind-status',
      method: 'GET',
      data,
    }),
  //微信解绑
  setWechatUnBind: (data) =>
    request({
      url: 'wx-unbind',
      method: 'POST',
      data,
    }),
  //微信绑定
  setWechatBind: (data) =>
    request({
      url: 'wx-bind',
      method: 'POST',
      data,
    }),
  //获取学校配置
  getSchoolOption: (data) =>
    request(
      {
        url: '/bmd/jsonApi.php',
        method: 'GET',
        data: { api: 'getSchoolOption', ...data },
        custom: {
          showLoading: true,
        },
      },
      REQUEST_PLATFORM_TYPES.REQUEST_PLATFORM_USER,
    ),
  //退出登录
  logout: () =>
    request(
      {
        url: '/bmd/userCenterApi.php?api=logout&c=User',
        method: 'GET',
        custom: {
          showLoading: true,
        },
      },
      REQUEST_PLATFORM_TYPES.REQUEST_PLATFORM_USER,
    ),
  //编辑用户信息
  editUserInfo: (data) =>
    request(
      {
        url: '/bmd/userCenterApi.php',
        method: 'POST',
        data: { api: 'editUserInfo', c: 'User', ...data },
        custom: {
          showLoading: true,
        },
      },
      REQUEST_PLATFORM_TYPES.REQUEST_PLATFORM_USER,
    ),
  //修改密码
  editUserPassword: (data) =>
    request(
      {
        url: '/bmd/userCenterApi.php',
        method: 'POST',
        data: { api: 'modifyPasswordByMobile', c: 'User', ...data },
        custom: {
          showLoading: true,
        },
      },
      REQUEST_PLATFORM_TYPES.REQUEST_PLATFORM_USER,
    ),
  getUserLoginName: (data) =>
    request(
      {
        url: '/bmd/userCenterApi.php',
        method: 'GET',
        data: { api: 'getUserByLoginNameSchoolId', c: 'User', ...data },
        custom: {
          showLoading: true,
        },
      },
      REQUEST_PLATFORM_TYPES.REQUEST_PLATFORM_USER,
    ),

  // 授权平台
  auth: {
    // token
    token: () =>
      request(
        {
          url: 'license/web-api.php',
          method: 'GET',
          data: { api: 'getTemporaryToken' },
        },
        REQUEST_PLATFORM_TYPES.REQUEST_PLATFORM_AUTH,
      ),
    getPlatformInfo: (data) =>
      request(
        {
          url: 'license/web-api.php',
          method: 'GET',
          data: { api: 'getPlatformAddress', ...data },
          custom: {
            isAuthPlatform: true,
          },
        },
        REQUEST_PLATFORM_TYPES.REQUEST_PLATFORM_AUTH,
      ),

    getSchoolList: (data) =>
      request(
        {
          url: 'license/web-api.php',
          method: 'GET',
          data: { api: 'getSchoolListByOthers', ...data },
          custom: {
            isAuthPlatform: true,
          },
        },
        REQUEST_PLATFORM_TYPES.REQUEST_PLATFORM_AUTH,
      ),
  },
};
