import React, {useEffect, useState} from "react";
import {configColumns} from "../columns";
import {BasicEditableColumns, BasicFormColumns, HeaderAndBodyTable} from "yayang-ui";
import {connect, useIntl} from "umi";
import {ErrorCode} from "@/common/const";
import {Button, message} from "antd";

const {CrudEditModal} = HeaderAndBodyTable;

/**
 * 供应商合同得分编辑
 * @param props
 * @returns
 */
const SupplierContractScoreEdit: React.FC<any> = (props: any) => {
  const {dispatch, visible, onCancel, callbackEditSuccess, selectedRecord} = props;
  const {formatMessage} = useIntl();

  const [initTableData, setInitTableData] = useState<any>([]);

  useEffect(() => {
    //获取表格数据
    dispatch({
      type: "supplierContractScore/querySupplierContractScoreBody",
      payload: {
        sort: 'id',
        order: 'desc',
        filter: JSON.stringify([
          {Key: 'h_id', Val: selectedRecord.h_id, Operator: '='},
        ]),
      },
      callback: (res: any) => {
        setInitTableData(res.rows);
      },
    });
  }, []);

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'h_id',
        'wbs_code',
        'year',
        'phone_number',
        'create_ts',
        'create_tz',
        'create_user_code',
        'create_user_name',
        'modify_ts',
        'modify_tz',
        'modify_user_code',
        'modify_user_name',
      ])
      .setFormColumnToInputNumber([
        {value: 'year', valueType: 'digit', min: 0},
        {value: 'phone_number', valueType: 'digit', min: 0},
      ])
      .setFormColumnToDatePicker([
        {value: 'create_ts', valueType: 'dateTs', needValueType: 'timestamp'},
        {value: 'modify_ts', valueType: 'dateTs', needValueType: 'timestamp'},
      ])
      .needToRules([
        "wbs_code",
        "year",
        "phone_number",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  const getTableColumns = () => {
    const cols = new BasicEditableColumns(configColumns)
      .initTableColumns([
        'h_id',
        'id',
        'contract_id',
        'product_quality',
        'service_ability',
        'contract_performance',
        'price_level',
        'technological_level',
        'integrity_management',
        'total_score',
        'delivery_amount',
      ])
      .setTableColumnToInputNumber([
        {value: 'product_quality', valueType: 'digit', min: 0},
        {value: 'service_ability', valueType: 'digit', min: 0},
        {value: 'contract_performance', valueType: 'digit', min: 0},
        {value: 'price_level', valueType: 'digit', min: 0},
        {value: 'technological_level', valueType: 'digit', min: 0},
        {value: 'integrity_management', valueType: 'digit', min: 0},
        {value: 'total_score', valueType: 'digit', min: 0},
        {value: 'delivery_amount', valueType: 'digit', min: 0},
      ])
      .needToRules([
        "contract_id",
        "product_quality",
        "service_ability",
        "contract_performance",
        "price_level",
        "technological_level",
        "integrity_management",
        "total_score",
        "delivery_amount",
      ])
      .getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };

  const toolBarRender = (handleAdd: any, handleBatchAdd: any, form: any) => {
    return [
      <Button
        type="primary"
        onClick={() => {
          handleAdd();
        }}
      >新增</Button>
    ];
  };

  return (
    <CrudEditModal
      title={"编辑供应商合同得分"}
      visible={visible}
      onCancel={onCancel}
      toolBarRender={toolBarRender}
      initFormValues={selectedRecord}
      formColumns={getFormColumns()}
      tableColumns={getTableColumns()}
      initDataSource={initTableData}
      onCommit={(data: any) => {
        const {addItems, editItems, dataSource, delItems, form} = data;
        const values = form.getFieldsValue();
        return new Promise((resolve) => {
          if (!dataSource.length) {
            return resolve(true);
          }
          dispatch({
            type: "supplierContractScore/updateSupplierContractScore",
            payload: {
              ...selectedRecord,
              ...values,
              AddItems: JSON.stringify(addItems),
              UpdateItems: JSON.stringify(editItems),
              DelItems: JSON.stringify(delItems.reduce((result: any[], item: any) => {
                result.push(item.h_id)
                return result;
              }, [])),
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success('修改成功');
                setTimeout(() => {
                  callbackEditSuccess();
                }, 200);
              }
            },
          });
        });
      }}
    />
  )
}

export default connect()(SupplierContractScoreEdit);
