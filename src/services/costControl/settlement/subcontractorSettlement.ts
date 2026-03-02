import request from "@/utils/request";

/**
 * 查询分包结算管理
 * @param params
 */
export async function getSubSettlementManagement(params: any) {
  return request("/api/ZyyjIms/settlement/subSettlementManagement/getSubSettlementManagement", {
    method: "GET",
    params,
  });
}

/**
 * 新增分包合同结算管理
 * @param params
 */
export async function addSubSettlementManagement(params: any) {
  return request("/api/ZyyjIms/settlement/subSettlementManagement/addSubSettlementManagement", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改分包合同结算管理
 * @param params
 */
export async function updateSubSettlementManagement(params: any) {
  return request("/api/ZyyjIms/settlement/subSettlementManagement/updateSubSettlementManagement", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除分包合同结算管理
 * @param params
 */
export async function deleteSubSettlementManagement(params: any) {
  return request("/api/ZyyjIms/settlement/subSettlementManagement/deleteSubSettlementManagement", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 导出分包合同结算管理
 * @param params
 */
export async function exportSubSettlementManagement(params: any) {
  return request("/api/ZyyjIms/settlement/subSettlementManagement/exportSubSettlementManagement", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * OCR识别分包合同结算
 * @param file 文件对象
 */
export async function analysisSubSettlementManagementOcr(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  return request("/api/ZyyjIms/settlement/ocr/analysisSubSettlementManagementOcr", {
    method: "POST",
    data: formData,
    requestType: "form",
  });
}

/**
 * 新增分包合同结算管理OCR
 * @param params
 */
export async function addSubSettlementManagementOcr(params: any) {
  return request("/api/ZyyjIms/settlement/ocr/addSubSettlementManagementOcr", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}




