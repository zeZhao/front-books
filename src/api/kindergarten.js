import request from '@/utils/http'

// 幼儿园接口


//列表
export function queryByPage(data) {
	return request('/sys/kindergarten/list','get',data)
}
//新增
export function append(data) {
	return request('/sys/kindergarten','post',data)
}
//修改
export function update(data) {
	return request('/sys/kindergarten','put',data)
}
//删除
export function remove(data) {
	return request(`/sys/kindergarten/${data}`,'delete')
}

