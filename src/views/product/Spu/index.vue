<template>
  <div>
    <el-card style="margin:20px 0">
      <CategroySelect @getCategoryId="getCategoryId" :show="scene!=0"></CategroySelect>
    </el-card>
    <el-card>
      <!-- 底部有三部分进行切换 -->
      <div v-show="scene===0">
        <!-- 展示spu列表的结构 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加spu</el-button>
        <el-table style="width: 100%;margin:20px 0" border :data="records">
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width"></el-table-column>
          <el-table-column prop="description" label="spu描述" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row}">
              <HintButton type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)"></HintButton>
              <HintButton type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)"></HintButton>
              <HintButton type="info" icon="el-icon-info" size="mini" title="查看当前spu的sku列表" @click="handler(row)"></HintButton>
              <el-popconfirm :title="`确定删除${row.valueName}吗?`" @onConfirm="deleteSpu(row)" >
                <HintButton type="danger" icon="el-icon-delete" size="mini" title="删除spu" slot="reference"></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          style="textAlign:center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout=" prev, pager, next, jumper, ->,sizes,total"
          :total="total"
          @current-change="getSpuList"
          @size-change="handleSizeChange">
        </el-pagination>
      </div>
      <SpuForm v-show="scene===1" @changeScene="changeScene" ref="spu"/>
      <SkuForm v-show="scene===2" @changeScenes="changeScenes" ref="sku"/>
    </el-card>
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :close="close">
      <el-table :data="skuList" style="width: 100%" border v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
        <el-table-column prop="price" label="价格" width="width"></el-table-column>
        <el-table-column prop="weight" label="重量" width="width"></el-table-column>
        <el-table-column prop="prop" label="默认图片" width="width">
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" style="width:100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
  name: "Spu",
  components:{SpuForm,SkuForm},
  data() {
    return {
      category1Id:"",
      category2Id:"",
      category3Id:"",
      show:true,
      page:1,
      limit:3,
      total:1,
      // spu列表数据
      records:[],
      scene: 0,  //0 展示spu数据列表   1 添加spu|修改spu  2 添加sku
      dialogTableVisible: false,
      spu:{},
      skuList:[], //存储sku列表的数据
      loading:true
    }
  },
  methods:{
    // 三级联动的自定义事件
    getCategoryId(cForm){
      const { category1Id, category2Id, category3Id } = cForm;
      this.category1Id = category1Id;
      this.category2Id = category2Id;
      this.category3Id = category3Id;
      this.getSpuList()
    },
    // 获取Spu列表数据的方法
    async getSpuList(pages=1){
      this.page = pages
      const {page,limit,category3Id} = this
      let result = await this.$API.spu.reqSpuList(page,limit,category3Id)
      if (result.code == 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    // 点击分页器第几页的回调
    // handleCurrentChange(page){
    //   this.page = page
    //   this.getSpuList()
    // }
    // 分页器某一页展示多少条数据发生变化的回调
    handleSizeChange(limit){
      this.limit = limit
      this.getSpuList()
    },
    // 添加spu按钮的回调
    addSpu(){
      this.scene=1
      // 通知子组件发请求  品牌 属性
      this.$refs.spu.addSpuData(this.category3Id)
    },
    // 修改spu
    updateSpu(row){
      this.scene=1
      // 在父组件中可以通过$refs获取子组件的数据与方法
      this.$refs.spu.initSpuData(row)
    },
    // 自定义事件
    changeScene({scene,flag}){
      this.scene = scene
      // 再次获取spu列表的数据  判断是保存还是修改
      if (flag=="修改") {
        this.getSpuList(this.page)
      }else{
        this.getSpuList()
      }
    },
    // 删除spu
    async deleteSpu(row){
      let result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result.code === 200) {
        this.$message({type:"success",message:"删除成功"})
        this.getSpuList(this.records.length>1?this.page:this.page-1)
      }
    },
    // 添加sku按钮的回调
    addSku(row){
      this.scene = 2
      this.$refs.sku.getData(this.category1Id,this.category2Id,row)
    },
    // 通知父组件修改场景
    changeScenes(){
      this.scene = 0
    },
    // 查看sku按钮的回调
    async handler(row){
      this.dialogTableVisible = true
      this.spu = row
      let result = await this.$API.spu.reqSkuList(row.id)
      if (result.code === 200) {
        this.skuList = result.data
        this.loading = false
      }
    },
    // 关闭对话框的回调
    close(){
      this.loading = true
      this.skuList = []
    }
  }
};
</script>

<style scoped>
</style>
