import React, { useEffect, useState } from 'react';
import { configColumns } from '../columns';
import { BasicTableColumns, SingleTable } from 'yayang-ui';
import { connect } from 'umi';
import WarningList from './WarningList';
const { CrudQueryDetailDrawer } = SingleTable;

const PartDetail: React.FC<any> = (props) => {
  const { open, onClose, selectedRecord, dispatch } = props;

  const [bodyData, setBodyData] = useState([]);

  /**
   * 查询
   */
  useEffect(() => {
    let form_no = selectedRecord?.form_no;
    if (form_no) {
      dispatch({
        type: 'emergencyplan/queryContingencyPlanConfigBody',
        payload: {
          sort: 'order_num',
          order: 'asc',
          filter: JSON.stringify([
            { Key: 'form_no', Val: form_no, Operator: '=' }
          ]),
        },
        callback: (res: any) => {
          const result = res?.rows || []
          setBodyData(result);
        },
      });
    }
  }, [selectedRecord]);

  /**
   * 列配置
   * @returns 
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      'plan_name',
      "applicable_area",
      "scene",
      "punishment_principle",
      "disposal_process",
      "contract_say_price",
    ]);
    return cols.getNeedColumns();
  };


  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="contract_no"
        title="应急预案详情"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={undefined}
      >
        {/* 气象预警级别详情 */}
        <WarningList initialData={bodyData} />
      </CrudQueryDetailDrawer>
    </>
  );
};

export default connect()(PartDetail);
