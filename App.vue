<script setup>
  import { onLaunch, onShow, onError, onLoad, onUnload } from '@dcloudio/uni-app';
  import sheep, { ShoproInit } from './sheep';
  import { computed, watch, ref, onBeforeMount, onBeforeUnmount } from 'vue';
  import { useMqtt } from '@/sheep/hooks/useMqtt';
  import { getPlatformConfig, isTokenValid, mqttInfo } from '@/sheep/hooks/useLogin';
  import { showCourseModal } from '@/sheep/hooks/useModal';
  import { onMessage } from '@/sheep/business/courseMessage';

  const {
    connect,
    listenMessageArrive,
    removeMessageArrive,
    registerOnMessage,
    removeOnMessage,
    listenConnect,
    removeConnect,
    listenSubscribe,
    removeSubscribe,
    listenReconnect,
    removeReconnect,
  } = useMqtt();

  // mqtt客户端
  const mqClient = ref(null);
  // 是否在重连
  const isReconnect = ref(false);

  onShow(() => {
    // 隐藏原生导航栏 使用自定义底部导航
    uni.hideTabBar({
      success: () => {},
      //捕获报错，勿删
      fail: (error) => {
        console.log(error);
      },
    });

    // 加载Shopro底层依赖
    ShoproInit();
  });

  onError((err) => {
    console.log('AppOnError:', err);
  });

  onShow(() => {
    // #ifdef APP-PLUS
    // 获取urlSchemes参数
    const args = plus.runtime.arguments;
    if (args) {
    }

    // 获取剪贴板
    uni.getClipboardData({
      success: (res) => {},
    });
    // #endif
  });
  // 移除事件
  onUnload(() => {
    console.log('onUnload');
  });
  onBeforeMount(() => {
    console.log('onBeforeMount');
  });

  // 监听事件
  onLoad(() => {
    console.log('1111111');
  });
  // 用户是否登录
  const isLogin = computed(() => {
    return sheep.$store('user').isLogin;
  });

  // 监听登录状态的变化
  watch(
    isLogin,
    (newVal, oldVal) => {
      // 退出登录的情况
      if (!newVal && oldVal) {
        closeMqtt();
      }

      if (newVal) {
        // 如果已经创建，先关闭
        closeMqtt();
        registerEvent();
        createMqtt();
      }
    },
    { immediate: true },
  );

  // 监听mqtt重连的状态
  watch(isReconnect, (state) => {
    console.log('watch isReconnect state change', state);
    // 正在重连中
    if (state) {
      uni.showLoading({
        title: '网络异常',
        mask: true,
        fail: () => {
          uni.hideLoading();
        },
      });
    }
    // 链接成功
    if (!state) {
      uni.hideLoading();
    }
  });

  function closeMqtt() {
    if (mqClient.value) {
      mqClient.value?.close();
      mqClient.value = null;
      removeEvent();
    }
  }

  // 创建mq链接
  async function createMqtt() {
    // 判断token是否有效
    const tokenFlag = await checkTokenValid();
    if (tokenFlag) {
      // 获取mqtt配置
      const config = await getPlatformConfig();
      console.info('get platform config', config?.mqtt_web_info);
      const { connectUrl, username, password } = mqttInfo(config?.mqtt_web_info);
      if (connectUrl) {
        mqClient.value = connect(connectUrl, { username, password });
      } else {
        console.error('get platform config error', config);
      }
    }
  }

  function registerEvent() {
    listenMessageArrive(messageArriveHandler);
    registerOnMessage(onMessageHandler);
    listenConnect(onConnectSuccess);
    listenSubscribe(onReceiveSubscribe);
    listenReconnect(onReconnectHandler);
  }

  function removeEvent() {
    removeMessageArrive(messageArriveHandler);
    removeOnMessage(onMessageHandler);
    removeConnect(onConnectSuccess);
    removeSubscribe(onReceiveSubscribe);
    removeReconnect(onReconnectHandler);
  }

  // 没有获取到用户信息，代表不合法
  async function checkTokenValid() {
    return await isTokenValid();
  }

  // 接收其页面的消息，
  // 约定qos级别为2
  function messageArriveHandler(data) {
    // TODO 发送消息
    //mqClient.value?.publish(data?.topic, data?.payload, {qos: 2});
  }

  // 收到的mqtt消息
  function onMessageHandler(data) {
    console.log(data, 'onMessageHandler', data.message);
    // todo 需要处理的全局mqtt消息
    onMessage(data.message, data.topic);
  }

  // 重连的事件
  function onReconnectHandler(e) {
    isReconnect.value = true;
  }

  // 连接成功事件
  function onConnectSuccess() {
    // 重置状态
    isReconnect.value = false;
    // 需要处理全局监听的主题
    const value = sheep.$store('user').userInfo;
    subscribeDone('web/course/user/' + value?.user_id);
  }

  // 发送需要监听的主题
  function onReceiveSubscribe({ msg, isSubscribe = true }) {
    console.log('onReceiveSubscribe', msg, isSubscribe);
    if (isSubscribe) {
      subscribeDone(msg);
    } else {
      mqClient.value?.unsubscribe(msg);
    }
  }

  // 订阅主题
  function subscribeDone(topic) {
    mqClient.value?.subscribe(topic, { qos: 2 });
  }
</script>

<style lang="scss">
  @import '@/sheep/scss/index.scss';
</style>
