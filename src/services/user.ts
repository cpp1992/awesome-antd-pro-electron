// import request from '@/utils/request';
import service from '@/utils/request.local';

export async function query(): Promise<any> {
  // return request('/api/users');
  return service.request({
    url: '/api/user/fetch',
    method: 'get',
  })
}

export async function queryCurrent(): Promise<any> {
  // return request('/api/currentUser');
  return service.request({
    url: '/api/login/current',
    method: 'get',
    data: {
      userid: '00000001'
    }
  })
}

export async function queryNotices(): Promise<any> {
  // return request('/api/notices');
  return service.request({
    url: '/api/notice/fetch',
    method: 'get',
  })
}
