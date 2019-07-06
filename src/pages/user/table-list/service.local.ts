import Table from 'antd/es/table';
import { TableListParams } from './data';

export async function queryRule(params: TableListParams) {
  console.log('query: ', params);
  if (params !== undefined) {
    return window.api.request({
      url: '/api/rule/rule',
      method: 'get',
      data: params.data,
      params: params.pagination,
    });
  }
  return window.api.request({
    url: '/api/rule/rule',
    method: 'get',
  });
}

export async function removeRule(params: TableListParams) {
  console.log('remove: ', params);
  return window.api.request({
    url: '/api/rule/rule',
    method: 'delete',
    data: params.data,
  });
}

export async function addRule(params: TableListParams) {
  console.log('add: ', params);
  return window.api.request({
    url: '/api/rule/rule',
    method: 'post',
    data: params.data,
  });
}

export async function updateRule(params: TableListParams) {
  console.log('update: ', params);
  return window.api.request({
    url: '/api/rule/rule',
    method: 'patch',
    data: params.data,
  });
}
