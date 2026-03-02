import request from "@/utils/request";

/**
 * 查询培训班随堂测试题目
 * @param params
 */
export async function getTrainingClassQuizQuestion(params: any) {
  return request("/api/ZyyjIms/hr/TrainingClassQuizQuestion/getTrainingClassQuizQuestion", {
    method: "GET",
    params,
  });
}

/**
 * 新增培训班随堂测试题目
 * @param params
 */
export async function addTrainingClassQuizQuestion(params: any) {
  return request("/api/ZyyjIms/hr/TrainingClassQuizQuestion/addTrainingClassQuizQuestion", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 修改培训班随堂测试题目
 * @param params
 */
export async function updateTrainingClassQuizQuestion(params: any) {
  return request("/api/ZyyjIms/hr/TrainingClassQuizQuestion/updateTrainingClassQuizQuestion", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 删除培训班随堂测试题目
 * @param params
 */
export async function deleteTrainingClassQuizQuestion(params: any) {
  return request("/api/ZyyjIms/hr/TrainingClassQuizQuestion/deleteTrainingClassQuizQuestion", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 生成培训班随堂测试题目
 * @param params
 */
export async function generateClassQuizQuestion(params: any) {
  return request("/api/ZyyjIms/hr/TrainingClassQuizQuestion/generateClassQuizQuestion", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 添加培训班随堂测试题目的分值和排序
 * @param params
 */
export async function addQuizQuestionSortAndScore(params: any) {
  return request("/api/ZyyjIms/hr/TrainingClassQuizQuestion/addQuizQuestionSortAndScore", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 开启关闭随堂考试
 * @param params
 */
export async function updateStartTestStatus(params: any) {
  return request("/api/ZyyjIms/hr/trainingPlan/updateStartTestStatus", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 查询当前随堂检测题的开启状态
 * @param params
 */
export async function getClassCourseStartTestStatus(params: any) {
  return request("/api/ZyyjIms/hr/TrainingClassQuizQuestion/getClassCourseStartTestStatus", {
    method: "GET",
    params,
  });
}


/**
 * 查询培训班随堂测试题目无答案
 * @param params
 */
export async function getTrainingClassQuizQuestionNoAnswer(params: any) {
  return request("/api/ZyyjIms/hr/TrainingClassQuizQuestion/getTrainingClassQuizQuestionNoAnswer", {
    method: "GET",
    params,
  });
}

/**
 * 保存学生答案
 * @param params
 */
export async function saveStudentAnswer(params: any) {
  return request("/api/ZyyjIms/hr/TrainingClassQuizQuestion/saveStudentAnswer", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}


/**
 * 查询学员随堂测试答案
 * @param params
 */
export async function getTrainingClassQuizStudentAnswer(params: any) {
  return request("/api/ZyyjIms/hr/TrainingClassQuizQuestion/getTrainingClassQuizStudentAnswer", {
    method: "GET",
    params,
  });
}



/**
 * 查询培训班课程评分记录
 * @param params
 */
export async function getUserSignExamStatus(params: any) {
  return request("/api/ZyyjIms/hr/trainingPlan/getUserSignExamStatus", {
    method: "GET",
    params,
  });
}

/**
 * 计算培训班课程随堂测试得分
 * @param params
 */
export async function calculateScore(params: any) {
  return request("/api/ZyyjIms/hr/TrainingClassQuizQuestion/calculateScore", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}

/**
 * 更新考生考试状态
 * @param params
 */
export async function updateExamStatus(params: any) {
  return request("/api/ZyyjIms/hr/TrainingClassQuizQuestion/updateExamStatus", {
    method: "POST",
    data: params,
    requestType: "form",
  });
}
