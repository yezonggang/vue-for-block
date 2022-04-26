import request from '@/utils/request'
export function getstudent() {
    return request({
      url: '/vue-element-admin/getstudent',
      method: 'get'
    })
  }