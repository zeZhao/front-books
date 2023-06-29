import request from '@/utils/http'
// 会员
//列表
export function queryByPage(data) {
	return request('/sys/member/list','get',data)
}
//新增
export function append(data) {
	return request('/sys/member','post',data)
}
//修改
export function update(data) {
	return request('/sys/member','put',data)
}
//删除
export function remove(data) {
	return request(`/sys/member/${data}`,'delete')
}

