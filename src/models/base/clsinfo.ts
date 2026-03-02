import { Effect } from 'umi';
import { Reducer } from '@@/plugin-dva/connect';
import {
  addMaterialClsInfo,
  deleteMaterialClsInfo,
  getMaterialClsInfo,
  updateMaterialClsInfo,
  initSinopec56MaterialClsInfo,
  queryBakData,
  getJiaProdClsWorkBookConfig,
  setJiaProdClsWorkBookConfig,
  queryBackConfigMaterialStatCls
} from '@/services/base/clsinfo';

/**
 * 定义state类型
 */
export interface IMaterialClsInfoStateType {
  materialClsInfoList?: any;
  materialClsInfoListFilter?: any;
}

/**
 * 定义Model数据类型
 */
export interface IMaterialClsInfoModelType {
  namespace: string;
  state: IMaterialClsInfoStateType;
  effects: {
    getJiaProdClsWorkBookConfig: Effect;
    setJiaProdClsWorkBookConfig: Effect;
    queryBakData: Effect;
    getMaterialClsInfo: Effect;
    queryBackConfigMaterialStatCls: Effect;
    updateMaterialClsInfo: Effect;

    addMaterialClsInfo: Effect;

    deleteMaterialClsInfo: Effect;
    initSinopec56MaterialClsInfo: Effect;
    getMaterialClsInfoFilter: Effect;
  };

  reducers: {
    saveMaterialClsInfoList: Reducer<IMaterialClsInfoStateType>;
    saveMaterialClsInfoFilter: Reducer<IMaterialClsInfoStateType>;
  };
}

/**
 * 物料分类信息
 */
const MaterialClsInfoModel: IMaterialClsInfoModelType = {
  namespace: 'materialclsinfo',

  state: {
    materialClsInfoList: [],
    materialClsInfoListFilter: [],
  },

  effects: {
    *queryBackConfigMaterialStatCls({ payload, callback }, { call }) {
      const response = yield call(queryBackConfigMaterialStatCls, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getJiaProdClsWorkBookConfig({ payload, callback }, { call }) {
      const response = yield call(getJiaProdClsWorkBookConfig, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *setJiaProdClsWorkBookConfig({ payload, callback }, { call }) {
      const response = yield call(setJiaProdClsWorkBookConfig, payload);
      if (callback) {
        console.log(333);
        callback(response);
      }
    },
    *queryBakData({ payload, callback }, { call }) {
      const response = yield call(queryBakData, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    * getMaterialClsInfo({ payload, callback }, { call, put }) {
      const response = yield call(getMaterialClsInfo, payload);
      if (response && response.rows && response.rows.length > 0) {
        response.rows.map((item: { key: string; cls_code: any; cls_name: any; }) => (Object.assign(item, { key: `${item.cls_code}-${item.cls_name}` })));
      }
      if (callback) {
        callback(response);
      }
      const leafList: { is_leaf: number }[] = [];
      response.rows.forEach((item: { is_leaf: number }) => {
        if (item && item.is_leaf && Number(item.is_leaf) === 1)
          leafList.push(item);
      });
      yield put({
        type: 'saveMaterialClsInfoList',
        payload: leafList || [],
      });

      // return new Promise((resolve) => {
      //   resolve(response);
      // });
    },

    * getMaterialClsInfoFilter({ payload, callback }, { call, put }) {
      const response = yield call(getMaterialClsInfo, payload);
      if (response && response.rows && response.rows.length > 0) {
        response.rows.map((item: { key: string; cls_code: any; cls_name: any; }) => (Object.assign(item, { key: `${item.cls_code}-${item.cls_name}` })));
      }
      if (callback) {
        callback(response);
      }
      const leafList: { is_leaf: number }[] = [];
      response.rows.forEach((item: { is_leaf: number }) => {
        if (item && item.is_leaf && Number(item.is_leaf) === 1)
          leafList.push(item);
      });
      yield put({
        type: 'saveMaterialClsInfoFilter',
        payload: leafList || [],
      });
    },

    * updateMaterialClsInfo({ payload, callback }, { call }) {
      const response = yield call(updateMaterialClsInfo, payload);
      if (callback) {
        callback(response);
      }
    },

    * addMaterialClsInfo({ payload, callback }, { call }) {
      const response = yield call(addMaterialClsInfo, payload);
      if (callback) {
        callback(response);
      }
    },

    * deleteMaterialClsInfo({ payload, callback }, { call }) {
      const response = yield call(deleteMaterialClsInfo, payload);
      if (callback) {
        callback(response);
      }
    },
    * initSinopec56MaterialClsInfo({ payload, callback }, { call }) {
      const response = yield call(initSinopec56MaterialClsInfo, payload);
      if (callback) {
        callback(response);
      }
    },
  },
  reducers: {
    saveMaterialClsInfoList(state, action) {
      return {
        ...state,
        materialClsInfoList: action.payload,
      };
    },
    saveMaterialClsInfoFilter(state, action) {
      return {
        ...state,
        materialClsInfoListFilter: action.payload,
      };
    },
  },
};

export default MaterialClsInfoModel;
