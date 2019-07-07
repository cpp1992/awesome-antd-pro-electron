import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { param } from 'change-case';
import {
 addModel, queryModel, removeModel, updateModel, queryModelFields,
} from './service';

import { LfResponse, FilterFormList, LfRequestOption } from '@/interface';
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
    add: Effect;
    remove: Effect;
    update: Effect;
    queryModelFields: Effect;
    queryModelData: Effect;
    fetch?: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
    setColumns: Reducer<StateType>;
    setModelName: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userTableList',

  state: {
    modelName: 'user',
    data: {
      list: [],
      pagination: {},
    },
    columns: [],
  },

  effects: {
    * add({ payload, callback }, { call, put }) {
      yield call(addModel, payload);
      if (callback) callback();
    },
    * remove({ payload, callback }, { call, put }) {
      yield call(removeModel, payload);
      if (callback) callback();
    },
    * update({ payload, callback }, { call, put }) {
      yield call(updateModel, payload);
      if (callback) callback();
    },
    * queryModelFields({ payload, callback }, { call, put }) {

      console.log('[Effects] Query Model Fields: ', payload)
      const response: LfResponse = yield call(queryModelFields, payload);
      // Generate columns from form fields
      const name = payload.url.split('/')[2];
      const fields: FilterFormList[] = response.data.entity;
      const columns: StandardTableColumnProps[] = fields.map(field => {
        field.dataIndex = field.key as string;
        field.title = param(field.key as string);
        field.align = 'left';
        field.sorter = true;
        return field;
      });
      // put columns
      yield put({
        type: 'setColumns',
        payload: columns,
      });
      yield put({
        type: 'setModelName',
        payload: name,
      });
      if (callback) callback();
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
    setModelName(state, action) {
      return {
        ...state,
        modelName: action.payload,
      };
    },
  },
};

export default Model;
