// 品牌管理数据
import request from '@/utils/request'

// 获取品牌列表的接口  /admin/product/baseTrademark/{page}/{limit}  get
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

// 添加品牌  /admin/product/baseTrademark/save  post  携带两个参数  tmName  logoUrl
// 修改品牌  /admin/product/baseTrademark/update  put  携带三个参数  id  tmName  logoUrl
export const reqAddOrUpdateTradeMark = (trademark)=>{
    if(trademark.id){
       return request({url:'/admin/product/baseTrademark/update',method:'put',data:trademark})
    }else {
       return request({url:'/admin/product/baseTrademark/save',method:'post',data:trademark})
    }
}

// 删除品牌  /admin/product/baseTrademark/remove/{id}  delete
export const reqDeleteTradeMark = (id) => request({url:`/admin/product/baseTrademark/remove/${id}`, method:'delete'})
