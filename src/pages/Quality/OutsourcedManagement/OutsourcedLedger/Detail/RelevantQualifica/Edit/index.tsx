import React, { useEffect, useState } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode, HUA_WEI_OBS_CONFIG } from "@/common/const";
import { message, Space, Form, Button, Input, Select, DatePicker } from "antd";
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import moment from "moment";

const { CrudEditModal } = SingleTable;

/**
 * 编辑外委实验室调查评价
 * @param props
 * @constructor
 */
const RelevantQualificaEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord, currentLedgerRecord } = props;
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
    <CrudEditModal
      title={"编辑外委实验室资质台账"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord,
        year: selectedRecord?.year ? String(selectedRecord?.year) : null,
        data_reliability: selectedRecord?.data_reliability + "", // 数据可靠性(1可靠/0不可靠)
        service_quality: selectedRecord?.service_quality + "", // 服务质量
        contract_performance: selectedRecord?.contract_performance + "", // 合同履约
        is_choose: selectedRecord?.is_choose + "", // 下年度是否选用(0 否 1 是)
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "workLicenseRegister/updateExternalLaboratoryQualification",
            payload: {
              ...selectedRecord,
              ...values,
              buss_type: 1,
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

export default connect()(RelevantQualificaEdit);
