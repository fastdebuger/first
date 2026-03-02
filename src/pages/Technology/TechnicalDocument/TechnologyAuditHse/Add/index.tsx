import React, { useState } from "react";
import { Form } from "antd";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode, HUA_WEI_OBS_CONFIG } from "@/common/const";
import { message } from "antd";
import AddIncomeContract from "@/components/AddIncomeContract";
import type { SelectedIncomeContract } from "@/components/AddIncomeContract";
import HuaWeiOBSUploadSingleFile from "@/components/HuaWeiOBSUploadSingleFile";

const { CrudAddModal } = SingleTable;

/**
 * 新增HSE危害因素辨识与风险评价报告审批
 * @param props
 * @constructor
 */
const TechnologyBaseDataAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
  const { formatMessage } = useIntl();
  const [record, setRecord] = useState<SelectedIncomeContract | null>(null);
  const [form] = Form.useForm();
  const baseFields = ['out_info_dep_name', 'contract_out_name', 'contract_say_price',];

  const monitorField = Form.useWatch('contract_say_price', form);

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
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
        'contract_say_price',
        {
          title: 'compinfo.hazardAndReport',
          subTitle: '危害因素辨识与风险评价报告',
          dataIndex: 'file_url1',
          width: 160,
          align: 'center',
          renderSelfForm: (formInstance: any) => (
            <HuaWeiOBSUploadSingleFile
              accept=".doc,.docx,.xls,.xlsx,.pdf"
              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
              limitSize={100}
              folderPath="/Technology/TechnologyAudit/HSE"
              handleRemove={() => form.setFieldsValue({ file_url1: null })}
              onChange={(file: any) => {
                formInstance.setFieldsValue({ file_url1: file?.response?.url });
              }}
            />
          ),
        },
        {
          title: 'compinfo.others',
          subTitle: '其他',
          dataIndex: 'file_url4',
          width: 160,
          align: 'center',
          renderSelfForm: (formInstance: any) => (
            <HuaWeiOBSUploadSingleFile
              accept=".zip,.7z,.rar"
              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
              limitSize={100}
              folderPath="/Technology/TechnologyAudit/HSE"
              handleRemove={() => form.setFieldsValue({ file_url3: null })}
              onChange={(file: any) => {
                formInstance.setFieldsValue({ file_url4: file?.response?.url });
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
          columns: ['out_info_id'],
        },
        {
          title: '申报材料',
          columns: ['file_url1', 'file_url4'],
        },
      ])
      .needToRules(monitorField >= 50000000 ? [...baseFields, 'file_url1'] : baseFields)
      .setFormColumnToInputNumber([{ value: 'contract_say_price', valueType: 'digit' }]);

    const needColumns = cols.getNeedColumns();
    needColumns.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return needColumns;
  };

  return (
    <CrudAddModal
      title={`新增HSE危害因素辨识与风险评价报告审批`}
      visible={visible}
      onCancel={onCancel}
      form={form}
      initialValue={{}}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "technologyBaseData/addTechnologyBaseData",
            payload: { ...values, type_code: '0' },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("新增成功");
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

export default connect()(TechnologyBaseDataAdd);




