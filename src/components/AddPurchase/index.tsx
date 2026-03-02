import React, { useRef, useState } from 'react';
import { Modal, Input } from 'antd';
import { connect } from 'umi';
import BaseCurdSingleTable from '@/components/BaseCrudSingleTable';
import { BasicTableColumns } from 'yayang-ui';
import { configColumns } from './columns';

export interface SelectedIncomeContract {
  id: number;
  purchase_group_code: string;
  purchase_group_name: string;
  RowNumber: number;
}

interface AddPurchaseProps {
  handleOk: (selectedRows: SelectedIncomeContract[]) => void;
}

/**
 * 查询收入合同备选数据
 * @constructor
 */
const AddPurchase: React.FC<AddPurchaseProps> = (props) => {
  const {
    handleOk,
  } = props;
  const actionRef: any = useRef();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState<SelectedIncomeContract[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        "RowNumber",
        "purchase_group_code",
        "purchase_group_name",
      ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
      .needToExport([
        "RowNumber",
        "purchase_group_code",
        "purchase_group_name",
      ])
    return cols.getNeedColumns();
  };
  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = () => {
    return [];
  };
  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: SelectedIncomeContract[]) => {
    // console.log(selectedRows, 'selectedRows');
    setSelectedRows(selectedRows);
    return [];
  };
  return (
    <>
      <Input.Search
        value={inputValue}
        readOnly
        enterButton
        placeholder='请选择采购组'
        onSearch={() => setIsVisible(true)}
      />
      <Modal
        title='采购组台账'
        open={isVisible}
        width={'100vw'}
        // footer={null}
        style={{
          top: 0,
          maxWidth: '100vw',
          paddingBottom: 0,
          maxHeight: '100vh',
          overflow: 'hidden',
        }}
        bodyStyle={{
          height: 'calc(100vh - 106px)',
          overflow: 'hidden'
        }}
        destroyOnClose
        onCancel={() => setIsVisible(false)}
        onOk={() => {
          if (selectedRows && selectedRows.length > 0) {
            setInputValue(selectedRows[0].purchase_group_name || '');
          }
          if (handleOk && handleOk instanceof Function) {
            handleOk(selectedRows);
          }
          setIsVisible(false);
        }}
        okText='确定'
        cancelText='取消'
      >
        {isVisible && (
          <BaseCurdSingleTable
            cRef={actionRef}
            rowKey="RowNumber"
            tableTitle="采购组台账详情"
            funcCode={'采购组台账'}
            type="purchase/getPurchaseGroup"
            importType="purchase/getPurchaseGroup"
            tableColumns={getTableColumns()}
            tableSortOrder={{ sort: 'id', order: 'desc' }}
            buttonToolbar={renderButtonToolbar}
            selectedRowsToolbar={renderSelectedRowsToolbar}
            rowSelection={{ type: 'radio' }}
            tableDefaultFilter={
              [
                // { Key: 'dep_code', Val: WBS_CODE + "%", Operator: 'like' }
              ]
            }
          />
        )}
      </Modal>
    </>
  );
};
export default connect()(AddPurchase);
