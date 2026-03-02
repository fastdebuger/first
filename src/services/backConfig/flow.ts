import request from "@/utils/request";

/**
 * 查询流程业务模块
 * @param params
 */
export async function queryProcessTemplateAssociate(params: any) {
  return request("/api/SegSubcontractor/ProcessTemplate/queryProcessTemplateAssociate", {
    method: "GET",
    params,
  });
}
export async function queryApprovalBusinessProcessTemplate(params: any) {
  return request("/api/flow/ProcessTemplate/queryApprovalBusinessProcessTemplate", {
    method: "GET",
    params,
  });
}
export async function queryGroupIdList(params: any) {
  return request("/api/flow/ProcessTemplate/queryGroupIdList", {
    method: "GET",
    params,
  });
}

/**
 * 保存流程业务模块
 * @param params
 */
export async function saveApprovalBusinessProcessTemplate(params: any) {
  return request("/api/flow/ProcessTemplate/saveApprovalBusinessProcessTemplate", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询流程
 * @param params
 */
export async function queryFlowModel(params: any) {
  return request("/api/flow/model", {
    method: "GET",
    params,
  });
}

/**
 * 根据流程实例号查询该流程的审批人及审批状态
 * @param {string} params.instanceId 流程实例号
 */
export async function getAssigneeAndStatusByInstanceId(params: { instanceId: string }) {
  return request('/api/flow/task/getAssigneeAndStatusByInstanceId', {
    method: 'GET',
    params,
  });
}

/**
 * 审批重新发起和通过按钮
 * {
 *     "taskId": "e0663963-8950-11f0-9cda-fa163e43da21",
 *     "values": {
 *         "isHasApproval": true,
 *         "taskId": "e0663963-8950-11f0-9cda-fa163e43da21",
 *         "system": "segSubcontractor",
 *         "funcCode": "F02",
 *         "instanceId": "fw20250904302",
 *         "id": 466,
 *         "registerFlowNo": "48d579b46d324f43b117376aecfa66cc",
 *         "reboot": true,
 *         "source": "yayang"
 *     },
 *     "comment": {
 *         "content": "",
 *         "taskId": "",
 *         "userId": "",
 *         "attachments": []
 *     },
 *     "langType": "zh-CN",
 *     "tz": 8,
 *     "ts": 1756935441
 * }
 */
export async function flowComplete(params:IflowCompleteProps ) {
  return request('/api/flow/task/complete', {
    method: 'POST',
    data: params,
  });
}
// 审批驳回
export async function flowRefuse(params:IflowCompleteProps ) {
  return request('/api/flow/task/refuse', {
    method: 'POST',
    data: params,
  });
}

export type IflowCompleteProps = {
  taskId: string;
  comment: {
    attachments: any[];
    content: string;
    taskId: string;
    userId: string;
  };
  values: {
    funcCode: string;
    id: number;
    instanceId: string;
    registerFlowNo: string;
    system: string;
    taskId: string;
  } | {}
}

/**
 * 查询流程task_id
 * @param params
 */
export async function aimInstanceTask(params: any) {
  return request("/api/flow/task/aimInstanceTask", {
    method: "GET",
    params,
  });
}


/**
 * 查看已创建流程
 * @param params
 */
export async function getDefineList(params: any) {
  return request("/api/flow/define", {
    method: "GET",
    params,
  });
}


/**
 * 分包商进度款发起审批
 * @param params
 */
export async function startApproval(params: any) {
  return request("/api/ZyyjIms/settlement/subProgressPayment/startApproval", {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 分包商结算发起审批
 * @param params
 */
export async function settlementStartApproval(params: any) {
  return request("/api/ZyyjIms/settlement/subSettlementManagement/startApproval", {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}


/**
 * 分包商签证发起审批
 * @param params
 */
export async function subEngineeringVisaStartApproval(params: any) {
  return request("/api/ZyyjIms/settlement/subEngineeringVisa/startApproval", {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}


/**
 * 获取所有的审批流程列表
 *
 */
export async function getList() {
  const res: any = await queryGroupIdList({
    // offset: '1',
    // limit: '999',
    filter: '[]',
    sort: 'groupId',
    order: 'asc',
    noPage: true
  })

  const meauList: any = {
    SegSubcontractor: '分包商管理系统',
    CivilEngineering: '建筑工程施工管理系统',
    SecondaryDesign: '管道深化设计平台',
    Materials: "物资管理系统",
    PipeWelding: "管道施工管理系统",
    ZyyjIms: '公司信息化管理系统'

  }

  if (res.data && res.data.rows) {
    return res.data.rows.map((item: any) => ({
      id: item.groupId,
      name: meauList[item.groupId],
      sort: item.RowNumber
    }))
  }
}








