import React, { useEffect, useState  } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode, HUA_WEI_OBS_CONFIG } from "@/common/const";
import { message, Space, Form, Button, Input,Select, DatePicker} from "antd";
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import moment from "moment";

const { CrudEditModal } = SingleTable;

/**
 * 编辑外委实验室调查评价
 * @param props
 * @constructor
 */
const PersonnelApplyFormEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord,currentLedgerRecord } = props;
  const { formatMessage } = useIntl();

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'year',
        "qualification_change", // 实验室资质范围、有效期的变化情况
        "data_reliability", // 数据可靠性(1可靠/0不可靠)
        "service_quality", // 服务质量
        "contract_performance", // 合同履约
        "is_choose", // 下年度是否选用(0 否 1 是)
      ])
      .setFormColumnToSelfColSpan([
        { value: 'qualification_change', colSpan: 24, labelCol: { span: 8 }, wrapperCol: { span: 16 } },
      ])
      .setFormColumnToDatePicker([
        { value: 'year', valueType: 'dateTs', needValueType: 'date',picker: 'year', format: 'YYYY' },
        
      ])
      .setFormColumnToSelect([
        {
          value: 'data_reliability', valueType: 'select', name: 'data_reliability_str', data: [
            { data_reliability: '0', data_reliability_str: '不可靠' },
            { data_reliability: '1', data_reliability_str: '可靠' },
          ]
        },
        {
          value: 'service_quality', valueType: 'select', name: 'service_quality_str', data: [
            { service_quality: '0', service_quality_str: '不合格' },
            { service_quality: '1', service_quality_str: '合格' },
          ]
        },
        {
          value: 'contract_performance', valueType: 'select', name: 'contract_performance_str', data: [
            { contract_performance: '0', contract_performance_str: '不满足要求' },
            { contract_performance: '1', contract_performance_str: '满足要求' },
          ]
        },
        {
          value: 'is_choose', valueType: 'select', name: 'is_choose_str', data: [
            { is_choose: '0', is_choose_str: '否' },
            { is_choose: '1', is_choose_str: '是' },
          ]
        },
      ])
      .setFormColumnToInputTextArea([
        { value: 'qualification_change' }
      ])
      .needToRules([
        'year',
        "qualification_change", // 实验室资质范围、有效期的变化情况
        "data_reliability", // 数据可靠性
        "service_quality", // 服务质量
        "contract_performance", // 合同履约
        "reviewer", // 审查人姓名
        "review_unit", // 审查单位
        "is_choose", // 下年度是否选用(0 否 1 是)
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
      title={"编辑外委实验室台账"}
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
            type: "workLicenseRegister/updateExternalLaboratoryAnnualAudit",
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

export default connect()(PersonnelApplyFormEdit);
