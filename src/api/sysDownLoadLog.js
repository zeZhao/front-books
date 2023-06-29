import request from '@/utils/http'

export function queryByPage(data) {
  return request({
    url: '/boot/list',
    method: 'get',
    data
  })
}
//新增
export function insertBoot(data) {
  return request({
    url: '/boot',
    method: 'post',
    data
  })
}
//修改
export function update(data) {
  return request({
    url: '/boot',
    method: 'put',
    data
  })
}
//删除
export function deteleBoot(data) {
  return request({
    url: `/boot/${data}`,
    method: 'delete',
  })
}
//上传
export function commonUpload(data) {
  return request({
    url: '/common/upload',
    method: 'post',
    data,
    
  })
}
