import request from "@/utils/request";
import { ICollectionOfRiskIncidents, ICollectionOfRiskIncidentsApproval, IDelInfo, IGetInfo, IRiskCategoryConfig, ISaveBatch } from "./data";


/**
 * 新增风险时间收集信息
 * @param params
 */
export async function saveInfo(params: ICollectionOfRiskIncidents) {
  return request("/api/ZyyjIms/risk/events/saveInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改风险时间收集信息
 * @param params
 */
export async function updateInfo(params: ICollectionOfRiskIncidents) {
  return request("/api/ZyyjIms/risk/events/updateInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改记风险事件收集信息为审批中
 * @param params
 */
export async function sendApproval(params: ICollectionOfRiskIncidentsApproval) {
  return request("/api/ZyyjIms/risk/events/sendApproval", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 查询风险时间收集信息
 * @param params
 */
export async function getInfo(params: IGetInfo) {
  return request("/api/ZyyjIms/risk/events/getInfo", {
    method: "GET",
    params,
  });
}


/**
 * 查询风险类别配置信息
 * @param params
 */
export async function queryRiskCategoryConfig(params: IRiskCategoryConfig) {
  return request("/api/ZyyjIms/risk/events/queryRiskCategoryConfig", {
    method: "GET",
    params,
  });
}


/**
 * 删除风险时间收集信息
 * @param params
 */
export async function delInfo(params: IDelInfo) {
  return request("/api/ZyyjIms/risk/events/delInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 批量保存记风险事件收集信息
 * @param params
 */
export async function saveBatch(params: ISaveBatch) {
  return request("/api/ZyyjIms/risk/events/saveBatch", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
