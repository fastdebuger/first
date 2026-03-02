import React, { useState } from "react";
import { Button, message, Modal, Space } from "antd";
import { connect } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { ErrorCode } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import ExperienceEdit from "../Edit";
import { configColumns } from "../columns";


const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 风险事件收集详情
 * @param props
 * @constructor
 */
const ExperienceDetail: React.FC<any> = (props) => {
  const { open, onClose, authority, selectedRecord, callbackSuccess, dispatch } = props;
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      "report_unit_name",
      "push_unit_name",
      'risk_events_name',
      "risk_type_name",
      "risk_level_name",
      "category_name",
      "happen_time_str",
      "scene",
      "situation_description",
      "injury_or_damage",
      // "reason_analysis",
      // "counter_measures",
      "is_litigation_name",
      // "company_dept_name",
      // "remark",
      "create_by_name",
      "create_date_str",
      "audit_date",
      "report_type_name",
      "audit_status_name",
    ])
      .needToFixed([
        {
          value: "audit_status_name",
          fixed: "right"
        }
      ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
    return cols.getNeedColumns();
  }

  const renderButtonToolbar = () => {
    return [
      <Button style={{ display: hasPermission(authority, '编辑') ? 'inline' : 'none' }} type={"primary"} onClick={() => setEditVisible(true)}>
        编辑
      </Button>,
      <Button style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }} danger type={"primary"} onClick={() => setDelVisible(true)}>
        删除
      </Button>,
    ];
  };

  const handleDel = () => {
    dispatch({
      type: "collectionOfRiskIncidents/delInfo",
      payload: {
        id: selectedRecord.id,
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          message.success("删除成功");
          setTimeout(() => {
            if (onClose) onClose();
            if (callbackSuccess) callbackSuccess();
          }, 1000);
        }
      },
    });
  };

  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="id"
        title="风险事件收集详情"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
        <div style={{ padding: '16px', background: '#fafafa', borderRadius: '4px' }}>
          {[
            { label: '公司机关业务相关部门', value: selectedRecord.company_dept_name },
            { label: '原因分析', value: selectedRecord.reason_analysis },
            { label: '已采取的应对措施', value: selectedRecord.counter_measures },
            { label: '可能或已造成的损失及影响', value: selectedRecord.injury_or_damage },
            { label: '当期情况描述', value: selectedRecord.situation_description },
            { label: '备注', value: selectedRecord.remark },
          ].map((item, index) => (
            <div key={index} style={{ marginBottom: 12, display: 'flex' }}>
              <span style={{ fontWeight: 'bold', color: '#666', width: '300px', flexShrink: 0 }}>
                {item.label}：
              </span>
              <span style={{ color: '#333', whiteSpace: 'pre-wrap' }}>
                {item.value || '暂无数据'}
              </span>
            </div>
          ))}
        </div>
      </CrudQueryDetailDrawer>
      {editVisible && (
        <ExperienceEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackSuccess={() => {
            setEditVisible(false);
            if (onClose) onClose();
            if (callbackSuccess) callbackSuccess();
          }}
        />
      )}
      <Modal
        title="删除数据"
        footer={
          <Space>
            <Button onClick={() => setDelVisible(false)}>我再想想</Button>
            <Button type={"primary"} danger onClick={() => handleDel()}>
              确认删除
            </Button>
          </Space>
        }
        open={delVisible}
        onOk={handleDel}
        onCancel={() => setDelVisible(false)}
      >
        <p>是否删除当前的数据: {selectedRecord["main_id"]}</p>
      </Modal>
    </>
  );
};

export default connect()(ExperienceDetail);
