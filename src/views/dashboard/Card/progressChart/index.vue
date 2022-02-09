<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
// 引入echarts
import * as echarts from "echarts";
export default {
  name: "LineChart",
  mounted() {
    let lineCharts = echarts.init(this.$refs.charts);
    lineCharts.setOption({
      xAxis: {
        // 隐藏x轴
        show: false,
        // 设置最大值，最小值
        min:0,
        max:100
      },
      yAxis: {
        // 隐藏y轴
        show: false,
        type: "category",
      },
      series: [
        {
          type: "bar",
          data: [78],
          color: "yellowgreen",
          barWidth: 20,
          showBackground:true,
          // 背景色
          backgroundStyle:{
            color:"#eee"
          },
          // 文本标签
          label:{
            formatter:"|",
            show:true,
            position:"right"
          }
        }
      ],
      // 布局的调整
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    });
  },
};
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>