import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { CurrentUser, ListItemDataType } from './data.d';
import { queryCurrentUser, queryPost } from './service';
import { LfResponse } from '@/interface';

export interface ModalState {
  currentUser: Partial<CurrentUser>;
  list: ListItemDataType[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: ModalState) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: ModalState;
  effects: {
    fetchCurrent: Effect;
    fetch: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<ModalState>;
    queryList: Reducer<ModalState>;
  };
}

const Model: ModelType = {
  namespace: 'accountCenter',

  state: {
    currentUser: {},
    list: [],
  },

  effects: {
    * fetchCurrent(_, { call, put }) {
      const response: LfResponse = yield call(queryCurrentUser);
      const payload = response.data.entity;
      yield put({
        type: 'saveCurrentUser',
        payload,
      });
    },
    * fetch({ payload }, { call, put }) {
      const response: LfResponse = yield call(queryPost, payload);
      const result = response.data.entity;
      yield put({
        type: 'queryList',
        payload: Array.isArray(result) ? result : [],
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...(state as ModalState),
        currentUser: action.payload || {},
      };
    },
    queryList(state, action) {
      return {
        ...(state as ModalState),
        list: action.payload,
      };
    },
  },
};

export default Model;
