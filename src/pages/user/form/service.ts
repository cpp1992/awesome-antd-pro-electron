import request from 'umi-request';

export async function fakeSubmitForm(params: any) {
  // return request('/api/forms', {
  //   method: 'POST',
  //   data: params,
  // });
  console.log('User submit values: ', params);
  return window.api.request({
    url: '/api/user/user',
    method: 'post',
    data: params,
  })
}

export async function submitForm(params: any) {
  console.log('User submit values: ', params);
  const { name, action, data } = params;
  return window.api.request({
    url: `/api/${name}/${action}`,
    method: 'post',
    data,
  })
}
