import React, { useRef, useState } from "react";
import { Button, message, Modal, Space } from "antd";
import { configColumns } from "../columns";
import { BasicTableColumns, HeaderAndBodyTable } from "yayang-ui";
import SafetyRiskControlEdit from "../Edit";
import { connect, useIntl } from "umi";
import { ErrorCode } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";

const { CrudQueryDetailDrawer } = HeaderAndBodyTable;

/**
 * 特种设备质量安全风险管控清单详情
 * @param props
 * @returns
 */
const SafetyRiskControlDetail: React.FC<any> = (props: any) => {
  const { authority, open, onClose, selectedRecord, actionRef, dispatch, title, special_equip_type } = props;
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);
  const { formatMessage } = useIntl();
  const childRef: any = useRef();

  const getTableColumns = () => {
    const cols: any = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      'wbs_name',
      "create_by_name",
      "create_date_str",
      "audit_status_name",
    ])
    cols.needColumns.forEach((item: any) => {
      Object.assign(item, { subTitle: formatMessage({ id: item.title }) })
    });
    return cols.getNeedColumns();
  };

  const getBodyTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        'RowNumber',
        'risk_category_name',
        'control_process_name',
        'principal',
        'quality_safety_majordomo',
        'quality_safety_officer',
      ])
      .needToExport([
        'RowNumber',
        'risk_category_name',
        'control_process_name',
        'principal',
        'quality_safety_majordomo',
        'quality_safety_officer',
      ])
      .noNeedToFilterIcon([
        'RowNumber',
      ])
      .noNeedToSorterIcon([
        'RowNumber',
      ])
    return cols.getNeedColumns();
  };

  const renderButtonToolbar = () => {
    return [
      <Button
        style={{ display: hasPermission(authority, '编辑') ? 'inline' : 'none' }}
        type={"primary"}
        onClick={() => setEditVisible(true)}
      >
        编辑
      </Button>,
      <Button
        style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
        danger
        type={"primary"}
        onClick={() => setDelVisible(true)}
      >
        删除
      </Button>,
    ];
  };

  const handleDel = () => {
    dispatch({
      type: "SafetyRiskControl/delInfo",
      payload: {
        main_id: selectedRecord['main_id'],
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          message.success("删除成功");
          setTimeout(() => {
            if (onClose) onClose();
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }, 1000);
        }
      },
    });
  };

  /**
   * 功能按钮组
   */
  const renderBodyButtonToolbar = () => {
    return [
      <Button
        style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
        type="primary"
        onClick={() => childRef.current.exportFile()}
      >
        {formatMessage({ id: 'common.list.export' })}
      </Button>,
    ];
  };

  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="main_id"
        title={title}
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
        <BaseCurdSingleTable
          cRef={childRef}
          rowKey="id"
          tableTitle={title + "详情"}
          moduleCaption={title + "详情"}
          type="SafetyRiskControl/getBody"
          exportType="SafetyRiskControl/getBody"
          tableDefaultFilter={[
            { Key: 'main_id', Val: selectedRecord.main_id, Operator: '=' },
          ]}
          tableColumns={getBodyTableColumns()}
          tableSortOrder={{ sort: 'id', order: 'asc' }}
          buttonToolbar={renderBodyButtonToolbar}
          selectedRowsToolbar={() => []}
          defaultPageSize={undefined}
          rowSelection={null}
          scroll={{ y: "calc(100vh - 320px)" }}
          height={"calc(-115px + 100vh)"}
          funcCode={authority + "--" + title}
        />
      </CrudQueryDetailDrawer>
      {editVisible && (
        <SafetyRiskControlEdit
          title={title}
          visible={editVisible}
          selectedRecord={selectedRecord}
          special_equip_type={special_equip_type}
          onCancel={() => setEditVisible(false)}
          callbackEditSuccess={() => {
            setEditVisible(false);
            if (onClose) onClose();
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {
        delVisible && (
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
            <p>是否删除当前的数据: {selectedRecord[""]}</p>
          </Modal>
        )
      }
    </>
  )
}

export default connect()(SafetyRiskControlDetail);
