import request from "@/utils/request";

/**
 * 查询物料信息
 * @param params
 */
export async function getMatreialProdInfo(params: any) {
  return request("/api/ZyyjIms/basic/basic/getMatreialProdInfo", {
    method: "GET",
    params,
  });
}

/**
 * 新增物料信息
 * @param params
 */
export async function addMatreialProdInfo(params: any) {
  return request("/api/ZyyjIms/basic/basic/addMatreialProdInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改物料信息
 * @param params
 */
export async function updateMatreialProdInfo(params: any) {
  return request("/api/ZyyjIms/basic/basic/updateMatreialProdInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除物料信息
 * @param params
 */
export async function deleteMatreialProdInfo(params: any) {
  return request("/api/ZyyjIms/basic/basic/deleteMatreialProdInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 导入物料分类信息
 * @param params
 */
export async function importMatreialProdInfo(params: any) {
  return request("/api/ZyyjIms/basic/basic/importMatreialProdInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 批量删除物料信息
 * @param params
 */
export async function batchDeleteMaterialProdInfo(params: any) {
  return request("/api/ZyyjIms/basic/basic/batchDeleteMaterialProdInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 查询不允许发放物料清单
 * @param params
 */
export async function queryRefuseOutStorageLst(params: any) {
  return request("/api/ZyyjIms/basic/basic/queryRefuseOutStorageLst", {
    method: "GET",
    params,
  });
}

/**
 * 批量添加不允许发放物料清单
 * @param params
 */
export async function batchAddRefuseOutStorageLst(params: any) {
  return request("/api/ZyyjIms/basic/basic/batchAddRefuseOutStorageLst", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 批量删除不允许发放物料清单
 * @param params
 */
export async function batchDelRefuseOutStorageLst(params: any) {
  return request("/api/ZyyjIms/basic/basic/batchDelRefuseOutStorageLst", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

export async function importCheckMaterialProdInfo(params: any) {
  return request("/api/ZyyjIms/basic/basic/importCheckMaterialProdInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
