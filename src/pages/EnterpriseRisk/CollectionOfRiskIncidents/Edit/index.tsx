import React, { useEffect, useMemo, useState, useCallback } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { Form, message, Select } from "antd";
import WbsTreeSelect from "@/components/CommonList/WbsTreeSelect";
import useSysDict from "@/utils/useSysDict";
import { arrToTree } from "@/utils/utils-array";

const { CrudEditModal } = SingleTable;
const { Option, OptGroup } = Select;
/**
 * 编辑风险事件收集
 */
const ExperienceEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
  const { formatMessage } = useIntl();
  const [riskCategoryConfig, setRiskCategoryConfig] = useState<any[]>([]);
  const [form] = Form.useForm();

  // 联动状态管理
  const [selectedSecondId, setSelectedSecondId] = useState<string | null>(null);

  // 初始化二级分类 ID
  useEffect(() => {
    if (visible && selectedRecord?.risk_category) {
      setSelectedSecondId(String(selectedRecord.risk_category));
    }
  }, [visible, selectedRecord]);

  // 格式化树形数据
  const treeData = useMemo(() =>
    arrToTree(riskCategoryConfig, 'id', 'parent_id', 'children', null),
    [riskCategoryConfig]);

  // 级联详情过滤
  const riskCategoryDetails = useMemo(() => {
    if (!selectedSecondId) return [];
    return riskCategoryConfig.filter(item => String(item.parent_id) === String(selectedSecondId));
  }, [selectedSecondId, riskCategoryConfig]);

  // 分类切换处理
  const handleCategoryChange = useCallback((value: string) => {
    setSelectedSecondId(value);
    form.setFieldsValue({ "risk_category_details": undefined });
  }, [form]);

  /** 加载分类配置 */
  useEffect(() => {
    if (!visible) return;
    dispatch({
      type: "collectionOfRiskIncidents/queryRiskCategoryConfig",
      payload: { order: 'asc', sort: 'id' },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          const normalizedData = res?.rows?.map((item: any) => ({
            ...item,
            id: String(item.id),
            parent_id: item.parent_id ? String(item.parent_id) : null
          }));
          setRiskCategoryConfig(normalizedData);
        }
      },
    });
  }, [visible]);

  const { configData } = useSysDict({
    filterVal: "'RISK_EVENTS_COMPANY_BUSINESS_DEPT'"
  });

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        {
          title: 'CollectionOfRiskIncidents.report_unit',
          subTitle: "填报单位",
          width: 160,
          align: 'center',
          dataIndex: "report_unit",
          renderSelfForm: () => <WbsTreeSelect />
        },
        {
          title: 'CollectionOfRiskIncidents.push_unit',
          subTitle: "事件发生单位",
          width: 160,
          align: 'center',
          dataIndex: "push_unit",
          renderSelfForm: () => <WbsTreeSelect />
        },
        "risk_type",
        "risk_level",
        {
          title: 'CollectionOfRiskIncidents.risk_category',
          subTitle: "风险类别",
          width: 160,
          align: 'center',
          dataIndex: "risk_category",
          renderSelfForm: () => (
            <Select
              placeholder="请选择"
              style={{ width: '100%' }}
              onChange={handleCategoryChange}
              allowClear
            >
              {treeData.map((parent: any) => (
                <OptGroup key={parent.id} label={parent.category_name}>
                  {parent.children?.map((child: any) => (
                    <Option key={child.id} value={child.id}>{child.category_name}</Option>
                  ))}
                </OptGroup>
              ))}
            </Select>
          )
        },
        {
          title: 'CollectionOfRiskIncidents.risk_category_details',
          subTitle: "风险类别详情",
          width: 160,
          align: 'center',
          dataIndex: "risk_category_details",
          renderSelfForm: () => (
            <Select
              mode="multiple"
              placeholder={selectedSecondId ? "请选择详情" : "请先选择风险类别"}
              style={{ width: '100%' }}
              disabled={!selectedSecondId}
              allowClear
            >
              {riskCategoryDetails.map((item: any) => (
                <Option key={item.id} value={item.id}>{item.category_name}</Option>
              ))}
            </Select>
          )
        },
        "risk_events_name",
        "happen_time",
        "scene",
        "situation_description",
        "injury_or_damage",
        "reason_analysis",
        "counter_measures",
        "is_litigation",
        "company_dept_id",
        "remark",
      ])
      .needToRules([
        "company_dept_id",
        "counter_measures",
        "happen_time",
        "push_unit",
        "risk_category",
        "risk_events_name",
        "risk_level",
        "risk_type",
        "scene",
        "is_litigation"
      ])
      .setFormColumnToDatePicker([
        {
          value: 'happen_time',
          valueType: 'dateTs',
          needValueType: 'timestamp'
        }
      ])
      .setFormColumnToSelect([
        {
          value: 'risk_type',
          name: 'risk_type_str',
          valueType: 'select',
          data: [
            { risk_type: "1", risk_type_str: "风险损失事件" },
            { risk_type: "2", risk_type_str: "潜在风险损失事件" }
          ]
        },
        {
          value: 'risk_level',
          name: 'risk_level_str',
          valueType: 'select',
          data: ["1-低度", "2-较低", "3-中度", "4-高度", "5-极高"].map(s => ({
            risk_level: s.split('-')[0],
            risk_level_str: s.split('-')[1]
          }))
        },
        {
          value: 'is_litigation',
          name: 'is_litigation_str',
          valueType: 'select',
          data: [
            { is_litigation: "0", is_litigation_str: "否" },
            { is_litigation: "1", is_litigation_str: "是" }
          ]
        },
        {
          value: 'company_dept_id',
          name: 'dict_name',
          valueType: "multiple",
          data: configData?.RISK_EVENTS_COMPANY_BUSINESS_DEPT || [],
          valueAlias: 'id',
        }
      ])
      .setFormColumnToInputTextArea([
        { value: 'situation_description' },
        { value: 'injury_or_damage' },
        { value: 'reason_analysis' },
        { value: 'counter_measures' },
        { value: 'remark' },
      ])
      .setSplitGroupFormColumns([
        {
          title: '责任主体信息',
          order: 1,
          columns: [
            "report_unit",
            "push_unit",
            "company_dept_id",
          ]
        },
        {
          title: '风险事件概况',
          order: 2,
          columns: [
            "risk_events_name",
            "happen_time",
            "scene",
            "is_litigation",
          ]
        },
        {
          title: '定性评价与分级',
          order: 3,
          columns: [
            "risk_type",
            "risk_level",
            "risk_category",
            "risk_category_details",
          ]
        },
        {
          title: '详细描述与应对',
          order: 4,
          columns: [
            "situation_description",
            "injury_or_damage",
            "reason_analysis",
            "counter_measures",
            "remark",
          ]
        }
      ])
      .getNeedColumns();

    cols.forEach((item: any) => {
      item.title = formatMessage({ id: item.title });
    });
    return cols;
  };

  return (
    <CrudEditModal
      form={form}
      title={"编辑风险事件收集"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord,
        risk_level: String(selectedRecord.risk_level ?? ""),
        risk_type: String(selectedRecord.risk_type ?? ""),
        is_litigation: String(selectedRecord.is_litigation ?? ""),
        risk_category: String(selectedRecord.risk_category ?? ""),
        company_dept_id: selectedRecord.company_dept_id ? String(selectedRecord.company_dept_id).split(",") : [],
        risk_category_details: selectedRecord.risk_category_details ? String(selectedRecord.risk_category_details).split(",") : [],
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        const payload = {
          ...selectedRecord,
          ...values,
          risk_category_details: values.risk_category_details?.join(','),
          company_dept_id: values.company_dept_id?.join(','),
        };
        return new Promise((resolve) => {
          dispatch({
            type: "collectionOfRiskIncidents/updateInfo",
            payload,
            callback: (res: any) => {
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("编辑成功");
                callbackSuccess();
              }
              resolve(true);
            },
          });
        });
      }}
    />
  );
};

export default connect()(ExperienceEdit);