import lfService from '@/utils/request.local';
export async function query(): Promise<any> {
  // return request('/api/users');
  return lfService.request({
    url: '/api/user/data',
    method: 'get',
  });
}

export async function queryCurrent(): Promise<any> {
  // return request('/api/currentUser');
  return lfService.request({
    url: '/api/login/data',
    method: 'get',
    data: {
      userid: '00000001',
    },
  });
}

export async function queryNotices(): Promise<any> {
  // return request('/api/notices');
  return lfService.request({
    url: '/api/notice/data',
    method: 'get',
  });
}
