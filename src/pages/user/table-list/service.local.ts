import Table from 'antd/es/table';
import { TableListParams } from './data';

export async function queryModelFields(params: any): Promise<any> {
  const name = params.name.replace('TableList', '');
  console.log('[Service] Query Model: ', params);
  const url = `/api/model/${name}`
  return window.api.request({
    url,
    method: 'get',
  });
}

export async function queryModel(params: any) {
  const {
 name, action, data, pagination,
} = params;
  console.log('query: ', params);
  if (data !== undefined) {
    return window.api.request({
      url: `/api/${name}/${action}`,
      method: 'get',
      data,
      params: pagination,
    });
  }
  return window.api.request({
    url: `/api/${name}/${action}`,
    method: 'get',
  });
}

export async function removeModel(params: any) {
  const {
 name, action, data, pagination,
} = params;
  console.log('remove: ', params);
  return window.api.request({
    url: `/api/${name}/${action}`,
    method: 'delete',
    data,
  });
}

export async function addModel(params: any) {
  const {
 name, action, data, pagination,
} = params;
  console.log('add: ', params);
  return window.api.request({
    url: `/api/${name}/${action}`,
    method: 'post',
    data,
  });
}

export async function updateModel(params: any) {
  const {
 name, action, data, pagination,
} = params;
  console.log('update: ', params);
  return window.api.request({
    url: `/api/${name}/${action}`,
    method: 'patch',
    data,
  });
}
