import request from "@/utils/request";

/**
 * 查询记分管理
 * @param params
 */
export async function getInfo(params: any) {
  return request("/api/ZyyjIms/workpoionts/question/getInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增记分管理
 * @param params
 */
export async function saveInfo(params: any) {
  return request("/api/ZyyjIms/workpoionts/question/saveInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改记分管理
 * @param params
 */
export async function updateInfo(params: any) {
  return request("/api/ZyyjIms/workpoionts/question/updateInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除记分管理
 * @param params
 */
export async function delInfo(params: any) {
  return request("/api/ZyyjIms/workpoionts/question/delInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 修改记分管理信息为审批中
 * @param params
 */
export async function sendApproval(params: any) {
  return request("/api/ZyyjIms/workpoionts/question/sendApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}



/**
 * 项目部修改维护管理人员/作业人员 - 修改
 * @param params
 */
export async function updateDetail(params: any) {
  return request("/api/ZyyjIms/workpoionts/question/updateDetail", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}



/**
 * 项目部维护管理人员/作业人员 - 新增
 * @param params
 */
export async function saveDetail(params: any) {
  return request("/api/ZyyjIms/workpoionts/question/saveDetail", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 获取详情信息
 * @param params
 */
export async function getDetailInfo(params: any) {
  return request("/api/ZyyjIms/workpoionts/question/getDetailInfo", {
    method: "GET",
    params,
  });
}


/**
 * 公司查看用户扣分明细
 * @param params
 */
export async function getUserDeductionDetail(params: any) {
  return request("/api/ZyyjIms/workpoionts/question/getUserDeductionDetail", {
    method: "GET",
    params,
  });
}