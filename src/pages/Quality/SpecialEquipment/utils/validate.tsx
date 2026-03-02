/**
 * 责任人员提交校验引擎
 */
type EquipmentCategory = "压力容器制造(组焊、安装改造修理)" | "压力管道_装置" | "压力管道_长输" | "锅炉" | "起重机械" | "压力管道元件";

interface PersonEntry {
    person_name: string;
    post_name: string;
    [key: string]: any;
}

interface ValidationRule {
    soloPosts: string[];      // 严禁兼任的岗位 (逻辑1, 3, 4)
    productionGroup: string[]; // 生产/设计/工艺/安装组 (逻辑5, 6中的A类)
    testingGroup: string[];    // 理化/耐压/压力试验组 (逻辑5中的B类)
    supplyGroup: string[];     // 材料/设备/计量组 (逻辑6中的B类)
}

const RULE_CONFIG: Record<EquipmentCategory, ValidationRule> = {
    "压力容器制造(组焊、安装改造修理)": {
        soloPosts: ["质保工程师", "无损检测责任人员", "质检责任人员"],
        productionGroup: ["设计责任人员", "材料责任人员", "工艺责任人员", "焊接责任人员", "热处理责任人员", "设备责任人员", "其他过程责任人员"],
        testingGroup: ["理化检验责任人员", "压力试验责任人员"],
        supplyGroup: ["材料责任人员", "设备责任人员", "计量责任人员"]
    },
    "压力管道_装置": {
        soloPosts: ["质保工程师", "无损检测责任人员", "质检责任人员"],
        productionGroup: ["设计责任人员", "材料责任人员", "工艺责任人员", "焊接责任人员", "热处理责任人员", "设备责任人员", "其他过程责任人员"],
        testingGroup: ["理化检验责任人员"],
        supplyGroup: ["材料责任人员", "设备责任人员", "计量责任人员"]
    },
    "压力管道_长输": {
        soloPosts: ["质保工程师", "无损检测责任人员", "质检责任人员"],
        productionGroup: ["设计责任人员", "材料责任人员", "工艺责任人员", "焊接责任人员", "热处理责任人员", "设备责任人员", "防腐蚀责任人员", "补口责任人员", "清管扫线责任人员", "其他过程责任人员"],
        testingGroup: ["理化检验责任人员"],
        supplyGroup: ["材料责任人员", "设备责任人员", "计量责任人员"]
    },
    "锅炉": {
        soloPosts: ["质保工程师", "无损检测责任人员", "质检责任人员"],
        productionGroup: ["设计责任人员", "材料责任人员", "工艺责任人员", "焊接责任人员", "热处理责任人员", "设备责任人员", "胀接责任人员", "电气责任人员", "仪表责任人员", "筑炉责任人员", "起重责任人员"],
        testingGroup: ["理化检验责任人员"],
        supplyGroup: ["材料责任人员", "设备责任人员", "计量责任人员"]
    },
    "起重机械": {
        soloPosts: ["质保工程师", "检验责任人员"],
        productionGroup: ["吊装责任人员", "焊接责任人员", "电气责任人员", "安装调试责任人员"],
        testingGroup: [], // 起重机械暂无理化组
        supplyGroup: ["材料责任人员", "设备责任人员"]
    },
    "压力管道元件": {
        soloPosts: ["质保工程师", "无损检测责任人员", "质检责任人员"],
        productionGroup: ["设计责任人员", "材料责任人员", "工艺责任人员", "焊接责任人员", "热处理责任人员", "设备责任人员", "计量责任人员"],
        testingGroup: ["理化检验责任人员", "耐压试验责任人员"],
        supplyGroup: ["材料责任人员", "设备责任人员", "计量责任人员"]
    }
};

/**
 * 校验执行器
 */
export const validatePersonnelData = (data: PersonEntry[], category: EquipmentCategory) => {
    const messages: string[] = [];
    const rule = RULE_CONFIG[category];

    // 1. 按姓名分组
    const personMap: Record<string, string[]> = {};
    data.forEach(item => {
        const name = item.person_name?.trim();
        if (name) {
            if (!personMap[name]) personMap[name] = [];
            personMap[name].push(item.post_name);
        }
    });

    // 2. 规则校验
    for (const [name, posts] of Object.entries(personMap)) {
        
        // --- [INFLUENCE: QUANTITY] ---
        if (posts.length > 2) {
            messages.push(`【INFLUENCE: ERROR】人员 [${name}] 姓名重复出现超过2次。`);
        }

        // --- [POSSIBILITY: SOLO_LIMIT] ---
        posts.forEach(p => {
            if (rule.soloPosts.includes(p) && posts.length > 1) {
                messages.push(`【POSSIBILITY: FORBIDDEN】人员 [${name}] 担任的 [${p}] 职务必须单独担任，不得兼任其他。`);
            }
        });

        // --- [POSSIBILITY: GROUP_MUTEX_5] ---
        // 逻辑5：设计/工艺等 与 理化检验/试验 不得相互兼任
        const hasProduction = posts.some(p => rule.productionGroup.includes(p));
        const hasTesting = posts.some(p => rule.testingGroup.includes(p));
        if (hasProduction && hasTesting) {
            messages.push(`【POSSIBILITY: CONFLICT】人员 [${name}] 违反“过程/设计”与“理化/试验”互斥规定。`);
        }

        // --- [POSSIBILITY: GROUP_MUTEX_6] ---
        // 逻辑6：材料/设备/计量 与 工艺/焊接/热处理等 不得相互兼任
        const hasSupply = posts.some(p => rule.supplyGroup.includes(p));
        // 注意：逻辑6中排除设计，仅限工艺/焊接/热处理/其他过程/防腐/清管/胀接等
        const pureProcessPosts = ["工艺责任人员", "焊接责任人员", "热处理责任人员", "其他过程责任人员", "防腐蚀责任人员", "补口责任人员", "清管扫线责任人员", "胀接责任人员", "电气责任人员", "仪表责任人员", "筑炉责任人员", "起重责任人员", "安装调试责任人员", "吊装责任人员"];
        const hasPureProcess = posts.some(p => pureProcessPosts.includes(p));
        
        if (hasSupply && hasPureProcess) {
            messages.push(`【POSSIBILITY: CONFLICT】人员 [${name}] 违反“材料/设备/计量”与“工艺/焊接/安装”互斥规定。`);
        }
    }

    return {
        IS_VALID: messages.length === 0,
        MESSAGES: messages
    };
};