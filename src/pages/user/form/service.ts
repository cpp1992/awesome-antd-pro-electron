import { LfRequestOption } from '@/interface';

export async function queryModelFields(params: LfRequestOption): Promise<any> {
  return window.api.request(params);
}
export async function fakeSubmitForm(params: any) {
  return window.api.request(params);
}

export async function submitForm(params: any) {
  return window.api.request(params);
}
