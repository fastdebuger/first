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
} from "../qualitySafetyUtils";
import useSysDict from "@/utils/useSysDict";
import { queryWBS, getObsCode } from "@/services/user";
import { queryQualitySafetyFactorTypeFlat } from "@/services/safetyGreen/inspect/questionClassification";
import { getLiabilityAttributionH, getLiabilityAttributionB } from "@/services/safetyGreen/inspect/qualitySafetyOversight";
import VerifyObsCodeSelectList from "@/pages/SafetyGreen/Inspect/QualitySafetyOversight/Add/VerifyObsCodeSelectList";


const { CrudEditModal } = SingleTable;

/**
 * 编辑质量安全监督检查问题清单
 * @param props
 * @constructor
 */
const QualitySafetyInspectionEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
  const { configData } = useSysDict({
    dispatch,
    filter: [
      {
        "Key": "sys_type_code",
        "Val": "'ENTITY_QUALITY','OPERATION_BEHAVIOR','SYSTEM_BELONG','QUESTION_CATEGORY'",
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
  // 使用 useWatch 监听 responsible_unit 字段值（责任单位归属）
  const responsibleUnit = Form.useWatch('responsible_unit', form);
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
  // 具体违章单位名称数据
  const [liabilityAttributionBOptions, setLiabilityAttributionBOptions] = useState<any[]>([]);
  // 全局加载状态
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * 获取初始数据：分公司、ObsCode、问题归类配置
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

    // 获取责任单位归属数据
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

  /**
   * 根据责任单位归属获取具体违章单位名称数据
   */
  const fetchViolationUnitData = async (liabilityAttributionValue: string) => {
    if (!liabilityAttributionValue) {
      setLiabilityAttributionBOptions([]);
      return;
    }
    const res = await getLiabilityAttributionB({
      sort: 'form_no',
      order: 'asc',
      filter: JSON.stringify([
        { Key: 'form_no', Val: liabilityAttributionValue, Operator: '=' }
      ])
    });
    setLiabilityAttributionBOptions(
      res?.rows?.map((item: any) => ({
        value: item.id,
        name: item.liability_attribution_b_name
      })) || []
    );
  };

  // 根据责任单位归属获取具体违章单位名称数据
  useEffect(() => {
    if (responsibleUnit) {
      fetchViolationUnitData(responsibleUnit);
    }
  }, [responsibleUnit, liabilityAttributionHData]);

  // 处理问题归类配置数据
  const { factor1Options: qualityFactor1Options, factor2Options: qualityFactor2Options } =
    processProblemClassificationData(problemClassificationData, '质量', qualityFactor1);
  const { factor1Options: safetyFactor1Options, factor2Options: safetyFactor2Options } =
    processProblemClassificationData(problemClassificationData, 'HSE', safetyFactor1);

  // 根据prop_key过滤ObsCode数据
  const problemObsCodeData = obsCodeAllData;



  const getFormColumns = () => {
    // 根据当前选择的 problem_type 动态获取 problem_category 的选项
    const problemCategoryOptions = getProblemCategoryOptions(problemType);

    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'problem_code',
        'upload_date',
        'branch_comp_code',
        'wbs_code',
        'project_name',
        'check_date',
        'problem_description',
        {
          "title": "compinfo.problem_image_url",
          "subTitle": "问题图片1",
          "dataIndex": "problem_image_url",
          "width": 160,
          "align": "center",
          renderSelfForm: (formInstance: any) =>
            <HuaWeiOBSUploadSingleFile
              accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
              limitSize={100}
              folderPath="/SafetyGreen/Inspect/QualitySafetyOversight"
              handleRemove={() => formInstance.setFieldsValue({ problem_image_url: null })}
              onChange={(file: any) => {
                formInstance.setFieldsValue({ problem_image_url: file?.response?.url })
              }}
            />
        },
        {
          "title": "compinfo.problem_image_url2",
          "subTitle": "问题图片2",
          "dataIndex": "problem_image_url2",
          "width": 160,
          "align": "center",
          renderSelfForm: (formInstance: any) =>
            <HuaWeiOBSUploadSingleFile
              accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
              limitSize={100}
              folderPath="/SafetyGreen/Inspect/QualitySafetyOversight"
              handleRemove={() => formInstance.setFieldsValue({ problem_image_url2: null })}
              onChange={(file: any) => {
                formInstance.setFieldsValue({ problem_image_url2: file?.response?.url })
              }}
            />
        },
        {
          "title": "compinfo.problem_image_url3",
          "subTitle": "问题图片3",
          "dataIndex": "problem_image_url3",
          "width": 160,
          "align": "center",
          renderSelfForm: (formInstance: any) =>
            <HuaWeiOBSUploadSingleFile
              accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
              limitSize={100}
              folderPath="/SafetyGreen/Inspect/QualitySafetyOversight"
              handleRemove={() => formInstance.setFieldsValue({ problem_image_url3: null })}
              onChange={(file: any) => {
                formInstance.setFieldsValue({ problem_image_url3: file?.response?.url })
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
        'safety_factor1',
        'safety_factor2',
        'responsible_unit',
        'violation_unit',
        'severity_level',
        'system_belong',
        {
          "title": "验证人",
          "subTitle": "验证人",
          "dataIndex": "verify_user_code",
          "width": 160,
          "align": "center",
          renderSelfForm: (formInstance: any) => {
            const onChange = (val) => {
              formInstance.setFieldsValue({ verify_user_code: val })
            }
            return (
              <VerifyObsCodeSelectList
                value={formInstance.getFieldValue('verify_user_code')}
                onChange={onChange}
                liabilityAttributionHData={liabilityAttributionHData}
                form={formInstance}
              />
            )
          }
        },
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
        // 根据用户级别控制 branch_comp_code 和 wbs_code 的禁用状态
        { value: 'branch_comp_code', disabled: getFieldDisabledByUserLevel('branch_comp_code') },
        { value: 'wbs_code', disabled: getFieldDisabledByUserLevel('wbs_code') },
        // 具体违章单位名称：只有选择了责任单位归属才能选择
        { value: 'violation_unit', disabled: !responsibleUnit },
        // 验证人：只有选择了责任单位归属才能选择
        { value: 'verify_user_code', disabled: !responsibleUnit },
      ])
      .setFormColumnToSelect([
        { value: 'examine_wbs_code', name: 'examine_wbs_code', valueType: 'select', data: [] },
        {
          value: 'problem_type',
          valueAlias: 'value',
          name: 'name',
          valueType: 'select',
          data: [
            { value: '0', name: '质量' },
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
            // 当 problem_category 变化时，清空相关的字段
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
        {
          value: 'problem_code',
          valueAlias: 'value',
          name: 'name',
          valueType: 'select',
          data: [{ value: '0', name: '公司总部及上级单位' }, { value: '1', name: '公司' }, { value: '2', name: '分公司' }, { value: '3', name: '项目部' }, { value: '4', name: '其他单位' }],
        },
        { value: 'entity_quality', valueAlias: 'id', name: 'dict_name', valueType: 'select', data: configData?.ENTITY_QUALITY || [] },
        { value: 'operation_behavior_ids', valueAlias: 'id', name: 'dict_name', valueType: 'select', data: configData?.OPERATION_BEHAVIOR || [] },
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
        {
          value: 'responsible_unit',
          valueAlias: 'value',
          name: 'name',
          valueType: 'select',
          data: liabilityAttributionHOptions,
          onChange: () => {
            // 当责任单位归属变化时，清空具体违章单位名称和验证人
            form.setFieldsValue({
              violation_unit: undefined,
            });
          }
        },
        {
          value: 'violation_unit',
          valueAlias: 'value',
          name: 'name',
          valueType: 'select',
          data: liabilityAttributionBOptions,
        },
        {
          value: 'severity_level', valueAlias: 'value', name: 'name', valueType: 'select', data: [
            { value: '0', name: '严重问题' },
            { value: '1', name: '较大问题' },
            { value: '2', name: '一般问题' },
            { value: '3', name: '轻微问题' },
          ]
        },
        { value: 'system_belong', valueAlias: 'id', name: 'dict_name', valueType: 'select', data: configData?.SYSTEM_BELONG || [] },
      ])
      .setFormColumnToDatePicker([
        { value: 'upload_date', valueType: 'dateTs', needValueType: 'timestamp' },
        { value: 'check_date', valueType: 'dateTs', needValueType: 'timestamp' },
        { value: 'form_make_time', valueType: 'dateTs', needValueType: 'timestamp' },
      ])
      .needToDisabled([
        'upload_date'
      ])
      .setFormColumnToInputTextArea([{ value: 'remark' }, { value: 'problem_description' }])
      .setSplitGroupFormColumns([
        {
          title: '质量问题归类',
          columns: ['quality_factor1', 'quality_factor2', 'entity_quality'],
        },
        {
          title: 'HSE问题归类',
          columns: ['safety_factor1', 'safety_factor2', 'operation_behavior_ids'],
        },
        {
          title: '责任归属',
          columns: ['responsible_unit', 'violation_unit', 'severity_level', 'system_belong', 'verify_user_code',],
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
        title={"编辑质量安全监督检查问题清单"}
        visible={visible}
        onCancel={onCancel}
        initialValue={selectedRecord}
        columns={getFormColumns()}
        form={form}
        onCommit={(values: any) => {
          return new Promise((resolve) => {
            dispatch({
              type: "qualitySafetyInspection/updateQualitySafetyInspection",
              payload: {
                ...selectedRecord,
                ...values,
                examine_wbs_code: localStorage.getItem('auth-default-wbsCode'),
                id: selectedRecord.id,
                items:JSON.stringify([{
                  id:values.operation_behavior_ids || selectedRecord.operation_behavior_ids,
                  number:0
                }]),
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
