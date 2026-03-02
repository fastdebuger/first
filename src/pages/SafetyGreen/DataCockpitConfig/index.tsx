import React, { useEffect } from 'react';
import { Button, Col, DatePicker, Form, InputNumber, message, Row, Card, Divider, Radio } from "antd";
import { connect } from 'umi';
import { ErrorCode } from '@yayang/constants';
import { WBS_CODE } from '@/common/const';
import moment from 'moment';
import SectionTitle from './SectionTitle';

/**
 * 数据驾驶舱配置页面
 */
const DataCockpitConfigPage: React.FC<any> = (props) => {
  const { dispatch } = props;
  const [SafetyRecordForm] = Form.useForm();
  const [AnnualSafetyForm] = Form.useForm();

  useEffect(() => {
    if (dispatch) {
      // 1. 获取连续安全工日初始数据
      dispatch({
        type: "LegalRequirements/getWorkDay",
        payload: { sort: 'id', order: 'desc' },
        callback: (row: any) => {
          if (row && typeof row === "object") {
            SafetyRecordForm.setFieldsValue({
              ...row,
              best_record_num: row.bestRecordNum,
              start_date: row.start_date ? moment(row.start_date).utcOffset(8) : null
            });
          }
        }
      });

      // 2. 获取年度安全工时初始数据
      dispatch({
        type: "LegalRequirements/getWorkAnnual",
        payload: { sort: 'id', order: 'desc' },
        callback: (row: any) => {
          if (row && typeof row === "object") {
            AnnualSafetyForm.setFieldsValue({
              ...row,
              headcount: row.headCount,
              man_hour: row.manHour,
            });
          }
        }
      });
    }
  }, []);

  /**
   * 保存 [1] 连续安全工日
   */
  const onSaveSafetyRecord = async () => {
    try {
      const values = await SafetyRecordForm.validateFields();
      const type = values.id ? "LegalRequirements/updateWorkDay" : "LegalRequirements/saveWorkDay";
      const submitDate = values.start_date ? values.start_date.format("YYYY-MM-DD HH:mm:ss") : null;

      dispatch({
        type,
        payload: { ...values, start_date: submitDate, wbs_code: WBS_CODE },
        callback: (res: any) => {
          if (res.errCode === ErrorCode.ErrOk) message.success("保存成功");
        },
      });
    } catch (error) { console.error("验证失败:", error); }
  };

  /**
   * 保存 [2] 连续安全工时
   */
  const onSaveAnnualSafety = async () => {
    try {
      const values = await AnnualSafetyForm.validateFields();
      const type = values.id ? "LegalRequirements/updateWorkAnnual" : "LegalRequirements/saveWorkAnnual";

      dispatch({
        type,
        payload: { ...values, wbs_code: WBS_CODE },
        callback: (res: any) => {
          if (res.errCode === ErrorCode.ErrOk) message.success("保存成功");
        },
      });
    } catch (error) { console.error("验证失败:", error); }
  };

  const rules = [{ required: true, message: '这是必填项' }];

  return (
    <div style={{ height: 'calc(100vh - 100px)', padding: '0 16px 16px 16px', boxSizing: 'border-box' }}>
      <Card
        bordered={false}
        title={<span style={{ fontSize: 20, fontWeight: 'bold' }}>数据驾驶舱配置</span>}
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        bodyStyle={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}
      >

        {/* 配置一：连续安全工日 */}
        <Divider orientation="left" style={{ borderColor: '#e4eaf0ff' }}>连续安全工日配置</Divider>
        <Form form={SafetyRecordForm} layout="vertical" initialValues={{ activation_type: "1" }}>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="启用方式" name="activation_type" rules={rules}>
                <Radio.Group style={{ width: '100%', textAlign: 'left' }}>
                  <Radio value={"1"}>计算</Radio>
                  <Radio value={"2"}>配置</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <SectionTitle title="计算模式" color="#1890ff" />
          <Row gutter={24} align="bottom">
            <Col span={24}>
              <Form.Item label="开始时间" name="start_date">
                <DatePicker
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  allowClear={false}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <SectionTitle title="配置模式" color="#1890ff" />
          <Row gutter={24} align="bottom">
            <Col span={18}>
              <Form.Item label="连续安全工日" name="best_record_num">
                <InputNumber placeholder="请输入连续安全工日" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6} style={{ textAlign: 'right', marginBottom: 24 }}>
              <Button type="primary" onClick={onSaveSafetyRecord}>保存记录</Button>
            </Col>
          </Row>
          <Form.Item name="id" hidden><InputNumber /></Form.Item>
        </Form>

        {/* 配置二：年度安全工时 */}
        <Divider orientation="left" style={{ borderColor: '#e4eaf0ff', marginTop: 40 }}>年度安全工时配置</Divider>
        <Form form={AnnualSafetyForm} layout="vertical" initialValues={{ activation_type: 1 }}>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="启用方式" name="activation_type" rules={rules}>
                <Radio.Group style={{ width: '100%', textAlign: 'left' }}>
                  <Radio value={1}>计算</Radio>
                  <Radio value={2}>配置</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <SectionTitle title="计算模式" color="#1890ff" />
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="系数" name="coefficient" >
                <InputNumber placeholder="请输入系数" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="总人数" name="headcount">
                <InputNumber placeholder="请输入人数" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="时间" name="man_hour">
                <InputNumber placeholder="请输入时间" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <SectionTitle title="配置模式" color="#1890ff" />
          <Row gutter={24} align="bottom">
            <Col span={18}>
              <Form.Item label="年度安全工时" name="safety_annual_hour">
                <InputNumber placeholder="请输入总工时" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6} style={{ textAlign: 'right', marginBottom: 24 }}>
              <Button type="primary" onClick={onSaveAnnualSafety}>保存记录</Button>
            </Col>
          </Row>
          <Form.Item name="id" hidden><InputNumber /></Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default connect()(DataCockpitConfigPage);