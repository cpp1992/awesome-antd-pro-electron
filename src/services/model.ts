import lfService from '@/utils/request.local';
export async function queryModelList(): Promise<any> {
  // return request('/api/users');
  return lfService.request({
    url: '/api/model/model',
    method: 'get',
  });
}

export async function queryModelFields(params: any): Promise<any> {
  // return request('/api/currentUser');
  const name = params.name.replace('Form', '');
  console.log('[Service] Query Model: ', name);
  const url = `/api/model/${name}`
  return lfService.request({
    url,
    method: 'get',
  });
}

export async function mockModel(params: any): Promise<any> {
  // return request('/api/currentUser');
  const { fields } = params;
  const name = params.name.replace('Form', '');
  console.log('[Service] Edit Model: ', name);
  const defaultValue = fields.reduce((acc, field) => {
    if (field.key !== 'id') {
      acc[field.key] = field.placeholder
    }
    return acc
  }, {})
  window.pool[name].set(name, []).write();
  window.pool[name].get(name).insert(defaultValue).write();
}
