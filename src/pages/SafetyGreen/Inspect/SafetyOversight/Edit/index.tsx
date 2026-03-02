import React, { useEffect, useState } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode, WBS_CODE } from "@/common/const";
import { message, Form, Spin } from "antd";
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';
import ObsCodeTreeSelect, { ObsCodeItem } from '@/components/ObsCodeTreeSelect';
import { HUA_WEI_OBS_CONFIG } from "@/common/const";
import {
  getProblemCategoryOptions,
  getFieldDisabled,
  getRequiredFields,
  getFieldDisabledByUserLevel,
  processProblemClassificationData,
  transformOperationBehaviorData,
  transformItemsToFormData,
} from "../qualitySafetyUtils";
import useSysDict from "@/utils/useSysDict";
import { queryWBS, getObsCode } from "@/services/user";
import { queryQualitySafetyFactorTypeFlat } from "@/services/safetyGreen/inspect/questionClassification";
import { getLiabilityAttributionH, getSafetyInspectionItems } from "@/services/safetyGreen/inspect/qualitySafetyOversight";
import OperationBehaviorForm from "../Add/OperationBehaviorForm";


const { CrudEditModal } = SingleTable;

/**
 * 编辑安全监督检查问题清单
 * @param props
 * @constructor
 */
const QualitySafetyInspectionEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
  const { configData } = useSysDict({
    filter: [
      {
        "Key": "sys_type_code",
        "Val": "'ENTITY_QUALITY','OPERATION_BEHAVIOR'",
        "Operator": "in"
      }
    ]
  })
  const { formatMessage } = useIntl();
  // 创建表单实例
  const [form] = Form.useForm();
  // 使用 useWatch 监听 problem_type 字段值
  const problemType = Form.useWatch('problem_type', form);
  // 使用 useWatch 监听 problem_category 字段值
  const problemCategory = Form.useWatch('problem_category', form);
  // 使用 useWatch 监听 branch_comp_code 字段值
  const branchCompCode = Form.useWatch('branch_comp_code', form);
  // 使用 useWatch 监听 quality_factor1 字段值
  const qualityFactor1 = Form.useWatch('quality_factor1', form);
  // 使用 useWatch 监听 safety_factor1 字段值
  const safetyFactor1 = Form.useWatch('safety_factor1', form);
  // 使用 useWatch 监听 operation_behavior_ids 字段值
  const operationBehaviorRaw = Form.useWatch('operation_behavior_ids', form);

  // 将 operation_behavior_ids 转换为数组格式的辅助函数
  const getOperationBehaviorArray = (value: any): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      // 如果是逗号分隔的字符串，转换为数组
      return value.split(',').filter(Boolean);
    }
    return [];
  };

  // 确保 operationBehavior 始终是数组
  const operationBehavior = getOperationBehaviorArray(operationBehaviorRaw);
  // 分公司数据
  const [branchCompOptions, setBranchCompOptions] = useState<any[]>([]);
  // 项目部数据
  const [wbsOptions, setWbsOptions] = useState<any[]>([]);
  // 问题归类配置原始数据
  const [problemClassificationData, setProblemClassificationData] = useState<any[]>([]);
  // ObsCode原始数据（所有数据）
  const [obsCodeAllData, setObsCodeAllData] = useState<ObsCodeItem[]>([]);
  // 责任单位归属数据
  const [liabilityAttributionHOptions, setLiabilityAttributionHOptions] = useState<any[]>([]);
  // 责任单位归属原始数据（包含完整信息）
  const [liabilityAttributionHData, setLiabilityAttributionHData] = useState<any[]>([]);

  // 全局加载状态
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * 获取初始数据：分公司、ObsCode、问题归类配置、作业行为详情
   */
  const fetchData = async () => {
    setLoading(true);
    // 获取分公司数据
    const branchCompRes = await queryWBS({
      sort: 'wbs_code',
      order: 'asc',
      filter: JSON.stringify([{ Key: 'prop_key', Val: 'subComp', Operator: '=' }])
    });
    // 判断是否成功获取分公司数据
    if (branchCompRes && branchCompRes.rows) {
      setBranchCompOptions(
        branchCompRes.rows.map((item: any) => ({ value: item.wbs_code, name: item.wbs_name }))
      );
    }

    // 获取obs数据（一次性获取所有数据，后续通过过滤）
    const obsCodeRes = await getObsCode({
      sort: 'obs_code',
      order: 'asc',
      filter: JSON.stringify([
        { Key: 'wbs_code', Val: WBS_CODE + "%", Operator: 'like' },
      ])
    });
    // 判断是否成功获取ObsCode数据
    if (obsCodeRes && obsCodeRes.rows) {
      setObsCodeAllData(obsCodeRes.rows.map((item: any) => ({
        wbs_code: item.wbs_code,
        obs_code: item.obs_code,
        obs_name: item.obs_name,
        prop_key: item.prop_key,
        RowNumber: item.RowNumber,
      })));
    }

    // 获取问题归类配置数据
    const problemClassificationRes = await queryQualitySafetyFactorTypeFlat({
      sort: 'form_no',
      order: 'asc',
    });
    // 判断是否成功获取问题归类配置数据
    if (problemClassificationRes && problemClassificationRes.rows) {
      setProblemClassificationData(problemClassificationRes.rows || []);
    }

    const liabilityAttributionHRes = await getLiabilityAttributionH({
      sort: 'form_no',
      order: 'asc',
    });
    if (liabilityAttributionHRes?.rows) {
      setLiabilityAttributionHData(liabilityAttributionHRes.rows);
      setLiabilityAttributionHOptions(
        liabilityAttributionHRes.rows.map((item: any) => ({
          value: item.form_no,
          name: item.liability_attribution_name
        }))
      );
    }

    // 从 selectedRecord 获取 operation_behavior_ids（接口返回的是字符串格式 'id1,id2'）
    const operationBehaviorIds = typeof selectedRecord?.operation_behavior_ids === 'string'
      ? selectedRecord.operation_behavior_ids.split(',').filter(Boolean)
      : selectedRecord?.operation_behavior_ids || [];

    // 判断是否有记录ID，如果有则获取作业行为详情数据
    if (selectedRecord?.id) {
      const itemsRes = await getSafetyInspectionItems({ id: selectedRecord.id });
      const { items, items1 } = itemsRes?.result || {};
      const itemsArray = typeof items === 'string' ? JSON.parse(items) : items || [];
      const items1Array = typeof items1 === 'string' ? JSON.parse(items1) : items1 || [];
      const operationBehaviorDetails = transformItemsToFormData(itemsArray, items1Array, operationBehaviorIds);

      form.setFieldsValue({
        operation_behavior_ids: operationBehaviorIds,
        operation_behavior_details: operationBehaviorDetails,
      });
    }
    setLoading(false);
  };

  /**
   * 根据分公司获取项目部数据
   */
  const fetchWbsData = async () => {
    // 判断是否选中了分公司
    if (branchCompCode) {
      setLoading(true);
      const res = await queryWBS({
        sort: 'wbs_code',
        order: 'asc',
        filter: JSON.stringify([
          { Key: 'prop_key', Val: 'dep', Operator: '=' },
          { Key: 'up_wbs_code', Val: branchCompCode, Operator: '=' }
        ])
      });
      // 判断是否成功获取项目部数据
      if (res && res.rows) {
        setWbsOptions(
          res.rows.map((item: any) => ({ value: item.wbs_code, name: item.wbs_name }))
        );
      } else {
        setWbsOptions([]);
      }
      setLoading(false);
    } else {
      setWbsOptions([]);
    }
  };

  // 合并的 useEffect：加载数据和确保ID类型匹配
  useEffect(() => {
    // 判断如果弹窗可见且有选中记录，则加载数据
    if (visible && selectedRecord) {
      fetchData();
    }
  }, [visible, selectedRecord, configData]);

  // 根据分公司获取项目部数据
  useEffect(() => {
    fetchWbsData();
  }, [branchCompCode]);

  // 处理问题归类配置数据
  const { factor1Options: qualityFactor1Options, factor2Options: qualityFactor2Options } =
    processProblemClassificationData(problemClassificationData, '质量', qualityFactor1);
  const { factor1Options: safetyFactor1Options, factor2Options: safetyFactor2Options } =
    processProblemClassificationData(problemClassificationData, 'HSE', safetyFactor1);

  const problemObsCodeData = obsCodeAllData;

  // 处理方式及其下级选项配置
  const treatmentMethods = [
    {
      value: '通过强化培训规范',
      name: '通过强化培训规范',
      subMethods: [
        { value: '组织结构与职责', name: '组织结构与职责' },
        { value: '能力培训和意识', name: '能力培训和意识' },
      ],
    },
    {
      value: '通过属地监测避免',
      name: '通过属地监测避免',
      subMethods: [
        { value: '组织结构与职责', name: '组织结构与职责' },
        { value: '绩效测量和监视', name: '绩效测量和监视' },
      ],
    },
    {
      value: '通过建立程序约束',
      name: '通过建立程序约束',
      subMethods: [
        { value: '组织结构与职责', name: '组织结构与职责' },
        { value: '文件', name: '文件' },
      ],
    },
  ];

  // 符合度选项
  const percentOptions = [
    { value: '0', name: '0%' },
    { value: '10', name: '10%' },
    { value: '20', name: '20%' },
    { value: '30', name: '30%' },
    { value: '40', name: '40%' },
    { value: '50', name: '50%' },
    { value: '60', name: '60%' },
    { value: '70', name: '70%' },
    { value: '80', name: '80%' },
    { value: '90', name: '90%' },
    { value: '100', name: '100%' },
  ];

  const getFormColumns = () => {
    // 根据当前选择的 problem_type 动态获取 problem_category 的选项
    const problemCategoryOptions = getProblemCategoryOptions(problemType);

    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        {
          "title": "compinfo.problem_code",
          "subTitle": "问题来源",
          "dataIndex": "problem_code",
          "width": 160,
          "align": "center",
          renderSelfForm: (form: any) => (
            <ObsCodeTreeSelect
              data={problemObsCodeData}
              value={form.getFieldValue('problem_code')}
              onChange={(val) => form.setFieldsValue({ problem_code: val })}
              placeholder="请选择问题来源"
              style={{ width: '100%' }}
              showSearch
              allowClear
            />
          )
        },
        'upload_date',
        'branch_comp_code',
        'wbs_code',
        'project_name',
        'check_date',
        'problem_description',
        {
          "title": "compinfo.problem_image_url",
          "subTitle": "问题图片",
          "dataIndex": "problem_image_url",
          "width": 160,
          "align": "center",
          renderSelfForm: (form: any) =>
            <HuaWeiOBSUploadSingleFile
              accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
              limitSize={100}
              folderPath="/SafetyGreen/Inspect/QualitySafetyOversight"
              handleRemove={() => form.setFieldsValue({ problem_image_url: null })}
              onChange={(file) => {
                form.setFieldsValue({ problem_image_url: file?.response?.url })
              }}
            />
        },
        'problem_type',
        'problem_category',

        'remark',
        'quality_factor1',
        'quality_factor2',
        'entity_quality',
        'operation_behavior_ids',
        {
          "title": "作业行为详情",
          "subTitle": "作业行为详情",
          "dataIndex": "operation_behavior_details",
          "width": 160,
          "align": "center",
          renderSelfForm: (form: any) => (
            <OperationBehaviorForm
              selectedBehaviors={operationBehavior || []}
              behaviorOptions={(configData?.OPERATION_BEHAVIOR || []).map((item: any) => ({
                id: item.id,
                name: item.dict_name,
              }))}
              treatmentMethods={treatmentMethods}
              percentOptions={percentOptions}
              form={form}
            />
          )
        },
        'safety_factor1',
        'safety_factor2',
        'safety_radio',
      ])
      .needToDisabled([
        { value: 'problem_category', disabled: !problemType },
        // 根据 problem_category 动态控制字段的禁用状态
        { value: 'quality_factor1', disabled: getFieldDisabled(problemCategory, 'quality_factor1') },
        { value: 'quality_factor2', disabled: getFieldDisabled(problemCategory, 'quality_factor2') },
        { value: 'entity_quality', disabled: getFieldDisabled(problemCategory, 'entity_quality') },
        { value: 'operation_behavior_ids', disabled: getFieldDisabled(problemCategory, 'operation_behavior_ids') },
        { value: 'safety_factor1', disabled: getFieldDisabled(problemCategory, 'safety_factor1') },
        { value: 'safety_factor2', disabled: getFieldDisabled(problemCategory, 'safety_factor2') },
        { value: 'safety_radio', disabled: getFieldDisabled(problemCategory, 'safety_radio') },
        // 根据用户级别控制 branch_comp_code 和 wbs_code 的禁用状态
        { value: 'branch_comp_code', disabled: getFieldDisabledByUserLevel('branch_comp_code') },
        { value: 'wbs_code', disabled: getFieldDisabledByUserLevel('wbs_code') },
      ])
      .setFormColumnToSelect([
        { value: 'examine_wbs_code', name: 'examine_wbs_code', valueType: 'select', data: [] },
        {
          value: 'problem_type',
          valueAlias: 'value',
          name: 'name',
          valueType: 'select',
          data: [
            // { value: '0', name: '质量' },
            { value: '1', name: 'HSE' },
          ],
          onChange: () => {
            // 当 problem_type 变化时，清空 problem_category
            form.setFieldsValue({ problem_category: undefined });
          }
        },
        {
          value: 'problem_category',
          valueAlias: 'value',
          name: 'name',
          valueType: 'select',
          data: problemCategoryOptions,
          onChange: () => {
            // 当 problem_category 变化时，清空相关的6个字段
            form.setFieldsValue({
              quality_factor1: undefined,
              quality_factor2: undefined,
              entity_quality: undefined,
              operation_behavior_ids: undefined,
              safety_factor1: undefined,
              safety_factor2: undefined,
            });
          }
        },
        {
          value: 'branch_comp_code',
          valueAlias: 'value',
          name: 'name',
          valueType: 'select',
          data: branchCompOptions,
          onChange: () => {
            // 当分公司变化时，清空项目部
            form.setFieldsValue({ wbs_code: undefined });
          }
        },
        {
          value: 'wbs_code',
          valueAlias: 'value',
          name: 'name',
          valueType: 'select',
          data: wbsOptions,
        },
        {
          value: 'quality_factor1',
          valueAlias: 'value',
          name: 'name',
          valueType: 'select',
          data: qualityFactor1Options,
          onChange: () => {
            // 当一级要素变化时，清空二级要素
            form.setFieldsValue({ quality_factor2: undefined });
          }
        },
        {
          value: 'quality_factor2',
          valueAlias: 'value',
          name: 'name',
          valueType: 'select',
          data: qualityFactor2Options,
        },
        { value: 'entity_quality', valueAlias: 'id', name: 'dict_name', valueType: 'select', data: configData?.ENTITY_QUALITY || [] },
        {
          value: 'operation_behavior_ids',
          valueAlias: 'id',
          name: 'dict_name',
          valueType: 'multiple',
          data: configData?.OPERATION_BEHAVIOR || [],
          onChange: (value: any) => {
            // 当 operation_behavior_ids 变化时，清空 operation_behavior_details
            form.setFieldsValue({ operation_behavior_details: undefined });
          }
        },
        {
          value: 'safety_factor1',
          valueAlias: 'value',
          name: 'name',
          valueType: 'select',
          data: safetyFactor1Options,
          onChange: () => {
            // 当一级要素变化时，清空二级要素
            form.setFieldsValue({ safety_factor2: undefined });
          }
        },
        {
          value: 'safety_factor2',
          valueAlias: 'value',
          name: 'name',
          valueType: 'select',
          data: safetyFactor2Options,
        },
        { value: 'safety_radio', valueAlias: 'value', name: 'name', valueType: 'select', data: percentOptions || [] },
      ])
      .setFormColumnToDatePicker([
        { value: 'upload_date', valueType: 'dateTs', needValueType: 'timestamp' },
        { value: 'check_date', valueType: 'dateTs', needValueType: 'timestamp' },
        { value: 'form_make_time', valueType: 'dateTs', needValueType: 'timestamp' },
      ])
      .setFormColumnToInputTextArea([{ value: 'remark' }, { value: 'problem_description' }])
      .setFormColumnToSelfColSpan([
        {
          colSpan: 24,
          value: 'operation_behavior_details',
          labelCol: {
            span: 24
          },
          wrapperCol: {
            span: 24
          }
        }
      ])
      .setSplitGroupFormColumns([
        {
          title: '质量问题归类',
          columns: ['quality_factor1', 'quality_factor2', 'entity_quality'],
        },
        {
          title: 'HSE问题归类',
          columns: ['safety_factor2', 'safety_radio', 'operation_behavior_ids', 'operation_behavior_details'],
        },
      ])
      .needToRules(getRequiredFields(problemCategory))
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <>
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <Spin size="large" />
        </div>
      )}
      <CrudEditModal
        title={"编辑安全监督检查问题清单"}
        visible={visible}
        onCancel={onCancel}
        initialValue={selectedRecord}
        columns={getFormColumns()}
        form={form}
        onCommit={(values: any) => {
          // 处理 operation_behavior_details 数据格式转换
          const processedValues = transformOperationBehaviorData(values);

          return new Promise((resolve) => {
            dispatch({
              type: "qualitySafetyInspection/updateQualitySafetyInspection",
              payload: {
                ...selectedRecord,
                ...processedValues,
                examine_wbs_code: localStorage.getItem('auth-default-wbsCode'),
                id: selectedRecord.id,
              },
              callback: (res: any) => {
                resolve(true);
                // 判断编辑操作是否成功，如果成功则提示并执行回调
                if (res.errCode === ErrorCode.ErrOk) {
                  message.success("编辑成功");
                  setTimeout(() => {
                    callbackSuccess();
                  }, 1000);
                }
              },
            });
          });
        }}
      />
    </>
  );
};

export default connect()(QualitySafetyInspectionEdit);
