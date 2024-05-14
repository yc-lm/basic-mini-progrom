// 定义获取openid时需要保存的key
// openid
import { apiSimpleWrapper } from '@/sheep/hooks/useApi';
import userApi from '@/sheep/api/user';
import sheep from '@/sheep';
import { isIPv4Address } from '@/sheep/helper/utils';
import { weAtob } from './base.js';

export const USER_OPENID = 'openid';
// 平台id
export const USER_PLATFORM_ID = 'platform_id';
// 学校id
export const USER_SCHOOL_ID = 'school_id';
// 登录名
export const USER_LOGIN_NAME = 'login_name';
// 平台host
export const USER_PLATFORM_HOST = 'domain_name';
// token
export const USER_TOKEN = 'token';
// 授权平台token
export const AUTH_PLATFORM_TOKEN = 'auth_token';
// 登录方式
export const USER_LOGIN_TYPE = 'login_type';

// 微信登录状态码:业务
export const WX_LOGIN_STATUS_OBJ = {
  SUCCESS: 1, // 成功
  NOT_BIND_PLATFORM: 2, // 未绑定平台
  NOT_GET_DOMAIN_NAME: 3, // 未获取到平台域名
  TOKEN_ERROR: 4, // 获取token失败
  OPEN_ID_ERROR: 5, // 没有获取到openid
};

// 用户相关需要存储的key
export const USER_KEY_OBJ = {
  USER_OPENID,
  USER_PLATFORM_ID,
  USER_SCHOOL_ID,
  USER_LOGIN_NAME,
  USER_PLATFORM_HOST,
  USER_TOKEN,
  AUTH_PLATFORM_TOKEN,
  USER_LOGIN_TYPE,
};

export const STORE_KEY_LIST = Object.values(USER_KEY_OBJ);

// 用户登录方式
export const USER_LOGIN_TYPE_OBJ = {
  WX_LOGIN: 'WX_LOGIN',
  ACCOUNT_LOGIN: 'ACCOUNT_LOGIN',
};

/**
 * 获取openid等信息
 * @param {string} codeStr wx code
 * @param {boolean} isHost 是否获取平台host
 * @param {boolean} refreshDomain 是否刷新域名和id存储
 */
export async function getOpenInfo(codeStr, isHost = true, refreshDomain = true) {
  let openInfo = await apiSimpleWrapper({
    api: userApi.getOpenId,
    params: { code: codeStr },
    notifyError: false,
    defaultValue: {},
  });
  const pid = openInfo?.platform_id;
  if (isHost && pid) {
    const platformInfo = await getPlatformInfoById(pid, refreshDomain);
    openInfo = { ...openInfo, domain_name: platformInfo?.domain_name };
  }
  return openInfo;
}

// 获取平台信息
export async function getPlatformInfoById(id, refreshDomain = true) {
  await getTemporaryToken();
  let platformInfo = await apiSimpleWrapper({
    api: userApi.auth.getPlatformInfo,
    params: { pid: id },
    notifyError: false,
    defaultValue: {},
  });
  console.log('getPlatformInfoById', platformInfo, process.env.NODE_ENV === 'development');
  // 开发环境兼容返回无domain_name的情况
  if (process.env.NODE_ENV === 'development' && platformInfo?.ip && !platformInfo?.domain_name) {
    platformInfo.domain_name = platformInfo?.ip;
  }
  if (refreshDomain && platformInfo?.domain_name) {
    // 等待执行：账号登录后，获取用户信息未获取到host
    sheep.$store('user').updateUserPlatformInfo(id, platformInfo?.domain_name);
  }
  return platformInfo;
}

// 通过登录账号获取token
export async function getToken(account, schoolId) {
  const tokenInfo = await apiSimpleWrapper({
    api: userApi.token,
    params: { login_name: account, school_id: schoolId },
    notifyError: false,
    defaultValue: '',
  });
  return tokenInfo?.['Access-Token'] || '';
}

// 获取授权平台token
export async function getTemporaryToken() {
  const token = await apiSimpleWrapper({
    api: userApi.auth.token,
    params: {},
    notifyError: false,
    defaultValue: '',
  });
  console.log('getTemporaryToken', token);
  token && uni.setStorageSync(USER_KEY_OBJ.AUTH_PLATFORM_TOKEN, token);
  return token;
}

// 获取用户简要信息
export async function getUserBriefInfo() {
  return await apiSimpleWrapper({
    api: userApi.profile,
    params: {},
    notifyError: false,
    defaultValue: {},
  });
}

// 获取学校列表
export async function getSchoolList(name = '', is_register = false) {
  const params = {
    is_register: is_register ? 1 : 0,
  };
  if (name) {
    params.name = name;
  }
  await getTemporaryToken();
  return await apiSimpleWrapper({
    api: userApi.auth.getSchoolList,
    params: params,
    notifyError: false,
    defaultValue: [],
  });
}

// 账号登录
export async function accountLogin(apiParams) {
  return await apiSimpleWrapper({
    api: userApi.accountLogin,
    params: apiParams,
    notifyError: true,
    defaultValue: {},
  });
}

// 学生账号注册
export async function studentRegister(apiParams) {
  return await apiSimpleWrapper({
    api: userApi.studentRegister,
    params: apiParams,
    notifyError: true,
    defaultValue: {},
  });
}

// 绑定账号
export async function wxBindUser(apiParams) {
  return await apiSimpleWrapper({
    api: userApi.bindUser,
    params: apiParams,
    notifyError: true,
    defaultValue: {},
  });
}

// 获取用户隐私协议
export async function getUserPrivacy() {
  return await apiSimpleWrapper({
    api: userApi.getPrivacy,
    params: {},
    notifyError: false,
    defaultValue: {},
  });
}

// 获取mq配置信息
export async function getPlatformConfig(decrypt = true) {
  const configStr = await apiSimpleWrapper({
    api: userApi.getPlatformConfig,
    params: {},
    notifyError: false,
    defaultValue: '',
  });
  return decrypt ? decryptConfig(configStr) : configStr;
}

// 解密平台配置
export function decryptConfig(configStr) {
  try {
    const temp = {};
    if (!configStr) {
      return temp;
    }
    const result = configStr.slice(10, -20);
    const decryptStr = weAtob(result);
    return decryptStr ? JSON.parse(decryptStr) : {};
  } catch (e) {
    console.log(e);
    return {};
  }
}

export function removeAllStorage() {
  Object.keys(USER_KEY_OBJ).forEach((key) => {
    uni.removeStorageSync(USER_KEY_OBJ[key]);
  });
  // 刷新登录状态
  sheep.$store('user').setToken('');
}

// 没有获取到用户信息，代表不合法
export async function isTokenValid(clear = true) {
  // 用户token
  const token = uni.getStorageSync(USER_KEY_OBJ.USER_TOKEN);
  // 用户平台host
  const userPlatformHost = uni.getStorageSync(USER_KEY_OBJ.USER_PLATFORM_HOST);

  if (!token || !userPlatformHost) {
    clear && removeAllStorage();
    return false;
  }

  const userInfo = await sheep.$store('user').getInfo(true);
  if (!userInfo) {
    clear && removeAllStorage();
    return false;
  }
  return true;
}

export async function getUserOpenInfo(codeStr) {
  const openInfo = await getOpenInfo(codeStr, true);
  console.log('getOpenId', openInfo);
  // 有openid代表获取成功
  // 其他信息未关联平台信息时，没有返回
  if (openInfo?.openid) {
    storeOpenId(openInfo);
    return true;
  }
  return false;
}

/**
 *
 * 存储用户信息
 *
 * 示例如下：
 * {
 *     "id": 2,
 *         "openid": "oiFao60LWiCKxADBeNVn14QfYdiU",
 *         "platform_id": null,
 *         "school_id": null,
 *         "login_name": null,
 *         "name": null,
 *         "active": null,
 *         "created_at": "2024-03-21 16:45:49",
 *         "updated_at": "2024-03-21 16:45:49"
 * }
 */
export function storeOpenId(openInfo = {}, keys = []) {
  keys = keys.length ? keys : Object.keys(openInfo);
  keys.forEach((key) => {
    if (STORE_KEY_LIST?.includes(key)) {
      // 空值覆盖
      uni.setStorageSync(key, openInfo[key]);
    }
  });
}

export function refreshPlatformInfo(platformInfo) {
  const key = ['school_id', 'platform_id', 'login_name', 'domain_name'];
  storeOpenId(platformInfo, key);
}

/**
 * 获取发起mqtt链接的协议
 */
export function mqttProtocol(https = true) {
  const currentPlatformInfo = sheep.$platform;
  console.log('mqttProtocol', https, currentPlatformInfo?.platform);
  // H5 or 小程序
  if (currentPlatformInfo?.platform === 'miniProgram') {
    return https ? 'wxs' : 'wx';
  } else {
    return https ? 'wss' : 'ws';
  }
}

/**
 * 拼接mqtt地址
 */
export function mqttInfo(hostInfo = {}) {
  let { username, password, ws_port, ws_path, host } = hostInfo;

  // host使用当前用户登录的平台地址
  host = uni.getStorageSync(USER_KEY_OBJ.USER_PLATFORM_HOST);

  let url = '';
  if (username && password && ws_port && host) {
    const protocol = mqttProtocol(!isIPv4Address(host));
    url = `${protocol}://${host}/${ws_path}`;
  }
  return {
    connectUrl: url,
    username,
    password,
  };
}

/**
 * 检测选择学校后 网络是否可达
 */
export function isNetReachable() {
  return new Promise((resolve) => {
    userApi
      .checkNetwork()
      .then((res) => {
        console.log('isNetReachable', res);
        resolve(true);
      })
      .catch(() => {
        resolve(false);
      });
  });
}

export function useLogin() {
  return {};
}
