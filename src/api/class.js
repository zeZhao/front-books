import request from '@/utils/http'
// 班级列表
export function queryByPage(data) {
	return request('/sys/class-grade/list','get',data)
}
//新增
export function append(data) {
	return request('/sys/class-grade','post',data)
}
//修改
export function update(data) {
	return request('/sys/class-grade','put',data)
}
//删除
export function remove(data) {
	return request(`/sys/class-grade/${data}`,'delete')
}
