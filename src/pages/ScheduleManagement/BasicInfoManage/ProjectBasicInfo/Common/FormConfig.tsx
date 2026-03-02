/**
 * 进度统计》项目基础信息》基础信息》动态表单列配置
 */
export const getDynamicFormConfig = (formatMessage: any) => {
  return {
    general_contractor_data: {
      title: formatMessage({id: 'scheduleManagement.general_contractor_data'}), // '总承包单位',
      fieldsList: [
        { label: formatMessage({id: 'scheduleManagement.general_contractor_data'}), name: 'name', span: 4, type: 'input', rules: [{ required: true, message: formatMessage({id: 'scheduleManagement.please.enter'})+formatMessage({id: 'scheduleManagement.general_contractor_data'}) }] },
        { label: formatMessage({id: 'scheduleManagement.contact'}), name: 'contact', span: 4, type: 'input', },
        { label: formatMessage({id: 'scheduleManagement.phone'}), name: 'phone', span: 4, type: 'input', rules: [{ pattern: /^1[3-9]\d{9}$/, message: formatMessage({id: 'scheduleManagement.sure.phone'}) }] },
        { label: formatMessage({id: 'scheduleManagement.email'}), name: 'email', span: 4, type: 'input', rules: [{ type: 'email', message: formatMessage({id: 'scheduleManagement.sure.email'}) }] },
      ]
    },
    design_dep_data: {
      title: formatMessage({id: 'scheduleManagement.design_dep_data'}),
      fieldsList: [
        { label: formatMessage({id: 'scheduleManagement.design_dep_data'}), name: 'name', span: 4, type: 'input', rules: [{ required: true, message: '请输入总承包单位' }] },
        { label: formatMessage({id: 'scheduleManagement.contact'}), name: 'contact', span: 4, type: 'input', },
        { label: formatMessage({id: 'scheduleManagement.phone'}), name: 'phone', span: 4, type: 'input', rules: [{ pattern: /^1[3-9]\d{9}$/, message: formatMessage({id: 'scheduleManagement.sure.phone'}) }] },
        { label: formatMessage({id: 'scheduleManagement.email'}), name: 'email', span: 4, type: 'input', rules: [{ type: 'email', message: formatMessage({id: 'scheduleManagement.sure.email'}) }] },
      ]
    },
    purchase_dep_data: {
      title: formatMessage({id: 'scheduleManagement.purchase_dep_data'}),
      fieldsList: [
        { label: formatMessage({id: 'scheduleManagement.purchase_dep_data'}), name: 'name', span: 4, type: 'input', rules: [{ required: true, message: '请输入总承包单位' }] },
        { label: formatMessage({id: 'scheduleManagement.contact'}), name: 'contact', span: 4, type: 'input', },
        { label: formatMessage({id: 'scheduleManagement.phone'}), name: 'phone', span: 4, type: 'input', rules: [{ pattern: /^1[3-9]\d{9}$/, message: formatMessage({id: 'scheduleManagement.sure.phone'}) }] },
        { label: formatMessage({id: 'scheduleManagement.email'}), name: 'email', span: 4, type: 'input', rules: [{ type: 'email', message: formatMessage({id: 'scheduleManagement.sure.email'}) }] },
      ]
    },
    internal_dep_data: {
      title: formatMessage({id: 'scheduleManagement.internal_dep_data'}),
      fieldsList: [
        {
          label: formatMessage({id: 'scheduleManagement.internal_dep_data'}),
          name: 'name',
          span: 4,
          type: 'focus-select',
          focusSelectProps: {
            fetchType: 'contractBasic/getSysDict',
            payload: {
              sort: 'id',
              order: 'asc',
              filter: JSON.stringify([{
                "Key": "sys_type_code",
                "Val": "INTERNAL_DEP",
                "Operator": "="
              }]),
            },
            fieldNames: { label: 'dict_name', value: 'id' },
            searchKey: "dict_name",
            fieldName: "internal_dep_data"
          }
        },
        { label: formatMessage({id: 'scheduleManagement.contact'}), name: 'contact', span: 4, type: 'input', },
        { label: formatMessage({id: 'scheduleManagement.phone'}), name: 'phone', span: 4, type: 'input', rules: [{ pattern: /^1[3-9]\d{9}$/, message: formatMessage({id: 'scheduleManagement.sure.phone'}) }] },
        { label: formatMessage({id: 'scheduleManagement.email'}), name: 'email', span: 4, type: 'input', rules: [{ type: 'email', message: formatMessage({id: 'scheduleManagement.sure.email'}) }] },
      ]
    },
    external_dep_data: {
      title: formatMessage({id: 'scheduleManagement.external_dep_data'}),
      fieldsList: [
        { label: formatMessage({id: 'scheduleManagement.external_dep_data'}), name: 'name', span: 4, type: 'input' },
        { label: formatMessage({id: 'scheduleManagement.contact'}), name: 'contact', span: 4, type: 'input', },
        { label: formatMessage({id: 'scheduleManagement.phone'}), name: 'phone', span: 4, type: 'input', rules: [{ pattern: /^1[3-9]\d{9}$/, message: formatMessage({id: 'scheduleManagement.sure.phone'}) }] },
        { label: formatMessage({id: 'scheduleManagement.email'}), name: 'email', span: 4, type: 'input', rules: [{ type: 'email', message: formatMessage({id: 'scheduleManagement.sure.email'}) }] },
      ]
    },
    ndt_dep_data: {
      title: formatMessage({id: 'scheduleManagement.ndt_dep_data'}),
      fieldsList: [
        { label: formatMessage({id: 'scheduleManagement.ndt_dep_data'}), name: 'name', span: 4, type: 'input' },
        { label: formatMessage({id: 'scheduleManagement.contact'}), name: 'contact', span: 4, type: 'input', },
        { label: formatMessage({id: 'scheduleManagement.phone'}), name: 'phone', span: 4, type: 'input', rules: [{ pattern: /^1[3-9]\d{9}$/, message: formatMessage({id: 'scheduleManagement.sure.phone'}) }] },
        { label: formatMessage({id: 'scheduleManagement.email'}), name: 'email', span: 4, type: 'input', rules: [{ type: 'email', message: formatMessage({id: 'scheduleManagement.sure.email'}) }] },
      ]
    },
    operation_dep_data: {
      title: formatMessage({id: 'scheduleManagement.operation_dep_data'}),
      fieldsList: [
        { label: formatMessage({id: 'scheduleManagement.operation_dep_data'}), name: 'name', span: 4, type: 'input' },
        { label: formatMessage({id: 'scheduleManagement.contact'}), name: 'contact', span: 4, type: 'input', },
        { label: formatMessage({id: 'scheduleManagement.phone'}), name: 'phone', span: 4, type: 'input', rules: [{ pattern: /^1[3-9]\d{9}$/, message: formatMessage({id: 'scheduleManagement.sure.phone'}) }] },
        { label: formatMessage({id: 'scheduleManagement.email'}), name: 'email', span: 4, type: 'input', rules: [{ type: 'email', message: formatMessage({id: 'scheduleManagement.sure.email'}) }] },
      ]
    },
  }
}

// 关键设备投入类型
export interface EquipmentItem {
  key: string; // 表格唯一标识（用于行操作）
  equipment_category: "通用设备" | "管道专用设备"; // 用于区分类别
  equipment_name: string; // 设备名称
  own_quantity?: number; // 自有台组（可选，避免undefined）
  lease_quantity?: number; // 租赁台组
  shared_quantity?: number; // 共享台组
  remark?: string; // 备注
}
// 关键设备投入- 初始数据
export const getInitData = (formatMessage: any): EquipmentItem[] => {
  return [
    { key: "1", equipment_category: formatMessage({id: 'scheduleManagement.general.equipment'}), equipment_name: formatMessage({id: 'scheduleManagement.crane'}), own_quantity: 0, lease_quantity: 0, shared_quantity: 0, remark: "" },
    { key: "2", equipment_category: formatMessage({id: 'scheduleManagement.general.equipment'}), equipment_name: formatMessage({id: 'scheduleManagement.excavator'}), own_quantity: 0, lease_quantity: 0, shared_quantity: 0, remark: "" },
    { key: "3", equipment_category: formatMessage({id: 'scheduleManagement.general.equipment'}), equipment_name: formatMessage({id: 'scheduleManagement.generator.set'}), own_quantity: 0, lease_quantity: 0, shared_quantity: 0, remark: "" },
    { key: "4", equipment_category: formatMessage({id: 'scheduleManagement.general.equipment'}), equipment_name: formatMessage({id: 'scheduleManagement.highWork.platform'}), own_quantity: 0, lease_quantity: 0, shared_quantity: 0, remark: "" },
    { key: "5", equipment_category: formatMessage({id: 'scheduleManagement.general.equipment'}), equipment_name: formatMessage({id: 'scheduleManagement.air.compressor'}), own_quantity: 0, lease_quantity: 0, shared_quantity: 0, remark: "" },
    { key: "6", equipment_category: formatMessage({id: 'scheduleManagement.general.equipment'}), equipment_name: formatMessage({id: 'scheduleManagement.other.equipment'}), own_quantity: 0, lease_quantity: 0, shared_quantity: 0, remark: "" },
    // 管道专用设备
    { key: "7", equipment_category: formatMessage({id: 'scheduleManagement.specific.equipment'}), equipment_name: formatMessage({id: 'scheduleManagement.laying.machine'}), own_quantity: 0, lease_quantity: 0, shared_quantity: 0, remark: "" },
    { key: "8", equipment_category: formatMessage({id: 'scheduleManagement.specific.equipment'}), equipment_name: formatMessage({id: 'scheduleManagement.horizontal'}), own_quantity: 0, lease_quantity: 0, shared_quantity: 0, remark: "" },
    { key: "9", equipment_category: formatMessage({id: 'scheduleManagement.specific.equipment'}), equipment_name: formatMessage({id: 'scheduleManagement.direct.shield'}), own_quantity: 0, lease_quantity: 0, shared_quantity: 0, remark: "" },
    { key: "10", equipment_category: formatMessage({id: 'scheduleManagement.specific.equipment'}), equipment_name: formatMessage({id: 'scheduleManagement.fully.automatic'}), own_quantity: 0, lease_quantity: 0, shared_quantity: 0, remark: "" },
    { key: "11", equipment_category: formatMessage({id: 'scheduleManagement.specific.equipment'}), equipment_name: formatMessage({id: 'scheduleManagement.other.special.equipment'}), own_quantity: 0, lease_quantity: 0, shared_quantity: 0, remark: "" },

  ]
}

// 人力资源投入类型
export interface HumanItem {
  key: string;
  category: string;
  type: string;                    // 对应后端返回的 type 字段
  own_cn_cnt: number;              // 自有中方
  own_fgn_cnt: number;             // 自有外方
  labor_cn_cnt: number;            // 劳务中方
  labor_fgn_cnt: number;           // 劳务外方
  sub_cn_cnt: number;              // 分包中方
  sub_fgn_cnt: number;             // 分包外方
}

// 人力资源投入 -初始化列配置
export const getHrInitData = (formatMessage: any): HumanItem[] => {
  return [
    { key: "1", category: formatMessage({id: 'scheduleManagement.management'}), type: formatMessage({id: 'scheduleManagement.management'}), own_cn_cnt: 0, own_fgn_cnt: 0, labor_cn_cnt: 0, labor_fgn_cnt: 0, sub_cn_cnt: 0, sub_fgn_cnt: 0 },
    { key: "2", category: formatMessage({id: 'scheduleManagement.designer'}), type: formatMessage({id: 'scheduleManagement.designer'}), own_cn_cnt: 0, own_fgn_cnt: 0, labor_cn_cnt: 0, labor_fgn_cnt: 0, sub_cn_cnt: 0, sub_fgn_cnt: 0 },
    { key: "3", category: formatMessage({id: 'scheduleManagement.procurement'}), type: formatMessage({id: 'scheduleManagement.procurement'}), own_cn_cnt: 0, own_fgn_cnt: 0, labor_cn_cnt: 0, labor_fgn_cnt: 0, sub_cn_cnt: 0, sub_fgn_cnt: 0 },
    { key: "4", category: formatMessage({id: 'scheduleManagement.construction'}), type: formatMessage({id: 'scheduleManagement.construction'}), own_cn_cnt: 0, own_fgn_cnt: 0, labor_cn_cnt: 0, labor_fgn_cnt: 0, sub_cn_cnt: 0, sub_fgn_cnt: 0 },

  ]
}

// 项目基础信息中需要禁用的列
export const disabledList = [
  'region_category',
  'owner_group',
  'sign_status',
  'contract_sign_date',
  'contract_start_date',
  'contract_end_date',
  'actual_start_date',
  'erp_code',
  'epm_code',
  'create_dep_code',
  'report_dep_code',
  'plan_finish_date',
  'warranty_period',
  'specialty_type',
  'three_new_category',
  'sub_category',
  'contract_mode',
  'project_level',
  'project_name',
  'is_guaranty',
  'is_related',
  'project_location',
  'longitude',
  'latitude',
  'project_subject',
  'project_quantities',
  'project_significance',
  'project_director',
  'director_phone',
  'director_email',
  'project_manager',
  'manager_phone',
  'manager_email',
  'project_contact',
  'contact_phone',
  'contact_email',
  'project_doc_control',
  'dc_phone',
  'dc_email',
  'construction_dep',
  'construction_dep_contact',
  'construction_dep_phone',
  'construction_dep_email',
  'pmc_pmt_dep',
  'pmc_pmt_contact',
  'pmc_pmt_phone',
  'pmc_pmt_email',
  'supervision_dep',
  'supervision_dep_contact',
  'supervision_dep_phone',
  'supervision_dep_email',
  'contract_currency', // 合同币种
  'RMB_rate', // 人民币汇率
  'US_rate',
  'report_project_status_name'
]

export const basicGroupFormColumns = [
  {
    title: '合同信息',
    columns: [
      'contract_say_price', // 合同金额（含税）
      'contract_un_say_price', // 合同金额（不含税）
      'contract_sign_date', // 合同签署日期
      'contract_start_date', // 合同生效日期
      'actual_start_date', // 实际开工日期
      'contract_end_date', // 合同完工日期
      'calculate_date', // 计算合同工期
      "contract_status", // 合同状态
      "plan_finish_date", // 预计完工日期
      "warranty_period", // 合同质保期
      "specialty_type", // 专业分类
      'three_new_category', // 三新分类
      'sub_category', // 专业细分
      'contract_mode', // 合同类型
      "project_level", // 项目等级
    ],
    order: 1
  },
  {
    title: '币种汇率信息',
    columns: [
      'contract_currency', // 合同币种
      'RMB_rate', // 人民币汇率
      'equivalent_RMB_price', // 折合人民币(含税)
      'equivalent_RMB_un_price', // 折合人民币(不含税)
      'US_rate', // 美元汇率
      'equivalent_US_price', // 折合美元(含税)
      'equivalent_US_un_price', // 折合美元(不含税)
      'RMB_Total_price', // 人民币合计(含税)
      'RMB_Total_un_price', // 人民币合计(不含税)
      'US_Total_price', // 美元合计(含税)
      'US_Total_un_price', // 美元合计(不含税)
    ],
    order: 2
  },
  {
    title: '项目信息',
    columns: [
      'project_name',
      "is_guaranty", // 是否由中油工程担保 0否1是
      "is_related", // 是否CPECC内部关联项目 0否1是
      "import_level", // 项目重要级别
      "report_project_status_name", // 项目状态
      "project_subject", // 项目概况
      "project_quantities", // 项目工程量
      "project_significance", // 项目意义
      "project_location", // 项目地点
      "longitude", // 经度
      "latitude", // 纬度
    ],
    order: 2
  },
  {
    title: '项目团队',
    columns: [
      "project_director", // 项目主任
      "director_phone",
      "director_email",
      "project_manager", // 项目经理
      "manager_phone",
      "manager_email",
      "project_contact", // 项目联系人
      "contact_phone",
      "contact_email",
      "project_doc_control", // 项目文控
      "dc_phone",
      "dc_email",
    ],
    order: 3
  },
  {
    title: '相关单位',
    columns: [
      "construction_dep", // 建设单位
      "construction_dep_contact",
      "construction_dep_phone",
      "construction_dep_email",
      "pmc_pmt_dep", // PMC/PMT单位
      "pmc_pmt_contact",
      "pmc_pmt_phone",
      "pmc_pmt_email",
      "supervision_dep", // 监理单位
      "supervision_dep_contact",
      "supervision_dep_phone",
      "supervision_dep_email",
      'general_contractor_data', // 总承包单位
      'design_dep_data', // 设计单位
      'purchase_dep_data', // 采购单位
      'internal_dep_data', // 内部施工单位
      'external_dep_data', // 外部施工单位
      'ndt_dep_data', // 无损检测单位
      'operation_dep_data', // 投产运行单位
      'area_data', // 区域

    ],
    order: 4
  },
]