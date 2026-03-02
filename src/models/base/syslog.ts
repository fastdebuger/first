import { Effect } from "umi";
import { Reducer } from "@@/plugin-dva/connect";
import {
  queryMaterialSysLog
} from '@/services/base/syslog';

/**
 * 定义state类型
 */
export interface IMaterialSysLogStateType {
  materialSysLogList?: any;
}

/**
 * 定义Model数据类型
 */
export interface IMaterialSysLogModelType {
  namespace: string;
  state: IMaterialSysLogStateType;
  effects: {
    queryMaterialSysLog: Effect;
  };

  reducers: {
    saveMaterialSysLogList: Reducer<IMaterialSysLogStateType>;
  };
}

/**
 * 系统日志
 */
const MaterialSysLogModel: IMaterialSysLogModelType = {
  namespace: "materialsysLog",

  state: {
    materialSysLogList: [],
  },

  effects: {
    *queryMaterialSysLog({ payload, callback }, { call, put }) {
      const response = yield call(queryMaterialSysLog, payload);
      if (callback) {
        callback(response);
      }

      yield put({
        type: "saveMaterialSysLogList",
        payload: response.rows || [],
      });

      return new Promise((resolve) => {
        resolve(response);
      });
    },
  },
  reducers: {
    saveMaterialSysLogList(state, action) {
      return {
        ...state,
        materialSysLogList: action.payload,
      };
    },
  },
};

export default MaterialSysLogModel;
