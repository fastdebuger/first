import request from '@/utils/request';

export interface CommonListType {
  depCode: string;
}

/**
 * 获取华为云 凡软报表静态配置参数
 * @param params
 */
export async function getWebParam(params?: any) {
  return request('/api/basic/sys/aut/getWebParam', {
    method: 'POST',
    data: params || {},
    requestType: 'form',
  });
}

/**
 * 查询用户所在的wbs层级 用于切换项目部
 */
export async function queryWbsByUserCanSwitch(params: any) {
  return request('/api/basic/user/aut/queryWbsByUserCanSwitch', {
    method: 'GET',
    params,
  });
}

/**
 * 查询权限装置
 * @param params
 */
export async function queryUserAscriptionDev(params: any) {
  return request('/api/pipeWelding/basic/config/aut/queryUserAscriptionDev', {
    method: 'GET',
    params,
  });
}

/**
 * 获取 下载的模版
 * @param params
 */
export async function downloadImportTemplate(params: CommonListType) {
  return request('/api/pipeWelding/resource/aut/queryImportTemplateUrl', {
    method: 'GET',
    params,
  });
}

/**
 * 获取 装置信息
 * @param params
 */
export async function fetchDevList(params: any) {
  return request('/api/basic/user/aut/queryDevLst', {
    method: 'GET',
    params,
  });
}

/**
 * 获取 单位工程信息
 * @param params
 */
export async function fetchUnitProjectList(params: any) {
  return request('/api/basic/user/aut/queryUnitProjectLst', {
    method: 'GET',
    params,
  });
}

/**
 * 获取 单元信息
 * @param params
 */
export async function fetchUnitList(params: any) {
  return request('/api/basic/user/aut/queryUnitLst', {
    method: 'GET',
    params,
  });
}

/**
 * 查询分包队伍
 * @param params
 */
export async function queryTeamLst(params: CommonListType) {
  return request('/api/basic/user/aut/queryTeamLst', {
    method: 'GET',
    params,
  });
}

/**
 * 查询分公司级用户
 * @param params
 */
export async function querySubWbsUser(params: any) {
  return request('/api/basic/user/aut/querySubWbsUser', {
    method: 'GET',
    params,
  });
}

/**
 * 获取 专业信息
 * @param params
 */
export async function queryQualityProfession(params: any) {
  return request('/api/quality/aut/queryQualityProfession', {
    method: 'GET',
    params,
  });
}


/**
 * 查询用户
 * @param params
 */
export async function queryUserInfo(params: any) {
  return request('/api/basic/user/aut/queryUserInfo', {
    method: 'GET',
    params,
  });
}

export async function getAddress(params: any) {
  return request('/api/basic/sys/aut/geneObsUploadSignedUrl', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}

/**
 * 获取集成统一上传参数
 */
export async function getUploadKey(params?: any) {
  return request('/api/basicNew/fileStore/aut/getUploadKey', {
    method: 'POST',
    data: params || {},
    requestType: 'form',
  });
}


export async function upload(url: string, params: any) {
  return request(url, {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}


/**
 * 查询分包商
 * @param params
 */
export async function querySublettingInfo(params: CommonListType) {
  return request('/api/ZyyjIms/basic/basic/querySublettingInfo', {
    method: 'GET',
    params,
  });
}


/**
 * 查询基础字典表
 * @param params
 */
export async function querySysBasicDict(params: any) {
  return request('/api/ZyyjIms/basic/basic/querySysBasicDict', {
    method: 'GET',
    params,
  });
}

export async function updateSysBasicDict(params: any) {
  return request("/api/ZyyjIms/basic/basic/updateSysBasicDict", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

export async function addSysBasicDict(params: any) {
  return request("/api/ZyyjIms/basic/basic/addSysBasicDict", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

export async function deleteSysBasicDict(params: any) {
  return request("/api/ZyyjIms/basic/basic/deleteSysBasicDict", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

export async function updateIsLockResource(params: any) {
  return request("/api/ZyyjIms/basic/basic/updateIsLockResource", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}



/**
 * 获取最新未读消息
 * @param params
 */
export async function getLatestUnreadMessages(params: any) {
  return request('/api/ZyyjIms/message/getLatestUnreadMessages', {
    method: 'GET',
    params,
  });
}

/**
 * 获取未读消息数量
 * @param params
 */
export async function getUnreadCount(params: any) {
  return request('/api/ZyyjIms/message/getUnreadCount', {
    method: 'GET',
    params,
  });
}


/**
 * 查询站内信详情
 * @param params
 */
export async function queryMessageDetail(params: any) {
  return request('/api/ZyyjIms/message/queryMessageDetail', {
    method: 'GET',
    params,
  });
}


/**
 * 查询站内信列表
 * @param params
 */
export async function queryListBySender(params: any) {
  return request('/api/ZyyjIms/message/queryListBySender', {
    method: 'GET',
    params,
  });
}

export async function queryMessageList(params: any) {
  return request('/api/ZyyjIms/message/queryMessageList', {
    method: 'GET',
    params,
  });
}


/**
 * 批量标记消息为已读
 * @param params
 */
export async function batchUpdateReadStatus(params: any) {
  return request("/api/ZyyjIms/message/batchUpdateReadStatus", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 批量标记消息为已读
 * @param params
 */
export async function sendAnnouncement(params: any) {
  return request("/api/ZyyjIms/message/sendAnnouncement", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 发送系统通知
 * @param params
 */
export async function sendSystemNotification(params: any) {
  return request("/api/ZyyjIms/message/sendSystemNotification", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

export async function sendAnnouncementToReceiver(params: any) {
  return request("/api/ZyyjIms/message/sendAnnouncementToReceiver", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}








