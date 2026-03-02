import React from "react";
import { Button, message } from "antd";
import { connect, useIntl } from "umi";
import { BasicEditableColumns, BasicFormColumns, HeaderAndBodyTable } from "yayang-ui";
import { configColumns } from "../columns";
import { ErrorCode } from "@yayang/constants";

const { CrudAddModal } = HeaderAndBodyTable;

/**
 * 新增问题归类配置
 * @param props
 * @returns
 */
const QualitySafetyFactorTypeAdd: React.FC<any> = (props: any) => {
  const { dispatch, visible, onCancel, callbackAddSuccess } = props;
  const { formatMessage } = useIntl();

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'problem_type',
        'problem_name',
      ])
      .setFormColumnToSelect([
        {
          value: 'problem_type', valueAlias: 'value', name: 'label', valueType: 'select', data: [
            { value: '0', label: '质量' },
            { value: '1', label: 'HSE' }
          ]
        },
      ])
      .needToRules([
        'problem_type',
        'problem_name',
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
        'problem_b_name',
        'weight_num',
      ])
      .setTableColumnToInputNumber([
        { value: 'weight_num', valueType: 'digit', min: 0, max: 99 },
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
      title={"新增问题归类配置"}
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
            type: "qualitySafetyFactorType/addQualitySafetyFactorType",
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

export default connect()(QualitySafetyFactorTypeAdd);
