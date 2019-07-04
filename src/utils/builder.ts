import { LfResponse, BaseData } from '@/interface';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 获取数据，包装成axios类似的返回格式
 * @param {BaseData} data Data from request
 * @param {string} message Response messag
 * @param {number} code Response code
 * @param {any} headers Response headers
 */
export const builder = (data: BaseData, message = '', code = 0, config = null, headers = {}): LfResponse => {
  const responseBody: LfResponse = {
    data: null,
    config: null,
    status: 200,
    statusText: '',
    headers: null,
    message: '',
    success: false,
    code: 0,
    timestamp: 0,
  };
  responseBody.data = data;
  responseBody.config = config;
  if (message !== undefined && message !== null) {
    responseBody.message = message;
  }
  if (code !== undefined && code !== 0) {
    responseBody.code = code;
    responseBody.status = code;
    responseBody.statusText = 'Ok';
    responseBody.success = true;
  }
  if (headers !== null && typeof headers === 'object' && Object.keys(headers).length > 0) {
    responseBody.headers = headers;
  }
  responseBody.timestamp = new Date().getTime();
  return responseBody;
};

/**
 * 获取url查询参数字符串，包装为json对象
 * @param {any} options Url查询参数字符串
 */
export const getQueryParameters = (options) => {
  const url = options.url;
  const search = url.split('?')[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    `{"${decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')}"}`,
  );
};

/**
 * 获取请求体字符串，返回json对象
 * @param {any} options 获取请求体
 */
export const getBody = options => options.body && JSON.parse(options.body);

export const baseData = (type, message, code?): BaseData => {
  let resultCode = 0;
  if (code) {
    resultCode = code;
  } else {
    resultCode = type === 'success' ? 0 : 1;
  }
  return {
    result: { resultCode, resultMessage: message },
    entity: null,
  };
};
