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
