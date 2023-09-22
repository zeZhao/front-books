import request from '@/utils/http'
// 类别列表
export function queryByPage(data) {
	return request('/sys/book-category/list','get',data)
}
//新增
export function append(data) {
	return request('/sys/book-category','post',data)
}
//修改
export function update(data) {
	return request('/sys/book-category','put',data)
}
//删除
export function remove(data) {
	return request(`/sys/book-category/${data}`,'delete')
}
