import React, { useEffect, useState } from "react";
import { connect, Dispatch } from "umi";
import { ErrorCode } from "@/common/const";
import { message, Modal, Form, Button } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import moment from "moment";
import EventFormItem from "./EventFormItem";
import useWbsData from "@/utils/useGetAllWbsCode";
import useSysDict from "@/utils/useSysDict";


// --- 类型定义 ---
interface ExperienceAddProps {
  dispatch: Dispatch;
  visible: boolean;
  onCancel: () => void;
  callbackSuccess: () => void;
  queryParamsType?: string | boolean;
}

/**
 * 风险事件批量添加
 * @param props 
 * @returns 
 */
const ExperienceAddDynamic: React.FC<ExperienceAddProps> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, queryParamsType } = props;
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [riskCategoryConfig, setRiskCategoryConfig] = useState<any[]>([]);
  // 请求项目层级
  const { wbsItems } = useWbsData(dispatch);
  // 请求配置表
  const { configData } = useSysDict({
    filter: [
      {
        "Key": "sys_type_code",
        "Val": "'RISK_EVENTS_COMPANY_BUSINESS_DEPT'",
        "Operator": "in"
      }
    ]
  })

  /**
   * 请求风险类型配置项
   */
  useEffect(() => {
    dispatch({
      type: "collectionOfRiskIncidents/queryRiskCategoryConfig",
      payload: {
        filter: JSON.stringify([]),
        order: 'asc',
        sort: 'id',
      },
      callback: (res: { errCode: number; rows: any }) => {
        if (res.errCode === ErrorCode.ErrOk) {
          const flatData = res.rows;
          setRiskCategoryConfig(flatData);
        } else {
          setRiskCategoryConfig([]);
        }
      },
    });
  }, [])


  /**
   * 提交
   * @returns 
   */
  const handleCommit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      // 处理数据提交格式
      const submitList = values.events.map((item: any) => ({
        "report_unit": "",
        // "report_name": "",
        "push_unit": "",
        "risk_type": "",
        "risk_level": "",
        "risk_category": "",
        "risk_events_name": "",
        "scene": "",
        "is_litigation": "",
        "situation_description": "",
        "injury_or_damage": "",
        "reason_analysis": "",
        "counter_measures": "",
        "remark": "",
        ...item,
        risk_category_details: Array.isArray(item.risk_category_details) ? item.risk_category_details.join(',') : item.risk_category_details,
        company_dept_id: Array.isArray(item.company_dept_id) ? item.company_dept_id.join(',') : item.company_dept_id,
        happen_time: item.happen_time ? moment(item.happen_time).unix() : null,
        report_type: queryParamsType ? "2" : "1",
      }));

      if (!submitList.length) {
        setSubmitting(false);
        return message.warning('请至少添加一条风险事件记录');
      }

      dispatch({
        type: "collectionOfRiskIncidents/saveBatch",
        payload: { Items: JSON.stringify(submitList) },
        callback: (res: any) => {
          setSubmitting(false);
          if (res.errCode === ErrorCode.ErrOk) {
            message.success(`成功新增 ${submitList.length} 条记录`);
            setTimeout(() => {
              callbackSuccess();
              onCancel();
            }, 500);
          } else {
            message.error(res.errMsg || '提交失败');
          }
        },
      });
    } catch (errorInfo) {
      setSubmitting(false);
      console.error('Validate Failed:', errorInfo);
    }
  };


  return (
    <Modal
      title={"新增风险事件收集" + (queryParamsType ? "(代办任务)" : "(日常填报)")}
      visible={visible}
      onCancel={onCancel}
      centered
      style={{ top: 0, width: '100vw', margin: 0, padding: 0 }}
      bodyStyle={{ height: 'calc(100vh - 135px)', overflowY: 'auto' }}
      width={"100vw"}
      footer={[
        <Button key="back" onClick={onCancel}>取消</Button>,
        <Button key="submit" type="primary" loading={submitting} onClick={handleCommit}>
          提交全部记录
        </Button>,
      ]}
    >
      <Form
        form={form}
        initialValues={{
          events: [{}]
        }}
      >
        <Form.List name="events">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <EventFormItem
                  wbsItems={wbsItems}
                  riskCategoryConfig={riskCategoryConfig}
                  companyDeptConfig={configData?.RISK_EVENTS_COMPANY_BUSINESS_DEPT}
                  key={field.key}
                  field={field}
                  index={index}
                  remove={remove}
                  fieldsCount={fields.length}
                />
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  style={{ marginBottom: 20 }}
                >
                  新增一条风险事件
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default connect()(ExperienceAddDynamic);