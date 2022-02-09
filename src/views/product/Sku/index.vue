<template>
  <div>
    <!-- 表格 -->
    <el-table style="width: 100%" border :data="records">
      <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
      <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width"></el-table-column>
      <el-table-column prop="prop" label="默认图片" width="110">
        <template v-slot="{row}">
          <img :src="row.skuDefaultImg" style="width:80px;height:80px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)" width="80"></el-table-column>
      <el-table-column prop="price" label="价格(元)" width="80"></el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template v-slot="{row}">
          <el-button type="success" title="下架" icon="el-icon-bottom" size="mini" v-if="row.isSale===0" @click="sale(row)"></el-button>
          <el-button type="info" title="上架" icon="el-icon-top" size="mini" v-else @click="cancel(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      style="textAlign:center"
      @current-change="getSkuList"
      @size-change="handleSizeChange">
    </el-pagination>
    <!-- 抽屉效果 -->
    <el-drawer :visible.sync="drawer" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{skuInfo.price}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
            <el-tag type="success" v-for="attr in skuInfo.skuAttrValueList" 
            :key="attr.id" style="margin:5px">{{attr.attrId}}-{{attr.valueId}}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="300px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" style="width:100%;height:100%">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      page:1,  // 当前页数
      limit:10, //当前页面有几条参数
      records:[],
      total:0,
      skuInfo:{},  //存储sku信息
      drawer: false
    }
  },
  mounted(){
    this.getSkuList()
  },
  methods:{
    // 获取sku列表的方法
    async getSkuList(pages=1){
      this.page = pages
      const {page,limit} = this
      let result = await this.$API.sku.reqSkuList(page,limit);
      if (result.code === 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    // 展示数据条数回调
    handleSizeChange(limit){
      this.limit = limit
      this.getSkuList()
    },
    // 上架
    async sale(row){
      let result = await this.$API.sku.reqSale(row.id)
      if (result.code === 200) {
        row.isSale = 1
        this.$message({message:'上架成功',type:'success'})
      }
    },
    // 下架
    async cancel(row){
      let result = await this.$API.sku.reqCancel(row.id)
      if (result.code === 200) {
        row.isSale = 0
        this.$message({message:'下架成功',type:'success'})
      }
    },
    edit(){
      this.$message({message:'正在开发中',type:'info'})
    },
    // 获取sku详情
    async getSkuInfo(row){
      let result = await this.$API.sku.reqSkuById(row.id)
      if (result.code === 200) {
        this.drawer = true
        this.skuInfo = result.data
      }
    }
  }
}
</script>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
  .el-carousel__button {
    width: 10px;
    height: 10px;
    background-color: red;
    border-radius: 50%;
  }
</style>
<style scoped>
  .el-row .el-col-5 {
    font-size: 18px;
    text-align: right;
  }
  .el-col {
    margin: 10px 10px;
  }
</style>
