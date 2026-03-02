import type { Effect } from 'umi';
import type { ResponseGenerator } from '@/typings';
import type { Reducer } from '@@/plugin-dva/connect';

import {
  getMemberCategory,
  addMemberCategory,
  updateMemberCategory,
  deleteMemberCategory,
  deleteAllMember,
} from '@/services/base/steelmembercategory';

/**
 * 定义state类型
 */
export interface ISteelMemberCategoryStateType {
  steelmembercategoryTypeList: [];
}

/**
 * 定义Model数据类型
 */
export interface ISteelMemberCategoryModelType {
  namespace: string;
  state: ISteelMemberCategoryStateType;
  effects: {
    getMemberCategory: Effect;
    addMemberCategory: Effect;
    updateMemberCategory: Effect;
    deleteMemberCategory: Effect;
    deleteAllMember: Effect;
  };

  reducers: {
    saveSteelmembercategoryTypeList: Reducer<ISteelMemberCategoryStateType>;
  };
}

/**
 * 钢构件类别
 */
const SteelMemberCategoryModel: ISteelMemberCategoryModelType = {
  namespace: 'steelmembercategory',

  state: {
    steelmembercategoryTypeList: [],
  },

  effects: {
    *getMemberCategory({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getMemberCategory, payload);
      if (callback) {
        callback(response);
      }
      yield put({
        type: 'saveSteelmembercategoryTypeList',
        payload: response.rows || [],
      });
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addMemberCategory({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(addMemberCategory, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateMemberCategory({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(updateMemberCategory, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteMemberCategory({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(deleteMemberCategory, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteAllMember({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(deleteAllMember, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {
    saveSteelmembercategoryTypeList(state, action) {
      return {
        ...state,
        steelmembercategoryTypeList: action.payload,
      };
    },
  },
};

export default SteelMemberCategoryModel;
