import React, { ReactNode, useRef, useState } from 'react';
import { Button, Modal, Space } from "antd";
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { WBS_CODE } from "@/common/const";
import { configColumns } from "./columns";
import EmergencyPlanDetail from "./EmergencyPlanDetail"

/**
 * 应急预案选择
 * @constructor
 */
const AddEmergencyPlanPage: React.FC<any> = (props) => {
  const { onSelect, visible, onCancel, authority, type = "radio", onOk } = props;
  const actionRef: any = useRef();
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const selectedRowsRef = useRef(null)
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      'RowNumber',
      {
        title: 'emergencyplan.plan_name',
        subTitle: '专项应急预案名称',
        dataIndex: 'plan_name',
        align: 'center',
        width: 160,
        render: (text: any, record: any) => {
          return (
            <a
              onClick={() => {
                setSelectedRecord(record)
                setOpen(true)
              }}
            >
              {text}
            </a>
          );
        },
      },
      "applicable_area",
      "scene",
      "punishment_principle",
      "disposal_process",
      "contract_say_price",
    ])
      .noNeedToFilterIcon(['RowNumber'])
      .noNeedToSorterIcon(['RowNumber'])

    return cols.getNeedColumns();
  }

  /**
   * 选择数据后关闭
   * @param rows 
   */
  const selectedRowsToolbar = (selectedRows: any) => {
    // console.log('selectedRows :>> ', selectedRows);
    if (selectedRows.length > 0) {
      selectedRowsRef.current = selectedRows;
      // onSelect(selectedRows[0])
      // onCancel()
    }
    return [];
  }

  const renderButtonToolbar = () => {
    return [
      <Space>
        <Button
          type="primary"
          onClick={() => {
            onOk(selectedRowsRef.current)
            setTimeout(onCancel, 1)
          }}
        >
          完成
        </Button>
        <Button
          onClick={onCancel}
        >
          取消
        </Button>
      </Space>
    ]
  }


  return (
    <div>
      {visible && (
        <Modal
          title={''}
          visible={visible}
          onCancel={onCancel}
          width={'100vw'}
          footer={null}
          closable={false}
          style={{
            top: 0,
            maxWidth: '100vw',
            paddingBottom: 0,
            maxHeight: '100vh',
            overflow: 'hidden',
          }}
          bodyStyle={{
            height: '100vh',
            overflow: 'hidden'
          }}
        >
          <BaseCurdSingleTable
            cRef={actionRef}
            rowKey="form_no"
            tableTitle='应急预案'
            type="emergencyplan/queryContingencyPlanConfigHead"
            exportType="emergencyplan/queryContingencyPlanConfigHead"
            tableColumns={getTableColumns()}
            funcCode={"AddEmergencyPlan" + 'queryContingencyPlanConfigHead'}
            tableSortOrder={{ sort: 'form_no', order: 'desc' }}
            buttonToolbar={renderButtonToolbar}
            selectedRowsToolbar={selectedRowsToolbar}
            rowSelection={{ type }}
            tableDefaultFilter={
              [
                // { Key: 'dep_code', Val: WBS_CODE + "%", Operator: 'like' }
              ]
            }
            moduleCaption={'应急预案'}
          />
        </Modal>
      )}


      {open && selectedRecord && (
        <EmergencyPlanDetail
          open={open}
          actionRef={actionRef}
          selectedRecord={selectedRecord}
          authority={authority}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}
export default AddEmergencyPlanPage;
