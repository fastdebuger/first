/**
 * 特种设备校验工具类
 */
export class SpecialEquipmentVerifyService {
  
  /**
   * 校验入口
   * @returns { success: boolean, msg: string }
   */
  static validate(type: string | number, items: any[]): { success: boolean; msg: string } {
    if (!items || items.length === 0) {
      return { success: false, msg: "请维护数据" };
    }

    // 1. 聚合数据：Map<姓名, 职务列表[]>
    const personPostMap = new Map<string, string[]>();
    items.forEach(item => {
      const name = item.person_name;
      const post = item.post_name;
      if (!name || !post) return;
      if (!personPostMap.has(name)) personPostMap.set(name, []);
      personPostMap.get(name)?.push(post);
    });

    // 2. 遍历每个人进行规则校验
    for (const [name, posts] of personPostMap) {
      const postSet = new Set(posts);
      const totalCount = posts.length;

      // -------- A. 强独占规则 (适用于所有类型) --------
      const exclusivePosts = ["质保工程师", "无损检测责任人员", "质检责任人员", "检验责任人员"];
      for (const ex of exclusivePosts) {
        if (postSet.has(ex) && totalCount > 1) {
          return { success: false, msg: `【${name}】为${ex}，不得兼任其他责任人员` };
        }
      }

      // -------- B. 数量限制 (最多兼任2个) --------
      if (totalCount > 2) {
        return { success: false, msg: `【${name}】最多只能兼任两个质量控制职务` };
      }

      // -------- C. 组合互斥规则 (根据设备类型区分) --------
      const typeStr = String(type);
      
      // 1-4, 6 类型的通用互斥逻辑：(设计/工艺/材料等) 与 (理化/试验类) 互斥
      if (['1', '2', '3', '4', '6'].includes(typeStr)) {
        const groupA = new Set(["设计责任人员", "材料责任人员", "工艺责任人员", "焊接责任人员", "热处理责任人员", "设备责任人员"]);
        const groupB = new Set(["理化检验责任人员", "压力试验责任人员", "耐压试验责任人员"]);
        
        if (this.hasIntersection(groupA, posts) && this.hasIntersection(groupB, posts)) {
          // 设计、材料、工艺、焊接、热处理、设备、其他过程责任人员与理化检验、压力试验责任人员不得相互兼任。
          return { success: false, msg: `【${name}】存在不允许兼任的组合（设计、材料、工艺、焊接、热处理、设备、其他过程责任人员与理化检验、压力试验责任人员不得相互兼任）` };
        }

        // 规则：(材料/设备/计量) 与 (工艺/焊接/热处理等) 互斥
        const materialGroup = new Set(["材料责任人员", "设备责任人员", "计量责任人员"]);
        const processGroup = new Set(["工艺责任人员", "焊接责任人员", "热处理责任人员", "防腐蚀（补口）责任人员", "清管扫线责任人员"]);
        
        if (this.hasIntersection(materialGroup, posts) && this.hasIntersection(processGroup, posts)) {
          return { success: false, msg: `【${name}】存在不允许兼任的组合（材料、设备、计量责任人员与工艺、焊接、热处理、防腐蚀（补口）、清管扫线、其他过程责任人员不得相互兼任。）` };
        }

      }

      // 5. 起重机械特殊规则
      if (typeStr === '5') {
        const materialDevice = new Set(["材料责任人员", "设备责任人员"]);
        const conflictProcess = new Set(["吊装责任人员", "焊接责任人员", "电气责任人员", "安装调试责任人员"]);
        if (this.hasIntersection(materialDevice, posts) && this.hasIntersection(conflictProcess, posts)) {
          return { success: false, msg: `【${name}】存在不允许兼任的组合(材料、设备责任人员与吊装、焊接、电气、安装调试责任人员不得相互兼任。)` };
        }
      }
    }

    return { success: true, msg: "" };
  }

  // 辅助方法：检查是否有交集
  private static hasIntersection(setA: Set<string>, arrayB: string[]): boolean {
    return arrayB.some(item => setA.has(item));
  }
}