<template>
  <view class="charts-box">
     <qiun-data-charts
         type="column"
         :opts="opts"
         :canvas2d="true"
         :canvas-id="canvasId"
         :chartData="chartData"
       />
  </view>
</template>
<script setup>
  import { computed,ref ,watch } from 'vue'
  const props = defineProps({

    /**
     * series 数据
     * name:可选，series 名称，用于提示和 legend 显示用
     * data:必选，series 数据，用于展示图表
     * 例如：
     [
       {
       name: '时长',
       data: [1, 2]
       }
     ]
     */
    series:{
      default:()=>{
        return  []
      },
      type:Array
    },
    /**
     * x轴数据，
     * 例如：
     ['周一','周二']
     */
    categories:{
      default:()=>{
        return []
      },
      type:Array
    },
    //是否绘制Y轴
   yAxisDisabled:{
     default:true,
     type:Boolean
   },
    //是否绘制Y轴网格线
    yAxisGrid:{
      default:true,
      type:Boolean
    },
    //
    /**
     * 柱状图类型，
     * 例如：
     'group'分组柱状图,'stack'堆叠柱状图,'meter'温度计式图
     */
    barType:{
      default:'group',
      type:String
    },
    canvasId:{
      default:'',
      type:String
    }
  })
  const opts = computed(()=>{
    return setOptions()
  })
  const chartData = computed(()=>{
    return setData()
  })
  const setOptions = function(){
    return {
      color: ["#60E07B"],
      padding: [15,15,0,5],
      enableScroll: false,
      legend: {
        show: false
      },
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        disabled:props.yAxisDisabled,
        disableGrid:props.yAxisGrid,
        data: [ ],
        splitNumber: 4
      },
      extra: {
        column: {
          type: props.barType,
          width: 30,
          activeBgColor: "#000000",
          activeBgOpacity: 0.08,
          seriesGap: 8,
          barBorderRadius: [
            4,
            4,
            4,
            4
          ]
        }
      }
    }
  }
  const setData =function (){
    const res  = {
      categories:props.categories,
      series:props.series
    }
    return  JSON.parse(JSON.stringify(res))
  }
</script>
<style scoped lang="scss">
  .charts-box {
    width: 100%;
    height: pxToRpx(240);
  }
</style>
