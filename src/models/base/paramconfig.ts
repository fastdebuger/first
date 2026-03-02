import type {Effect, Reducer} from "umi";
import {
  updateFormNoConfig,
  getMaterialFormNoConfig,
  updateMaterialSysParam,
  getMaterialSysParam,
} from '@/services/base/paramconfig';

/**
 * 定义state类型
 */
export interface IMatreialParamConfigStateType {
  list: any[];
}

/**
 * 定义Model数据类型
 */
export interface IMatreialParamConfigModelType {
  namespace: string;
  state: IMatreialParamConfigStateType;
  effects: {
    getMaterialFormNoConfig: Effect;
    updateFormNoConfig: Effect;
    updateMaterialSysParam: Effect;
    getMaterialSysParam: Effect;
  };
  reducers: {
    save: Reducer<IMatreialParamConfigStateType>;
  };
}

/**
 * 物料信息
 */
const MatreialParamConfigModel: IMatreialParamConfigModelType = {
  namespace: 'matreialparamconfig',

  state: {
    list: [],
  },

  effects: {
    // 查询单据号规则配置
    * getMaterialFormNoConfig({payload, callback}, {call}) {
      const response = yield call(getMaterialFormNoConfig, payload);
      if (callback) {
        callback(response);
      }
    },
    // 查询系统参数自定义配置
    * getMaterialSysParam({payload, callback}, {call, put}) {
      const response = yield call(getMaterialSysParam, payload);
      if (callback) {
        callback(response);
      }
      yield put({
        type: 'save',
        payload: response.rows || [],
      });
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    // 修改单据号规则配置
    * updateFormNoConfig({payload, callback}, {call}) {
      const response = yield call(updateFormNoConfig, payload);
      if (callback) {
        callback(response);
      }
    },
    // 修改系统参数自定义配置
    * updateMaterialSysParam({payload, callback}, {call}) {
      const response = yield call(updateMaterialSysParam, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {
    save(state: any, {payload}) {
      console.log(payload)
      return {
        ...state,
        list: payload,
      };
    },
  },
};

export default MatreialParamConfigModel;
