import React, { useEffect, useState } from "react";
import { Button, message, Modal, Space, Spin } from "antd";
import { connect } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { ErrorCode } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import DynamicTableForm, { DynamicFormColumn } from '@/components/DynamicTableForm';

import MonthlyOutputEdit from "../Edit";
import { configColumns } from "../columns";


const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 承包商施工作业过程中监督检查表信息详情
 * @param props
 * @constructor
 */
const MonthlyOutputDetail: React.FC<any> = (props) => {
  const { getInterfaceData, open, onClose, authority, selectedRecord, callbackSuccess, dispatch } = props;
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);

  // 监督检查表数据
  const [examinationData, setExaminationData] = useState([]);
  const [examinationItems, setExaminationItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 监督检查配置列
  const examinationCols: DynamicFormColumn[] = [
    { title: '序号', dataIndex: 'RowNumber', width: 80 },
    { title: '监督检查内容', dataIndex: 'examination_content', width: 400 },
    {
      title: '检查结果',
      dataIndex: 'examination_result',
    },
    {
      title: '检查人',
      dataIndex: 'examination_person',
    },
    {
      title: '检查部门',
      dataIndex: 'examination_dept',
    },
  ];

  useEffect(() => {
    if (dispatch) {
      setLoading(true);
      Promise.all([
        getInterfaceData('monthlyOutput/getExaminationConfig'),
        getInterfaceData('monthlyOutput/queryMonthlyOutputDetail', { monthly_output_id: selectedRecord.monthly_output_id })
      ]).then((res: any[]) => {
        const configRes = res[0];
        const detailRes = res[1];
        // 配置数据就是监督检查表的数据
        setExaminationData(configRes || []);
        // 详情数据中的监督检查项
        setExaminationItems(detailRes || []);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    }
  }, [selectedRecord?.monthly_output_id]);
/**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "branch_comp_name",
      "dep_name",
      "contractor_name",
      "contractor_manager",
      "register_number",
      "contact_phone",
      "contract_name",
      "monthly_person_count",
      "monthly_output_value",
      "actual_start_date",
      "actual_end_date",
      'remark',
      "report_date",
      "form_maker_name",
      "project_principal",
    ])
      .setTableColumnToDatePicker([
        { value: 'report_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'contract_start_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'contract_end_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'actual_start_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'actual_end_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ])
    return cols.getNeedColumns();
  }
  /**
   * 功能按钮组
   * @param reloadTable
   */
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
  // 删除承包商施工作业信息函数
  const handleDel = () => {
    dispatch({
      type: "monthlyOutput/delMonthlyOutput",
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
        title="承包商施工作业过程中监督检查表信息"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
        <Spin spinning={loading}>
          {/* 动态表单：监督检查表 */}
          <DynamicTableForm
            rows={examinationData || []}
            columns={examinationCols}
            disabled={true}
            title="监督检查表"
            groupBy={(r: any) => r.examination_item}
            showGroupAsLeft
            groupTitleHeader="检查项目"
            dataMerge={{
              items: examinationItems,
              idFieldName: 'examination_config_id',
              mergeFields: {
                examination_result: 'examination_result',
                examination_person: 'examination_person',
                examination_dept: 'examination_dept',
              },
            }}
          />
        </Spin>
      </CrudQueryDetailDrawer>
      {editVisible && (
        <MonthlyOutputEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          getInterfaceData={getInterfaceData}
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
        <p>是否删除当前的数据: {selectedRecord["id"]}</p>
      </Modal>
    </>
  );
};

export default connect()(MonthlyOutputDetail);
