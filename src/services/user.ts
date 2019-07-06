import lfService from '@/utils/request.local';
export async function query(): Promise<any> {
  // return request('/api/users');
  return lfService.request({
    url: '/api/user/user',
    method: 'get',
  });
}

export async function queryCurrent(): Promise<any> {
  // return request('/api/currentUser');
  return lfService.request({
    url: '/api/login/login',
    method: 'get',
    data: {
      userid: '00000001',
    },
  });
}

export async function queryNotices(): Promise<any> {
  // return request('/api/notices');
  return lfService.request({
    url: '/api/notice/notice',
    method: 'get',
  });
}
