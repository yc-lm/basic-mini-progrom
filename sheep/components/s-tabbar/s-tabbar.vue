<template>
  <view class="u-page__item" v-if="tabbar?.list.length > 0">
    <su-tabbar
      :value="path"
      :fixed="true"
      :placeholder="true"
      :safeAreaInsetBottom="true"
      :inactiveColor="tabbar.color"
      :activeColor="tabbar.selectedColor"
    >
      <su-tabbar-item
        v-for="(item, index) in tabbar.list"
        :key="item.text"
        :text="item.text"
        :name="item.pagePath"
        @tap="sheep.$router.go(item.pagePath)"
      >
        <template v-slot:active-icon>
          <image class="u-page__item__slot-icon" :src="item.selectedIconPath"></image>
        </template>
        <template v-slot:inactive-icon>
          <image class="u-page__item__slot-icon" :src="item.iconPath"></image>
        </template>
      </su-tabbar-item>
    </su-tabbar>
  </view>
</template>

<script setup>
  import { computed, unref } from 'vue';
  import sheep from '@/sheep';
  const tabbar = {
    color: 'rgba(26,29,52,0.65)',
    selectedColor: '#2CABF8',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: '/pages/index/index',
        text: '课程',
        iconPath: '../../../static/img/bar-course.png',
        selectedIconPath: '../../../static/img/bar-course-select.png',
      },
      {
        pagePath: '/pages/message/message',
        text: '消息',
        iconPath: '../../../static/img/bar-message.png',
        selectedIconPath: '../../../static/img/bar-message-select.png',
      },
      {
        pagePath: '/pages/my/my',
        text: '我的',
        iconPath: '../../../static/img/bar-my.png',
        selectedIconPath: '../../../static/img/bar-my-select.png',
      },
    ],
  };
  const tabbarStyle = computed(() => {
    return {};
    const backgroundStyle = tabbar.value.background;
    if (backgroundStyle.type == 'color') return { background: backgroundStyle.bgColor };
    if (backgroundStyle.type == 'image')
      return {
        background: `url(${sheep.$url.cdn(
          backgroundStyle.bgImage,
        )}) no-repeat top center / 100% auto`,
      };
  });

  const getTabbarCenter = (index) => {
    if (unref(tabbar).mode !== 2) return false;
    return unref(tabbar).list % 2 > 0
      ? Math.ceil(unref(tabbar).list.length / 2) === index + 1
      : false;
  };

  const props = defineProps({
    path: String,
    default: '',
  });
</script>

<style lang="scss">
  .u-page {
    padding: 0;

    &__item {
      &__title {
        color: var(--textSize);
        background-color: #fff;
        padding: 15px;
        font-size: 15px;

        &__slot-title {
          color: var(--textSize);
          font-size: 14px;
        }
      }

      &__slot-icon {
        width: pxToRpx(22);
        height: pxToRpx(22);
      }
    }
  }
</style>
