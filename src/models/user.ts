import { Effect } from 'dva';
import { Reducer } from 'redux';

import { LfResponse } from '@/interface';
import { queryCurrent, query as queryUsers } from '@/services/user';

export interface CurrentUser {
  avatar?: string;
  name?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  unreadCount?: number;
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    * fetch(_, { call, put }) {
      const response: LfResponse = yield call(queryUsers);
      const payload = response.data.entity;
      yield put({
        type: 'save',
        payload,
      });
    },
    * fetchCurrent({ payload }, { call, put }) {
      // hack here to get modules
      const response: LfResponse = yield call(queryCurrent, payload);
      const user: CurrentUser = response.data.entity[0];
      yield put({
        type: 'saveCurrentUser',
        payload: user,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
