import { Reducer } from 'redux';
import { Subscription } from 'dva';

import { Effect } from './connect.d';
import { NoticeIconData } from '@/components/NoticeIcon';
import { queryNotices } from '@/services/user';
import { queryModelFields } from '@/services/model';
import { LfResponse } from '@/interface';

export interface NoticeItem extends NoticeIconData {
  id: string;
  type: string;
  status: string;
}

export interface GlobalModelState {
  collapsed: boolean;
  notices: NoticeItem[];
  models: any[];
}

export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
  effects: {
    queryModelFields: Effect;
    fetchNotices: Effect;
    clearNotices: Effect;
    changeNoticeReadState: Effect;
  };
  reducers: {
    changeLayoutCollapsed: Reducer<GlobalModelState>;
    saveModels: Reducer<GlobalModelState>;
    saveNotices: Reducer<GlobalModelState>;
    saveClearedNotices: Reducer<GlobalModelState>;
  };
  subscriptions: { setup: Subscription };
}

const GlobalModel: GlobalModelType = {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    models: [],
  },

  effects: {
    * queryModelFields({ payload }, { call, put, select }) {
      console.log('[Effects] Query model payload: ', payload);
      // With effects
      const type = 'userForm/changeModelName';
      // Without effects
      // const type = `userForm/save`;

      const response: LfResponse = yield call(queryModelFields, payload);
      const fields = response.data.entity;

      // call/put to userForm model
      yield call({
        type,
        payload: {
          name: payload.name,
          fields,
        },
      });
    },
    * fetchNotices(_, { call, put, select }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      const unreadCount: number = yield select(
        state => state.global.notices.filter(item => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },
    * clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count: number = yield select(state => state.global.notices.length);
      const unreadCount: number = yield select(
        state => state.global.notices.filter(item => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },
    * changeNoticeReadState({ payload }, { put, select }) {
      const notices: NoticeItem[] = yield select(state => state.global.notices.map(item => {
          const notice = { ...item };
          if (notice.id === payload) {
            notice.read = true;
          }
          return notice;
        }));

      yield put({
        type: 'saveNotices',
        payload: notices,
      });

      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter(item => !item.read).length,
        },
      });
    },
  },

  reducers: {
    changeLayoutCollapsed(state = { notices: [], collapsed: true, models: [] }, { payload }): GlobalModelState {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }): GlobalModelState {
      return {
        collapsed: false,
        ...state,
        notices: payload,
      };
    },
    saveModels(state, { payload }): GlobalModelState {
      return {
        ...state,
        models: payload,
      };
    },
    saveClearedNotices(state = { notices: [], collapsed: true, models: [] }, { payload }): GlobalModelState {
      return {
        collapsed: false,
        ...state,
        notices: state.notices.filter((item): boolean => item.type !== payload),
      };
    },
  },

  subscriptions: {
    setup({ dispatch, history }): void {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }): void => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};

export default GlobalModel;
