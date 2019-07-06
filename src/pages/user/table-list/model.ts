import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {
 addRule, queryRule, removeRule, updateRule,
} from './service.local';

import { LfResponse } from '@/interface';
import { TableListData } from './data.d';

export interface StateType {
  data: TableListData;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    add: Effect;
    remove: Effect;
    update: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'listTableList',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response: LfResponse = yield call(queryRule, payload);
      const list = response.data.entity;
      yield put({
        type: 'save',
        payload: {
          list: list.length ? list : [list],
        },
      });
    },
    * add({ payload, callback }, { call, put }) {
      yield call(addRule, payload);
      const response: LfResponse = yield call(queryRule);
      const list = response.data.entity;
      yield put({
        type: 'save',
        payload: {
          list: list.length ? list : [list],
        },
      });
      if (callback) callback();
    },
    * remove({ payload, callback }, { call, put }) {
      yield call(removeRule, payload);
      const response: LfResponse = yield call(queryRule);
      const list = response.data.entity;
      yield put({
        type: 'save',
        payload: {
          list: list.length ? list : [list],
        },
      });
      if (callback) callback();
    },
    * update({ payload, callback }, { call, put }) {
      yield call(updateRule, payload);
      const response: LfResponse = yield call(queryRule);
      const list = response.data.entity;
      yield put({
        type: 'save',
        payload: {
          list: list.length ? list : [list],
        },
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};

export default Model;
