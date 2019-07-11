import lfService from '@/utils/request.local';

export async function query(): Promise<any> {
  return lfService.request({
    url: '/api/user/data',
  });
}

export async function queryCurrent(params: any): Promise<any> {
  return lfService.request({
    url: '/api/login/data',
    data: {
      userid: params.userid,
    },
  });
}

export async function queryNotices(): Promise<any> {
  return lfService.request({
    url: '/api/notice/data',
  });
}
