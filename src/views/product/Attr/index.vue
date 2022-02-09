<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategroySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategroySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 表格 -->
        <el-table :data="attrList" style="width: 100%; margintop: 20px" border>
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="150"
          ></el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin: 5px 10px"
              >
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加/修改属性 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table style="width: 100%; margin: 20px 0" border :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 这里的结构需要input与span来回切换 -->
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span v-else @click="toEdit(row, $index)" style="display: block; height: 20px">
                {{ row.valueName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`确定删除${row.valueName}吗?`" @onConfirm="deleteAttrValue($index)" >
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash当中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 接收平台的属性
      attrList: [],
      // 控制table表格的显示与隐藏
      isShowTable: true,
      // 收集新增/修改属性
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [], //属性值
        categoryId: 0,
        categoryLevel: 3,
      },
    };
  },
  methods: {
    // 获取平台属性的数据
    async getAttrlist() {
      const { category1Id, category2Id, category3Id } = this;
      const result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },
    // 自定义事件回调
    getCategoryId(cForm) {
      const { category1Id, category2Id, category3Id } = cForm;
      this.category1Id = category1Id;
      this.category2Id = category2Id;
      this.category3Id = category3Id;
      this.getAttrlist();
    },
    // 添加属性值按钮的回调
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        flag: true, //给每一个属性值添加一个标记，切换查看与编辑模式
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length-1].focus()
      });
    },
    // 添加属性按钮的回调
    addAttr() {
      this.isShowTable = false;
      this.attrInfo = {
        attrName: "", //属性名
        attrValueList: [], //属性值
        categoryId: this.category3Id, //收集三级分类id
        categoryLevel: 3,
      };
    },
    // 修改属性
    updateAttr(row) {
      this.isShowTable = false;
      // 由于数据结构存在对象里面套数组，数组里面套对象，所以需要用到深拷贝解决问题
      // this.attrInfo = {...row}  X
      this.attrInfo = cloneDeep(row);
      // 在修改属性的时候将已有的数据添加flag属性
      this.attrInfo.attrValueList.forEach((item) => {
        // 添加响应式数据
        this.$set(item, "flag", false);
      });
    },
    // 失去焦点，切换为查看模式
    toLook(row) {
      row.flag = false;
      // 判断输入的属性值是否为有效值
      if (!row.valueName.trim()) {
        this.$message("请输入一个正确的属性值");
        return;
      }
      // 判断输入的属性值是否重复
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        if (row != item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepat) {
        this.$message("属性值重复");
        return;
      }
    },
    // 点击span的回调，变为编辑模式
    toEdit(row, index) {
      row.flag = true;
      // 获取input节点，实现自动聚焦
      // 点击span的时候要重新渲染input
      this.$nextTick(() => {
        this.$refs[index].focus()
      });
    },
    // 气泡确认按钮回调
    deleteAttrValue(index){
      // 当前删除属性值不需要发请求
      this.attrInfo.attrValueList.splice(index,1)
    },
    // 保存按钮，进行添加属性/修改属性的操作
    async addOrUpdateAttr(){
      // 如果用户添加了很多属性值，属性值为空的情况要过滤
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item=>{
        // 过滤属性名不为空
        if (item.valueName!=""&&item.flag==false) {
          // 删除掉flag属性
          delete item.flag
          return true
        }
      })
      // 发请求
      try{
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        this.isShowTable = true
        this.$message({type:'success',message:'保存成功'})
        this.getAttrlist()
      }catch(error){
        this.$message('保存失败')
      }
    }
  },
};
</script>

<style scoped>
</style>
