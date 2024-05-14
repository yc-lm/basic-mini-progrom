import mqtt from 'mqtt/dist/mqtt';
import guid from '@/sheep/helper/guid';
import { isJson, isFunction } from '@/sheep/helper/utils';

const MQ_ON_CONNECT = 'MQ_ON_CONNECT';
const MQ_ON_MESSAGE = 'MQ_ON_MESSAGE';
const MQ_ON_ERROR = 'MQ_ON_ERROR';
const MQ_ON_CLOSE = 'MQ_ON_CLOSE';
// 重连的事件
const MQ_ON_RECONNECT = 'MQ_ON_RECONNECT';

export const EVENT_NAME = {
  connect: MQ_ON_CONNECT,
  message: MQ_ON_MESSAGE,
  error: MQ_ON_ERROR,
  close: MQ_ON_CLOSE,
  reconnect: MQ_ON_RECONNECT,
};

class MyMqtt {
  // 默认配置
  defaultConfig = {
    clean: true, // true: 清除会话, false: 保留会话
    connectTimeout: 4000, // 超时时间
  };

  eventCollection = {};

  supportEvent = ['connect', 'message', 'error', 'close', 'reconnect'];
  client = null;

  // 事件后缀名称
  constructor(connectUrl, options, event) {
    this.options = { ...this.defaultConfig, ...options, clientId: guid() };
    this.connectUrl = connectUrl;
    this.registerEvent(event);
  }

  connect() {
    this.client = mqtt.connect(this.connectUrl, this.options);
    this.addEvent();
  }

  registerEvent(eventCollection) {
    const eventLen = this.supportEvent.length;

    for (let i = 0; i < eventLen; i++) {
      const eventName = this.supportEvent[i];

      const customCallback = eventCollection[eventName];
      if (customCallback && isFunction(customCallback)) {
        this.eventCollection[eventName] = customCallback;
      } else {
        this.eventCollection[eventName] = (e) => {
          console.log('in  this.eventCollection,', eventName);
          // 触发全局事件
          uni.$emit(EVENT_NAME[eventName], e);
        };
      }
    }
  }

  addEvent() {
    this.client?.on('reconnect', this.onReconnect.bind(this));
    this.client?.on('error', this.onError.bind(this));
    this.client?.on('connect', this.onConnect.bind(this));
    this.client?.on('close', this.onClose.bind(this));
    // 监听消息
    this.client.on('message', this.onMessageHandler.bind(this));
  }

  removeEvent() {
    this.client?.off('reconnect', this.onReconnect.bind(this));
    this.client?.off('error', this.onError.bind(this));
    this.client?.off('connect', this.onConnect.bind(this));
    this.client?.off('close', this.onClose.bind(this));
    this.client?.off('message', this.onMessageHandler.bind(this));
  }

  onMessageHandler(topic, message) {
    this.onMessage(topic, message.toString());
  }

  onReconnect(error) {
    console.log('正在重连:', error);
    this.eventCollection['reconnect'](error);
  }

  onConnect(e) {
    console.log('连接成功');
    this.eventCollection['connect'](e);
  }

  onError(error) {
    console.log('链接错误:', error);
    this.removeEvent();
  }

  onClose(error) {
    console.log('链接关闭:', error);
    this.removeEvent();
  }

  onMessage(topic, message) {
    try {
      const data = isJson(message) ? JSON.parse(message) : message;
      this.eventCollection['message']({ topic, message: data });
    } catch (error) {
      console.log(error);
    }
  }

  subscribe(topic, opt = {}) {
    this.client.subscribe(topic, opt, (error) => {
      if (error) console.log(error);
    });
  }

  unsubscribe(topic) {
    this.client?.unsubscribe(topic, (error) => {
      if (error) console.log(error);
    });
  }

  publish(topic, message, options = {}) {
    this.client?.publish(topic, JSON.stringify(message), options);
  }

  close() {
    this.client?.end();
  }
}

export default MyMqtt;
