/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { pickBy } from 'lodash';
import {
 LfResponse, LfService, BaseData, LfRequestOption,
} from '@/interface';
import { builder, baseData } from '@/utils/builder';
import { log } from '@/utils';
import pool from './db';

/**
 * 配置request请求时的默认参数
 */
// 创建 axios localforage 实例
const lfService: LfService = {
  getModel: (modelName: string) => modelName,

  validateUrl: (options: LfRequestOption) => {
    const [blank, prefix, namespace, action] = options.url.split('/');
    const model = {};
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
        method = 'get',
        data,
        params: { namespace, action = 'data' },
      } = options;

      const pageParams = { ...options.params.pageParams };

      const requestedOption: LfRequestOption = {
        ...options,
      };
      let requestedData: BaseData = null;
      let response: LfResponse = null;

      // path example: user.data, user.fields, user.name
      const entities = pool[namespace].get(action);
      console.log(`1. Current Entity [${namespace}]:`, entities.value());

      switch (method) {
        case 'post':
          // if login
          if (namespace === 'login') {
            // verity password
            requestedData = baseData('fail', `post ${namespace}`);
            requestedData.entity = {
              status: 'error',
              type: data.type,
              currentAuthority: 'guest',
            };
            if (data.password === 'ant.design' && data.userName === 'admin') {
              requestedData = baseData('success', `post ${namespace}`);
              requestedData.entity = {
                status: 'ok',
                type: data.type,
                currentAuthority: 'admin',
              };
            }
            if (data.password === 'ant.design' && data.userName === 'user') {
              requestedData = baseData('success', `post ${namespace}`);
              requestedData.entity = {
                status: 'ok',
                type: data.type,
                currentAuthority: 'user',
              };
            }
          } else {
            requestedData = baseData('success', `post ${namespace}`);
            requestedData.entity = entities.insert(data).write();
          }
          break;
        case 'delete':
          requestedData = baseData('success', `delete ${namespace}`);
          console.log(data.key);
          if (Array.isArray(data.key)) {
            data.key.forEach(key => {
              entities.removeWhere({ key }).write();
            });
            requestedData.entity = data.key;
          } else {
            requestedData.entity = entities.removeWhere({ key: data.key }).write();
          }
          break;
        case 'patch':
          requestedData = baseData('success', `update ${namespace}`);
          requestedData.entity = entities.updateWhere({ key: data.key }, data).write();
          break;
        case 'get':
          requestedData = baseData('success', `get ${namespace}`);
          console.log('2. Checking data:', data);
          if (data === undefined) {
            console.log('3. Querying without data...');
            console.log('4. Checking pagination...', pageParams);
            if (Object.keys(pageParams).length > 0) {
              console.log('5. Querying with pagination...');
              const { pageSize } = pageParams;
              requestedData.entity = entities.take(pageSize).sortBy('key').value();
            } else {
              console.log('5. Querying without pagination...');
              requestedData.entity = entities.value();
            }
          } else if (data.key !== undefined) {
              console.log('3. Querying with unique key...', data);
              requestedData.entity = entities.find({ key: data.key }).value();
          } else {
            // options.params.pagination, query
            console.log('3. Querying with data object...', data);
            const validQuery = pickBy(data, value => value !== undefined);
            console.log('4. Getting with query params...', validQuery);
            requestedData.entity = entities.find(validQuery).value();
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
