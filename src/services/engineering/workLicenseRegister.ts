import request from "@/utils/request";

/**
 * 查询作业许可
 * @param params
 */
export async function getWorkPermit(params: any) {
  return request("/api/ZyyjIms/engineering/workPermit/getWorkPermit", {
    method: "GET",
    params,
  });
}

/**
 * 添加作业许可
 * @param params
 */
export async function addWorkPermit(params: any) {
  return request("/api/ZyyjIms/engineering/workPermit/addWorkPermit", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 修改作业许可
 * @param params
 */
export async function updateWorkPermit(params: any) {
  return request("/api/ZyyjIms/engineering/workPermit/updateWorkPermit", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 删除作业许可
 * @param params
 */
export async function deleteWorkPermit(params: any) {
  return request("/api/ZyyjIms/engineering/workPermit/deleteWorkPermit", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 导入作业许可
 * @param params
 */
export async function importAttendance(params: any) {
  return request("/api/ZyyjIms/engineering/workPermit/importAttendance", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 发起审批
 * @param params
 */
export async function startApproval(params: any) {
  return request("/api/ZyyjIms/engineering/workPermit/startApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 项目月报台账
 * @param params
 */
export async function getProjectMonthlyReport(params: any) {
  return request("/api/ZyyjIms/engineering/projectBaseInfo/getProjectMonthlyReport", {
    method: "GET",
    params,
  });
}
// ================================== 年度生产计划
/**
 * 查询年度计划
 * @param params
 */
export async function getProjectAnnualPlan(params: any) {
  return request("/api/ZyyjIms/engineering/ProjectAnnualPlan/getProjectAnnualPlan", {
    method: "GET",
    params,
  });
}
/**
 * 添加年度计划
 * @param params
 */
export async function addProjectAnnualPlan(params: any) {
  return request("/api/ZyyjIms/engineering/ProjectAnnualPlan/addProjectAnnualPlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 修改年度计划
 * @param params
 */
export async function updateProjectAnnualPlan(params: any) {
  return request("/api/ZyyjIms/engineering/ProjectAnnualPlan/updateProjectAnnualPlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 删除年度计划
 * @param params
 */
export async function deleteProjectAnnualPlan(params: any) {
  return request("/api/ZyyjIms/engineering/ProjectAnnualPlan/deleteProjectAnnualPlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询一级建造师
 * @param params
 */
export async function getAConstructionDivision(params: any) {
  return request("/api/ZyyjIms/engineering/AConstructionDivision/getAConstructionDivision", {
    method: "GET",
    params,
  });
}
/**
 * 添加一级建造师
 * @param params
 */
export async function addAConstructionDivision(params: any) {
  return request("/api/ZyyjIms/engineering/AConstructionDivision/addAConstructionDivision", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 修改一级建造师
 * @param params
 */
export async function updateAConstructionDivision(params: any) {
  return request("/api/ZyyjIms/engineering/AConstructionDivision/updateAConstructionDivision", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 删除一级建造师
 * @param params
 */
export async function deleteAConstructionDivision(params: any) {
  return request("/api/ZyyjIms/engineering/AConstructionDivision/deleteAConstructionDivision", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询区域字典
 * @param params
 */
export async function getAllAreaDict(params: any) {
  return request("/api/ZyyjIms/engineering/dict/getAllAreaDict", {
    method: "GET",
    params,
  });
}
/**
 * 根据作业内容名称统计
 * @param params
 */
export async function statisticByWorkContent(params: any) {
  return request("/api/ZyyjIms/engineering/workPermit/statisticByWorkContent", {
    method: "GET",
    params,
  });
}
/**
 * 查询指定月份的施工产值计划
 * @param params
 */
export async function getOutputValuePlanByMonth(params: any) {
  return request("/api/ZyyjIms/engineering/projectBaseInfo/getOutputValuePlanByMonth", {
    method: "GET",
    params,
  });
}

/**
 * 查询质量检查员资格申请表
 * @param params
 */
export async function getInspectorApplication(params: any) {
  return request("/api/ZyyjIms/quality/Inspector/InspectorApplication/getInspectorApplication", {
    method: "GET",
    params,
  });
}
/**
 * 添加质量检查员资格申请表
 * @param params
 */
export async function addInspectorApplication(params: any) {
  return request("/api/ZyyjIms/quality/Inspector/InspectorApplication/addInspectorApplication", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 删除质量检查员资格申请表
 * @param params
 */
export async function deleteInspectorApplication(params: any) {
  return request("/api/ZyyjIms/quality/Inspector/InspectorApplication/deleteInspectorApplication", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 修改质量检查员资格申请表
 * @param params
 */
export async function updateInspectorApplication(params: any) {
  return request("/api/ZyyjIms/quality/Inspector/InspectorApplication/updateInspectorApplication", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 发起审批
 * @param params
 */
export async function inspectorStartApproval(params: any) {
  return request("/api/ZyyjIms/quality/Inspector/InspectorApplication/startApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询质量检查员台账
 * @param params
 */
export async function getInspector(params: any) {
  return request("/api/ZyyjIms/quality/Inspector/Inspector/getInspector", {
    method: "GET",
    params,
  });
}

/**
 * 修改质量检查员台账
 * @param params
 */
export async function updateInspector(params: any) {
  return request("/api/ZyyjIms/quality/Inspector/Inspector/updateInspector", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 查询质量检查员年审
 * @param params
 */
export async function getInspectorAnnualAudit(params: any) {
  return request("/api/ZyyjIms/quality/Inspector/InspectorAnnualAudit/getInspectorAnnualAudit", {
    method: "GET",
    params,
  });
}
/**
 * 添加质量检查员年审
 * @param params
 */
export async function addInspectorAnnualAudit(params: any) {
  return request("/api/ZyyjIms/quality/Inspector/InspectorAnnualAudit/addInspectorAnnualAudit", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 删除质量检查员年审
 * @param params
 */
export async function deleteInspectorAnnualAudit(params: any) {
  return request("/api/ZyyjIms/quality/Inspector/InspectorAnnualAudit/deleteInspectorAnnualAudit", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 修改质量检查员年审
 * @param params
 */
export async function updateInspectorAnnualAudit(params: any) {
  return request("/api/ZyyjIms/quality/Inspector/InspectorAnnualAudit/updateInspectorAnnualAudit", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 质量检查员年审发起审批
 * @param params
 */
export async function annualAuditStartApproval(params: any) {
  return request("/api/ZyyjIms/quality/Inspector/InspectorAnnualAudit/startApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询监视和测量设备登记表
 * @param params
 */
export async function getMeasureDevice(params: any) {
  return request("/api/ZyyjIms/quality/MeasureDevice/MeasureDevice/getMeasureDevice", {
    method: "GET",
    params,
  });
}
/**
 * 添加监视和测量设备登记表
 * @param params
 */
export async function addMeasureDevice(params: any) {
  return request("/api/ZyyjIms/quality/MeasureDevice/MeasureDevice/addMeasureDevice", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 删除监视和测量设备登记表
 * @param params
 */
export async function deleteMeasureDevice(params: any) {
  return request("/api/ZyyjIms/quality/MeasureDevice/MeasureDevice/deleteMeasureDevice", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 修改监视和测量设备登记表
 * @param params
 */
export async function updateMeasureDevice(params: any) {
  return request("/api/ZyyjIms/quality/MeasureDevice/MeasureDevice/updateMeasureDevice", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 查询监视和测量设备登记表，统计
 * @param params
 */
export async function getMeasureDeviceStatistics(params: any) {
  return request("/api/ZyyjIms/quality/MeasureDevice/MeasureDevice/getMeasureDeviceStatistics", {
    method: "GET",
    params,
  });
}
/**
 * 查询当前审批状态(项目部调取)
 * @param params
 */
export async function devicegetCurrApprovalStatus(params: any) {
  return request("/api/ZyyjIms/quality/MeasureDevice/MeasureDevice/getCurrApprovalStatus", {
    method: "GET",
    params,
  });
}


/**
 * 查询计量人员资格申请表
 * @param params
 */
export async function getMeasurePersonnelApplication(params: any) {
  return request("/api/ZyyjIms/quality/MeasurePersonnel/MeasurePersonnelApplication/getMeasurePersonnelApplication", {
    method: "GET",
    params,
  });
}

/**
 * 新增计量人员资格申请表
 * @param params
 */
export async function addMeasurePersonnelApplication(params: any) {
  return request("/api/ZyyjIms/quality/MeasurePersonnel/MeasurePersonnelApplication/addMeasurePersonnelApplication", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改计量人员资格申请表
 * @param params
 */
export async function updateMeasurePersonnelApplication(params: any) {
  return request("/api/ZyyjIms/quality/MeasurePersonnel/MeasurePersonnelApplication/updateMeasurePersonnelApplication", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除计量人员资格申请表
 * @param params
 */
export async function deleteMeasurePersonnelApplication(params: any) {
  return request("/api/ZyyjIms/quality/MeasurePersonnel/MeasurePersonnelApplication/deleteMeasurePersonnelApplication", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 计量人员资格申请表 发起审批
 * @param params
 */
export async function personnelStartApproval(params: any) {
  return request("/api/ZyyjIms/quality/MeasurePersonnel/MeasurePersonnelApplication/startApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 计量人员资格年审 发起审批
 * @param params
 */
export async function startApprovalPersonnelAudit(params: any) {
  return request("/api/ZyyjIms/quality/MeasurePersonnel/MeasurePersonnelAudit/startApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 查询监视和测量设备审批记录
 * @param params
 */
export async function getMeasureDeviceApproval(params: any) {
  return request("/api/ZyyjIms/quality/MeasureDevice/MeasureDeviceApproval/getMeasureDeviceApproval", {
    method: "GET",
    params,
  });
}

/**
 * 添加监视和测量设备审批记录
 * @param params
 */
export async function addMeasureDeviceApproval(params: any) {
  return request("/api/ZyyjIms/quality/MeasureDevice/MeasureDeviceApproval/addMeasureDeviceApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 监视和测量设备发起审批
 * @param params
 */
export async function deviceStartApproval(params: any) {
  return request("/api/ZyyjIms/quality/MeasureDevice/MeasureDeviceApproval/startApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询计量人员台账
 * @param params
 */
export async function getMeasurePersonnel(params: any) {
  return request("/api/ZyyjIms/quality/MeasurePersonnel/MeasurePersonnel/getMeasurePersonnel", {
    method: "GET",
    params,
  });
}
/**
 * 查询计量人员项目资质
 * @param params
 */
export async function queryQualifiedProject(params: any) {
  return request("/api/ZyyjIms/quality/MeasurePersonnel/MeasurePersonnel/queryQualifiedProject", {
    method: "GET",
    params,
  });
}
/**
 * 修改计量人员台账
 * @param params
 */
export async function updateMeasurePersonnel(params: any) {
  return request("/api/ZyyjIms/quality/MeasurePersonnel/MeasurePersonnel/updateMeasurePersonnel", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 确认在岗状态
 * @param params
 */
export async function confirmOnDuty(params: any) {
  return request("/api/ZyyjIms/quality/MeasurePersonnel/MeasurePersonnel/confirmOnDuty", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询计量人员复审
 * @param params
 */
export async function getMeasurePersonnelAudit(params: any) {
  return request("/api/ZyyjIms/quality/MeasurePersonnel/MeasurePersonnelAudit/getMeasurePersonnelAudit", {
    method: "GET",
    params,
  });
}

/**
 * 添加计量人员复审
 * @param params
 */
export async function addMeasurePersonnelAudit(params: any) {
  return request("/api/ZyyjIms/quality/MeasurePersonnel/MeasurePersonnelAudit/addMeasurePersonnelAudit", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询外委实验室调查评价
 * @param params
 */
export async function getExternalLaboratoryEvaluation(params: any) {
  return request("/api/ZyyjIms/quality/externalLaboratory/ExternalLaboratoryEvaluation/getExternalLaboratoryEvaluation", {
    method: "GET",
    params,
  });
}

/**
 * 新增外委实验室调查评价
 * @param params
 */
export async function addExternalLaboratoryEvaluation(params: any) {
  return request("/api/ZyyjIms/quality/externalLaboratory/ExternalLaboratoryEvaluation/addExternalLaboratoryEvaluation", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改外委实验室调查评价
 * @param params
 */
export async function updateExternalLaboratoryEvaluation(params: any) {
  return request("/api/ZyyjIms/quality/externalLaboratory/ExternalLaboratoryEvaluation/updateExternalLaboratoryEvaluation", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除外委实验室调查评价
 * @param params
 */
export async function deleteExternalLaboratoryEvaluation(params: any) {
  return request("/api/ZyyjIms/quality/externalLaboratory/ExternalLaboratoryEvaluation/deleteExternalLaboratoryEvaluation", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 发起审批 外委实验室调查评价
 * @param params
 */
export async function startApprovalEvaluation(params: any) {
  return request("/api/ZyyjIms/quality/externalLaboratory/ExternalLaboratoryEvaluation/startApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 查询外委实验室台账
 * @param params
 */
export async function getExternalLaboratory(params: any) {
  return request("/api/ZyyjIms/quality/externalLaboratory/ExternalLaboratory/getExternalLaboratory", {
    method: "GET",
    params,
  });
}

/**
 * 修改外委实验室台账
 * @param params
 */
export async function updateExternalLaboratory(params: any) {
  return request("/api/ZyyjIms/quality/externalLaboratory/ExternalLaboratoryQualification/updateExternalLaboratoryInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 查询外委实验室年审
 * @param params
 */
export async function getExternalLaboratoryAnnualAudit(params: any) {
  return request("/api/ZyyjIms/quality/externalLaboratory/ExternalLaboratoryAnnualAudit/getExternalLaboratoryAnnualAudit", {
    method: "GET",
    params,
  });
}
/**
 * 添加外委实验室年审
 * @param params
 */
export async function addExternalLaboratoryAnnualAudit(params: any) {
  return request("/api/ZyyjIms/quality/externalLaboratory/ExternalLaboratoryAnnualAudit/addExternalLaboratoryAnnualAudit", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 修改外委实验室年审
 * @param params
 */
export async function updateExternalLaboratoryAnnualAudit(params: any) {
  return request("/api/ZyyjIms/quality/externalLaboratory/ExternalLaboratoryAnnualAudit/updateExternalLaboratoryAnnualAudit", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除外委实验室年审
 * @param params
 */
export async function deleteExternalLaboratoryAnnualAudit(params: any) {
  return request("/api/ZyyjIms/quality/externalLaboratory/ExternalLaboratoryAnnualAudit/deleteExternalLaboratoryAnnualAudit", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 添加外委实验室年审 发起审批
 * @param params
 */
export async function startApprovalAnnualAudit(params: any) {
  return request("/api/ZyyjIms/quality/externalLaboratory/ExternalLaboratoryAnnualAudit/startApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询外委实验室资质
 * @param params
 */
export async function getExternalLaboratoryQualification(params: any) {
  return request("/api/ZyyjIms/quality/externalLaboratory/ExternalLaboratoryQualification/getExternalLaboratoryQualification", {
    method: "GET",
    params,
  });
}
/**
 * 添加外委实验室资质
 * @param params
 */
export async function addExternalLaboratoryQualification(params: any) {
  return request("/api/ZyyjIms/quality/externalLaboratory/ExternalLaboratoryQualification/addExternalLaboratoryQualification", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 删除外委实验室资质
 * @param params
 */
export async function deleteExternalLaboratoryQualification(params: any) {
  return request("/api/ZyyjIms/quality/externalLaboratory/ExternalLaboratoryQualification/deleteExternalLaboratoryQualification", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 修改外委实验室资质
 * @param params
 */
export async function updateExternalLaboratoryQualification(params: any) {
  return request("/api/ZyyjIms/quality/externalLaboratory/ExternalLaboratoryQualification/updateExternalLaboratoryEvaluation", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/**
 * 查询月度质量风险评估
 * @param params
 */
export async function queryRiskMonthlyHead(params: any) {
  return request("/api/ZyyjIms/quality/risk/RiskMonthly/queryRiskMonthlyHead", {
    method: "GET",
    params,
  });
}
/**
 * 查询月度质量风险评估
 * @param params
 */
export async function queryRiskMonthlyBody(params: any) {
  return request("/api/ZyyjIms/quality/risk/RiskMonthly/queryRiskMonthlyBody", {
    method: "GET",
    params,
  });
}
/**
 * 查询月度质量风险评估
 * @param params
 */
export async function queryRiskMonthlyFlat(params: any) {
  return request("/api/ZyyjIms/quality/risk/RiskMonthly/queryRiskMonthlyFlat", {
    method: "GET",
    params,
  });
}
/**
 * 查询月度质量风险评估
 * @param params
 */
export async function getRiskMonthly(params: any) {
  return request("/api/ZyyjIms/quality/risk/RiskMonthly/getRiskMonthly", {
    method: "GET",
    params,
  });
}
/**
 * 新增月度质量风险评估
 * @param params
 */
export async function addRiskMonthly(params: any) {
  return request("/api/ZyyjIms/quality/risk/RiskMonthly/addRiskMonthly", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 删除月度重大质量风险
 * @param params
 */
export async function deleteRiskMonthly(params: any) {
  return request("/api/ZyyjIms/quality/risk/RiskMonthly/deleteRiskMonthly", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改月度质量风险评估
 * @param params
 */
export async function updateRiskMonthly(params: any) {
  return request("/api/ZyyjIms/quality/risk/RiskMonthly/updateRiskMonthly", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 提交重大质量风险
 * @param params
 */
export async function submitRisk(params: any) {
  return request("/api/ZyyjIms/quality/risk/submitRecord/submitRisk", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 批量更新月度重大质量风险状态
 * @param params
 */
export async function updateRiskStatus(params: any) {
  return request("/api/ZyyjIms/quality/risk/RiskMonthly/updateRiskStatus", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 批量更新年度重大质量风险状态
 * @param params
 */
export async function updateRiskAnnualRiskStatus(params: any) {
  return request("/api/ZyyjIms/quality/risk/RiskAnnual/updateRiskStatus", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询风险提交记录
 * @param params
 */
export async function getRiskSubmitRecord(params: any) {
  return request("/api/ZyyjIms/quality/risk/submitRecord/getRiskSubmitRecord", {
    method: "GET",
    params,
  });
}
/**
 * 查询风险提交记录
 * @param params
 */
export async function getRiskSubmitRecordTime(params: any) {
  return request("/api/ZyyjIms/quality/risk/submitRecord/getRiskSubmitRecordTime", {
    method: "GET",
    params,
  });
}
/**
 * 删除月度质量风险评估
 * @param params
 */
export async function delRiskMonthly(params: any) {
  return request("/api/ZyyjIms/quality/risk/RiskMonthly/delRiskMonthly", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 查询当前审批状态(项目部调取)
 * @param params
 */
export async function riskMonthlyFlatApprovalStatus(params: any) {
  return request("/api/ZyyjIms/quality/risk/RiskMonthly/getCurrApprovalStatus", {
    method: "GET",
    params,
  });
}

/**
 * 添加月度质量风险审批记录
 * @param params
 */
export async function addRiskMonthlyApproval(params: any) {
  return request("/api/ZyyjIms/quality/risk/RiskMonthlyApproval/addRiskMonthlyApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 查询月度质量风险审批记录
 * @param params
 */
export async function getRiskMonthlyApproval(params: any) {
  return request("/api/ZyyjIms/quality/risk/RiskMonthlyApproval/getRiskMonthlyApproval", {
    method: "GET",
    params,
  });
}

/**
 * 月度质量风险审批记录 发起审批  
 * @param params
 */
export async function riskMonthlyApprovalstartApproval(params: any) {
  return request("/api/ZyyjIms/quality/risk/RiskMonthlyApproval/startApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 查询年度质量风险表头
 * @param params
 */
export async function queryRiskAnnualHead(params: any) {
  return request("/api/ZyyjIms/quality/risk/RiskAnnual/queryRiskAnnualHead", {
    method: "GET",
    params,
  });
}
/**
 * 查询年度质量风险表体
 * @param params
 */
export async function queryRiskAnnualBody(params: any) {
  return request("/api/ZyyjIms/quality/risk/RiskAnnual/queryRiskAnnualBody", {
    method: "GET",
    params,
  });
}
/**
 * 查询当前审批状态(项目部调取)
 * @param params
 */
export async function getCurrApprovalStatus(params: any) {
  return request("/api/ZyyjIms/quality/risk/RiskAnnual/getCurrApprovalStatus", {
    method: "GET",
    params,
  });
}
/**
 * 添加年度质量风险
 * @param params
 */
export async function addRiskAnnual(params: any) {
  return request("/api/ZyyjIms/quality/risk/RiskAnnual/addRiskAnnual", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 删除年度质量风险
 * @param params
 */
export async function delRiskAnnual(params: any) {
  return request("/api/ZyyjIms/quality/risk/RiskAnnual/delRiskAnnual", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 修改年度质量风险
 * @param params
 */
export async function updateRiskAnnual(params: any) {
  return request("/api/ZyyjIms/quality/risk/RiskAnnual/updateRiskAnnual", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 添加年度质量风险审批记录
 * @param params
 */
export async function addRiskAnnualApproval(params: any) {
  return request("/api/ZyyjIms/quality/risk/RiskAnnualApproval/addRiskAnnualApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 查询年度质量风险审批记录
 * @param params
 */
export async function getRiskAnnualApproval(params: any) {
  return request("/api/ZyyjIms/quality/risk/RiskAnnualApproval/getRiskAnnualApproval", {
    method: "GET",
    params,
  });
}
/**
 *  发起审批
 * @param params
 */
export async function startApprovalYearRiskAnnual(params: any) {
  return request("/api/ZyyjIms/quality/risk/RiskAnnualApproval/startApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++=

/**
 * 查询质量回访计划
 * @param params
 */
export async function getVisitPlan(params: any) {
  return request("/api/ZyyjIms/quality/visit/VisitPlan/getVisitPlan", {
    method: "GET",
    params,
  });
}
/**
 * 查询当前审批状态(项目部调取)
 * @param params
 */
export async function visitCurrApprovalStatus(params: any) {
  return request("/api/ZyyjIms/quality/visit/VisitPlan/getCurrApprovalStatus", {
    method: "GET",
    params,
  });
}
/**
 * 新增质量回访计划
 * @param params
 */
export async function addVisitPlan(params: any) {
  return request("/api/ZyyjIms/quality/visit/VisitPlan/addVisitPlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改质量回访计划
 * @param params
 */
export async function updateVisitPlan(params: any) {
  return request("/api/ZyyjIms/quality/visit/VisitPlan/updateVisitPlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除质量回访计划
 * @param params
 */
export async function deleteVisitPlan(params: any) {
  return request("/api/ZyyjIms/quality/visit/VisitPlan/deleteVisitPlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询质量回访计划审批记录
 * @param params
 */
export async function getVisitPlanApproval(params: any) {
  return request("/api/ZyyjIms/quality/visit/VisitPlanApproval/getVisitPlanApproval", {
    method: "GET",
    params,
  });
}

/**
 * 添加质量回访计划审批记录
 * @param params
 */
export async function addVisitPlanApproval(params: any) {
  return request("/api/ZyyjIms/quality/visit/VisitPlanApproval/addVisitPlanApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询质量回访计划审批记录 发起审批
 * @param params
 */
export async function visitstartApproval(params: any) {
  return request("/api/ZyyjIms/quality/visit/VisitPlanApproval/startApproval", {
    method: "GET",
    params,
  });
}
/**
 * 查询回访计划提交时间
 * @param params
 */
export async function getVisitPlanSubmitRecordTime(params: any) {
  return request("/api/ZyyjIms/quality/visit/VisitPlanSubmit/getVisitPlanSubmitRecordTime", {
    method: "GET",
    params,
  });
}
/**
 * 提交回访计划
 * @param params
 */
export async function submitVisitPlan(params: any) {
  return request("/api/ZyyjIms/quality/visit/VisitPlanSubmit/submitVisitPlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 提交回访计划
 * @param params
 */
export async function addVisitRecordUrl(params: any) {
  return request("/api/ZyyjIms/quality/visit/VisitPlan/addVisitRecordUrl", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 查询焊工业绩
 * @param params
 */
export async function getWelderPerformance(params: any) {
  return request("/api/ZyyjIms/quality/welderPerformance/WelderPerformance/getWelderPerformance", {
    method: "GET",
    params,
  });
}
/**
 * 查询焊工业绩人员列表
 * @param params
 */
export async function getWelderList(params: any) {
  return request("/api/ZyyjIms/quality/welderPerformance/WelderPerformance/getWelderList", {
    method: "GET",
    params,
  });
}
/**
 * 查询焊工业绩人员列表
 * @param params
 */
export async function getNextApprover(params: any) {
  return request("/api/ZyyjIms/quality/welderPerformance/WelderPerformance/getNextApprover", {
    method: "GET",
    params,
  });
}

/**
 * 新增焊工业绩
 * @param params
 */
export async function addWelderPerformance(params: any) {
  return request("/api/ZyyjIms/quality/welderPerformance/WelderPerformance/addWelderPerformance", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改焊工业绩
 * @param params
 */
export async function updateWelderPerformance(params: any) {
  return request("/api/ZyyjIms/quality/welderPerformance/WelderPerformance/updateWelderPerformance", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除焊工业绩
 * @param params
 */
export async function deleteWelderPerformance(params: any) {
  return request("/api/ZyyjIms/quality/welderPerformance/WelderPerformance/deleteWelderPerformance", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询当前审批状态(项目部调取)
 * @param params
 */
export async function weldergetCurrApprovalStatus(params: any) {
  return request("/api/ZyyjIms/quality/welderPerformance/WelderPerformance/getCurrApprovalStatus", {
    method: "GET",
    params,
  });
}
/**
 * 查询焊工业绩审批记录
 * @param params
 */
export async function getWelderPerformanceApproval(params: any) {
  return request("/api/ZyyjIms/quality/welderPerformance/WelderPerformanceApproval/getWelderPerformanceApproval", {
    method: "GET",
    params,
  });
}

/**
 * 添加焊工业绩审批记录
 * @param params
 */
export async function addWelderPerformanceApproval(params: any) {
  return request("/api/ZyyjIms/quality/welderPerformance/WelderPerformanceApproval/addWelderPerformanceApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 焊工业绩 发起审批
 * @param params
 */
export async function welderStartApproval(params: any) {
  return request("/api/ZyyjIms/quality/welderPerformance/WelderPerformanceApproval/startApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 查询特种设备作业人员台账
 * @param params
 */
export async function getWelderInfo(params: any) {
  return request("/api/ZyyjIms/quality/welder/WelderInfo/getWelderInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增特种设备作业人员台账
 * @param params
 */
export async function addWelderInfo(params: any) {
  return request("/api/ZyyjIms/quality/welder/WelderInfo/addWelderInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改特种设备作业人员台账
 * @param params
 */
export async function updateWelderInfo(params: any) {
  return request("/api/ZyyjIms/quality/welder/WelderInfo/updateWelderInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除特种设备作业人员台账
 * @param params
 */
export async function deleteWelderInfo(params: any) {
  return request("/api/ZyyjIms/quality/welder/WelderInfo/deleteWelderInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询焊工考试项目汇总
 * @param params
 */
export async function queryWelderExamHead(params: any) {
  return request("/api/ZyyjIms/quality/welder/WelderExam/queryWelderExamHead", {
    method: "GET",
    params,
  });
}
/**
 * 查询焊工考试项目汇总
 * @param params
 */
export async function queryWelderExamBody(params: any) {
  return request("/api/ZyyjIms/quality/welder/WelderExam/queryWelderExamBody", {
    method: "GET",
    params,
  });
}
/**
 * 查询焊工考试项目汇总
 * @param params
 */
export async function queryWelderExamFlat(params: any) {
  return request("/api/ZyyjIms/quality/welder/WelderExam/queryWelderExamFlat", {
    method: "GET",
    params,
  });
}

/**
 * 新增焊工考试项目汇总
 * @param params
 */
export async function addWelderExam(params: any) {
  return request("/api/ZyyjIms/quality/welder/WelderExam/addWelderExam", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改焊工考试项目汇总
 * @param params
 */
export async function updateWelderExam(params: any) {
  return request("/api/ZyyjIms/quality/welder/WelderExam/updateWelderExam", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除焊工考试项目汇总
 * @param params
 */
export async function delWelderExam(params: any) {
  return request("/api/ZyyjIms/quality/welder/WelderExam/delWelderExam", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除焊工考试项目汇总
 * @param params
 */
export async function welderExamstartApproval(params: any) {
  return request("/api/ZyyjIms/quality/welder/WelderExam/startApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询焊工资格情况统计
 * @param params
 */
export async function getWelderExamStatistics(params: any) {
  return request("/api/ZyyjIms/quality/welder/WelderExam/getWelderExamStatistics", {
    method: "GET",
    params,
  });
}

/**
 * 查询焊工资格情况统计
 * @param params
 */
export async function getWelderQualification(params: any) {
  return request("/api/ZyyjIms/quality/welder/WelderQualification/getWelderQualification", {
    method: "GET",
    params,
  });
}

/**
 * 新增焊工资格情况统计
 * @param params
 */
export async function addWelderQualification(params: any) {
  return request("/api/ZyyjIms/quality/welder/WelderQualification/addWelderQualification", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改焊工资格情况统计
 * @param params
 */
export async function updateWelderQualification(params: any) {
  return request("/api/ZyyjIms/quality/welder/WelderQualification/updateWelderQualification", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除焊工资格情况统计
 * @param params
 */
export async function deleteWelderQualification(params: any) {
  return request("/api/ZyyjIms/quality/welder/WelderQualification/deleteWelderQualification", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 查询创优情况计划
 * @param params
 */
export async function getMeritPlan(params: any) {
  return request("/api/ZyyjIms/quality/merit/MeritPlan/getMeritPlan", {
    method: "GET",
    params,
  });
}

/**
 * 新增创优情况计划
 * @param params
 */
export async function addMeritPlan(params: any) {
  return request("/api/ZyyjIms/quality/merit/MeritPlan/addMeritPlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改创优情况计划
 * @param params
 */
export async function updateMeritPlan(params: any) {
  return request("/api/ZyyjIms/quality/merit/MeritPlan/updateMeritPlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除创优情况计划
 * @param params
 */
export async function deleteMeritPlan(params: any) {
  return request("/api/ZyyjIms/quality/merit/MeritPlan/deleteMeritPlan", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 查询当前审批状态(项目部调取)
 * @param params
 */
export async function meritPlangetCurrApprovalStatus(params: any) {
  return request("/api/ZyyjIms/quality/merit/MeritPlan/getCurrApprovalStatus", {
    method: "GET",
    params,
  });
}
/**
 * 查询创优情况计划审批记录
 * @param params
 */
export async function getMeritPlanApproval(params: any) {
  return request("/api/ZyyjIms/quality/merit/MeritPlanApproval/getMeritPlanApproval", {
    method: "GET",
    params,
  });
}


/**
 * 删除创优情况计划
 * @param params
 */
export async function addMeritPlanApproval(params: any) {
  return request("/api/ZyyjIms/quality/merit/MeritPlanApproval/addMeritPlanApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 创优情况计划-发起审批
 * @param params
 */
export async function MeritStartApproval(params: any) {
  return request("/api/ZyyjIms/quality/merit/MeritPlanApproval/startApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询月度重大质量风险
 * @param params
 */
export async function queryMajorRiskMonthly(params: any) {
  return request("/api/ZyyjIms/quality/risk/RiskMonthly/queryMajorRiskMonthly", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 生成月度重大质量风险
 * @param params
 */
export async function generateMajorRiskMonthly(params: any) {
  return request("/api/ZyyjIms/quality/risk/RiskMonthly/generateMajorRiskMonthly", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 添加风险部位
 * @param params
 */
export async function addRiskPosition(params: any) {
  return request("/api/ZyyjIms/quality/risk/RiskMonthly/addRiskPosition", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询年度重大质量风险
 * @param params
 */
export async function queryMajorRiskAnnual(params: any) {
  return request("/api/ZyyjIms/quality/risk/RiskAnnual/queryMajorRiskAnnual", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 生成年度重大质量风险
 * @param params
 */
export async function generateMajorRiskAnnual(params: any) {
  return request("/api/ZyyjIms/quality/risk/RiskAnnual/generateMajorRiskAnnual", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 生成年度重大质量风险
 * @param params
 */
export async function addRiskPositionAnnual(params: any) {
  return request("/api/ZyyjIms/quality/risk/RiskAnnual/addRiskPosition", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 导入监视和测量设备登记表
 * @param params
 */
export async function importMeasureDevice(params: any) {
  return request("/api/ZyyjIms/quality/MeasureDevice/MeasureDevice/importMeasureDevice", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 导入计量人员
 * @param params
 */
export async function importMeasurePersonnel(params: any) {
  return request("/api/ZyyjIms/quality/MeasurePersonnel/MeasurePersonnel/importMeasurePersonnel", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 查询特种设备作业人员台账
 * @param params
 */
export async function getSpecialEquipmentWorker(params: any) {
  return request("/api/ZyyjIms/quality/welder/SpecialEquipmentWorker/getSpecialEquipmentWorker", {
    method: "GET",
    params,
  });
}
/**
 * 添加特种设备作业人员台账
 * @param params
 */
export async function addSpecialEquipmentWorker(params: any) {
  return request("/api/ZyyjIms/quality/welder/SpecialEquipmentWorker/addSpecialEquipmentWorker", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 修改特种设备作业人员台账
 * @param params
 */
export async function updateSpecialEquipmentWorker(params: any) {
  return request("/api/ZyyjIms/quality/welder/SpecialEquipmentWorker/updateSpecialEquipmentWorker", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
/**
 * 删除特种设备作业人员台账
 * @param params
 */
export async function deleteSpecialEquipmentWorker(params: any) {
  return request("/api/ZyyjIms/quality/welder/SpecialEquipmentWorker/deleteSpecialEquipmentWorker", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
