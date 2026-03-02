import React, { useRef } from 'react';
import { Button, message, Modal } from 'antd';
import { connect } from 'umi';
import { BasicTableColumns } from 'qcx4-components';
import { configColumns } from '../columns';
import { ConnectState } from '@/models/connect';
import BaseFormSearchTable from "@/components/BaseFormSearchTable";
/**
 * 物料信息新增
 * @param props
 * @constructor
 */
const MatreialProdInfoPageAdd: React.FC<any> = (props) => {
  const { visible, onCancel, handleBatchAdd } = props;
  const childRef = useRef();
  const getTableColumns = () => {
    const dnCol = new BasicTableColumns(configColumns);
    return (
      dnCol
        .initTableColumns([
          'comp_type_str',
          'prod_code',
          'prod_name',
          'aid_name',
          'cls_code',
          'cls_name',
          'spec',
          'unit',
          'prod_describe',
          'standard',
          'remark',
          'nps1',
          'nps2',
          'nps3',
          'material',
          'material_type',
          'unit_weight',
          'upload_ts',
          'upload_ts_str'
        ]).setTableColumnToDatePicker([
          { value: 'upload_ts', valueType: 'dateTs' },
        ])
        .needToHideInTableButExport([
          'upload_ts_str'
        ]).noNeedToExport([
          'upload_ts',
        ])
        .getNeedColumns()
    );
  };

  // 定义过滤的条件
  const operator = {
    in: [],
    '=': [],
    '>': [],
    '<': [],
    '><': [],
    noFilters: [],
  };

  const toolBarRender = (selectedRows: any) => {
    // @ts-ignore
    return [
      <Button
        type='primary'
        size='middle'
        onClick={() => {
          if (selectedRows.length < 1) {
            message.warning("请选择物料");
            return;
          }
          handleBatchAdd(selectedRows);
          onCancel();
        }}
      >
        提交所选物料
      </Button>,
    ];
  };

  return (
    <Modal
      title='新增不允许发放物料'
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={'100vw'}
      style={{ top: 0, maxWidth: "100vw", padding: 0, overflowX: "hidden" }}
      bodyStyle={{ height: "calc(100vh - 55px)", padding: 10, overflowX: "hidden" }}
    >
      <BaseFormSearchTable
        cRef={childRef}
        rowKey="prod_code"
        tableTitle={() => <h3>从下方选择不允许随便发放的物料</h3>}
        tableSortOrder={{ sort: 'upload_ts', order: 'desc' }}
        formColumns={[]}
        tableColumns={getTableColumns()}
        type='matreialprodinfo/getMatreialProdInfo'
        toolBarRender={toolBarRender}
        operator={operator}
        rowSelection={{
          type: 'checkbox',
          callback: (keys: any[], rows: any[]) => {
            console.log('--------keys', keys, rows);
          }
        }}
      />
    </Modal>
  );
};

export default connect(({ common, materialclsinfo }: ConnectState) => ({
  devList: common.devList,
  materialClsInfoList: materialclsinfo.materialClsInfoList,
}))(MatreialProdInfoPageAdd);
