import request from "@/utils/request";

/**
 * 1. 工程数量统计 [GET] /api/stats/projectCount
 * @returns 总量、A级、B级、其他工程数量数据
 */
export async function projectCount(params: any) {
  return request("/api/ZyyjIms/stats/projectCount", {
    method: "GET",
    params,
  });
}

/**
 * 2. 人员结构统计 [GET] /api/stats/staffDistribution
 * @returns 分包商、自有人员数量数据
 */
export async function staffDistribution(params: any) {
  return request("/api/stats/staffDistribution", {
    method: "GET",
    params,
  });
}

/**
 * 3. 管道吋口趋势统计 [GET] /api/stats/pipeProgress
 * @returns 周度趋势（categories、total、completed、autoWelding）
 */
export async function pipeProgress(params: any) {
  return request("/api/stats/pipeProgress", {
    method: "GET",
    params,
  });
}

/**
 * 4. 问题数量统计 [GET] /api/stats/issueStats
 * @returns 质量、安全、总量等问题数量数据
 */
export async function issueStats(params: any) {
  return request("/api/stats/issueStats", {
    method: "GET",
    params,
  });
}

/**
 * 5. 安全生产核心指标统计 [GET] /api/stats/safetyHours
 * @returns 连续安全天数、年度安全工时
 */
export async function safetyHours(params: any) {
  return request("/api/stats/safetyHours", {
    method: "GET",
    params,
  });
}

/**
 * 6. 市场开发统计 [GET] /api/stats/marketDev
 * @returns 业务占比（rows）、完成率/基础指标/奋斗指标（result）
 */
export async function marketDev(params: any) {
  return request("/api/stats/marketDev", {
    method: "GET",
    params,
  });
}