import request from '@/utils/http'

export function login(data) {
	return request("/sys/login","post",data)
}
export function logout() {
  return request({
    url: '/user/logout',
    method: 'get',
  })
}