// import request from 'umi-request';

export async function queryModelFields(params: any): Promise<any> {
  const name = params.name.replace('Form', '');
  console.log('[Service] Query Model: ', params);
  const url = `/api/model/${name}`
  return window.api.request({
    url,
    method: 'get',
  });
}
export async function fakeSubmitForm(params: any) {
  // return request('/api/forms', {
  //   method: 'POST',
  //   data: params,
  // });
  console.log('[Service] User submit values: ', params);
  return window.api.request({
    url: '/api/user/user',
    method: 'post',
    data: params,
  })
}

export async function submitForm(params: any) {
  const { name, action, data } = params;
  console.log(`[Service] Submit [${name}/${action}] with values: `, data);
  return window.api.request({
    url: `/api/${name}/${action}`,
    method: 'post',
    data,
  })
}
