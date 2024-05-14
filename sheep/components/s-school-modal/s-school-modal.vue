<template>
  <!-- 规格弹窗 -->
  <su-popup
    :show="isShow"
    round="16"
    :showClose="true"
    :space="27"
    :is-mask-click="false"
    @close="closeSchoolModal"
    title="选择学校"
  >
    <view class="select-school-wrap" id="indexed-list-content">
      <uni-search-bar
        placeholder="请输入学校名称"
        @confirm="search"
        :focus="false"
        cancel-button="none"
        v-model="searchValue"
        @input="input"
        @cancel="cancel"
        @clear="clear"
      >
      </uni-search-bar>

      <view class="index-bar fixed flex flex-col justify-center" v-show="!searchValue">
        <view
          class="bar-item col-b-title-5 flex align-center justify-center"
          v-for="(letter, index) in filteredLetters"
          :key="index"
          :class="{ active: letter === currentLetter }"
          @tap="handleTapLetter(letter)"
        >
          {{ letter }}
        </view>
      </view>

      <scroll-view
        :scroll-y="true"
        :scroll-into-view="currentLetter"
        :bounces="false"
        class="alphabet-search f-s-17 col-b-title"
        @scroll="handleScroll"
        @scrolltolower="handleScrollLower"
      >
        <view class="list-wrap" v-if="!searchValue">
          <view class="list-item" v-for="item in filteredList" :key="item.id" :id="item.id">
            <view class="list-title">{{ item.id }}</view>

            <view
              class="school-container"
              v-for="school in item.data"
              :key="school.id"
              @tap="handleSelect(school)"
            >
              <view class="school-name">{{ school.name }}</view>
            </view>
          </view>
        </view>
        <!--有搜索内容-->
        <view v-else class="list-wrap">
          <view
            class="list-item"
            v-for="(item, index) in filteredList"
            :key="index"
            @tap="handleSelect(item)"
          >
            <view class="school-name">{{ item.name }}</view>
          </view>
        </view>
      </scroll-view>
    </view>
  </su-popup>
</template>
<script>
  export default {
    options: { styleIsolation: 'shared' },
  };
</script>
<script setup>
  import {
    computed,
    toRefs,
    ref,
    onMounted,
    defineEmits,
    watch,
    getCurrentInstance,
    nextTick,
  } from 'vue';
  import sheep from '@/sheep';
  import { closeSchoolModal } from '@/sheep/hooks/useModal';
  import { throttle } from 'lodash';

  const emits = defineEmits(['handleSelect']);
  const props = defineProps({
    schoolList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 弃用，不支持动态设置id，uni.createSelectorQuery查询不到
    domId: {
      type: String,
      default: 'indexed-list-content',
    },
  });

  // 定义高度
  const HEIGHT_VARS = {
    TITLE: 28,
    CHILD: 48,
    BOTTOM: 8,
  };

  // 属性
  const { schoolList, domId } = toRefs(props);

  const modalStore = sheep.$store('modal');
  // 弹窗显示
  const isShow = computed(() => modalStore.selectSchool);
  // 搜索值
  const searchValue = ref('');
  //当前选中的字母
  const currentLetter = ref('');
  // 字母索引数组
  const indexLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  // 是否为点击字母跳转
  const isTapLetter = ref(false);
  // 高度
  const totalHeight = ref(0);
  // 是否滚动到底部
  const isScrollEnd = ref(false);
  // 当前引用实例
  const appInstance = getCurrentInstance().proxy;
  // 区域高度，包含搜索+选择区域
  const viewHeight = ref(0);

  // 关闭时的逻辑
  watch(isShow, (val) => {
    if (!val) {
      searchValue.value = '';
      isTapLetter.value = false;
      isScrollEnd.value = false;
      initLetter();
    }
    // 存在
    if (val) {
      nextTick(() => {
        getViewRect();
      });
    }
  });

  // 列表需要显示的数据
  const filteredList = computed(() => {
    if (searchValue.value) {
      return schoolList.value.filter((item) => item.name?.includes(searchValue.value)) || [];
    }

    return formatData(schoolList.value);
  });

  // 初始化当前选中
  function initLetter() {
    const list = formatData(schoolList.value);
    const letters = filterLetterFn(list);
    setCurrentLetter(letters?.length ? letters[0] : '');
  }

  // 初始字母的高度
  function initHeight(list) {
    const len = list?.length;
    let total = 0;
    for (let i = 0; i < len; i++) {
      const temp = list[i];
      const childLen = temp?.data?.length;
      //  标题的高度+margin-bottom+子项高度 * len
      let totalHeight = HEIGHT_VARS.TITLE + HEIGHT_VARS.BOTTOM + HEIGHT_VARS.CHILD * childLen;
      // 前一个的结束（+1个像素）为下一个的开始，
      const start = i > 0 ? list[i - 1]?.end : 0;
      // 结束为开始加上当前高度
      const end = start + totalHeight;
      temp.start = start;
      temp.end = end;
      // 总高度
      total += totalHeight;
      list[i] = temp;
    }
    console.log('initHeight', list, total);
    return { list, total };
  }

  // 计算letter位置
  function refreshLetterPlace() {}

  // 过滤没有数据的字母
  function filterLetterFn(dataList) {
    const list = [];
    indexLetters.forEach((letter) => {
      const data = dataList.find((item) => item.id === letter) || {};
      if (data && data?.data?.length) {
        list.push(letter);
      }
    });
    return list;
  }

  // 需要显示的字母，只显示有数据的
  const filteredLetters = computed(() => {
    return filterLetterFn(filteredList.value);
  });

  /**
   * 格式化数据
   */
  function formatData(data) {
    const result = [];
    indexLetters.forEach((letter) => {
      let temp = { id: letter, data: [] };
      temp.data = data.filter((item) => item.first === letter) || [];
      const len = temp.data.length;
      if (temp.data && len) {
        result.push(temp);
      }
    });

    const { total, list } = initHeight(result);
    totalHeight.value = total;
    return list;
  }

  // 搜索
  function search(res) {
    uni.showToast({
      title: '搜索：' + res.value,
      icon: 'none',
    });
  }

  function input() {}

  function cancel() {}

  function clear() {}

  function setCurrentLetter(letter, tap = false) {
    if (tap) {
      isTapLetter.value = true;
    }
    // 反选
    currentLetter.value = letter;
  }

  function handleTapLetter(letter) {
    getViewRect();
    setCurrentLetter(letter, true);
  }

  // 选择学校
  function handleSelect(item) {
    emits('handleSelect', item);
    closeSchoolModal();
  }

  // 节流处理滚动事件
  const throttleScroll = throttle(scrollHandler, 100);

  function handleScroll(e) {
    throttleScroll.call(null, e);
  }

  function handleScrollLower() {
    console.log('handleScrollLower');
    isScrollEnd.value = true;
  }

  function scrollHandler(e) {
    const scrollTop = e?.detail?.scrollTop;
    // 滚动区域可视高度
    const scrollViewHeight = viewHeight?.value ? viewHeight.value - 72 : 558;
    console.log(
        'scrollHandler',
        isScrollEnd.value,
        isTapLetter.value,
        scrollTop,
        totalHeight.value,
    );
    if (scrollTop + scrollViewHeight >= totalHeight.value) {
      return false;
    }

    if (isScrollEnd.value) {
      isScrollEnd.value = false;
      return false;
    }

    // 是点击字母滚动
    if (isTapLetter.value) {
      isTapLetter.value = false;
      return false;
    }

    const len = filteredList?.value.length;
    let findLetter = '';
    for (let i = 0; i < len; i++) {
      const temp = filteredList.value[i];
      if (scrollTop >= temp.start && scrollTop < temp.end) {
        findLetter = temp?.id;
        break;
      }
    }

    findLetter && setCurrentLetter(findLetter);
  }

  function getViewRect() {
    uni
      .createSelectorQuery()
      .in(appInstance)
      .select(`#indexed-list-content`)
      .boundingClientRect((ret) => {
        viewHeight.value = ret?.height ? ret?.height : 0;
        console.log('init viewHeight', viewHeight.value);
      })
      .exec();
  }

  watch(
    schoolList,
    () => {
      initLetter();
    },
    { immediate: true },
  );
</script>
<style lang="scss" scoped>
  .select-school-wrap {
    height: pxToRpx(630);

    :deep(.uni-searchbar) {
      padding: 16px;
      height: 40px;
    }

    .alphabet-search {
      height: pxToRpx(558);
      padding: 0 16px;
      box-sizing: border-box;

      .list-wrap {
        .list-item {
          width: calc(100% - 16px);
          margin-bottom: 8px;

          .school-name {
            height: 48px;
            line-height: 48px;
            font-size: 17px;
            color: $title;
          }
        }

        .list-title {
          height: 20px;
          line-height: 20px;
          font-size: 14px;
          color: rgba(26, 29, 52, 0.45);
          margin-bottom: 8px;
        }
      }
    }

    .index-bar {
      right: 16px;
      top: pxToRpx(120);
      height: pxToRpx(558);
      z-index: 100;

      .bar-item {
        width: 16px;
        height: 16px;
        font-size: 14px;
        margin-bottom: 2px;

        &.active {
          background: $blue;
          border-radius: 50%;
          color: $white;
        }
      }
    }
  }
</style>
