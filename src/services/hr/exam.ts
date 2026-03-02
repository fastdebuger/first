import request from "@/utils/request";


/**
 * 查询考试题目的选项
 * @param params
 */
export async function queryExamQuestionOptions(params: any) {
  return request("/api/ZyyjIms/hr/exam/question/queryExamQuestionOptions", {
    method: "GET",
    params,
  });
}

/**
 * 查询考试人员类型
 * @param params
 */
export async function queryExamPersonalTypeList(params: any) {
  return request("/api/ZyyjIms/hr/exam/basic/queryExamPersonalTypeList", {
    method: "GET",
    params,
  });
}

/**
 * 查询考试题目
 * @param params
 */
export async function getExamQuestion(params: any) {
  return request("/api/ZyyjIms/hr/exam/ExamQuestion/getExamQuestion", {
    method: "GET",
    params,
  });
}

/**
 * 新增考试题目
 * @param params
 */
export async function addExamQuestion(params: any) {
  return request("/api/ZyyjIms/hr/exam/ExamQuestion/addExamQuestion", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改考试题目
 * @param params
 */
export async function updateExamQuestion(params: any) {
  return request("/api/ZyyjIms/hr/exam/ExamQuestion/updateExamQuestion", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除考试题目
 * @param params
 */
export async function deleteExamQuestion(params: any) {
  return request("/api/ZyyjIms/hr/exam/ExamQuestion/deleteExamQuestion", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 查询试卷已选考题
 * @param params
 */
export async function queryExamPaperExistQuestions(params: any) {
  return request("/api/ZyyjIms/hr/exam/ExamPaper/queryExamPaperExistQuestions", {
    method: "GET",
    params,
  });
}

/**
 * 查询试卷备选考题
 * @param params
 */
export async function queryExamPaperBakQuestions(params: any) {
  return request("/api/ZyyjIms/hr/exam/ExamPaper/queryExamPaperBakQuestions", {
    method: "GET",
    params,
  });
}



/**
 * 查询用户已报名的考试试卷
 * @param params
 */
export async function getUserExam(params: any) {
  return request("/api/ZyyjIms/hr/exam/ExamPaper/getUserExam", {
    method: "GET",
    params,
  });
}


/**
 * 查询考试试卷
 * @param params
 */
export async function getExamPaper(params: any) {
  return request("/api/ZyyjIms/hr/exam/ExamPaper/getExamPaper", {
    method: "GET",
    params,
  });
}


/**
 * 新增试卷
 * @param params
 */
export async function addExamPaper(params: any) {
  return request("/api/ZyyjIms/hr/exam/ExamPaper/addExamPaper", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改试卷
 * @param params
 */
export async function updateExamPaper(params: any) {
  return request("/api/ZyyjIms/hr/exam/ExamPaper/updateExamPaper", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
* 查询试卷已选考题
* @param params
*/
export async function getExamPaperQuestion(params: any) {
  return request("/api/ZyyjIms/hr/exam/ExamPaper/getExamQuestion", {
    method: "GET",
    params,
  });
}

/**
 * 获取考试试卷问题无答案
 * @param params
 */
export async function getExamQuestionNoAnswer(params: any) {
  return request("/api/ZyyjIms/hr/exam/ExamPaper/getExamQuestionNoAnswer", {
    method: "GET",
    params,
  });
}

/**
 * 查询考试题目考生答案
 * @param params
 */
export async function getExamQuestionStudentAnswer(params: any) {
  return request("/api/ZyyjIms/hr/exam/ExamPaper/getExamQuestionStudentAnswer", {
    method: "GET",
    params,
  });
}



export async function deleteExamPaper(params: any) {
  return request("/api/ZyyjIms/hr/exam/ExamPaper/deleteExamPaper", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 保存试卷考题
 * @param params
 */
export async function savePaperQuestionMap(params: any) {
  return request("/api/ZyyjIms/hr/exam/ExamPaper/savePaperQuestionMap", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


export async function getExamUser(params: any) {
  return request("/api/ZyyjIms/hr/exam/ExamPaper/getExamUser", {
    method: "GET",
    params,
  });
}

/**
 * 管理员添加参考人员
 * @param params
 */
export async function addExamUser(params: any) {
  return request("/api/ZyyjIms/hr/exam/ExamPaper/addExamUser", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 参考人员自主报名
 * @param params
 */
export async function examUserSelfRegistration(params: any) {
  return request("/api/ZyyjIms/hr/exam/ExamPaper/examUserSelfRegistration", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除试卷
 * @param params
 */
export async function delExamPaperdeleteExamPaper(params: any) {
  return request("/api/ZyyjIms/hr/exam/ExamPaper/deleteExamPaper", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 发布考试试卷
 * @param params
 */
export async function publishExamPaper(params: any) {
  return request("/api/ZyyjIms/hr/exam/ExamPaper/publishExamPaper", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 追加实操考题
 * @param params
 */
export async function addPracticalExam(params: any) {
  return request("/api/ZyyjIms/hr/exam/ExamPaper/addPracticalExam", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 取消试卷中已选择的考题
 * @param params
 */
export async function cancelExamPaperQuestion(params: any) {
  return request("/api/ZyyjIms/hr/exam/ExamPaper/cancelExamPaperQuestion", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 新增试卷考题
 * @param params
 */
export async function addExamPaperQuestions(params: any) {
  return request("/api/ZyyjIms/hr/exam/paper/addExamPaperQuestions", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}





/**
 * 查询考试
 * @param params
 */
export async function queryExamSessionList(params: any) {
  return request("/api/ZyyjIms/hr/exam/session/queryExamSessionList", {
    method: "GET",
    params,
  });
}

/**
 * 查询用户能参与的考试场次和考试系统
 * @param params
 */
export async function queryUserExamSessionList(params: any) {
  return request("/api/ZyyjIms/hr/exam/session/queryUserExamSessionList", {
    method: "GET",
    params,
  });
}




/**
 * 查询可用的考试
 * @param params
 */
export async function queryAllowExamSessionList(params: any) {
  return request("/api/ZyyjIms/hr/exam/session/queryAllowExamSessionList", {
    method: "GET",
    params,
  });
}


/**
 * 新增考试
 * @param params
 */
export async function addExamSession(params: any) {
  return request("/api/ZyyjIms/hr/exam/session/addExamSession", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改考试
 * @param params
 */
export async function updateExamSession(params: any) {
  return request("/api/ZyyjIms/hr/exam/session/updateExamSession", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除考试
 * @param params
 */
export async function delExamSession(params: any) {
  return request("/api/ZyyjIms/hr/exam/session/delExamSession", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改考试状态
 * @param params
 */
export async function updateExamSessionStatus(params: any) {
  return request("/api/ZyyjIms/hr/exam/session/updateExamSessionStatus", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 是否允许开始考试
 * @param params
 */
export async function isAllowStartExam(params: any) {
  return request("/api/ZyyjIms/hr/exam/session/isAllowStartExam", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 开始考试
 * @param params
 */
export async function startExamRecord(params: any) {
  return request("/api/ZyyjIms/hr/exam/session/startExamRecord", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 查询考试题目
 * @param params
 */
export async function queryPaperQuestions(params: any) {
  return request("/api/ZyyjIms/hr/exam/session/queryPaperQuestions", {
    method: "GET",
    params,
  });
}

/**
 * 查询题目选项
 * @param params
 */
export async function queryQuestionOptions(params: any) {
  return request("/api/ZyyjIms/hr/exam/session/queryQuestionOptions", {
    method: "GET",
    params,
  });
}


/**
 * 保存每一道题答案
 * @param params
 */
export async function saveEveryQuestionAnswer(params: any) {
  return request("/api/ZyyjIms/hr/exam/basic/ZyyjIms/hr/exam/saveEveryQuestionAnswer", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 交卷
 * @param params
 */
export async function submitExamRecord(params: any) {
  return request("/api/ZyyjIms/hr/exam/basic/ZyyjIms/hr/exam/submitExamRecord", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}






/**
 * 查询用户考试记录
 * @param params
 */
export async function queryExamRecordList(params: any) {
  return request("/api/ZyyjIms/hr/exam/record/queryExamRecordList", {
    method: "GET",
    params,
  });
}


/**
 * 新增用户考试记录
 * @param params
 */
export async function addExamRecord(params: any) {
  return request("/api/ZyyjIms/hr/exam/record/addExamRecord", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改用户考试记录
 * @param params
 */
export async function updateExamRecord(params: any) {
  return request("/api/ZyyjIms/hr/exam/record/updateExamRecord", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除用户考试记录
 * @param params
 */
export async function delExamRecord(params: any) {
  return request("/api/ZyyjIms/hr/exam/record/delExamRecord", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改用户考试记录状态
 * @param params
 */
export async function updateExamRecordStatus(params: any) {
  return request("/api/ZyyjIms/hr/exam/record/updateExamRecordStatus", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 开始考试
 * @param params
 */
export async function startExam(params: any) {
  return request("/api/ZyyjIms/hr/exam/record/startExam", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 查询考试中的试卷详情
 * @param params
 */
export async function queryExamPaperInfo(params: any) {
  return request("/api/ZyyjIms/hr/exam/record/queryExamPaperInfo", {
    method: "GET",
    params,
  });
}


/**
 * 查询考试中的试卷题目
 * @param params
 */
export async function queryExamPaperQuestions(params: any) {
  return request("/api/ZyyjIms/hr/exam/record/queryExamPaperQuestions", {
    method: "GET",
    params,
  });
}

/**
 * 查询考试中的已经答题的题目
 * @param params
 */
export async function queryExamRecordUserAnswer(params: any) {
  return request("/api/ZyyjIms/hr/exam/record/queryExamRecordUserAnswer", {
    method: "GET",
    params,
  });
}


/**
 * 提交考卷
 * @param params
 */
export async function submitExamPaper(params: any) {
  return request("/api/ZyyjIms/hr/exam/record/submitExamPaper", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询考试模块信息
 * @param params
 */
export async function queryExamModuleInfo(params: any) {
  return request("/api/ZyyjIms/hr/exam/basic/ZyyjIms/hr/exam/queryExamModuleInfo", {
    method: "GET",
    params,
  });
}

/**
 * 查询考试信息
 * @param params
 */
export async function queryExamDetailInfoH(params: any) {
  return request("/api/ZyyjIms/hr/exam/basic/ZyyjIms/hr/exam/queryExamDetailInfoH", {
    method: "GET",
    params,
  });
}

/**
 * 添加考试信息
 * @param params
 */
export async function addExamDetailInfo(params: any) {
  return request("/api/ZyyjIms/hr/exam/basic/ZyyjIms/hr/exam/addExamDetailInfo", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 查询考试试题
 * @param params
 */
export async function queryExamDetailInfoB(params: any) {
  return request("/api/ZyyjIms/hr/exam/basic/ZyyjIms/hr/exam/queryExamDetailInfoB", {
    method: "GET",
    params,
  });
}

/**
 * 增加考试试题
 * @param params
 */
export async function addExamDetailInfoB(params: any) {
  return request("/api/ZyyjIms/hr/exam/basic/ZyyjIms/hr/exam/addExamDetailInfoB", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询考试人数
 * @param params
 */
export async function getJoinOrAllUserSum(params: any) {
  return request("/api/ZyyjIms/hr/exam/basic/ZyyjIms/hr/exam/queryJoinOrAllUserSum", {
    method: "GET",
    params,
  });
}

/**
 * 查询人数排行
 * @param params
 */
export async function getRankingScore(params: any) {
  return request("/api/ZyyjIms/hr/exam/basic/ZyyjIms/hr/exam/queryRankingScore", {
    method: "GET",
    params,
  });
}


