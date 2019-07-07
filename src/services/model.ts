import lfService from '@/utils/request.local';
export async function query(): Promise<any> {
  // return request('/api/users');
  return lfService.request({
    url: '/api/model/model',
    method: 'get',
  });
}

export async function queryModel(params: any): Promise<any> {
  // return request('/api/currentUser');
  const name = params.name;
  console.log('Query Model Service: ', name);
  const url = `/api/model/${name}`
  return lfService.request({
    url,
    method: 'get',
  });
}

export async function editModelFields(params: any): Promise<any> {
  // return request('/api/currentUser');
  window.pool[params.name].get[params.name].set(params.fields).write();
  return Promise.resolve(params);
}
