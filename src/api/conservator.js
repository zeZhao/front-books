import request from '@/utils/http'

// 老师接口


//列表
export function queryByPage(data) {
	return request('/sys/conservator/list','get',data)
}
//新增
export function append(data) {
	return request('/sys/conservator','post',data)
}
//修改
export function update(data) {
	return request('/sys/conservator','put',data)
}
//删除
export function remove(data) {
	return request(`/sys/conservator/${data}`,'delete')
}

