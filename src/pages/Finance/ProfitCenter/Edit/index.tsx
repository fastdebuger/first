import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";
import WbsAllWbsByPropKeyTreeSelect from "@/components/CommonList/WbsAllWbsByPropKeyTreeSelect";

const { CrudEditModal } = SingleTable;

/**
 * 编辑利润中心
 * @param props
 * @constructor
 */
const ProfitCenterEdit: React.FC<any> = (props) => {
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
          "id",
          "profit_center_code",
          {
            title: "compinfo.profit_wbs_code",
            subTitle: "利润中心名称",
            dataIndex: "profit_wbs_code",
            width: 160,
            align: "center",
            renderSelfForm: form => {
              const onChange = (_val: string, fields: string) => {
                form.setFieldsValue({
                  profit_wbs_code: _val,
                  profit_belong_wbs_code: fields.up_wbs_code,
                })
              }
              return (
                <WbsAllWbsByPropKeyTreeSelect onChange={onChange}/>
              )
            }
          },
          {
            title: "compinfo.profit_belong_wbs_code",
            subTitle: "所属分公司",
            dataIndex: "profit_belong_wbs_code",
            width: 160,
            align: "center",
            renderSelfForm: form => {
              return (
                <WbsAllWbsByPropKeyTreeSelect propKey={"'branchComp', 'subComp'"}/>
              )
            }
          },
          "inOrOut",
          "profit_remark",
        ])
        .setFormColumnToInputTextArea([
          {value: 'profit_remark'}
        ])
        .setFormColumnToSelect([
          {value: "inOrOut", name: "inOrOut", valueType: 'radio', data: [
              {"inOrOut": '境内'},
              {"inOrOut": '境外'}
            ]}
        ])
        .needToHide([
          'id'
        ])
        .needToRules([
          "profit_center_code",
          'profit_wbs_code',
          'profit_belong_wbs_code',
          "inOrOut"
        ])
        .needToDisabled([
          "profit_center_code",
        ])
        .getNeedColumns();
      cols.forEach(
        (item: any) => (item.title = formatMessage({ id: item.title }))
      );
      return cols;
    };

  return (
    <CrudEditModal
      title={"编辑利润中心"}
      visible={visible}
      onCancel={onCancel}
      initialValue={selectedRecord}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "profitCenter/updateProfitCenter",
            payload: values,
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

export default connect()(ProfitCenterEdit);
