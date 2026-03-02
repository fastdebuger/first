import React, { useState, useEffect } from "react";
import { configColumns } from "./columns";
// @ts-ignore
import { BasicTableColumns } from "yayang-ui"
import { ErrorCode } from "@yayang/constants";
import { Modal, Table, message } from "antd";
import { getDefaultFiltersInspector } from "@/utils/utils";
import { useIntl } from "umi";

/**
 * 焊工考试项目汇总表
 */
const WeldingExamination: React.FC<any> = (props: any) => {
  const { visible, onCancel, selectedRecord, dispatch } = props;
  const { formatMessage } = useIntl();
  // 表格数据
  const [tableData, setTableData] = useState<any>([]);
  // 统计数据
  const [statistics, setStatistics] = useState({
    person_count_sum: 0,
    project_count_sum: 0
  });

  useEffect(() => {
    if (visible && selectedRecord?.h_id) {
      dispatch({
        type: "workLicenseRegister/getWelderExamStatistics",
        payload: {
          h_id: selectedRecord?.h_id,
          filter: JSON.stringify(getDefaultFiltersInspector()),
        },
        callback: (res: any) => {
          if (res.errCode === ErrorCode.ErrOk) {
            setTableData(res.result.list || []);
            setStatistics({
              person_count_sum: res.result.person_count_sum || 0,
              project_count_sum: res.result.project_count_sum || 0
            });
          } else {
            message.error(res.errMsg || "获取数据失败");
          }
        }
      });
    }
  }, [visible, selectedRecord]);

  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns)
    .initTableColumns([
      "sub_comp_name",
      'valid_project',
      'person_count',
      'project_count',
      'plan_exam_time',
      'exam_address',
      'remark',
    ])
    .getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols
  };

  // 渲染表格底部合计行
  const renderSummary = () => {
    return (
      <Table.Summary fixed>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} colSpan={2}>
            <strong>合计</strong>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={2}>
            <strong>{statistics.person_count_sum}</strong>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={3}>
            <strong>{statistics.project_count_sum}</strong>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={4} colSpan={3}></Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  return (
    <Modal
      title={'焊工考试项目汇总表'}
      style={{
        maxWidth: '100vw',
        top: 0,
        paddingBottom: 0,
      }}
      bodyStyle={{
        height: 'calc(100vh - 55px)',
        overflowY: 'auto',
      }}
      open={visible}
      onCancel={onCancel}
      width='100vw'
      footer={null}
    >
      <Table
        columns={getTableColumns()}
        dataSource={tableData}
        rowKey={(record) => `${record.sub_comp_code}_${record.valid_project}`}
        pagination={false}
        scroll={{ y: 'calc(100vh - 400px)' }}
        summary={renderSummary}
        bordered
        size="middle"
        locale={{
          emptyText: tableData.length === 0 ? '暂无数据' : undefined
        }}
      />
    </Modal>
  );
};

export default WeldingExamination;