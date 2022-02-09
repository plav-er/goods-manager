// 平台属性管理接口
import request from '@/utils/request';

// 一级分类接口  /admin/product/getCategory1  get
export const reqCategroy1List = () => request({url:'/admin/product/getCategory1',method:'get'})

// 二级分类数据接口  /admin/product/getCategory2/{category1Id} get
export const reqCategroy2List = (category1Id) => request({url:`/admin/product/getCategory2/${category1Id}`,method:'get'})

// 三级分类数据接口  /admin/product/getCategory3/{category2Id}  get
export const reqCategroy3List = (category2Id) => request({url:`/admin/product/getCategory3/${category2Id}`,method:'get'})

// 获取平台属性   /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}  get
export const reqAttrList = (category1Id,category2Id,category3Id) => request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})

// 添加属性   /admin/product/saveAttrInfo  post
export const reqAddOrUpdateAttr = (data) => request({url:'/admin/product/saveAttrInfo',method:'post',data})