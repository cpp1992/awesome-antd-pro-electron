import { FromDataType } from './index';

export async function accountLogin(params: FromDataType) {
  return window.api.request({
    url: '/api/login/data',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return window.api.request(`/api/login/captcha?mobile=${mobile}`);
}
