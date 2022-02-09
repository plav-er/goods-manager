<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="spu名称">
        <el-input placeholder="spu名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option :label="tm.tmName" :value="tm.id" v-for="tm in tradeMarkList" :key="tm.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="spu描述">
        <el-input type="textarea" rows="4" placeholder="描述" v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="spu图片">
        <!-- 上传图片 on-preview:图片预览的时候会触发  on-remove：图片移除时触发-->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>   
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrIdAndAttrName">
          <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" v-for="unselect in unSelectSaleAttr" :key="unselect.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
        <!-- 展示spu属于自己的数据 -->
        <el-table style="width: 100%; margin: 10px 0" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" ></el-table-column>
          <el-table-column prop="prop" label="属性名称列表" width="width">
            <template slot-scope="{row}">
              <!--  @close="handleClose(tag)"
              @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" -->
              <el-tag :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" closable 
              :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index,1)">
              {{tag.saleAttrValueName}}
              </el-tag>
              <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput"
              size="small" @blur="handleInputConfirm(row)">
              </el-input>
              <!-- @click="showInput" -->
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spu: {   //存储spu信息
        // 三级分类id
        category3Id: 0,
        // 描述
        description: "",
        // 品牌id
        tmId: "",
        // spu名称
        spuName: "",
        // spu图片
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "",
          //   imgUrl: "",
          //   spuId: 0,
          // },
        ],
        // 平台属性
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "",
          //       saleAttrName: "",
          //       saleAttrValueName: "",
          //       spuId: 0,
          //     }
          //   ]
          // }
        ],
      }, 
      attrIdAndAttrName:"",
      tradeMarkList: [], //品牌信息
      spuImageList: [], //图片数据
      saleAttrList: [], //销售属性的数据
    };
  },
  computed:{
    // 处理平台属性
    unSelectSaleAttr(){
      return this.saleAttrList.filter(item=>{
        return this.spu.spuSaleAttrList.every(item1=>{
          return item.name != item1.saleAttrName
        })
      })
    }
  },
  methods: {
    // 照片墙删除某一张图片的回调
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.spuImageList = fileList
    },
    // 照片墙图片预览的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 照片墙上传成功的回调
    handleSuccess(response, file, fileList){
      this.spuImageList = fileList
    },
    //初始化spu数据
    async initSpuData(spu) {
      //  获取spu信息
      let result = await this.$API.spu.reqSpu(spu.id);
      if (result.code === 200) {
        this.spu = result.data;
      }
      // 获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取spu图片的数据
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code === 200) {
        let listArr = spuImageResult.data;
        // 处理数据，添加新字段
        listArr.forEach(item=>{
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.spuImageList = listArr
      }
      // 获取平台销售的属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    // 添加新的销售属性
    addSaleAttr(){
      const [baseSaleAttrId,saleAttrName] = this.attrIdAndAttrName.split(":")
      // 向spu对象添加新的销售属性
      let newSaleAttr = {baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]}
      this.spu.spuSaleAttrList.push(newSaleAttr)
      this.attrIdAndAttrName=""
    },
    // 添加销售属性的值
    addSaleAttrValue(row){
      // 添加响应式数据
      this.$set(row,"inputVisible",true)
      this.$set(row,"inputValue",'')
    },
    // el-input 失去焦点事件
    handleInputConfirm(row){
      row.inputVisible = false
      const {baseSaleAttrId,inputValue} = row
      // 新增的销售属性值的名称不能为空
      if (inputValue.trim()=="") {
        this.$message('属性值不能为空')
        return
      }
      // 属性值不能重复
      let result = row.spuSaleAttrValueList.every(item=>item.saleAttrValueName!=inputValue)
      if (!result) {
        return
      }
      let newSaleAttrValue = {baseSaleAttrId,saleAttrValueName:inputValue}
      row.spuSaleAttrValueList.push(newSaleAttrValue)
    },
    // 添加或修改spu保存
    async addUpdateSpu(){
      // 整理参数
      this.spu.spuImageList = this.spuImageList.map(item=>{
        return {
          imgName:item.name,
          imgUrl:(item.response&&item.response.data)||item.url
        }
      })
      // 发请求
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if (result.code === 200) {
        this.$message({message:"保存成功",type:"success"})
        this.$emit('changeScene',{scene:0,flag:this.spu.id?"修改":"添加"})
      }
      // 清除数据
      Object.assign(this._data,this.$options.data())
    },
    // 点击添加按钮发送请求
    async addSpuData(category3Id){
      this.spu.category3Id = category3Id
      // 获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取平台销售的属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    // 取消按钮
    cancel(){
      this.$emit('changeScene', {scene:0,flag:''})
      // 清除残余数据,清空数据
      // 合并对象
      Object.assign(this._data,this.$options.data())
    }
  },
};
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>