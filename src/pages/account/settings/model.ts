import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { CurrentUser, GeographicItemType } from './data.d';
import {
 queryCity, queryCurrent, queryProvince, query as queryUsers,
} from './service';
import { LfResponse, LfService } from '@/interface';

export interface ModalState {
  currentUser?: Partial<CurrentUser>;
  province?: GeographicItemType[];
  city?: GeographicItemType[];
  isLoading?: boolean;
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
    fetchProvince: Effect;
    fetchCity: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<ModalState>;
    changeNotifyCount: Reducer<ModalState>;
    setProvince: Reducer<ModalState>;
    setCity: Reducer<ModalState>;
    changeLoading: Reducer<ModalState>;
  };
}

const Model: ModelType = {
  namespace: 'accountSettings',

  state: {
    currentUser: {},
    province: [],
    city: [],
    isLoading: false,
  },

  effects: {
    * fetch(_, { call, put }) {
      const response: LfResponse = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response.data.entity,
      });
    },
    * fetchCurrent(_, { call, put }) {
      const response: LfResponse = yield call(queryCurrent);
      const payload = response.data.entity;
      yield put({
        type: 'saveCurrentUser',
        payload,
      });
    },
    * fetchProvince(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response: LfResponse = yield call(queryProvince);
      const province: GeographicItemType[] = response.data.entity;
      yield put({
        type: 'setProvince',
        payload: province,
      });
    },
    * fetchCity({ payload }, { call, put }) {
      const response: LfResponse = yield call(queryCity);
      const city: GeographicItemType[] = response.data.entity[payload];
      yield put({
        type: 'setCity',
        payload: city,
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
    changeNotifyCount(state = {}, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
    setProvince(state, action) {
      return {
        ...state,
        province: action.payload,
      };
    },
    setCity(state, action) {
      return {
        ...state,
        city: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        isLoading: action.payload,
      };
    },
  },
};

export default Model;
