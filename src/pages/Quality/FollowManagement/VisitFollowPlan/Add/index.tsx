import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode, HUA_WEI_OBS_CONFIG } from "@/common/const";
import { message } from "antd";
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';
import ContractNoModal from "../ContractNoModal";
const { CrudAddModal } = SingleTable;

/**
 * 新增监视和测量设备登记表
 * @param props
 * @constructor
 */
const MonitoringMeasuringAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
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
                  console.log(data.contract_end_date ,"data.contract_end_date data.contract_end_date ");
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
        // {
        //   title: "contract.file_url",
        //   dataIndex: "url",
        //   subTitle: "附件",
        //   width: 300,
        //   align: "center",
        //   renderSelfForm: (form) => {
        //     return (
        //       <HuaWeiOBSUploadSingleFile
        //         accept=".doc,.docx,.xls,.xlsx,.pdf,.7z,.zip,.rar"
        //         sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
        //         limitSize={100}
        //         folderPath="/Engineering/WorkLicenseRegister"
        //         handleRemove={() => {
        //           form.setFieldsValue({ url: null })
        //         }}
        //         /**
        //          * 文件上传变更处理函数
        //          * @param file - 上传的文件的信息
        //          */
        //         onChange={(file: any) => {
        //           form.setFieldsValue({ url: file?.response?.url })
        //         }}
        //       />
        //     )
        //   }
        // },
      ])
      .setFormColumnToDatePicker([
        { value: 'year', valueType: 'dateTs', needValueType: 'date', picker: 'year', format: 'YYYY' },
        { value: 'visit_date', valueType: 'dateTs', needValueType: 'date', picker: 'month', format: 'YYYY-MM' },
        { value: 'contract_end_date', valueType: 'dateTs', needValueType: 'date' }
      ])
      .needToDisabled([
        'owner_name', // 建设单位名称
        'contract_name', // 回访工程（产品）名称 
      ])
      .needToRules([
        'year',
        "contract_no",
        'visit_date', // 回访时间
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
    <CrudAddModal
      title={"新增质量回访计划"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        year: String(new Date().getFullYear()),
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "workLicenseRegister/addVisitPlan",
            payload: {
              ...values,
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

export default connect()(MonitoringMeasuringAdd);
