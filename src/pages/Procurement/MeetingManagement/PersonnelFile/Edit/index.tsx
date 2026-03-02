import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode, WBS_CODE } from "@/common/const";
import { message } from "antd";

import CommonPaginationSelect from '@/components/CommonList/CommonPaginationSelect';

const { CrudEditModal } = SingleTable;

/**
 * 编辑人员档案
 * @param props
 * @constructor
 */
const PersonEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (dispatch) {
      // dispatch({
      //   type: '',
      //   payload: {
      //
      //   }
      // })
    }
  }, []);

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'dep_name',
        'dep_code',
        {
          title: '职务名称',
          subTitle: "职务名称",
          dataIndex: "position_code",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <CommonPaginationSelect
                dispatch={dispatch}
                fieldNames={{ label: 'position_name', value: 'position_code' }}
                optionFilterProp={'position_name'}
                fetchType='position/getPosition'
                payload={{
                  sort: 'create_time',
                  order: 'desc',
                  filter: JSON.stringify([
                    { Key: 'dep_code', Val: WBS_CODE + "%", Operator: 'like' }
                  ])
                }}
              />
            )
          }
        },
        'person_code',
        'person_name',
        'remark',
      ])
      .needToHide([
        'dep_code',
      ])
      .needToDisabled([
        'dep_name'
      ])
      .needToRules([
        "dep_name",
        "position_code",
        "person_code",
        "person_name",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudEditModal
      title={"编辑人员档案"}
      visible={visible}
      onCancel={onCancel}
      initialValue={selectedRecord}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "person/updatePerson",
            payload: {
              ...selectedRecord,
              ...values,
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("编辑成功");
                setTimeout(() => {
                  callbackSuccess();
                }, 1000);
              }
            },
          });
        });
      }}
    />
  );
};

export default connect()(PersonEdit);
