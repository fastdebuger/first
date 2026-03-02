import React, { useEffect, useState } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode, HUA_WEI_OBS_CONFIG } from "@/common/const";
import { message, Space, Form, Button, Input, Select, DatePicker } from "antd";
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';
import MultiDynamicForms from "@/components/MultiDynamicForms";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
const { CrudAddModal } = SingleTable;

/**
 * 新增计量人员资格申请表
 * @param props
 * @constructor
 */
const RelevantQualificaAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, currentLedgerRecord } = props;
  const { formatMessage } = useIntl();
  
  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'qualification', // 资质名称
        'qualification_date', // 资质到期时间 
        {
          title: "contract.file_url",
          dataIndex: "qualification_url",
          subTitle: "资质附件",
          width: 300,
          align: "center",
          renderSelfForm: (form) => {
            return (
              <HuaWeiOBSUploadSingleFile
                accept=".doc,.docx,.xls,.xlsx,.pdf,.7z,.zip,.rar"
                sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
                limitSize={100}
                folderPath="/Engineering/WorkLicenseRegister"
                handleRemove={() => {
                  form.setFieldsValue({ qualification_url: null })
                }}
                /**
                 * 文件上传变更处理函数
                 * @param file - 上传的文件的信息
                 */
                onChange={(file: any) => {
                  form.setFieldsValue({ qualification_url: file?.response?.url })
                }}
              />
            )
          }
        },
      ])
      .setFormColumnToDatePicker([
        { value: 'qualification_date', valueType: 'dateTs', needValueType: 'date' },
        
      ])
      
      .needToRules([
        'qualification', // 资质名称
        'qualification_date', // 资质到期时间 
        'qualification_url', // 资质附件
      ])
      .getNeedColumns();
    cols.forEach((item: any) => {
      if (item.title) {
        item.title = formatMessage({ id: item.title })
      }
    });
    return cols;
  };

  return (
    <CrudAddModal
      title={"新增外委实验室资质台账"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{}}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "workLicenseRegister/addExternalLaboratoryQualification",
            payload: {
              ...values,
              buss_id: currentLedgerRecord?.id,
              buss_type: 1,
            },
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

export default connect()(RelevantQualificaAdd);
