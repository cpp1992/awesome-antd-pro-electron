import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {
 addModel, queryModel, removeModel, updateModel, queryModelFields,
} from './service.local';

import { LfResponse } from '@/interface';
import { TableListData } from './data.d';
import { StandardTableColumnProps } from './components/StandardTable';

export interface StateType {
  modelName: string;
  data: TableListData;
  columns: StandardTableColumnProps[];
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
    queryModelFields: Effect;
    queryModelData: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
    setColumns: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userTableList',

  state: {
    modelName: 'userTableList',
    data: {
      list: [],
      pagination: {},
    },
    columns: [],
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      yield call({ type: 'queryModelFields', payload });
      yield call({ type: 'queryModelData', payload });

    },
    * add({ payload, callback }, { call, put }) {
      yield call(addModel, payload);
      yield call('fetch');
      if (callback) callback();
    },
    * remove({ payload, callback }, { call, put }) {
      yield call(removeModel, payload);
      yield call('fetch');
      if (callback) callback();
    },
    * update({ payload, callback }, { call, put }) {
      yield call(updateModel, payload);
      yield call('fetch');
      if (callback) callback();
    },
    * queryModelFields({ payload }, { call, put }) {
      console.log('[Effects] Query Model Fields: ', payload)
      const response: LfResponse = yield call(queryModelFields, payload);
      const columns: StandardTableColumnProps[] = response.data.entity.map(field => {
        field.dataIndex = field.key;
        return field;
      });
      yield put({
        type: 'setColumns',
        payload: columns,
      });
    },
    * queryModelData({ payload }, { call, put }) {
      console.log('[Effects] Query Model Data: ', payload)
      const response: LfResponse = yield call(queryModel, payload);
      const list: TableListData['list'] = response.data.entity;

      yield put({
        type: 'save',
        payload: {
          list: list.length ? list : [list],
        },
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    setColumns(state, action) {
      return {
        ...state,
        columns: action.payload,
      };
    },
  },
};

export default Model;
