import type { Effect } from 'umi';
import {
  getUserRelationData,
  batchSetUserDefaultDep,
} from '@/services/user';
import type { ResponseGenerator } from '@/typings';

export type ConfigUserWbsModelState = {
  currentUser?: any;
};

export type ConfigUserWbsModelType = {
  namespace: string;
  state: ConfigUserWbsModelState;
  effects: {
    getUserRelationData: Effect;
    batchSetUserDefaultDep: Effect;
  };
  reducers: {};
};

const ConfigUserWbsModel: ConfigUserWbsModelType = {
  namespace: 'configuserwbs',

  state: {
    currentUser: {},
  },

  effects: {
    *getUserRelationData({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(getUserRelationData, payload);
      if (callback) {
        callback(response);
      }
    },
    *batchSetUserDefaultDep({ payload, callback }, { call }) {
      const response: ResponseGenerator = yield call(batchSetUserDefaultDep, payload);
      if (callback) {
        callback(response);
      }
    },
  },

  reducers: {},
};

export default ConfigUserWbsModel;


