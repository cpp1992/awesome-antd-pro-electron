import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { message } from 'antd';
import { fakeSubmitForm, submitForm, queryModelFields } from './service';
import { LfResponse } from '@/interface';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: {
    modelName: string;
    modelFields: any[];
  };
  effects: {
    fakeSubmitForm: Effect;
    submitForm: Effect;
    queryModelFields: Effect;
    changeModelName: Effect;
  };
  reducers: {
    save: Reducer<any>;
  }
}
const Model: ModelType = {
  namespace: 'userForm',

  state: {
    modelName: 'user',
    modelFields: [],
  },

  effects: {
    * fakeSubmitForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
    * submitForm({ payload }, { call }) {
      yield call(submitForm, payload);
      message.success('提交成功');
    },
    * queryModelFields({ payload }, { call, put }) {
      console.log('[Effects] Query Model payload: ', payload)
      const response: LfResponse = yield call(queryModelFields, payload);
      const name = payload.url.split('/')[2];
      const fields = response.data.entity;
      yield put({
        type: 'save',
        payload: {
          name,
          fields,
        },
      });
    },
    * changeModelName({ payload }, { call, put }) {
      // Called from global/queryModelFields
      console.log('[Effects] Change Model payload: ', payload)
      yield put({
        type: 'save',
        payload,
      })
    },
  },

  reducers: {
    save(state, { payload }) {
      console.log('[Reducer] Save Model: ', payload)
      return {
        ...state,
        modelName: payload.name,
        modelFields: payload.fields,
      };
    },

  },
};

export default Model;
