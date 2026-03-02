import React from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";
import ContractNoModal from "../ContractNoModal";

const { CrudEditModal } = SingleTable;

/**
 * 编辑质量回访计划
 * @param props
 * @constructor
 */
const MonitoringMeasuringEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
  const { formatMessage } = useIntl();
  /**
   * 表单列配置引用columns文件
   * @returns 返回一个数组
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'year',
        {
          title: "contract.contract_no",
          dataIndex: "contract_no",
          subTitle: "合同编号",
          width: 300,
          align: "center",
          renderSelfForm: (form: any, dataSource: any) => {
            return (
              <ContractNoModal
                dataSource={dataSource || []}
                handleChange={async (data: any) => {
                  if (data) {
                    form.setFieldsValue({
                      contract_no: data.contract_no || null,
                      owner_name: data.owner_name || null,
                      contract_name: data.contract_name || null,
                      contract_end_date: data.contract_end_date_str || null
                    })
                  } else {
                    form?.setFieldsValue({
                      contract_no: '',
                      owner_name: '',
                      contract_name: '',
                      contract_end_date: '',
                    })
                  }
                }} />
            )
          }
        },
        'owner_name', // 建设单位名称
        'contract_name', // 回访工程（产品）名称 
        'contract_end_date', // 竣工（交付）日期     
        "visit_date", // 回访时间
        "responsible_person",
      ])
      .setFormColumnToDatePicker([
        { value: 'year', valueType: 'dateTs', needValueType: 'date', picker: 'year', format: 'YYYY' },
        { value: 'visit_date', valueType: 'dateTs', needValueType: 'date', picker: 'month', format: 'YYYY-MM' },
        { value: 'contract_end_date', valueType: 'dateTs', needValueType: 'date' }
      ])
      .needToDisabled([
        'year',
        'owner_name', // 建设单位名称
        'contract_name', // 回访工程（产品）名称 
      ])
      .needToRules([
        'year',
        "contract_no",
        'contract_end_date',
        "visit_date",
        "responsible_person",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudEditModal
      title={"编辑质量回访计划"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord,
        year: String(selectedRecord?.year),
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "workLicenseRegister/updateVisitPlan",
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

export default connect()(MonitoringMeasuringEdit);
