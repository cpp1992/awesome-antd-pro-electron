import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { message } from 'antd';
import { fakeSubmitForm, submitForm } from './service';

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
    submitRegularForm: Effect;
    submitForm: Effect;
    changeModelName: Effect;
  };
  reducers: {
    save: Reducer<any>;
  }
}
const Model: ModelType = {
  namespace: 'userForm',

  state: {
    modelName: 'userForm',
    modelFields: [],
  },

  effects: {
    * submitRegularForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
    * submitForm({ payload }, { call }) {
      yield call(submitForm, payload);
      message.success('提交成功');
    },
    * changeModelName({ payload }, { put }) {
      console.log('Change Model name: ', payload)
      yield put({
        type: 'save',
        payload,
      })
    },
  },

  reducers: {
    save(state, { payload }) {
      console.log('Save Model name: ', payload)
      return {
        ...state,
        modelName: payload.name,
        modelFields: payload.fields,
      };
    },

  },
};

export default Model;
