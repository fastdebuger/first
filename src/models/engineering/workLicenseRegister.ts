import { Effect } from "umi";
import {ResponseGenerator} from "@/typings";
import {
  getWorkPermit,
  addWorkPermit,
  updateWorkPermit,
  deleteWorkPermit,
  startApproval,
  getProjectMonthlyReport,
  importAttendance,
  getProjectAnnualPlan,
  addProjectAnnualPlan,
  updateProjectAnnualPlan,
  deleteProjectAnnualPlan,

  getAConstructionDivision,
  addAConstructionDivision,
  updateAConstructionDivision,
  deleteAConstructionDivision,
  getAllAreaDict,
  statisticByWorkContent,
  getOutputValuePlanByMonth,
  getInspectorApplication,
  addInspectorApplication,
  deleteInspectorApplication,
  updateInspectorApplication,
  inspectorStartApproval,
  getInspector,
  updateInspector,

  getInspectorAnnualAudit,
  addInspectorAnnualAudit,
  deleteInspectorAnnualAudit,
  updateInspectorAnnualAudit,
  annualAuditStartApproval,

  getMeasureDevice,
  addMeasureDevice,
  deleteMeasureDevice,
  updateMeasureDevice,
  getMeasureDeviceStatistics,
  devicegetCurrApprovalStatus,

  getMeasurePersonnelApplication,  
  addMeasurePersonnelApplication,  
  updateMeasurePersonnelApplication,  
  deleteMeasurePersonnelApplication,  
  personnelStartApproval,
  startApprovalPersonnelAudit,
  deviceStartApproval,
  addMeasureDeviceApproval,
  getMeasureDeviceApproval,
  getMeasurePersonnel,
  queryQualifiedProject,
  updateMeasurePersonnel,
  confirmOnDuty,
  getMeasurePersonnelAudit,
  addMeasurePersonnelAudit,

  getExternalLaboratoryEvaluation,  
  addExternalLaboratoryEvaluation,  
  updateExternalLaboratoryEvaluation,  
  deleteExternalLaboratoryEvaluation,

  startApprovalEvaluation,
  getExternalLaboratory,
  updateExternalLaboratory,

  getExternalLaboratoryAnnualAudit,
  addExternalLaboratoryAnnualAudit,
  startApprovalAnnualAudit,
  getExternalLaboratoryQualification,
  updateExternalLaboratoryQualification,

  queryRiskMonthlyHead,  
  queryRiskMonthlyBody,  
  queryRiskMonthlyFlat,  
  addRiskMonthly,  
  updateRiskMonthly,  
  delRiskMonthly,
  riskMonthlyFlatApprovalStatus,
  addRiskMonthlyApproval,
  getRiskMonthlyApproval,
  riskMonthlyApprovalstartApproval,

  queryRiskAnnualHead,
  queryRiskAnnualBody,
  getCurrApprovalStatus,
  addRiskAnnual,
  delRiskAnnual,
  updateRiskAnnual,
  addRiskAnnualApproval,
  getRiskAnnualApproval,
  startApprovalYearRiskAnnual,
  getVisitPlan,  
  addVisitPlan,  
  updateVisitPlan,  
  deleteVisitPlan,
  visitCurrApprovalStatus,

  getVisitPlanApproval,
  addVisitPlanApproval,
  visitstartApproval,

  getWelderPerformance,  
  addWelderPerformance,  
  updateWelderPerformance,  
  deleteWelderPerformance,

  getWelderPerformanceApproval,
  addWelderPerformanceApproval,
  welderStartApproval,
  weldergetCurrApprovalStatus,
  getWelderInfo,  
  addWelderInfo,  
  updateWelderInfo,  
  deleteWelderInfo,

  queryWelderExamHead,  
  queryWelderExamBody,  
  queryWelderExamFlat,  
  addWelderExam,  
  updateWelderExam,  
  delWelderExam,
  getWelderQualification,  
  addWelderQualification,  
  updateWelderQualification,  
  deleteWelderQualification,

  getMeritPlan,  
  addMeritPlan,  
  updateMeritPlan,  
  deleteMeritPlan,
  meritPlangetCurrApprovalStatus,

  getMeritPlanApproval,
  addMeritPlanApproval,
  MeritStartApproval,
  queryMajorRiskMonthly,
  generateMajorRiskMonthly,
  addRiskPosition,
  queryMajorRiskAnnual,
  generateMajorRiskAnnual,
  addRiskPositionAnnual,
  importMeasureDevice,
  importMeasurePersonnel,
  deleteExternalLaboratoryAnnualAudit,
  addExternalLaboratoryQualification,
  deleteExternalLaboratoryQualification,
  getRiskMonthly,
  deleteRiskMonthly,
  submitRisk,
  updateRiskStatus,
  getRiskSubmitRecord,
  getRiskSubmitRecordTime,
  getVisitPlanSubmitRecordTime,
  submitVisitPlan,
  getWelderList,
  getNextApprover,

  getSpecialEquipmentWorker,
  addSpecialEquipmentWorker,
  updateSpecialEquipmentWorker,
  deleteSpecialEquipmentWorker,
  getWelderExamStatistics,
  updateExternalLaboratoryAnnualAudit,
  updateRiskAnnualRiskStatus,
  addVisitRecordUrl,
  welderExamstartApproval,
} from "@/services/engineering/workLicenseRegister";
import type { Reducer } from '@@/plugin-dva/connect';

/**
 * 定义state类型
 */
export interface IPositionStateType {
  userList?: any;

}

/**
 * 定义Model数据类型
 */
export interface IPositionModelType {
  namespace: string;
  state: IPositionStateType;
  effects: {
    getWorkPermit: Effect;
    addWorkPermit: Effect;
    updateWorkPermit: Effect;
    deleteWorkPermit: Effect;
    startApproval: Effect;
    getProjectMonthlyReport: Effect;
    importAttendance: Effect;
    getProjectAnnualPlan: Effect;
    addProjectAnnualPlan: Effect;
    updateProjectAnnualPlan: Effect;
    deleteProjectAnnualPlan: Effect;

    getAConstructionDivision: Effect;
    addAConstructionDivision: Effect;
    updateAConstructionDivision: Effect;
    deleteAConstructionDivision: Effect;
    getAllAreaDict: Effect;
    statisticByWorkContent: Effect;
    getOutputValuePlanByMonth: Effect;

    getInspectorApplication: Effect;
    addInspectorApplication: Effect;
    deleteInspectorApplication: Effect;
    updateInspectorApplication: Effect;
    inspectorStartApproval: Effect;

    getInspector: Effect;
    updateInspector: Effect;

    getInspectorAnnualAudit: Effect;
    addInspectorAnnualAudit: Effect;
    deleteInspectorAnnualAudit: Effect;
    updateInspectorAnnualAudit: Effect;
    annualAuditStartApproval: Effect;

    getMeasureDevice: Effect;
    addMeasureDevice: Effect;
    deleteMeasureDevice: Effect;
    updateMeasureDevice: Effect;
    getMeasureDeviceStatistics: Effect;
    devicegetCurrApprovalStatus: Effect;

    getMeasurePersonnelApplication: Effect;
    addMeasurePersonnelApplication: Effect;
    updateMeasurePersonnelApplication: Effect;
    deleteMeasurePersonnelApplication: Effect;

    deviceStartApproval: Effect;
    addMeasureDeviceApproval: Effect;
    getMeasureDeviceApproval: Effect;
    personnelStartApproval: Effect;
    startApprovalPersonnelAudit: Effect;
    getMeasurePersonnel: Effect;
    queryQualifiedProject: Effect;
    updateMeasurePersonnel: Effect;
    confirmOnDuty: Effect;

    getMeasurePersonnelAudit: Effect;
    addMeasurePersonnelAudit: Effect;

    getExternalLaboratoryEvaluation: Effect;
    addExternalLaboratoryEvaluation: Effect;
    updateExternalLaboratoryEvaluation: Effect;
    deleteExternalLaboratoryEvaluation: Effect;

    startApprovalEvaluation: Effect;
    getExternalLaboratory: Effect;
    updateExternalLaboratory: Effect;
    
    getExternalLaboratoryAnnualAudit: Effect;
    addExternalLaboratoryAnnualAudit: Effect;
    startApprovalAnnualAudit: Effect;
    getExternalLaboratoryQualification: Effect;
    updateExternalLaboratoryQualification: Effect;
    queryRiskMonthlyHead: Effect;
    queryRiskMonthlyBody: Effect;
    queryRiskMonthlyFlat: Effect;
    addRiskMonthly: Effect;
    updateRiskMonthly: Effect;
    delRiskMonthly: Effect;
    riskMonthlyFlatApprovalStatus: Effect;

    addRiskMonthlyApproval: Effect;
    getRiskMonthlyApproval: Effect;
    riskMonthlyApprovalstartApproval: Effect;

    queryRiskAnnualHead: Effect;
    queryRiskAnnualBody: Effect;
    getCurrApprovalStatus: Effect;
    addRiskAnnual: Effect;
    delRiskAnnual: Effect;
    updateRiskAnnual: Effect;
    addRiskAnnualApproval: Effect;
    getRiskAnnualApproval: Effect;
    startApprovalYearRiskAnnual: Effect;

    getVisitPlan: Effect;
    addVisitPlan: Effect;
    updateVisitPlan: Effect;
    deleteVisitPlan: Effect;
    visitCurrApprovalStatus: Effect;

    getVisitPlanApproval: Effect;
    addVisitPlanApproval: Effect;
    visitstartApproval: Effect;

    getWelderPerformance: Effect;
    addWelderPerformance: Effect;
    updateWelderPerformance: Effect;
    deleteWelderPerformance: Effect;

    getWelderPerformanceApproval: Effect;
    addWelderPerformanceApproval: Effect;
    welderStartApproval: Effect;
    weldergetCurrApprovalStatus: Effect;

    getWelderInfo: Effect;
    addWelderInfo: Effect;
    updateWelderInfo: Effect;
    deleteWelderInfo: Effect;

    queryWelderExamHead: Effect;
    queryWelderExamBody: Effect;
    queryWelderExamFlat: Effect;
    addWelderExam: Effect;
    updateWelderExam: Effect;
    delWelderExam: Effect;

    getWelderQualification: Effect;
    addWelderQualification: Effect;
    updateWelderQualification: Effect;
    deleteWelderQualification: Effect;

    getMeritPlan: Effect;
    addMeritPlan: Effect;
    updateMeritPlan: Effect;
    deleteMeritPlan: Effect;
    meritPlangetCurrApprovalStatus: Effect;

    getMeritPlanApproval: Effect;
    addMeritPlanApproval: Effect;
    MeritStartApproval: Effect;

    queryMajorRiskMonthly: Effect;
    generateMajorRiskMonthly: Effect;
    addRiskPosition: Effect;
    queryMajorRiskAnnual: Effect;
    generateMajorRiskAnnual: Effect;
    addRiskPositionAnnual: Effect;
    importMeasureDevice: Effect;
    importMeasurePersonnel: Effect;
    deleteExternalLaboratoryAnnualAudit: Effect;
    
    addExternalLaboratoryQualification: Effect;
    deleteExternalLaboratoryQualification: Effect;

    getRiskMonthly: Effect;
    deleteRiskMonthly: Effect;
    submitRisk: Effect;
    updateRiskStatus: Effect;
    getRiskSubmitRecord: Effect;
    getRiskSubmitRecordTime: Effect;
    getVisitPlanSubmitRecordTime: Effect;
    submitVisitPlan: Effect;
    getWelderList: Effect;
    getNextApprover: Effect;
    getSpecialEquipmentWorker: Effect;
    addSpecialEquipmentWorker: Effect;
    updateSpecialEquipmentWorker: Effect;
    deleteSpecialEquipmentWorker: Effect;
    getWelderExamStatistics: Effect;
    updateExternalLaboratoryAnnualAudit: Effect;
    updateRiskAnnualRiskStatus: Effect;
    addVisitRecordUrl: Effect;
    welderExamstartApproval: Effect;
  };

  reducers: {
    saveUserList: Reducer;

  };
}

/**
 * 作业许可证登录表
 */
const WorkLicenseRegister: IPositionModelType = {
  namespace: "workLicenseRegister",

  state: {
    userList: [],
  },

  effects: {
    *getWorkPermit({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getWorkPermit, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addWorkPermit({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addWorkPermit, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateWorkPermit({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateWorkPermit, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteWorkPermit({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteWorkPermit, payload);
      if (callback) {
        callback(response);
      }
    },
    *importAttendance({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importAttendance, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    
    *startApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(startApproval, payload);
      if (callback) {
        callback(response);
      }
    },
    *getProjectMonthlyReport({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getProjectMonthlyReport, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getProjectAnnualPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getProjectAnnualPlan, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addProjectAnnualPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addProjectAnnualPlan, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateProjectAnnualPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateProjectAnnualPlan, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *deleteProjectAnnualPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteProjectAnnualPlan, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getAConstructionDivision({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getAConstructionDivision, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addAConstructionDivision({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addAConstructionDivision, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateAConstructionDivision({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateAConstructionDivision, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *deleteAConstructionDivision({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteAConstructionDivision, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getAllAreaDict({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getAllAreaDict, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *statisticByWorkContent({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(statisticByWorkContent, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getOutputValuePlanByMonth({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getOutputValuePlanByMonth, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getInspectorApplication({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getInspectorApplication, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addInspectorApplication({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addInspectorApplication, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *deleteInspectorApplication({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteInspectorApplication, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateInspectorApplication({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateInspectorApplication, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *inspectorStartApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(inspectorStartApproval, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },

    *getInspector({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getInspector, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateInspector({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateInspector, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getInspectorAnnualAudit({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getInspectorAnnualAudit, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addInspectorAnnualAudit({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addInspectorAnnualAudit, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *deleteInspectorAnnualAudit({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteInspectorAnnualAudit, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateInspectorAnnualAudit({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateInspectorAnnualAudit, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *annualAuditStartApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(annualAuditStartApproval, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getMeasureDevice({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getMeasureDevice, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addMeasureDevice({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addMeasureDevice, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *deleteMeasureDevice({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteMeasureDevice, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateMeasureDevice({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateMeasureDevice, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getMeasureDeviceStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getMeasureDeviceStatistics, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *devicegetCurrApprovalStatus({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(devicegetCurrApprovalStatus, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getMeasurePersonnelApplication({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getMeasurePersonnelApplication, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addMeasurePersonnelApplication({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addMeasurePersonnelApplication, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateMeasurePersonnelApplication({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateMeasurePersonnelApplication, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteMeasurePersonnelApplication({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteMeasurePersonnelApplication, payload);
      if (callback) {
        callback(response);
      }
    },
    *deviceStartApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deviceStartApproval, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addMeasureDeviceApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addMeasureDeviceApproval, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getMeasureDeviceApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getMeasureDeviceApproval, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *personnelStartApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(personnelStartApproval, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *startApprovalPersonnelAudit({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(startApprovalPersonnelAudit, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getMeasurePersonnel({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getMeasurePersonnel, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryQualifiedProject({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryQualifiedProject, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateMeasurePersonnel({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateMeasurePersonnel, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *confirmOnDuty({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(confirmOnDuty, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getMeasurePersonnelAudit({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getMeasurePersonnelAudit, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addMeasurePersonnelAudit({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addMeasurePersonnelAudit, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getExternalLaboratoryEvaluation({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getExternalLaboratoryEvaluation, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addExternalLaboratoryEvaluation({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addExternalLaboratoryEvaluation, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateExternalLaboratoryEvaluation({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateExternalLaboratoryEvaluation, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteExternalLaboratoryEvaluation({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteExternalLaboratoryEvaluation, payload);
      if (callback) {
        callback(response);
      }
    },
    *startApprovalEvaluation({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(startApprovalEvaluation, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getExternalLaboratory({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getExternalLaboratory, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateExternalLaboratory({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateExternalLaboratory, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryRiskMonthlyHead({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryRiskMonthlyHead, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryRiskMonthlyBody({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryRiskMonthlyBody, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryRiskMonthlyFlat({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryRiskMonthlyFlat, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addRiskMonthly({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addRiskMonthly, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateRiskMonthly({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateRiskMonthly, payload);
      if (callback) {
        callback(response);
      }
    },
    *delRiskMonthly({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delRiskMonthly, payload);
      if (callback) {
        callback(response);
      }
    },
    *riskMonthlyFlatApprovalStatus({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(riskMonthlyFlatApprovalStatus, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    
    *addRiskMonthlyApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addRiskMonthlyApproval, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getRiskMonthlyApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getRiskMonthlyApproval, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *riskMonthlyApprovalstartApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(riskMonthlyApprovalstartApproval, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryRiskAnnualHead({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryRiskAnnualHead, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryRiskAnnualBody({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryRiskAnnualBody, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getCurrApprovalStatus({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getCurrApprovalStatus, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addRiskAnnual({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addRiskAnnual, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *delRiskAnnual({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delRiskAnnual, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateRiskAnnual({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateRiskAnnual, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addRiskAnnualApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addRiskAnnualApproval, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *startApprovalYearRiskAnnual({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(startApprovalYearRiskAnnual, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getRiskAnnualApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getRiskAnnualApproval, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    
    *getVisitPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getVisitPlan, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addVisitPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addVisitPlan, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateVisitPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateVisitPlan, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteVisitPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteVisitPlan, payload);
      if (callback) {
        callback(response);
      }
    },
    *visitCurrApprovalStatus({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(visitCurrApprovalStatus, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getVisitPlanApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getVisitPlanApproval, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addVisitPlanApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addVisitPlanApproval, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *visitstartApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(visitstartApproval, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getWelderPerformance({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getWelderPerformance, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addWelderPerformance({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addWelderPerformance, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateWelderPerformance({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateWelderPerformance, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteWelderPerformance({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteWelderPerformance, payload);
      if (callback) {
        callback(response);
      }
    },
    *getWelderPerformanceApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getWelderPerformanceApproval, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addWelderPerformanceApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addWelderPerformanceApproval, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *welderStartApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(welderStartApproval, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *weldergetCurrApprovalStatus({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(weldergetCurrApprovalStatus, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getWelderInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getWelderInfo, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addWelderInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addWelderInfo, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateWelderInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateWelderInfo, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteWelderInfo({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteWelderInfo, payload);
      if (callback) {
        callback(response);
      }
    },

    *queryWelderExamHead({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryWelderExamHead, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryWelderExamBody({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryWelderExamBody, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryWelderExamFlat({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryWelderExamFlat, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addWelderExam({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addWelderExam, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateWelderExam({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateWelderExam, payload);
      if (callback) {
        callback(response);
      }
    },
    *delWelderExam({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(delWelderExam, payload);
      if (callback) {
        callback(response);
      }
    },

    *getWelderQualification({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getWelderQualification, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addWelderQualification({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addWelderQualification, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateWelderQualification({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateWelderQualification, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteWelderQualification({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteWelderQualification, payload);
      if (callback) {
        callback(response);
      }
    },

    *getMeritPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getMeritPlan, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addMeritPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addMeritPlan, payload);
      if (callback) {
        callback(response);
      }
    },
    *updateMeritPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateMeritPlan, payload);
      if (callback) {
        callback(response);
      }
    },
    *deleteMeritPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteMeritPlan, payload);
      if (callback) {
        callback(response);
      }
    },
    *meritPlangetCurrApprovalStatus({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(meritPlangetCurrApprovalStatus, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },

    *getMeritPlanApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getMeritPlanApproval, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addMeritPlanApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addMeritPlanApproval, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *MeritStartApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(MeritStartApproval, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    // ++++++++++++++++++++++++++
    *getExternalLaboratoryAnnualAudit({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getExternalLaboratoryAnnualAudit, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addExternalLaboratoryAnnualAudit({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addExternalLaboratoryAnnualAudit, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *startApprovalAnnualAudit({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(startApprovalAnnualAudit, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getExternalLaboratoryQualification({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getExternalLaboratoryQualification, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateExternalLaboratoryQualification({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateExternalLaboratoryQualification, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *queryMajorRiskMonthly({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryMajorRiskMonthly, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *generateMajorRiskMonthly({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(generateMajorRiskMonthly, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addRiskPosition({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addRiskPosition, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    
    *queryMajorRiskAnnual({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(queryMajorRiskAnnual, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *generateMajorRiskAnnual({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(generateMajorRiskAnnual, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addRiskPositionAnnual({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addRiskPositionAnnual, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *importMeasureDevice({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importMeasureDevice, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *importMeasurePersonnel({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(importMeasurePersonnel, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },

    *deleteExternalLaboratoryAnnualAudit({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteExternalLaboratoryAnnualAudit, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addExternalLaboratoryQualification({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addExternalLaboratoryQualification, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *deleteExternalLaboratoryQualification({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteExternalLaboratoryQualification, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getRiskMonthly({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getRiskMonthly, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *deleteRiskMonthly({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteRiskMonthly, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *submitRisk({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(submitRisk, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateRiskStatus({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateRiskStatus, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getRiskSubmitRecord({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getRiskSubmitRecord, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getRiskSubmitRecordTime({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getRiskSubmitRecordTime, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getVisitPlanSubmitRecordTime({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getVisitPlanSubmitRecordTime, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *submitVisitPlan({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(submitVisitPlan, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getWelderList({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getWelderList, payload);
      if (callback) {
        callback(response);
      }
      const employeeList: any = response.rows?.map((item) => {
        if(typeof item === 'object' && item !== null){
          return {
            ...item,
            employee_name: item.employee_code+`（${item.welder_name}）`,
          }
        } else {
          return item;
        }
        
      });
      yield put({
        type: 'saveUserList',
        payload: employeeList || []
      })
      return new Promise((resolve) => {
        resolve(response);
      });
    },

    *getNextApprover({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getNextApprover, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getSpecialEquipmentWorker({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getSpecialEquipmentWorker, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addSpecialEquipmentWorker({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addSpecialEquipmentWorker, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateSpecialEquipmentWorker({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateSpecialEquipmentWorker, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *deleteSpecialEquipmentWorker({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(deleteSpecialEquipmentWorker, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *getWelderExamStatistics({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(getWelderExamStatistics, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateExternalLaboratoryAnnualAudit({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateExternalLaboratoryAnnualAudit, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *updateRiskAnnualRiskStatus({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(updateRiskAnnualRiskStatus, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *addVisitRecordUrl({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(addVisitRecordUrl, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    *welderExamstartApproval({ payload, callback }, { call, put }) {
      const response: ResponseGenerator = yield call(welderExamstartApproval, payload);
      if (callback) {
        callback(response);
      }
      return new Promise((resolve) => {
        resolve(response);
      });
    },
    
    
  },
  reducers: {
    saveUserList(state, { payload }) {
      return {
        ...state,
        userList: payload,
      }
    },
  },
};

export default WorkLicenseRegister;
