import low, { LowdbSync } from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import Memory from 'lowdb/adapters/Memory';
import loadashId from 'lodash-id';
import user from '../../mock/user';
import notices from '../../mock/notices';
import rule from '../pages/user/table-list/_mock';
import geographic from '../pages/account/settings/_mock';
import userModel from '../pages/user/form/_mock';
import loginModel from '../pages/account/login/_mock';

// const adapter = new FileSync(join(__dirname, "data.json"));

const collections = ['user', 'notice', 'login', 'rule', 'geographic', 'model'];

const dbInit = (collections: string[]) => {
  const adapter = new Memory('antd');
  const db: any = low(adapter);
  db._.mixin(loadashId);
  collections.forEach(collection => {
    if (!db.has(collection).value()) {
      db.set(collection, []).write();
    }
  });
  return db;
};

const dbInitModule = (collections: string[]): { [name: string]: any } => {
  const pool = {};
  collections.forEach(collection => {
    const adapter = new Memory(collection);
    const dbModule: any = low(adapter);
    dbModule._.mixin(loadashId);
    if (!dbModule.has(collection).value()) {
      dbModule.set(collection, []).write();
    }
    pool[collection] = dbModule;
  });
  return pool;
};

const pool = dbInitModule(collections);

// init some default data
const currentUser = user['GET /api/currentUser'];
pool.login
  .get('login')
  .insert(currentUser)
  .write();

const users = user['GET /api/users'];
users.forEach(user => {
  pool.user
    .get('user')
    .insert(user)
    .write();
});

notices.notices.forEach(notice => {
  pool.notice
    .get('notice')
    .insert(notice)
    .write();
});

rule.tableListDataSource.forEach(rule => {
  pool.rule
    .get('rule')
    .insert(rule)
    .write();
});

pool.geographic.set('province', geographic.province).write();
pool.geographic.set('city', geographic.city).write();

// 初始化每个对象模型的表单信息
pool.model.get('model').push('user').write();
pool.model.get('model').push('login').write();
pool.model.set('user', userModel.fields).write();
pool.model.set('login', loginModel.fields).write();

window.pool = pool;

export default pool;
