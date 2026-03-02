import { configColumns } from "../columns";
import { useIntl, connect } from "umi";
import AddEmergencyPlan from "../AddEmergencyPlan";
import React, { useRef, useState } from 'react';
import { BasicEditableColumns } from 'yayang-ui';
import { Modal, Form, message } from 'antd';
import BasicFormOperatorTable from '@/components/BaseFormOperatorTable'
import { ErrorCode } from "@yayang/constants";
import EmergencyResponsibilityDetail from '../Detail';

/**
 * 批量新增应急预案
 * @param props
 * @constructor
 */
const EmergencyResponsibilityAdd: React.FC<any> = (props) => {
  const { allUserListList, visible, onCancel, callbackSuccess, authority, dispatch } = props;
  const { formatMessage } = useIntl()

  const actionRef = useRef();
  const [initDataSource, setInitDataSource] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [open, setOpen] = useState(false);

  const getTableColumns = () => {
    const cols = new BasicEditableColumns(configColumns)
    cols.initTableColumns([
      {
        title: 'emergencyplan.plan_config_id',
        dataIndex: "plan_config_id",
        width: 160,
        align: 'center',
        editable: true,
        renderSelfEditable: (record) => {
          return (
            <a
              onClick={() => {
                setSelectedRecord(record)
                setOpen(true)
              }}
            >
              {record.plan_name}
            </a>
          )
        }
      },
      // "plan_config_id",
      "receiver",
      // "receiver_tel_num",
      "principal",
      // "principal_tel_num",
      "publisher",
      // "publisher_tel_num",
      "decision_info",
      
    ])
      .setTableColumnToSelect([
        {
          value: "receiver",
          valueType: "select",
          name: "user_name",
          valueAlias: "user_code",
          data: allUserListList
        },
        {
          value: "principal",
          valueType: "select",
          name: "user_name",
          valueAlias: "user_code",
          data: allUserListList
        },
        {
          value: "publisher",
          valueType: "select",
          name: "user_name",
          valueAlias: "user_code",
          data: allUserListList
        }])
      .needToRules([
        "receiver",
        "principal",
        "publisher",
      ])
      .noNeedToEditable([]);
    return cols.getNeedColumns();
  };


  const callbackCommitData: any = async (fields) => {
    // console.log('fields :>> ', fields);
    const { form, addItems, editItems, delItems, dataSource, oldDataSource } = fields;
    actionRef?.current?.cancelCommitButtonLoading?.();
    if (!(dataSource.length > 0)) {
      message.error("请添加数据")
      return new Promise((resolve: any) => {
        resolve(true)
      })
    }

    const datas = dataSource
      .map((i: any) => {
        delete i.id;
        delete i.key;
        delete i.isEditRow;
        delete i.isAddRow;
        delete i.RowNumber;
        delete i.rowForm
        return i;
      })

    dispatch({
      type: 'emergencyplan/addContingencyPlan',
      payload: {
        Items: JSON.stringify(
          datas
        ),
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          message.success(formatMessage({ id: 'common.list.add.success' }));
          setTimeout(() => {
            callbackSuccess();
            actionRef?.current?.cancelCommitButtonLoading?.();
          }, 200);
        }
      },
    });

  };

  /***
   * 获取应急预案数据
   */
  const toolBarRender = (_: any, handleBatchAdd: any, form: any) => {
    return [
      <AddEmergencyPlan
        type="checkbox"
        authority={authority}
        form={form}
        onOk={(rows: any[]) => {
          if (rows.length > 0) {
            const row = rows.map(o => ({ ...o, plan_config_id: o.form_no, plan_name: o.plan_name }))
            setInitDataSource(row)
          }
        }}
      />
    ]
  };

  return (
    <>
      <Modal
        title={"新增应急预案"}
        visible={visible}
        onCancel={onCancel}
        footer={null}
        width={'100%'}
        style={{
          maxWidth: '100vw',
          top: 0,
          paddingBottom: 0,
        }}
        bodyStyle={{
          height: 'calc(100vh - 55px)',
          padding: 10,
          overflow: "scroll"
        }}
      >
        <BasicFormOperatorTable
          formProps={{
            form: form,
          }}
          cRef={actionRef}
          toolBarRender={toolBarRender}
          initFormValues={{}}
          formColumns={[]}
          tableColumns={getTableColumns()}
          initDataSource={initDataSource}
          callbackCommitData={callbackCommitData}
        />
      </Modal>

      {open && selectedRecord && (
        <EmergencyResponsibilityDetail
          open={open}
          actionRef={actionRef}
          selectedRecord={selectedRecord}
          authority={authority}
          onClose={() => {
            setOpen(false)
          }}
        />
      )}
    </>
  );
};

export default connect(({ common }: any) => ({
  allUserListList: common.allUserListList
}))(EmergencyResponsibilityAdd);
