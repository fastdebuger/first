import React, { useEffect, useState } from "react";
import { Form } from "antd";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode, HUA_WEI_OBS_CONFIG } from "@/common/const";
import { message } from "antd";
import AddIncomeContract from "@/components/AddIncomeContract";
import type { SelectedIncomeContract } from "@/components/AddIncomeContract";
import HuaWeiOBSUploadSingleFile from "@/components/HuaWeiOBSUploadSingleFile";

const { CrudEditModal } = SingleTable;

/**
 * 编辑施工技术方案审批
 * @param props
 * @constructor
 */
const TechnologyBaseDataEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
  const { formatMessage } = useIntl();
  const [record, setRecord] = useState<SelectedIncomeContract | null>(null);
  const [form] = Form.useForm();

  const baseFields = ['out_info_dep_name', 'contract_out_name', 'base_data_name', 'level'];
  const monitorField = Form.useWatch('level', form);

  useEffect(() => {
    // 如果有 out_info_id，加载合同信息
    if (selectedRecord?.out_info_id && dispatch) {
      dispatch({
        type: "income/getIncomeInfo",
        payload: {
          filter: JSON.stringify([
            { Key: 'id', Val: selectedRecord.out_info_id, Operator: '=' }
          ]),
          order: 'desc',
          sort: 'id',
        },
        callback: (res: { errCode: number; rows: any }) => {
          if (res.errCode === ErrorCode.ErrOk && res.rows && res.rows.length > 0) {
            setRecord(res.rows[0]);
          }
        },
      });
    }
  }, []);

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'contract_say_price',
        {
          title: '收入合同',
          subTitle: '收入合同信息',
          dataIndex: 'out_info_id',
          width: 300,
          align: 'center',
          renderSelfForm: (formInstance: any) => {
            return (
              <AddIncomeContract
                record={record}
                dispatch={dispatch}
                onChange={(data: SelectedIncomeContract) => {
                  setRecord(data);
                  if (data) {
                    formInstance.setFieldsValue({
                      out_info_id: data.id,
                      contract_say_price: data.contract_say_price,
                      contract_out_name: data.contract_name,
                      out_info_dep_name: data.dep_name,
                    });
                  }
                }}
                onClear={() => {
                  setRecord(null);
                }}
                width={300}
              />
            );
          },
        },
        'out_info_dep_name',
        'contract_out_name',
        'base_data_name',
        'level',
        'data_ts',
        {
          title: '施工技术方案',
          subTitle: '施工技术方案',
          dataIndex: 'file_url1',
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => (
            <HuaWeiOBSUploadSingleFile
              accept=".doc,.docx,.xls,.xlsx,.pdf"
              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
              limitSize={100}
              folderPath="/Technology/TechnologyAudit/Construction"
              handleRemove={() => form.setFieldsValue({ file_url1: null })}
              onChange={(file: any) => {
                form.setFieldsValue({ file_url1: file?.response?.url });
              }}
            />
          ),
        },
        {
          title: '其他',
          subTitle: '其他',
          dataIndex: 'file_url4',
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => (
            <HuaWeiOBSUploadSingleFile
              accept=".zip,.7z,.rar"
              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
              limitSize={100}
              folderPath="/Technology/TechnologyAudit/Construction"
              handleRemove={() => form.setFieldsValue({ file_url4: null })}
              onChange={(file: any) => {
                form.setFieldsValue({ file_url4: file?.response?.url });
              }}
            />
          ),
        },
      ])
      .setFormColumnToSelfColSpan([
        {
          colSpan: 24,
          value: 'out_info_id',
          labelCol: {
            span: 24,
          },
          wrapperCol: {
            span: 24,
          },
        },
      ])
      .setSplitGroupFormColumns([
        {
          title: '合同信息',
          columns: ['out_info_id', 'contract_say_price'],
        },
        {
          title: '方案信息',
          columns: ['level', 'data_ts', 'base_data_name'],
        },
        {
          title: '申报材料',
          columns: ['file_url1', 'file_url4'],
        },
      ])
      .needToRules(monitorField === '1' ? [...baseFields, 'data_ts', 'file_url1'] : [...baseFields, 'file_url1'])
      .needToDisabled(monitorField === '1' ? [] : ['data_ts'])
      .setFormColumnToSelect([
        {
          value: 'level',
          name: 'name',
          valueType: 'select',
          data: [
            { value: 0, name: '一般方案' },
            { value: 1, name: '重/危大方案' }
          ],
          valueAlias: 'value',
        },
      ])
      .setFormColumnToDatePicker([
        {
          value: 'data_ts',
          valueType: 'dateTs',
          needValueType: 'timestamp',
        },
      ])
      .needToHide(['contract_say_price'])
      ;

    const needColumns = cols.getNeedColumns();
    needColumns.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return needColumns;
  };

  return (
    <CrudEditModal
      title={`编辑施工技术方案审批`}
      visible={visible}
      onCancel={onCancel}
      form={form}
      initialValue={selectedRecord}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "technologyBaseData/updateTechnologyBaseData",
            payload: {
              ...selectedRecord,
              ...values
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

export default connect()(TechnologyBaseDataEdit);




