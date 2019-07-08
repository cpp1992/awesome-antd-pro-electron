import service from '@/utils/request.local';

export async function query(): Promise<any> {
  return service.request({
    url: '/api/user/data',
  });
}

export async function queryCurrent(): Promise<any> {
  return service.request({
    url: '/api/login/data',
    data: {
      userid: '00000001',
    },
  });
}

export async function queryProvince() {
  return service.request({
    url: '/api/geographic/province',
  });
}

export async function queryCity(province: string) {
  return service.request({
    url: '/api/geographic/city',
  });
}
