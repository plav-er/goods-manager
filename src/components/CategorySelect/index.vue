<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category1Id"
          @change="handler1"
          :disabled="show"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="c1 in list1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category2Id"
          @change="handler2"
          :disabled="show"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="c2 in list2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category3Id"
          @change="handler3"
          :disabled="show"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in list3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategroySelect",
  props:["show"],
  data() {
    return {
      //一级分类数据
      list1: [],
      //二级分类数据
      list2: [],
      //三级分类数据
      list3: [],
      //收集相应的id
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  mounted() {
    this.getCategory1List();
  },
  methods: {
    async getCategory1List() {
      let result = await this.$API.attr.reqCategroy1List();
      if (result.code === 200) {
        this.list1 = result.data;
      }
    },
    // 一级分类的select事件回调
    async handler1() {
      // 先清空数据
      this.list2=[]
      this.list3=[]
      this.cForm.category2Id=""
      this.cForm.category3Id=""
      const { category1Id } = this.cForm;
      let result = await this.$API.attr.reqCategroy2List(category1Id);
      if (result.code === 200) {
        this.list2 = result.data;
      }
    },
    // 二级分类的select事件回调
    async handler2() {
      // this.list3=[]
      this.cForm.category3Id=""
      const { category2Id } = this.cForm;
      let result = await this.$API.attr.reqCategroy3List(category2Id);
      if (result.code === 200) {
        this.list3 = result.data;
      }
    },
    // 三级分类的select事件回调
    handler3() {
      this.$emit("getCategoryId",this.cForm)
    },
  },
};
</script>

<style>
</style>