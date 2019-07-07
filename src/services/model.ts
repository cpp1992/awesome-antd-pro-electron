import lfService from '@/utils/request.local';

export async function queryModelList(): Promise<any> {
  return lfService.request({
    url: '/api/model/data',
  });
}

export async function queryModelFields(params: any): Promise<any> {
  const name = params.name.replace('Form', '');
  console.log('[Service] Query Model: ', name);
  const url = `/api/${name}/fields`
  return lfService.request({
    url,
  });
}

export async function mockModel(params: any): Promise<any> {
  const { fields } = params;
  const name = params.name.replace('Form', '');
  console.log('[Service] Edit Model: ', name);
  const defaultValue = fields.reduce((acc, field) => {
    if (field.key !== 'id') {
      acc[field.key] = field.placeholder
    }
    return acc
  }, {})
  window.pool[name].set('data', []).write();
  window.pool[name].get('data').insert(defaultValue).write();
}
