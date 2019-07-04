/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { LfResponse, LfService, BaseData, LfRequestOption } from '@/interface';
import { builder, baseData } from '@/utils/builder';
import { log } from '@/utils';
import pool from './db';

/**
 * 配置request请求时的默认参数
 */
// 创建 axios localforage 实例
const lfService: LfService = {

  getModel: (modelName: string) => "",

  validateUrl: (options: LfRequestOption) => {
    const [blank, prefix, namespace, action] = options.url.split('/');
    const model =  {};
    // header, columns
    const newOptions: LfRequestOption = {
      ...options,
      params: {
        ...options.params,
        model,
        prefix,
        namespace,
        action,
      },
    };
    log.info('Request new options:', newOptions);
    return newOptions;
  },

  async response(options: LfRequestOption) {
    const result = await this.request(options);
    return result;
  },

  async request(options: LfRequestOption) {
    const newOpitons = this.validateUrl(options);
    const result = await this.fetch(newOpitons);
    return result;
  },

  fetch: async (options: LfRequestOption) => new Promise(async (resolve, reject) => {
    const {
      method,
      data,
      params: {
        model,
        namespace
      }
    } = options;

    const requestedOption: LfRequestOption = {
      ...options,
    };
    let requestedData: BaseData = null;
    let response: LfResponse = null;

    const entities = pool[namespace].get(namespace);

    switch (method) {
      case 'post':
        requestedData = baseData('success', `post ${namespace}`);
        requestedData.entity = entities.push(data).write();
        break;
      case 'delete':
        requestedData = baseData('success', `delete ${namespace}`);
        requestedData.entity = entities.remove({ id: data.id }).write()
        break;
      case 'patch':
        requestedData = baseData('success', `update ${namespace}`);
        requestedData.entity = entities.find({ id: data.id }).assign(data).write()
        break;
      case 'get':
        requestedData = baseData('success', `get ${namespace}`);
        if(data) {
          requestedData.entity = entities.value();
        } else {
          requestedData.entity = entities.find(data).value();
        }
    }
    log.info('--------------- Local ---------------------');
    log.info(`${method}  --*--*--*-> `, requestedData);
    log.info('--------------- Local ---------------------');
    // build response
    if (requestedData.entity !== null || requestedData.entity !== undefined) {
      response = builder(
        requestedData,
        `${method} ${namespace} Ok`,
        200,
        requestedOption,
        options,
      );
      resolve(response);
    } else {
      response = builder(
        requestedData,
        `${method} ${namespace} NotOk`,
        500,
        requestedOption,
        options,
      );
      reject(response);
    }
  }),
};

window.api = lfService;
export default lfService;
