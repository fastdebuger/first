import request from '@/utils/request';

/**
 * 查询用户待办信息
 * @param params
 */
export async function queryUserToDoInfo(params: any) {
  return request('/api/basic/user/aut/queryUserToDoInfo', {
    method: 'GET',
    params: params,
  });
}

/**
 * 更新用户待办查看状态
 * @param params
 */
export async function updateUserToDoStatus(params: any) {
  return request("/api/basic/user/aut/updateUserToDoStatus", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

export async function getPendingApproval(params: any) {
  return request('/api/todo/approval/flow/getPendingApproval', {
    method: 'GET',
    params: params,
  });
}


/**
 * 获取审批节点
 * @param params
 */
export async function getApprovalNode(params: any) {
  return request('/api/todo/approval/flow/getApprovalNode', {
    method: 'GET',
    params,
  });
}



/**
 * 发起流程
 * @param params
 * @returns
 */
export async function startProcess(params: any) {
  return request('/api/todo/approval/flow/startProcess', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}


/**
 * 流程通过
 * @param params
 * @returns
 */
export async function complete(params: any) {
  return request('/api/todo/approval/flow/complete', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 流程拒绝
 * @param params
 * @returns
 */
export async function refuse(params: any) {
  return request('/api/todo/approval/flow/refuse', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}




//------------------------  之前用的流程请求 -------------------------

/* 物资系统 Start */
export async function queryProcessInstance(params: any) {
  return request('/api/WMMaterial/frame/process/queryProcessInstance', {
    method: 'GET',
    params,
  });
}

export async function queryProcessInstanceDetails(params: any) {
  return request('/api/WMMaterial/frame/process/queryProcessInstanceDetails', {
    method: 'GET',
    params,
  });
}

export async function updateStepStatus(params: any) {
  return request('/api/WMMaterial/frame/process/updateStepStatusApi', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/* End 物资系统 */
