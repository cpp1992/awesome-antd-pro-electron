import {
  tail, first, last, nth, camelCase,
} from 'lodash';
import loadashId from 'lodash-id';
import low, { LowdbSync } from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import Memory from 'lowdb/adapters/Memory';

import user from '../../mock/user';
import notices from '../../mock/notices';
import rule from '../pages/user/table-list/_mock';
import geographic from '../pages/account/settings/_mock';

// const adapter = new FileSync(join(__dirname, "data.json"));

let pool: any;

const collections = ['user', 'notice', 'login', 'rule', 'geographic', 'model'];

export const dbInitModule = (pool: any, collections: string[]): { [name: string]: any } => collections.reduce((acc, collection) => {
    const adapter = new Memory(collection);
    const dbModule: any = low(adapter);
    dbModule._.mixin(loadashId);
    dbModule.set('name', collection);
    dbModule.set('data', []).write();
    dbModule.set('fields', []).write();
    acc[collection] = dbModule;
    return acc;
  }, pool);


pool = dbInitModule({}, collections);
console.log('window pool basic:', pool);

// init some mock data
const currentUser = user['GET /api/currentUser'];
pool.login
  .get('data')
  .insert(currentUser)
  .write();

notices.notices.forEach(notice => {
  pool.notice
    .get('data')
    .insert(notice)
    .write();
});

rule.tableListDataSource.forEach(rule => {
  pool.rule
    .get('data')
    .insert(rule)
    .write();
});

pool.geographic.set('province', geographic.province).write();
pool.geographic.set('city', geographic.city).write();

// 初始化每个对象模型的表单信息
const MockModels = require.context('./_mocks/json', true, /\.json$/)

MockModels.keys().forEach((fileName: string) => {

  const fileNameMeta = tail(fileName.split('/'));
  const modelNameCamel = camelCase(nth(fileNameMeta, -2))
  // 将模型列表定义，添加到model数据库中，用于选择模型，动态更新
  pool.model.get('data').push({
    title: modelNameCamel,
    value: modelNameCamel,
  }).write();
  pool = dbInitModule(pool, [modelNameCamel]);
  // 将字段定义添加到每个数据库中
  pool[modelNameCamel].set('fields', MockModels(fileName).fields).write();
})

console.log('window pool dynamic', pool);

window.pool = pool;

export default pool;
