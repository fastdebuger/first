import React, { useImperativeHandle, forwardRef, useEffect, useState } from "react";
import { useIntl } from "umi";
import { InputNumber, Form, Select, Input, Spin } from "antd";
import { BasicFormColumns, BasicTaskForm, } from "yayang-ui";
import FocusPaginationSelect from '@/components/CommonList/FocusSelect';
import { getChildren } from "@/utils/utils-array";
import { ErrorCode, WBS_CODE } from "@/common/const";
import { formatContractDuration } from "@/utils/utils-date";
// 用于高精度计算的js 库解决 浮点数精度问题
import Decimal from 'decimal.js';

import ContractNoModal from "./ContractNoModal";
import DynamicFormList from "./DynamicFormList";
import AreaDataField from "./AreaDataField";
import { getDynamicFormConfig, disabledList, basicGroupFormColumns } from "../FormConfig";
import { configColumns } from "../../columns";
import "./index.less";

/**
 * 新增项目基本信息
 * @param props - 组件接收的props
 *   @param ref: 父组件传递的Ref，用于暴露getFormData等方法
 *   @param disabled: 
 *   @param isContractNo: 控制是否维护选择合同编号
 * @constructor
 */
const BasicInfoWrapper = forwardRef<any, any>((props, ref) => {
  const { dispatch, disabled = false, isContractNo = false } = props;
  const { formatMessage } = useIntl();
  /**
   * useIntl() 不能在函数组件外使用 - Hook 只能在 React 组件或自定义 Hook 中调用
   * 所以这里需要将 formatMessage通过函数传递给子引用，用于动态生成国际化字段
   */
  const dynamicFormConfig = getDynamicFormConfig(formatMessage);
  /**
 * 表单相关状态管理
 * 用于项目信息录入表单的状态初始化和数据监听
 */
  // 初始化表单实例
  const [form] = Form.useForm();
  // 项目分类列表状态
  const [projectCategoryList, setProjectCategoryList] = useState<any>([]);
  // 三级分类状态
  const [threeCategory, setThreeCategory] = useState<any>([]);
  // 资金比例配置状态
  const [moneyRate, setMoneyRate] = useState<any>({});
  // 加载状态标识
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 监听区域分类字段变化
  const regionCategory = Form.useWatch('region_category', form);
  // 监听项目分类字段变化
  const projectCategory = Form.useWatch('specialty_type', form);
  const threeNewCategoryForm = Form.useWatch('three_new_category', form);
  /**
 * 使用 useImperativeHandle 自定义暴露给父组件的实例值
 * @param ref 父组件传递的 ref 对象，用于转发子组件的方法或属性
 * @returns 返回一个对象，包含 getFormData 和 setFormData 两个方法供外部调用
 */
  useImperativeHandle(ref, () => {
    return {
      /**
       * 异步获取表单数据并进行校验
       * @returns Promise<any> 表单验证通过后的数据
       * @throws Error 当表单验证失败时抛出错误提示
       */
      getFormData: async () => {
        try {
          const values = await form.validateFields();
          return values;
        } catch (err) {
          throw new Error("请填写完整的基础信息");
        }
      },
      form: form,
      /**
       * 设置表单数据，并对特定字段做 JSON 解析和格式化处理
       * @param data 需要设置到表单中的原始数据
       */
      setFormData: (data: any) => {
        console.log(data, "assssssssss");
        // 定义需要被解析为 JSON 的字段列表
        const jsonStringFields = [
          'general_contractor_data',
          'design_dep_data',
          'purchase_dep_data',
          'internal_dep_data',
          'external_dep_data',
          'ndt_dep_data',
          'operation_dep_data',
          'area_data'
        ];

        // 统一解析 + 安全容错
        const parsedData = { ...data };

        // 遍历指定字段，统一处理其数据结构（主要是将字符串形式的 JSON 转换为对象或数组）
        jsonStringFields.forEach(field => {
          const value = parsedData[field];
          /** 检查字段值是否为非空字符串，如果是则尝试解析为JSON格式数据
            * 解析成功将结果存入parsedData对象对应字段，解析失败则设置为空数组 */
          if (typeof value === 'string' && value.trim() !== '') {
            try {
              parsedData[field] = JSON.parse(value);
            } catch (e) {
              console.warn(`解析 ${field} 失败:`, value);
              parsedData[field] = []; // 解析失败就给空数组
            }
            // 处理空值情况，将null、undefined、'[]'、'[{}]'等空值统一归一化为空数组
          } else if (!value || value === '[]' || value === '[{}]') {
            parsedData[field] = []; // 空字符串或空数组都归一化为 []
          }
          // 如果是 null/undefined，也设为 []
          else if (!Array.isArray(parsedData[field])) {
            parsedData[field] = [];
          }
        });

        // 重要：先 setFieldsValue，再延迟一次，确保 Form.List 能正确识别数组长度
        form.setFieldsValue(parsedData);

        setTimeout(() => {
          form.setFieldsValue(parsedData);
        }, 100);
      },
    };
  });

  // 统一查询字典
  const fetchDict = async () => {
    setIsLoading(true);
    // 查询三新分类字典
    dispatch({
      type: 'basicInfo/getThreeNewCategoryDictTree',
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          setThreeCategory(res.result || []);
          if(disabled || isContractNo){
            const currentThreeNewCategory = threeNewCategoryForm;
            const data = getChildren(res.result, [currentThreeNewCategory || ''], { valueAs: 'id' });
            setProjectCategoryList(data);
          }
          
        }
      }
    })
    // 查询币种字典
    dispatch({
      type: 'moneyRateConfig/getCurrencyExchangeRateConfig',
      payload: {
        sort: 'id',
        order: 'desc',
        filter: JSON.stringify([
          { Key: 'dep_code', Val: WBS_CODE, Operator: '=' }
        ])
      },
      callback: (res: any) => {
        if (res.rows && res.rows.length > 0) {
          setMoneyRate(res.rows[0] || {});
        }
      }
    })
    setIsLoading(false);
  }

    /**
   * 将输入值转换为Decimal对象，乘以指定的百位数，然后转换回普通数值
   * @param value - 要计算的原始值
   * @param hundred - 用于相乘的百位数值
   * @returns 返回计算后的数值结果
   */
  const calculateDecimal = (value: any, hundred: any) => {
      return new Decimal(value)
        .times(hundred)
        .toNumber();
    }
  /**
   * 获取表格列配置的函数
   * @returns 返回构造好的表格列数组，用于表格展示和导出
   */
  const getTableColumns = () => {
    let moneyRateList: any = [];
    /**
     * 检查区域分类是否为国外地区
     * 当regionCategory变量的值等于'国外'时，执行相应的业务逻辑分支
     */
    if (regionCategory === '国外' && Object.values(moneyRate).length > 0) {
      moneyRateList = [
        // 'contract_currency', // 合同币种
        {
          title: 'scheduleManagement.contract_currency',
          subTitle: "合同币种",
          dataIndex: "contract_currency",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            form.setFieldsValue({ contract_currency: moneyRate.currency || null });
            return <Input
              disabled
            />;
          }
        },
        // 'RMB_rate', // 人民币汇率
        {
          title: 'scheduleManagement.RMB_rate',
          subTitle: "人民币汇率",
          dataIndex: "RMB_rate",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            form.setFieldsValue({ RMB_rate: moneyRate.exchange_rate_rmb || null });
            return <Input
              disabled
            />;
          }
        },
        // 'equivalent_RMB_price', // 折合人民币(含税)
        {
          title: 'scheduleManagement.equivalent_RMB_price',
          subTitle: "折合人民币(含税)",
          dataIndex: "equivalent_RMB_price",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            const contractSayPrice = form.getFieldsValue(['contract_say_price']);
            // const rmbPrice = contractSayPrice.contract_say_price * Number(moneyRate.exchange_rate_rmb);
            const rmbPrice = calculateDecimal(contractSayPrice.contract_say_price, Number(moneyRate.exchange_rate_rmb))
            form.setFieldsValue({
              equivalent_RMB_price: rmbPrice
            })
            return (
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                disabled
                addonAfter="万元"
                placeholder="折合人民币(含税)"
              />
            )
          }
        },
        // 'equivalent_RMB_un_price', // 折合人民币(不含税)
        {
          title: 'scheduleManagement.equivalent_RMB_un_price',
          subTitle: "折合人民币(不含税)",
          dataIndex: "equivalent_RMB_un_price",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            const noContractSayPrice = form.getFieldsValue(['contract_un_say_price']);
            // const rmbPrice = noContractSayPrice.contract_un_say_price * Number(moneyRate.exchange_rate_rmb);
            const rmbPrice = calculateDecimal(noContractSayPrice.contract_un_say_price, Number(moneyRate.exchange_rate_rmb))
            form.setFieldsValue({
              equivalent_RMB_un_price: rmbPrice
            })
            return (
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                disabled
                addonAfter="万元"
                placeholder="折合人民币(不含税)"
              />
            )
          }
        },
        // 'US_rate', // 美元汇率
        {
          title: 'scheduleManagement.US_rate',
          subTitle: "美元汇率",
          dataIndex: "US_rate",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            form.setFieldsValue({ US_rate: moneyRate.exchange_rate_dollar || null });
            return <Input
              disabled
            />;
          }
        },
        // 'equivalent_US_price', // 折合美元(含税)
        {
          title: 'scheduleManagement.equivalent_US_price',
          subTitle: "折合美元(含税)",
          dataIndex: "equivalent_US_price",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            const contractSayPrice = form.getFieldsValue(['contract_say_price']);
            // const rmbPrice = (contractSayPrice.contract_say_price * Number(moneyRate.exchange_rate_dollar)).toFixed(2);
            const rmbPrice = calculateDecimal(contractSayPrice.contract_say_price, Number(moneyRate.exchange_rate_dollar))
            form.setFieldsValue({
              equivalent_US_price: rmbPrice
            })
            return (
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                disabled
                addonAfter="万元"
                placeholder="折合美元(含税)"
              />
            )
          }
        },
        // 'equivalent_US_un_price', // 折合美元(不含税)
        {
          title: 'scheduleManagement.equivalent_US_un_price',
          subTitle: "折合美元(不含税)",
          dataIndex: "equivalent_US_un_price",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            const noContractSayPrice = form.getFieldsValue(['contract_un_say_price']);
            // const rmbPrice = noContractSayPrice.contract_un_say_price * Number(moneyRate.exchange_rate_dollar);
            const rmbPrice = calculateDecimal(noContractSayPrice.contract_un_say_price, Number(moneyRate.exchange_rate_dollar))
            form.setFieldsValue({
              equivalent_US_un_price: rmbPrice
            })
            return (
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                disabled
                addonAfter="万元"
                placeholder="折合美元(不含税)"
              />
            )
          }
        },
        // 'RMB_Total_price', // 人民币合计(含税)
        {
          title: 'scheduleManagement.RMB_Total_price',
          subTitle: "人民币合计(含税)",
          dataIndex: "RMB_Total_price",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            const contractSayPrice = form.getFieldsValue(['contract_say_price']);
            // const rmbPrice = contractSayPrice.contract_say_price * Number(moneyRate.exchange_rate_rmb);
            const rmbPrice = calculateDecimal(contractSayPrice.contract_say_price, Number(moneyRate.exchange_rate_rmb))
            form.setFieldsValue({
              RMB_Total_price: rmbPrice
            })
            return (
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                disabled
                addonAfter="万元"
                placeholder="人民币合计(含税)"
              />
            )
          }
        },
        // 'RMB_Total_un_price', // 人民币合计(不含税)
        {
          title: 'scheduleManagement.RMB_Total_un_price',
          subTitle: "人民币合计(不含税)",
          dataIndex: "RMB_Total_un_price",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            const noContractSayPrice = form.getFieldsValue(['contract_un_say_price']);
            // const rmbPrice = new Decimal(noContractSayPrice.contract_un_say_price).times(moneyRate.exchange_rate_rmb).toNumber();
            const rmbPrice = calculateDecimal(noContractSayPrice.contract_un_say_price, Number(moneyRate.exchange_rate_rmb))
            form.setFieldsValue({
              RMB_Total_un_price: rmbPrice
            })
            return (
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                disabled
                addonAfter="万元"
                placeholder="人民币合计(不含税)"
              />
            )
          }
        },
        // 'US_Total_price', // 美元合计(含税)
        {
          title: 'scheduleManagement.US_Total_price',
          subTitle: "美元合计(含税)",
          dataIndex: "US_Total_price",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            const contractSayPrice = form.getFieldsValue(['contract_say_price']);
            // const rmbPrice = contractSayPrice.contract_say_price * Number(moneyRate.exchange_rate_dollar);
            const rmbPrice = calculateDecimal(contractSayPrice.contract_say_price, Number(moneyRate.exchange_rate_dollar))
            form.setFieldsValue({
              US_Total_price: rmbPrice
            })
            return (
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                disabled
                addonAfter="万元"
                placeholder="美元合计(含税)"
              />
            )
          }
        },
        // 'US_Total_un_price', // 美元合计(不含税)
        {
          title: 'scheduleManagement.US_Total_un_price',
          subTitle: "美元合计(不含税)",
          dataIndex: "US_Total_un_price",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            const noContractSayPrice = form.getFieldsValue(['contract_un_say_price']);
            // const rmbPrice = noContractSayPrice.contract_un_say_price * Number(moneyRate.exchange_rate_dollar);
            const rmbPrice = calculateDecimal(noContractSayPrice.contract_un_say_price, Number(moneyRate.exchange_rate_dollar))
            form.setFieldsValue({
              US_Total_un_price: rmbPrice
            })
            return (
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                disabled
                addonAfter="万元"
                placeholder="美元合计(不含税)"
              />
            )
          }
        },
      ];
    }

    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        {
          title: 'scheduleManagement.contract_no',
          subTitle: '合同号',
          width: 160,
          align: 'center',
          dataIndex: 'contract_no',
          renderSelfForm: (form, dataSource, updateDataSource) => {
            return (
              <ContractNoModal
                dataSource={dataSource || []}
                disabled={disabled || isContractNo}
                handleChange={async (data: any) => {
                  await fetchDict();
                  const contractList = data || {};
                  // 分割字符串
                  const regionCategoryStr = contractList.owner_group_str || '';
                  if(data){
                    form.setFieldsValue({
                      contract_no: contractList.contract_no || null,
                      // 汉字
                      region_category: regionCategoryStr.slice(0, 2) || null,
                      owner_group: regionCategoryStr.slice(2, 5) || null,
                      erp_code: contractList.wbs_code || null,
                      contract_say_price: (Number(contractList.contract_say_price) / 10000) || null,
                      contract_un_say_price: (Number(contractList.contract_un_say_price) / 10000) || null,
                      contract_sign_date: contractList.contract_sign_date || null,
                      contract_start_date: contractList.contract_start_date || null,
                      contract_end_date: contractList.contract_end_date || null,
                      specialty_type: contractList.specialty_type_str || null, // 专业分类
                      contract_mode: contractList.contract_mode_str || null, // 合同类型
                      project_level: contractList.project_level_str || null, // 项目等级
                      create_dep_code: contractList.dep_name || null,
                      report_dep_code: contractList.dep_name || null,
                      project_name: contractList.contract_name || null, // 合同名称
                      construction_dep: contractList.owner_unit_name || null, // 甲方单位名称
                      project_manager: contractList.user_name || null,
                    })
                  }else {
                    form?.setFieldsValue({
                      contract_no: '',
                      region_category: '',
                      owner_group: '',
                      erp_code: '',
                      contract_say_price: '',
                      contract_un_say_price: '',
                      contract_sign_date: null,
                      contract_start_date: null,
                      contract_end_date: null,
                      specialty_type: '', // 专业分类
                      contract_mode: '', // 合同类型
                      project_level: '', // 项目等级
                      create_dep_code: '',
                      report_dep_code: '',
                      project_name: '',
                      construction_dep: '',
                      project_manager: '',
                    })
                  }
                  
                }} />
            )
          }
        },
        "region_category", // 地域类型（0-国内1-国外）
        "owner_group", // 系统分类（0-集团内部1-集团外部）
        regionCategory === '国外' && 'sign_status', // 签约情况（0-境内1-境外）
        "erp_code", // ERP项目编码
        "epm_code", // EPM编码
        "create_dep_code", // 创建单位
        "report_dep_code", // 填报单位
        {
          title: 'scheduleManagement.contract_say_price',
          subTitle: '合同金额（含税）',
          width: 160,
          align: 'center',
          dataIndex: 'contract_say_price',
          renderSelfForm: (form, dataSource, updateDataSource) => {
            return (
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                disabled
                addonAfter="万元"
                placeholder="请输入合同金额（含税）"
              />
            )
          }
        },
        {
          title: 'scheduleManagement.contract_un_say_price',
          subTitle: '合同金额（不含税）',
          width: 160,
          align: 'center',
          dataIndex: 'contract_un_say_price',
          renderSelfForm: (form, dataSource, updateDataSource) => {
            return (
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                disabled
                addonAfter="万元"
                placeholder="请输入合同金额（不含税）"
              />
            )
          }
        },
        'contract_sign_date', // 合同签署日期
        'contract_start_date', // 合同生效日期
        'actual_start_date', // 实际开工日期
        'contract_end_date', // 合同完工日期
        // 计算合同工期
        {
          title: 'scheduleManagement.calculate_date',
          subTitle: "合同工期",
          dataIndex: "calculate_date",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            const contractEndDate = form.getFieldsValue(['contract_end_date']);
            const contractStartDate = form.getFieldsValue(['contract_start_date']);
            const duration = formatContractDuration(
              contractStartDate.contract_start_date * 1000, // 1763108991 2025-11-15
              contractEndDate.contract_end_date * 1000, // 1763800193 2025-11-23"
              true  // 包含起始日（合同生效当天算一天）
            );
            console.log(duration, "durationduration");
            form.setFieldsValue({
              calculate_date: duration || '-'
            })
            return (
              <Input disabled />
            )
          }
        },
        {
          title: 'scheduleManagement.contract_status',
          subTitle: "合同状态",
          dataIndex: "contract_status",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <FocusPaginationSelect
                disabled={disabled} // 可以继承antd中的属性
                fetchType='contractBasic/getSysDict' 
                payload={{
                  sort: 'id',
                  order: 'asc',
                  filter: JSON.stringify([{ "Key": "sys_type_code", "Val": "CONTRACT_STATUS", "Operator": "=" }]),
                }}
                optionFilterProp={'dict_name'} 
                fieldNames={{ label: 'dict_name', value: 'id' }}
                placeholder="请选择合同状态"
                form={form}
                fieldName="contract_status"
              />
            )
          }
        },
        "plan_finish_date", // 预计完工日期
        "warranty_period", // 合同质保期
        // "project_category", // 专业分类
        {
          title: 'scheduleManagement.project_category',
          subTitle: "专业分类",
          dataIndex: "specialty_type",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <FocusPaginationSelect
                disabled // 可以继承antd中的属性
                fetchType='contractBasic/getSysDict' 
                payload={{
                  sort: 'id',
                  order: 'asc',
                  filter: JSON.stringify([{ "Key": "sys_type_code", "Val": "SPECIALTY_TYPE", "Operator": "=" }]),
                }}
                fieldNames={{ label: 'dict_name', value: 'id' }}
                placeholder="请选择专业分类"
                optionFilterProp={'dict_name'} 

              />
            )
          }
        },
        projectCategory === '三新工程' && {
          title: 'scheduleManagement.three_new_category',
          subTitle: "三新分类",
          dataIndex: "three_new_category",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            const categoryList = threeCategory?.map((item: any) => {
              return {
                value: item.id,
                label: item.dict_name
              }
            })
            return (
              <Select
                disabled={disabled}
                onChange={(e, option: any) => {
                  /**
                   * 获取指定分类的子级数据
                   * @param threeCategory - 三级分类数据源
                   * @param option - 包含value属性的选项对象，用于指定筛选条件
                   * @param options - 配置对象，valueAs属性指定将value作为哪个字段进行匹配
                   * @returns 符合条件的子级数据数组
                   */
                  form.setFieldsValue({ three_new_category: e })
                  const data = getChildren(threeCategory, [option.value || ''], { valueAs: 'id' });
                  setProjectCategoryList(data);
                }}
                options={categoryList || []}
              />
            )
          }
        },
        projectCategory === '三新工程' && {
          title: 'scheduleManagement.sub_category',
          subTitle: "专业细分",
          dataIndex: "sub_category",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <Select
                disabled={disabled}
                options={projectCategoryList || []}
              />
            )
          }
        },
        'contract_mode', // 合同类型
        'project_level', // 项目等级
        ...moneyRateList,
        "project_name", // 项目名称
        "is_guaranty", // 是否由中油工程担保 0否1是
        "is_related", // 是否CPECC内部关联项目 0否1是
        // "import_level", // 项目重要级别（国家重点项目、集团重点项目、中油工程重点项目）
        {
          title: 'scheduleManagement.import_level',
          subTitle: "项目重要级别",
          dataIndex: "import_level",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <Select
                mode='multiple'
                disabled={disabled}
                placeholder="请选择项目重要级别"
                onChange={(value) => {
                  if (value.length > 0) {
                    form.setFieldsValue({ import_level: value })
                  }
                }}
                options={[
                  { value: '国家重点项目', label: '国家重点项目' },
                  { value: '集团重点项目', label: '集团重点项目' },
                  { value: '中油工程重点项目', label: '中油工程重点项目' },
                ]}
              />
            )
          }
        },
        "report_project_status_name", // 项目状态

        "project_subject", // 项目概况
        "project_quantities", // 项目工程量
        "project_significance", // 项目意义
        "project_location", // 项目地点
        "longitude", // 经度
        "latitude", // 纬度

        "project_director", // 项目主任
        "director_phone", // 项目主任联系电话
        "director_email", // 项目主任电子邮箱
        "project_manager", // 项目经理
        "manager_phone", // 项目经理联系电话
        "manager_email", // 项目经理电子邮箱
        "project_contact", // 项目联系人
        "contact_phone", // 项目联系人电话
        "contact_email", // 项目联系人邮箱
        "project_doc_control", // 项目文控
        "dc_phone", // 
        "dc_email", // 

        "construction_dep", // 建设单位
        "construction_dep_contact", // 
        "construction_dep_phone", // 
        "construction_dep_email", // 
        "pmc_pmt_dep", // PMC/PMT单位
        "pmc_pmt_contact", // 
        "pmc_pmt_phone", // 
        "pmc_pmt_email", // 
        "supervision_dep", // 监理单位
        "supervision_dep_contact", // 
        "supervision_dep_phone", // 
        "supervision_dep_email", // supervision_dep_email
        // 动态增减表单项 - 使用自定义渲染
        {
          title: 'scheduleManagement.general_contractor_data',
          subTitle: '总承包单位',
          width: 160,
          align: 'center',
          dataIndex: 'general_contractor_data',
          renderSelfForm: (form, dataSource, updateDataSource) => (
            <DynamicFormList
              name="general_contractor_data"
              disabled={disabled}
              title={dynamicFormConfig.general_contractor_data.title}
              fieldsList={dynamicFormConfig.general_contractor_data.fieldsList}
              form={form}
              dataSource={dataSource}
              updateDataSource={updateDataSource}
            />
          )
        },
        {
          title: 'scheduleManagement.design_dep_data',
          subTitle: '设计单位',
          width: 160,
          align: 'center',
          dataIndex: 'design_dep_data',
          renderSelfForm: (form, dataSource, updateDataSource) => (
            <DynamicFormList
              name="design_dep_data"
              disabled={disabled}
              title={dynamicFormConfig.design_dep_data.title}
              fieldsList={dynamicFormConfig.design_dep_data.fieldsList}
              form={form}
              dataSource={dataSource}
              updateDataSource={updateDataSource}
            />
          )
        },
        {
          title: 'scheduleManagement.purchase_dep_data',
          subTitle: '采购单位',
          width: 160,
          align: 'center',
          dataIndex: 'purchase_dep_data',
          renderSelfForm: (form, dataSource, updateDataSource) => (
            <DynamicFormList
              name="purchase_dep_data"
              disabled={disabled}
              title={dynamicFormConfig.purchase_dep_data.title}
              fieldsList={dynamicFormConfig.purchase_dep_data.fieldsList}
              form={form}
              dataSource={dataSource}
              updateDataSource={updateDataSource}
            />
          )
        },
        {
          title: 'scheduleManagement.internal_dep_data',
          subTitle: '内部施工单位',
          width: 160,
          align: 'center',
          dataIndex: 'internal_dep_data',
          renderSelfForm: (form, dataSource, updateDataSource) => (
            <DynamicFormList
              name="internal_dep_data"
              disabled={disabled}
              title={dynamicFormConfig.internal_dep_data.title}
              fieldsList={dynamicFormConfig.internal_dep_data.fieldsList}
              form={form}
              dataSource={dataSource}
              updateDataSource={updateDataSource}
              dispatch={dispatch}
            />
          )
        },
        {
          title: 'scheduleManagement.external_dep_data',
          subTitle: '外部施工单位',
          width: 160,
          align: 'center',
          dataIndex: 'external_dep_data',
          renderSelfForm: (form, dataSource, updateDataSource) => (
            <DynamicFormList
              name="external_dep_data"
              disabled={disabled}
              title={dynamicFormConfig.external_dep_data.title}
              fieldsList={dynamicFormConfig.external_dep_data.fieldsList}
              form={form}
              dataSource={dataSource}
              updateDataSource={updateDataSource}
              dispatch={dispatch}
            />
          )
        },
        {
          title: 'scheduleManagement.ndt_dep_data',
          subTitle: '无损检测单位',
          width: 160,
          align: 'center',
          dataIndex: 'ndt_dep_data',
          renderSelfForm: (form, dataSource, updateDataSource) => (
            <DynamicFormList
              name="ndt_dep_data"
              disabled={disabled}
              title={dynamicFormConfig.ndt_dep_data.title}
              fieldsList={dynamicFormConfig.ndt_dep_data.fieldsList}
              form={form}
              dataSource={dataSource}
              updateDataSource={updateDataSource}
              dispatch={dispatch}
            />
          )
        },
        {
          title: 'scheduleManagement.operation_dep_data',
          subTitle: '投产运行单位',
          width: 160,
          align: 'center',
          dataIndex: 'operation_dep_data',
          renderSelfForm: (form, dataSource, updateDataSource) => (
            <DynamicFormList
              name="operation_dep_data"
              disabled={disabled}
              title={dynamicFormConfig.operation_dep_data.title}
              fieldsList={dynamicFormConfig.operation_dep_data.fieldsList}
              form={form}
              dataSource={dataSource}
              updateDataSource={updateDataSource}
              dispatch={dispatch}
            />
          )
        },
        regionCategory && {
          title: 'scheduleManagement.area_data',
          subTitle: '区域',
          width: 160,
          align: 'center',
          dataIndex: 'area_data',
          renderSelfForm: (form, dataSource, updateDataSource) => {
            return (
              <AreaDataField
                form={form}
                disabled={disabled}
                dataSource={dataSource}
                updateDataSource={updateDataSource}
                dispatch={dispatch}
              />
            )
          }
        },

      ])
      .setSplitGroupFormColumns([...basicGroupFormColumns])
      // 自定义宽度的列
      .setFormColumnToSelfColSpan([
        { value: 'contract_say_price', colSpan: 8, labelCol: { span: 8 }, wrapperCol: { span: 16 } },
        { value: 'contract_un_say_price', colSpan: 8, labelCol: { span: 8 }, wrapperCol: { span: 16 } },
        { value: 'contract_sign_date', colSpan: 8, labelCol: { span: 8 }, wrapperCol: { span: 16 } },

        { value: 'project_director', colSpan: 8, labelCol: { span: 8 }, wrapperCol: { span: 16 } },
        { value: 'director_phone', colSpan: 8, labelCol: { span: 8 }, wrapperCol: { span: 16 } },
        { value: 'director_email', colSpan: 8, labelCol: { span: 8 }, wrapperCol: { span: 16 } },
        { value: 'project_manager', colSpan: 8, labelCol: { span: 8 }, wrapperCol: { span: 16 } },
        { value: 'manager_phone', colSpan: 8, labelCol: { span: 8 }, wrapperCol: { span: 16 } },
        { value: 'manager_email', colSpan: 8, labelCol: { span: 8 }, wrapperCol: { span: 16 } },
        { value: 'project_contact', colSpan: 8, labelCol: { span: 8 }, wrapperCol: { span: 16 } },
        { value: 'contact_phone', colSpan: 8, labelCol: { span: 8 }, wrapperCol: { span: 16 } },
        { value: 'contact_email', colSpan: 8, labelCol: { span: 8 }, wrapperCol: { span: 16 } },
        { value: 'project_doc_control', colSpan: 8, labelCol: { span: 8 }, wrapperCol: { span: 16 } },
        { value: 'dc_phone', colSpan: 8, labelCol: { span: 8 }, wrapperCol: { span: 16 } },
        { value: 'dc_email', colSpan: 8, labelCol: { span: 8 }, wrapperCol: { span: 16 } },
        // 动态增减项
        { value: 'general_contractor_data', colSpan: 24, labelCol: { span: 0 }, wrapperCol: { span: 24 }, showLabel: false },
        { value: 'design_dep_data', colSpan: 24, labelCol: { span: 0 }, wrapperCol: { span: 24 }, showLabel: false },
        { value: 'purchase_dep_data', colSpan: 24, labelCol: { span: 0 }, wrapperCol: { span: 24 }, showLabel: false },
        { value: 'internal_dep_data', colSpan: 24, labelCol: { span: 0 }, wrapperCol: { span: 24 }, showLabel: false },
        { value: 'external_dep_data', colSpan: 24, labelCol: { span: 0 }, wrapperCol: { span: 24 }, showLabel: false },
        { value: 'ndt_dep_data', colSpan: 24, labelCol: { span: 0 }, wrapperCol: { span: 24 }, showLabel: false },
        { value: 'operation_dep_data', colSpan: 24, labelCol: { span: 0 }, wrapperCol: { span: 24 }, showLabel: false },
        { value: 'area_data', colSpan: 24, labelCol: { span: 0 }, wrapperCol: { span: 24 }, showLabel: false },
        { value: 'project_name', colSpan: 16, labelCol: { span: 3 }, wrapperCol: { span: 21 }, showLabel: false },
        { value: 'is_guaranty', colSpan: 8, labelCol: { span: 8 }, wrapperCol: { span: 16 } },
        { value: 'is_related', colSpan: 8, labelCol: { span: 8 }, wrapperCol: { span: 16 } },
      ])
      .setFormColumnToSelect([
        // 地域分类
        {
          value: 'region_category',
          valueType: 'select',
          name: 'label',
          valueAlias: 'value',
          data: [
            { value: 0, label: '国内' }, { value: 1, label: '国外' }
          ]
        },
        // 系统分类
        {
          value: 'owner_group',
          valueType: 'select',
          name: 'label',
          valueAlias: 'value',
          data: [
            { value: 0, label: '集团内部' }, { value: 1, label: '集团外部' }
          ]
        },
        // 是否由中油工程担保
        {
          value: 'is_guaranty',
          valueType: 'select',
          name: 'label',
          valueAlias: 'value',
          data: [{ value: 1, label: '是' }, { value: 0, label: '否' }]
        },
        {
          value: 'sign_status',
          valueType: 'select',
          name: 'label',
          valueAlias: 'value',
          data: [{ value: 0, label: '境内' }, { value: 1, label: '境外' }]
        },
        {
          value: 'is_related',
          valueType: 'select',
          name: 'label',
          valueAlias: 'value',
          data: [{ value: 1, label: '是' }, { value: 0, label: '否' }]
        },

      ])
      .setFormColumnToDatePicker([
        { value: 'contract_sign_date', valueType: 'dateTs', needValueType: 'timestamp' }, // 合同签署日期
        { value: 'contract_start_date', valueType: 'dateTs', needValueType: 'timestamp' }, // 合同生效日期
        { value: 'contract_end_date', valueType: 'dateTs', needValueType: 'timestamp' }, // 合同完工日
        { value: 'plan_finish_date', valueType: 'dateTs', needValueType: 'timestamp' }, // 预计完工日期
        { value: 'actual_start_date', valueType: 'dateTs', needValueType: 'timestamp' }, // 实际开工日期
      ])
      .setFormColumnToInputTextArea([
        { value: 'project_subject' }, // 项目概况
        { value: 'project_quantities' }, // 项目工程量
        { value: 'project_significance' }, // 项目意义
      ])
      .needToRules([
        'contract_no',
        'region_category',
        'owner_group',
        'sign_status',
        'project_name',
        'contract_say_price', // 合同金额（含税）
        'contract_un_say_price', // 合同金额（不含税）
        'contract_sign_date', // 合同签署日期 
        'contract_start_date', // 合同生效日期
        'contract_end_date', // 合同完工日期
        'contract_status', // 合同状态
        "warranty_period", // 合同质保期
        "specialty_type", // 专业分类
        'three_new_category', // 三新分类
        'sub_category', // 专业细分
        'contract_mode', // 合同类型
        'project_level', // 项目等级
        'is_guaranty',
        "project_location", // 项目地点
        'project_subject', // 项目概况
        'project_quantities', // 项目工程量
        'project_significance', // 项目意义
        "project_manager", // 项目经理
        "manager_phone", // 项目经理联系电话
        "manager_email", // 项目经理电子邮箱
        "project_contact", // 项目联系人
        "contact_phone", // 项目联系人电话
        "contact_email", // 项目联系人邮箱
        "project_doc_control", // 项目文控
        "dc_phone", // 
        "dc_email", // 
        "construction_dep", // 建设单位
        'plan_finish_date',
        'actual_start_date'
      ])
      .needToDisabled(disabled ? [
        ...disabledList
      ] : [
        'region_category',
        'owner_group',
        'erp_code',
        'contract_sign_date', // 合同签署日期
        'contract_start_date', // 合同生效日期
        'contract_end_date', // 合同完工日期
        "specialty_type", // 专业分类
        'contract_mode', // 合同类型
        'project_name',
        'project_level', // 项目等级
        "create_dep_code", // 创建单位
        "report_dep_code", // 填报单位
        'contract_currency', // 合同币种
        'RMB_rate', // 人民币汇率
        'US_rate',
        'is_related',
        'report_project_status_name',
      ])
      .getNeedColumns();
    cols.forEach((item: any) => item.title = formatMessage({ id: item.title }));
    return cols;
  };
  useEffect(() => {
    if(disabled || isContractNo){
      fetchDict();
      
    }
  },[threeNewCategoryForm,disabled]);

  return (
    <Spin spinning={isLoading}>
      <BasicTaskForm
        form={form}
        initialValue={{
          is_related: '0',
          is_guaranty: '0',
          contract_currency: moneyRate?.currency,
          RMB_rate: moneyRate?.exchange_rate_rmb,
          US_rate: moneyRate?.exchange_rate_dollar,
        }}
        formColumns={getTableColumns()}
        colSpan={6}
        labelCol={{ span: 8 }}
        labelAlign="left"
      />

    </Spin>
  );
});
// React 组件的静态属性，用于在开发工具（如 React DevTools）、错误堆栈、日志等地方显示组件的名字
BasicInfoWrapper.displayName = 'BasicInfoWrapper';

export default BasicInfoWrapper;