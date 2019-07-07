import service from '@/utils/request.local';

export async function query(): Promise<any> {
  // return request('/api/users');
  return service.request({
    url: '/api/user/data',
    method: 'get',
  });
}

export async function queryCurrent(): Promise<any> {
  // return request('/api/currentUser');
  return service.request({
    url: '/api/login/data',
    method: 'get',
    data: {
      userid: '00000001',
    },
  });
}

export async function queryProvince() {
  return service.request({
    url: '/api/geographic/province',
    method: 'get',
  });
}

export async function queryCity(province: string) {
  return service.request({
    url: '/api/geographic/city',
    method: 'get',
  });
}
