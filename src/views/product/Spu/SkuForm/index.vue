<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称"> {{spu.spuName}} </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" type="number" v-model="skuInfo.price" style="width:150px"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input placeholder="规格描述" type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="attr.attrName" v-for="attr in attrInfoList" :key="attr.id">
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="attrValue in attr.attrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id">
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="80" align="center"></el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{row}">
              <img :src="row.imgUrl" style="width:100px;height:100px">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width" align="center">
            <template slot-scope="{row}">
              <el-button type="primary" v-if="row.isDefault===0" @click="changeDefault(row)">设置为默认</el-button>
              <el-button type="success" v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      skuInfo: {
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        price: 0,
        skuName: "",
        skuDesc: "",
        weight: "",
        // 平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // }
        ],
        // 默认图片
        skuDefaultImg: "",
        // 收集图片的字段
        skuImageList: [
          // {
          //   imgName: "",
          //   imgUrl: "",
          //   isDefault: "",
          //   spuImgId: 0,
          // }
        ],
        // 销售属性
        skuSaleAttrValueList: [
          // {
          //   saleAttrId: 0,
          //   saleAttrValueId: 0
          // }
        ],
      },
      spu:{},
      spuImageList: [],
      spuSaleAttrList: [],
      attrInfoList: [],
      // 收集图片资源的字段
      imageList:[]
    }
  },
  methods: {
    // 获取sku数据
    async getData(category1Id, category2Id, row) {
      // 收集父组件给予的数据
      this.skuInfo.category3Id = row.category3Id
      this.skuInfo.spuId = row.id
      this.skuInfo.tmId = row.tmId
      this.spu = row
      // 获取图片数据
      let result = await this.$API.spu.reqSpuImageList(row.id);
      if (result.code === 200) {
        let list = result.data;
        list.forEach(item => {
          item.isDefault = 0
        });
        this.spuImageList = list
      }
      // 获取销售属性的数据
      let result1 = await this.$API.spu.reqSpuSaleAttrList(row.id);
      if (result1.code === 200) {
        this.spuSaleAttrList = result1.data;
      }
      //获取平台属性的数据
      let result2 = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        row.category3Id
      );
      if (result2.code === 200) {
        this.attrInfoList = result2.data;
      }
    },
    // table表格复选框按钮事件
    handleSelectionChange(selection){
      this.imageList = selection
    },
    // 设置默认排他操作
    changeDefault(row){
      this.spuImageList.forEach(item=>{
        item.isDefault = 0
      })
      row.isDefault = 1
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 取消
    cancel(){
      this.$emit('changeScenes',0)
      Object.assign(this._data,this.$options.data())
    },
    // 保存按钮
    async save(){
      // 整理参数
      // 整理平台属性
      const {attrInfoList, skuInfo,spuSaleAttrList,imageList} = this
      // 整理平台数据方法1
      // attrInfoList.forEach(item=>{
      //   if (item.attrIdAndValueId) {
      //     const [attrId,valueId] = item.attrIdAndValueId.split(":")
      //     let obj = {attrId,valueId}
      //     skuInfo.skuAttrValueList.push(obj)
      //   }
      // })
      // 整理平台数据方法2
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev,item)=>{
        if (item.attrIdAndValueId) {
          const [attrId,valueId] = item.attrIdAndValueId.split(":")
          prev.push({attrId,valueId})
        }
        return prev
      },[])
      // 整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev,item)=>{
        if (item.attrIdAndValueId) {
          const [saleAttrId,saleValueId] = item.attrIdAndValueId.split(":")
          prev.push({saleAttrId,saleValueId})
        }
        return prev
      },[])
      // 整理图片数据
      skuInfo.skuImageList = imageList.map(item=>{
        return {
          imgName:item.imgName,
          imgUrl:item.imgUrl,
          isDefault:item.isDefault,
          spuImgId:item.id
        }
      })
      let result = await this.$API.spu.reqAddSku(skuInfo)
      if (result.code === 200) {
        this.$message({message:'保存成功',type:'success'})
        this.$emit('changeScenes',0)
      }
    }
  },
};
</script>

<style>
</style>