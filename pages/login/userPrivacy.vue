<template>
  <s-layout title="用户协议与隐私政策" class="account-login-page">
    <view class="p-16 f-s-17 f-w-400 col-b-title">
      <view class="flex flex-col f-s-14 col-b-title-7 m-b-24">
        <text class="datetime m-b-8">更新日期：{{ timeFormat(params.publish_time, 1) }}</text>
        <text class="datetime">发布日期：{{ timeFormat(params.update_time, 1) }}</text>
      </view>

      <view>
        <view class="slogan f-w-600 m-b-8">{{ params.slogan }}</view>
        <view class="main-desc m-b-24 l-h-24">{{ params.main_desc }}</view>

        <view class="f-w-600 m-b-24">用户协议</view>
        <view class="protocol-list">
          <view v-for="(protocol, index) in params.protocol_list" :key="index">
            <view class="f-w-600 m-b-8">{{ index + 1 }}.{{ protocol.title }}</view>
            <!--对标题的描述-->
            <view v-if="protocol.summary && protocol.summary.length" class="m-b-8">
              <view v-for="(smy, sIndex) in protocol.summary" :key="sIndex" class="m-b-8">{{
                smy
              }}</view>
            </view>

            <view v-for="(item, i) in protocol.desc" class="m-b-24 l-h-24" :key="i">

              <view v-if="item.content" class="m-b-8">{{ `${index + 1}.${i + 1}` }}{{ item.content }}</view>
              <!--补充描述-->
              <view class="m-b-8" v-if="item.summary && item.summary.length">
                <view
                    v-for="(subSummary, subSummaryIndex) in item.summary"
                    :key="subSummaryIndex"
                    class="m-b-8"
                >{{ subSummary }}</view
                >
              </view>
              <!--补充条款-->
              <view class="m-t-8" v-if="item.sub && item.sub.length">
                <view v-for="(subInfo, subIndex) in item.sub" :key="subIndex" class="m-b-8">{{
                  `${subIndex + 1})${subInfo}`
                }}</view>
              </view>

              <!--补充结尾-->
              <view class="m-t-8" v-if="item.end && item.end.length">
                <view v-for="(endInfo, endIndex) in item.end" :key="endIndex" class="m-b-8">{{
                  endInfo
                }}</view>
              </view>
            </view>
          </view>
        </view>

        <view class="f-w-600 m-b-24">隐私政策</view>
        <view class="m-b-24"
          >我们非常重视用户个人信息的保护。鉴于此，我们根据相关法律法规规定，制定了本政策，以帮助您了解我们将如何收集、使用并保护您的个人信息。</view
        >
        <view class="m-b-24"
          >在使用本软件前，请仔细阅读并了解本政策。如您不同意本政策的部分或全部内容，或对本政策内容有任何疑问，我们建议您暂停进一步操作，并可以与我们取得联系（联系方式详见文末）。您在同意课搭子小程序的隐私政策之时，或实际使用本软件的行为将视为您已阅读并同意本政策条款。</view
        >
        <view class="m-b-24">
          <view class="f-w-600 m-b-8">目录</view>
          <view class="m-b-8">1. 定义</view>
          <view class="m-b-8">2. 我们如何收集和使用您的信息</view>
          <view class="m-b-8">3. 我们如何共享、转让、公开披露您的信息</view>
          <view class="m-b-8">4. 事先征得授权同意的例外</view>
          <view class="m-b-8">5. 我们如何存储、保护您的个人信息</view>
          <view class="m-b-8">6. 您如何访问和管理数字隐私</view>
          <view class="m-b-8">7. 未成年人隐私保护特别约定</view>
          <view class="m-b-8">8. 隐私政策的变更</view>
          <view class="m-b-8">9. 联系我们</view>
        </view>

        <view class="privacy-list">
          <view v-for="(privacy, privacyIndex) in params.privacy_list" :key="privacyIndex">
            <view class="f-w-600 m-b-8">{{ privacyIndex + 1 }}.{{ privacy.title }}</view>
            <!--对标题的描述-->
            <view v-if="privacy.summary && privacy.summary.length" class="m-b-8">
              <view v-for="(smy, sIndex) in privacy.summary" :key="sIndex" class="m-b-8">{{
                smy
              }}</view>
            </view>

            <view v-for="(item, i) in privacy.desc" class="m-b-24 l-h-24" :key="i">
              <view v-if="item.content" class="m-b-8">{{ `${privacyIndex + 1}.${i + 1}` }}{{ item.content }}</view>

              <!--补充描述-->
              <view class="m-b-8" v-if="item.summary && item.summary.length">
                <view
                    v-for="(subSummary, subSummaryIndex) in item.summary"
                    :key="subSummaryIndex"
                    class="m-b-8"
                >{{ subSummary }}</view
                >
              </view>

              <!--补充条款-->
              <view class="m-t-8" v-if="item.sub && item.sub.length">
                <view v-for="(subInfo, subIndex) in item.sub" :key="subIndex" class="m-b-8">{{
                  `${subIndex + 1})${subInfo}`
                }}</view>
              </view>
              <!--补充结尾-->
              <view class="m-t-8" v-if="item.end && item.end.length">
                <view v-for="(endInfo, endIndex) in item.end" :key="endIndex" class="m-b-8">{{
                  endInfo
                }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </s-layout>
</template>
<script setup>
  import { computed, reactive } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { getUserPrivacy } from '@/sheep/hooks/useLogin';
  import { timeFormat } from '@/sheep/helper/time';

  onLoad(() => {
    getData();
  });

  const params = reactive({
    publish_time: '',
    update_time: '',
    slogan: '',
    main_desc: '',
    protocol_list: [],
    privacy_list: [],
  });

  async function getData() {
    const { publish_time, update_time, slogan, main_desc, protocol_list, privacy_list } =
      await getUserPrivacy();

    params.publish_time = publish_time;
    params.update_time = update_time;
    params.slogan = slogan;
    params.main_desc = main_desc;
    params.protocol_list = protocol_list;

    // 隐私数据
    params.privacy_list = privacy_list;
  }
</script>
