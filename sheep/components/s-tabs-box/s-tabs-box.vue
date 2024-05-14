<template>
  <view class="flex-space-b h-100p">
    <view
      class="tabs-box h-100p p-4 border-box flex f-s-14 relative"
      v-show="tabList.length"
      :class="type"
    >
      <view
        class="box-item h-100p flex align-center justify-center col-b-title-7 pointer p-l-8 p-r-8 w-34 m-r-40"
        v-for="item in tabList"
        :key="item.value"
        :class="{ active: activeTab === item.value }"
        @click="changeTab(item)"
      >
        <text :class="{ 'active-name': activeTab === item.value }" class="f-s-17">{{
          item.name
        }}</text>
      </view>
      <view
        class="linear-active h-4 w-50 radius-sm absolute"
        :style="{ left: offsetLeft + 'px', width: linearWidth + 'px' }"
      ></view>
    </view>
  </view>
</template>
<script>
  export default {
    name: 'TabsBox',
    props: {
      tabList: {
        default: () => [],
        type: Array,
      },
      defaultTab: {
        default: '',
        type: [String, Number],
      },
      /*
  type:风格类型 ,可选 card，linear
  */
      type: {
        default: 'linear',
        type: String,
      },
    },
    data() {
      return {
        activeTab: '',
        // 线条偏移距离和长度
        offsetLeft: 0,
        linearWidth: 0,
      };
    },
    computed: {},
    watch: {
      defaultTab: {
        handler(newVal) {
          this.activeTab = this.defaultTab;
        },
        immediate: true,
      },
    },
    mounted() {
      this.getOffsetLeft();
    },
    methods: {
      getOffsetLeft() {
        this.$nextTick(() => {
          const query = uni.createSelectorQuery().in(this).select('.active-name');
          query
            .fields(
              {
                rect: true,
                size: true,
              },
              (res) => {
                if (res) {
                  this.offsetLeft = res.left;
                  this.linearWidth = res.width;
                }
              },
            )
            .exec();
        });
      },
      changeTab(item) {
        this.activeTab = item.value;
        this.$emit('update:defaultTab', this.activeTab);
        this.$emit('changeTab', item);
        this.getOffsetLeft();
      },
    },
  };
</script>
<style scoped lang="scss">
  .tabs-box {
    width: min-content;
    box-sizing: border-box;
  }
  .linear {
    .linear-active {
      background: $blue;
      bottom: 0;
      transition: 0.3s all;
    }
    .active-name {
      color: $blue;
      font-weight: bold;
    }
  }
  .dropdown-active {
    background-color: #eaf7fe;
    color: #56bcf9;
  }
</style>
