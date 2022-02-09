import request from '@/utils/request';

// 获取spu列表数据的接口  /admin/product/{page}/{limit}   get
export const reqSpuList = (page,limit,category3Id) => request({url:`/admin/product/${page}/${limit}`,method:'get',params:{category3Id}})

// 获取spu信息  /admin/product/getSpuById/{spuId}  get
export const reqSpu = (spuId)=>request({url:`/admin/product/getSpuById/${spuId}`,method:'get'})

// 获取品牌的信息  /admin/product/baseTrademark/getTrademarkList get
export const reqTradeMarkList = ()=>request({url:'/admin/product/baseTrademark/getTrademarkList',method:'get'})

// 获取spu图片接口  /admin/product/spuImageList/{spuId}  get
export const reqSpuImageList = (spuId)=>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})

// 获取平台销售属性  /admin/product/baseSaleAttrList  get
export const reqBaseSaleAttrList = () =>request({url:'/admin/product/baseSaleAttrList',method:'get'})

// 修改spu||添加spu /admin/product/updateSpuInfo  post  /admin/product/saveSpuInfo  post
export const reqAddOrUpdateSpu = (spuInfo)=>{
    if (spuInfo.id) {
       return request({url:'/admin/product/updateSpuInfo',method:'post',data:spuInfo})
    }else {
       return request({url:'/admin/product/saveSpuInfo',method:'post',data:spuInfo})
    }
}

// 删除spu  /admin/product/deleteSpu/{spuId}  delete
export const reqDeleteSpu = (spuId)=>request({url:`/admin/product/deleteSpu/${spuId}`,method:'delete'})

// 获取图片接口  /admin/product/spuImageList/{spuId}  get
// export const reqSpuImageList = (spuId) =>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})

// 获取销售属性  /admin/product/spuSaleAttrList/{spuId}  get
export const reqSpuSaleAttrList = (spuId) =>request({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get'})

// 获取平台属性的数据 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} get
export const reqAttrInfoList = (category1Id,category2Id,category3Id) =>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})

// 添加sku  /admin/product/saveSkuInfo   post
export const reqAddSku = (skuInfo) => request({url:'/admin/product/saveSkuInfo',method:'post',data:skuInfo})

// 获取spu列表  /admin/product/findBySpuId/{spuId}  get
export const reqSkuList = (spuId)=>request({url:`/admin/product/findBySpuId/${spuId}`,method:'get'})