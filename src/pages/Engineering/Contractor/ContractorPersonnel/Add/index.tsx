import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";
import useSysDict from '@/utils/useSysDict';
import { PERSONNEL_STATUS } from "@/common/const";
import ContractModal from "../ContractModal";

const { CrudAddModal } = SingleTable;

/**
 * 新增承包商人员信息
 * @param props
 * @constructor
 */
const PersonInfoAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
  const { formatMessage } = useIntl();

  const { configData } = useSysDict({
    dispatch,
    filter: [
      {
        "Key": "sys_type_code",
        "Val": "'CONTRACTOR_PERSON_JOB','CERTIFICATE_TYPE'",
        "Operator": "in"
      }
    ]
  })

  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'wbs_code',
        'person_name',
        'id_card_no',
        'contract_no',
        {
          title: "compinfo.contract_name",
          subTitle: "合同名称",
          dataIndex: "contract_out_name",
          width: 160,
          align: "center",
          renderSelfForm: (form: any, dataSource: any) => {
            return (
              <ContractModal
                dataSource={dataSource || []}
                form={form}
                handleChange={async (data: any) => {
                  const contractList = data || {};
                  if (data) {
                    form.setFieldsValue({
                      contract_no: contractList.contract_no || null,
                      team_name: contractList.subletting_enroll_name || null,
                      contract_out_name: contractList.contract_out_name || null
                    })
                  } else {
                    form?.setFieldsValue({
                      contract_no: null,
                      team_name: null,
                      contract_out_name: null
                    })
                  }
                  
                }} />
            )
          }
        },
        'team_name',
        'position_id',
        'certificate_id',
        'certificate_no',
        'entry_date',
        'status',

      ])
      .setFormColumnToSelect([
        { value: 'position_id', valueAlias: 'id', name: 'dict_name', valueType: 'select', data: configData?.CONTRACTOR_PERSON_JOB || [] },
        { value: 'certificate_id', valueAlias: 'id', name: 'dict_name', valueType: 'select', data: configData?.CERTIFICATE_TYPE || [] },
        { value: 'status', valueAlias: 'value', name: 'label', valueType: 'select', data: PERSONNEL_STATUS || [] },
      
      ])
      .needToHide([
        'wbs_code',
        'contract_no',
      ])
      .setFormColumnToDatePicker([
        { value: 'entry_date', valueType: 'dateTs', needValueType: 'timestamp' },
      ])
      .needToRules([
        'contract_no',
        'contract_out_name',
        "wbs_code",
        "id_card_no",
        "person_name",
        "team_name",
        "position_id",
        "certificate_id",
        "certificate_no",
        "entry_date",
        'status'
      ])
      .needToDisabled(['team_name'])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={"新增承包商人员信息"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        status: '1'
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "personInfo/addPersonInfo",
            payload: {
              ...values,
              wbs_code : localStorage.getItem('auth-default-wbsCode')
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

export default connect()(PersonInfoAdd);
