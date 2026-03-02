import request from "@/utils/request";

/**
 * 查询物料分类信息
 * @param params
 */
export async function getMaterialClsInfo(params: any) {
  return request("/api/ZyyjIms/basic/basic/getMaterialClsInfo", {
    method: "GET",
    params,
  });
}

/**
 * 修改物料分类信息
 * @param params
 */
export async function updateMaterialClsInfo(params: any) {
  return request("/api/ZyyjIms/basic/basic/updateMaterialClsInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 添加物料分类信息
 * @param params
 */
export async function addMaterialClsInfo(params: any) {
  return request("/api/ZyyjIms/basic/basic/addMaterialClsInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除物料分类信息
 * @param params
 */
export async function deleteMaterialClsInfo(params: any) {
  return request("/api/ZyyjIms/basic/basic/deleteMaterialClsInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 初始化56大类
 * @param params
 */
export async function initSinopec56MaterialClsInfo(params: any) {
  return request("/api/ZyyjIms/basic/basic/initSinopec56MaterialClsInfo", {
    method: "POST",
    data: params,
    requestType: "form"
  })
}

/**
 * @param params
 */
export async function queryBakData(params: any) {
  return request("/api/ZyyjIms/basic/ProdClsWorkBookConfig/queryBakData", {
    method: "GET",
    params,
  });
}

/**
 * @param params
 */
export async function getJiaProdClsWorkBookConfig(params: any) {
  return request("/api/ZyyjIms/basic/ProdClsWorkBookConfig/getJiaProdClsWorkBookConfig", {
    method: "GET",
    params,
  });
}


/**
 * 初始化56大类
 * @param params
 */
export async function setJiaProdClsWorkBookConfig(params: any) {
  return request("/api/ZyyjIms/basic/ProdClsWorkBookConfig/setJiaProdClsWorkBookConfig", {
    method: "POST",
    data: params,
    requestType: "form"
  })
}


export async function queryBackConfigMaterialStatCls(params: any) {
  return request("/api/basic/sys/back/config/queryBackConfigMaterialStatCls", {
    method: "GET",
    params,
  });
}

