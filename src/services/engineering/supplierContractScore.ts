import request from "@/utils/request";


/**
 * 查询供应商合同得分
 * @param params
 */
export async function querySupplierContractScoreBody(params: any) {
  return request("/api/ZyyjIms/engineering/SupplierContractScore/querySupplierContractScore", {
    method: "GET",
    params,
  });
}


/**
 * 修改供应商合同得分
 * @param params
 */
export async function updateSupplierContractScore(params: any) {
  return request("/api/ZyyjIms/engineering/SupplierContractScore/updateSupplierContractScore", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除供应商合同得分
 * @param params
 */
export async function delSupplierContractScore(params: any) {
  return request("/api/ZyyjIms/engineering/SupplierContractScore/delSupplierContractScore", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 添加供应商合同得分表体
 * @param params
 */
export async function addSupplierContractScoreBody(params: any) {
  return request("/api/ZyyjIms/engineering/SupplierContractScore/addSupplierContractScore", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 添加供应商合同得分
 * @param params
 */
export async function addSupplierContractScore(params: any) {
  return request("/api/ZyyjIms/engineering/SupplierContractScore/addSupplierContractScore", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}




/**
 * 查询二级单位联系人
 * @param params
 */
export async function getUnitLinkman(params: any) {
  return request("/api/ZyyjIms/engineering/SupplierContractScore/getUnitLinkman", {
    method: "GET",
    params,
  });
}

/**
 * 添加二级单位联系人
 * @param params
 */
export async function addSupplierUnitLinkman(params: any) {
  return request("/api/ZyyjIms/engineering/SupplierContractScore/addSupplierUnitLinkman", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 更新二级单位联系人
 * @param params
 */
export async function updateSupplierUnitLinkman(params: any) {
  return request("/api/ZyyjIms/engineering/SupplierContractScore/updateSupplierUnitLinkman", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
