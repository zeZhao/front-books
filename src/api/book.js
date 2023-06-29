import request from '@/utils/http'
// 图书列表
export function queryByPage(data) {
	return request('/sys/boot/list','get',data)
}
//新增
export function append(data) {
	return request('/sys/boot','post',data)
}
//修改
export function update(data) {
	return request('/sys/boot','put',data)
}
//删除
export function remove(data) {
	return request(`/sys/boot/${data}`,'delete')
}
//上传
export function commonUpload(data) {
	return request('/sys/common/upload','post',data)
}
