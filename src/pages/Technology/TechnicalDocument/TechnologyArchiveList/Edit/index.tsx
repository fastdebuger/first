import React, { useEffect, useState } from "react";
import { configColumns } from "../columns";
import { BasicEditableColumns, BasicFormColumns, HeaderAndBodyTable } from "yayang-ui";
import { connect, useIntl } from "umi";
import { ErrorCode } from "@/common/const";
import { Button, message } from "antd";

const { CrudEditModal } = HeaderAndBodyTable;

/**
 * 归档清单编辑
 * @param props
 * @returns
 */
const TechnologyArchiveListEdit: React.FC<any> = (props: any) => {
  const { dispatch, visible, onCancel, callbackEditSuccess, selectedRecord } = props;
  const { formatMessage } = useIntl();

  const [initTableData, setInitTableData] = useState<any>([]);

  useEffect(() => {
    //获取表格数据
    dispatch({
      type: "technologyArchiveList/queryTechnologyArchiveListBody",
      payload: {
        sort: 'id',
        order: 'desc',
        filter: JSON.stringify([
          { Key: 'form_no', Val: selectedRecord.form_no, Operator: '=' },
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
        'contract_out_name',
        'record_name',
      ])
      .setFormColumnToDatePicker([
        { value: 'form_make_time', valueType: 'dateTs', needValueType: 'timestamp' },
      ])
      .needToRules([
        "contract_out_name",
        "record_name",
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
        'record_name_b',
        'unit',
        'archive_num',
        'transfer_date',
        'remark',
      ])
      .setTableColumnToInputNumber([
        { value: 'archive_num', valueType: 'digit', min: 0 },
      ])
      .setTableColumnToDatePicker([
        { value: 'transfer_date', valueType: 'dateTs' },
      ])
      .needToRules([
        "record_name_b",
        "unit",
        "archive_num",
        "transfer_date",
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
      title={"编辑归档清单"}
      visible={visible}
      onCancel={onCancel}
      toolBarRender={toolBarRender}
      initFormValues={selectedRecord}
      formColumns={getFormColumns()}
      tableColumns={getTableColumns()}
      initDataSource={initTableData}
      onCommit={(data: any) => {
        const { addItems, editItems, dataSource, delItems, form } = data;
        const values = form.getFieldsValue();
        return new Promise((resolve) => {
          if (!dataSource.length) {
            return resolve(true);
          }
          dispatch({
            type: "technologyArchiveList/updateTechnologyArchiveList",
            payload: {
              ...selectedRecord,
              ...values,
              AddItems: JSON.stringify(addItems),
              UpdateItems: JSON.stringify(editItems),
              DelItems: JSON.stringify(delItems.reduce((result: any[], item: any) => {
                result.push(item.form_no)
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

export default connect()(TechnologyArchiveListEdit);
