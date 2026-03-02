import React, { useEffect } from 'react';
import { Button, Col, Form, message, Row } from "antd";
import { connect, useIntl } from 'umi';
import { BasicTaskForm, BasicFormColumns } from 'yayang-ui';
import { configColumns } from "./columns";
import { ErrorCode } from '@yayang/constants';
import { WBS_CODE } from '@/common/const';

/**
 * 年度重大风险评估填报时间配置表信息
 * @constructor
 */
const TimeConfigPage: React.FC<any> = (props) => {
  const { dispatch } = props;
  const [form] = Form.useForm();
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: "dateConfig/getInfo",
        payload: {
          sort: 'id',
          order: 'desc',
          filter: JSON.stringify([
            { Key: 'wbs_code', Val: WBS_CODE, Operator: '=' }
          ])
        },
        callback: (row: any) => {
          if (Array.isArray(row.rows) && row.rows.length > 0) {
            form.setFieldsValue({
              ...row.rows[0]
            })
          }
        }
      })
    }
  }, [])


  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'report_start_date',
        'report_end_date',
        'id',
      ])
      .setFormColumnToDatePicker([
        {
          value: 'report_start_date',
          valueType: 'dateTs',
          format: 'YYYY-MM-DD',
          needValueType: "timestamp"
        },
        {
          value: 'report_end_date',
          valueType: 'dateTs',
          format: 'YYYY-MM-DD',
          needValueType: "timestamp"
        },
      ])
      .needToHide([
        'id',
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  /**
   * 操作区域
   */
  const footerBarRender = (form: any) => {
    const handleSearch = async () => {
      const values = await form.validateFields();
      const type = values.id ? "dateConfig/updateInfo" : "dateConfig/saveInfo";
      dispatch({
        type,
        payload: values,
        callback: (res: any) => {
          if (res.errCode === ErrorCode.ErrOk) {
            message.success("保存成功");
          }
        },
      });
    };
    return (
      <Row>
        <Col
          span={24}
          style={{
            textAlign: 'right'
          }}>
          <Button
            type="primary"
            onClick={handleSearch}
          // style={{ display: hasPermission(authority, '保存') ? 'inline' : 'none' }}
          >
            保存
          </Button>
        </Col>
      </Row>
    )
  };

  return (
    <div
      style={{
        padding: 16
      }}
    >
      <Row
        align="middle"
        style={{
          padding: '12px 16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* <div style={{ width: 4, height: 16, backgroundColor: '#1890ff', borderRadius: 2 }} /> */}
          <span style={{ fontSize: 20, fontWeight: 600, color: 'rgba(0,0,0,0.85)' }}>
            {"年度重大风险评估填报时间配置表"}
          </span>
        </div>
      </Row>

      <div
        style={{
          padding: 16
        }}
      >
        <BasicTaskForm
          form={form}
          initialValue={{}}
          formColumns={getFormColumns()}
          footerBarRender={footerBarRender}
        />
      </div>
    </div>
  )
}
export default connect()(TimeConfigPage);
