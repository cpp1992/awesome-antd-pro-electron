import user from '../../mock/user';
import notices from '../../mock/notices';

import low, { LowdbSync } from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import Memory from "lowdb/adapters/Memory";
import uniqueId from "lodash-id";
// const adapter = new FileSync(join(__dirname, "data.json"));

const collections = [
  'user',
  'notice',
  'login'
]

const dbInit = (collections: string[]) => {
  const adapter = new Memory('antd');
  const db: any = low(adapter);
  db._.mixin(uniqueId);
  collections.forEach(collection => {
    if (!db.has(collection).value()) {
      db.set(collection, []).write();
    }
  });
  return db;
}

const dbInitModule = (collections: string[]): { [name: string]: any }  => {
  const pool = {}
  collections.forEach(collection => {
    const adapter = new Memory(collection);
    const dbModule: any = low(adapter);
    dbModule._.mixin(uniqueId);
    if (!dbModule.has(collection).value()) {
      dbModule.set(collection, []).write();
    }
    pool[collection] = dbModule;
  });
  return pool;
}

const pool = dbInitModule(collections);

// init some default data
const login = user['GET /api/currentUser'];
pool.login.get('login').push(login).write();

const users = user['GET /api/users'];
users.forEach(user => {
  pool.user.get('user').push(user).write();
});

notices.notices.forEach(notice => {
  pool.notice.get('notice').push(notice).write();
})

window.pool = pool;

export default pool;
