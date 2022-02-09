<template>
  <el-card>
    <div slot="header" class="hearder">
      <div class="search-header">
        <span>线上热门搜索</span>
        <el-dropdown>
          <span>
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="12">
          <lineCharts></lineCharts>
        </el-col>
        <el-col :span="12">
          <lineCharts></lineCharts>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="排名" width="80"></el-table-column>
      <el-table-column prop="date" label="搜索关键字"></el-table-column>
      <el-table-column prop="date" label="用户数" sortable></el-table-column>
      <el-table-column prop="date" label="周涨幅" sortable></el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination layout="prev, pager, next" :total="1000" class="pagination"></el-pagination>
  </el-card>
</template>

<script>
import lineCharts from "./lineCharts";
export default {
  components: { lineCharts },
  data() {
      return {
          tableData:[]
      }
  },
};
</script>

<style scoped>
.search-header {
  display: flex;
  justify-content: space-between;
}
.hearder {
  border-bottom: 1px solid #ccc;
  padding: 5px 0;
}
.pagination {
    text-align: right;
}
</style>