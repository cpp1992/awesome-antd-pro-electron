import { LfRequestOption } from '@/interface';

export async function queryModelFields(params: LfRequestOption): Promise<any> {
  return window.api.request(params);
}

export async function queryModel(params: LfRequestOption): Promise<any> {
  return window.api.request(params);
}

export async function removeModel(params: LfRequestOption): Promise<any> {
  return window.api.request(params);
}

export async function addModel(params: LfRequestOption): Promise<any> {
  return window.api.request(params);
}

export async function updateModel(params: LfRequestOption): Promise<any> {
  return window.api.request(params);
}
