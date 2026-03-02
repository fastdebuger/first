/**
 * 1. 定义设备索引的联合类型，增强代码的 POSSIBILITY
 * 这样在调用函数时，IDE 会自动提示可选值
 */
export type SpecialEquipmentIndex = 1 | 2 | 3 | 4 | 5 | "1" | "2" | "3" | "4" | "5";

/**
 * 定义映射常量
 */
const SPECIAL_EQUIPMENT_MAP: Record<string, string> = {
  "1": "压力容器制造(组焊、安装改造修理)",
  "2": "压力管道",
  "3": "锅炉",
  "4": "起重机械",
  "5": "压力管道元件",
} as const;

/**
 * 获取标题
 * @param index 设备编号
 * @returns 设备名称，匹配失败返回空字符串
 */
export const getSpecialEquipmentTitle = (index: SpecialEquipmentIndex | any): string => {
  // 处理 null 或 undefined 的情况
  if (index === null || index === undefined) return "";
  return SPECIAL_EQUIPMENT_MAP[String(index)] ?? "";
};