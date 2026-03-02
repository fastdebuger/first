import React from "react";
import { Button, message } from "antd";
import { connect, useIntl } from "umi";
import { BasicEditableColumns, BasicFormColumns, HeaderAndBodyTable } from "yayang-ui";
import { configColumns } from "../columns";
import { ErrorCode } from "@yayang/constants";
import ContractSelectInput from "@/components/ContractSelect";

const { CrudAddModal } = HeaderAndBodyTable;

/**
 * 新增归档清单
 * @param props
 * @returns
 */
const TechnologyArchiveListAdd: React.FC<any> = (props: any) => {
  const { dispatch, visible, onCancel, callbackAddSuccess } = props;
  const { formatMessage } = useIntl();

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        {
          title: '工程名称',
          subTitle: '工程名称',
          dataIndex: 'contract_out_name',
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => (
            <ContractSelectInput
              placeholder="请选择工程名称"
              displayField="contract_name"
              onChange={(record: any) => {
                console.log(record,'record');

                form.current.setFieldsValue({
                  contract_out_name: record?.contract_name || record,
                });
              }}
            />
          ),
        },
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
    <CrudAddModal
      title={"新增归档清单"}
      visible={visible}
      onCancel={onCancel}
      formColumns={getFormColumns()}
      initFormValues={{}}
      initDataSource={[]}
      toolBarRender={toolBarRender}
      tableColumns={getTableColumns()}
      onCommit={(data: any) => {
        const { addItems, form } = data;
        const values = form.getFieldsValue();
        return new Promise((resolve: any) => {
          if (!addItems.length) {
            return resolve(true);
          }
          dispatch({
            type: "technologyArchiveList/addTechnologyArchiveList",
            payload: {
              ...values,
              Items: JSON.stringify(addItems)
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("新增成功");
                setTimeout(() => {
                  callbackAddSuccess();
                }, 1000);
              }
            },
          });
        });
      }}
    />
  )
}

export default connect()(TechnologyArchiveListAdd);
