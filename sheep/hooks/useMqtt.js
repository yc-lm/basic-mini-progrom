import Api, {EVENT_NAME} from '@/sheep/hooks/mqtt'

// 其它页面触发MQ消息
const MQ_SEND_MESSAGE = 'MQ_SEND_MESSAGE';
// 触发订阅消息的事件subscribe
const MQ_SUBSCRIBE_EVENT = 'MQ_SUBSCRIBE_EVENT';
function connect(url, options, event = {}) {
    const api = new Api(url, options, event);
    api.connect();
    return api;
}

// 其他页面发送mq消息
function sendMqMessage(message) {
    uni.$emit(MQ_SEND_MESSAGE, message)
}

// 监听其他页面mq消息
function listenMessageArrive(callback) {
    uni.$on(MQ_SEND_MESSAGE, callback)
}

// 移除监听mq消息
function removeMessageArrive(callback) {
    uni.$off(MQ_SEND_MESSAGE, callback)
}

// 其他页面监听全局ws消息
function registerOnMessage(callback) {
    uni.$on(EVENT_NAME.message, callback);
}

function removeOnMessage(callback) {
    uni.$off(EVENT_NAME.message, callback);
}

// 监听连接成功
function listenReconnect(callback) {
    uni.$on(EVENT_NAME.reconnect, callback);
}

function removeReconnect(callback) {
    uni.$off(EVENT_NAME.reconnect, callback);
}

// 监听连接成功
function listenConnect(callback) {
    uni.$on(EVENT_NAME.connect, callback);
}

function removeConnect(callback) {
    uni.$off(EVENT_NAME.connect, callback);
}

function listenSubscribe(callback) {
    uni.$on(MQ_SUBSCRIBE_EVENT, callback);
}

function removeSubscribe(callback) {
    uni.$off(MQ_SUBSCRIBE_EVENT, callback);
}

function sendMqSubscribe(message) {
    uni.$emit(MQ_SUBSCRIBE_EVENT, message)
}

export function useMqtt() {
    return {
        EVENT_NAME,
        sendMqMessage,
        connect,
        listenMessageArrive,
        removeMessageArrive,
        registerOnMessage,
        removeOnMessage,
        listenConnect,
        removeConnect,
        listenSubscribe,
        removeSubscribe,
        sendMqSubscribe,
        listenReconnect,
        removeReconnect
    };
}