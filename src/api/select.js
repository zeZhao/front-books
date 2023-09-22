

import request from '@/utils/http'
// 图书列表下拉
export function bootList(data) {
	return request('/sys/boot/option','get',data)
}
// 类别列表下拉
export function categoryList(data) {
	return request('/sys/book-category/option','get',data)
}
// 老师列表下拉
export function conservatorList(data) {
	return request('/sys/conservator/option','get',data)
}
// 幼儿园列表下拉
export function kindergartenList(data) {
	return request('/sys/kindergarten/option','get',data)
}
// 班级列表下拉
export function classList(data) {
	return request('/sys/class-grade/option','get',data)
}
// h会员列表下拉
export function memberList(data) {
	return request('/sys/member/option','get',data)
}
