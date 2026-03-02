import React, { useEffect, useState } from 'react';
import { BasicFormColumns, SingleTable } from 'yayang-ui';
import { Dispatch, ISteelMemberCategoryStateType, useIntl } from 'umi';
import { connect } from 'umi';
import { CONTRACT_TYPE, ErrorCode, HUA_WEI_OBS_CONFIG } from '@/common/const';
import { Form, message } from 'antd';
import type { ConnectState } from '@/models/connect';
import useSysDict from '@/utils/useSysDict';
import { configColumns } from '../columns';
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';
import PopulateCardWithDataProps from '../PopulateCardWithData';

const { CrudEditModal } = SingleTable;
interface Expenditure {
  dispatch: Dispatch,
  visible: boolean,
  onCancel: () => void,
  callbackAddSuccess: () => void,
  steelmembercategoryTypeList: ISteelMemberCategoryStateType[],
  selectedRecord: any
}

const ExpenditureEdit: React.FC<Expenditure> = (props) => {
  const { dispatch, visible, onCancel, callbackAddSuccess, selectedRecord } = props;
  const [form] = Form.useForm()
  const [record, setRecord] = useState(null)
  const [isContractType, setIsContractType] = useState<boolean>(CONTRACT_TYPE.includes(selectedRecord.contract_type_str)) // 存储负责人是否必填
  const contract_type = Form.useWatch('contract_type', form);
  const { formatMessage } = useIntl();
  const { configData } = useSysDict({
    filterVal: "'CONTRACT_TYPE','PUR_WAY','MATERIALS_TYPE'",
    // filter: [
    //   {
    //     "Key": "sys_type_code",
    //     "Val": "'CONTRACT_TYPE','PUR_WAY','MATERIALS_TYPE'",
    //     "Operator": "in"
    //   }
    // ]
  })

  // 根据选择的合同模块类型判断负责人是否必填
  useEffect(() => {
    // 配置数据和合同类型同时有值的时候处理
    if (configData && contract_type) {
      const contractTypeObj = configData?.CONTRACT_TYPE.find(item => String(item.id) === String(contract_type))
      if (contractTypeObj && contractTypeObj.dict_name) {
        setIsContractType(CONTRACT_TYPE.includes(contractTypeObj.dict_name))
      } else {
        setIsContractType(false)
      }
    }
  }, [contract_type])

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        // 'branch_comp_code',
        // 'dep_code',
        "contract_no",
        "obs_code",
        "user_code",
        {
          title: 'income_info_wbs_name',
          subTitle: "对应的主合同WBS项目定义",
          dataIndex: "income_info_wbs_code",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <PopulateCardWithDataProps
                selectedRecord={selectedRecord}
                onSelect={(values) => {
                  setRecord(values)
                  form.setFieldsValue({
                    income_info_wbs_name: values.wbs_code,
                    contract_name: values.contract_name,
                    contract_income_id: values?.id,
                  })
                }}
                onCardCancel={() => {
                  form.setFieldsValue({
                    income_info_wbs_code: "",
                    contract_name: "",
                    contract_income_id: ""
                  })
                }}
              />
            )
          }
        },
        'contract_type',
        'contract_name',
        'contract_out_name',
        "subletting_enroll_code",// 乙方单位名称
        'y_signatory_user',// 乙方签约人
        'y_site_user',// 乙方现场负责人
        // "contract_out_name",
        'contract_scope',
        'pur_way',
        'contract_start_date',
        'contract_end_date',
        'contract_say_price',
        'contract_un_say_price',
        'contract_sign_date',
        'materials_type',
        'remark',
        {
          title: 'contract.scanning_file_url',
          subTitle: "合同扫描件",
          dataIndex: "file_url",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) =>
            <HuaWeiOBSUploadSingleFile
              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
              limitSize={100}
              folderPath="/Contract/Income"
              accept=".doc,.docx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png,.bmp,.webp"
              handleRemove={() => form.setFieldsValue({ file_url: null })}
              onChange={(file) => {
                form.setFieldsValue({ file_url: file?.response?.url })
              }}
            />
        },
        {
          title: 'contract.others_file_url', // 附件标题
          subTitle: "其他附件", // 副标题
          dataIndex: "others_file_url", // 数据索引
          width: 160, // 列宽
          align: 'center', // 对齐方式
          renderSelfForm: (form: any) => // 自定义表单渲染
            <HuaWeiOBSUploadSingleFile // 华为 OBS 上传组件
              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE} // 系统路径
              limitSize={100} // 文件大小限制
              folderPath="/Contract/Income" // 存储文件夹路径
              accept=".doc,.docx,.xls,.xlsx,.pdf" // 允许的文件类型
              handleRemove={() => form.setFieldsValue({ others_file_url: null })} // 删除文件时清空表单值
              onChange={(file) => { // 文件上传成功后更新表单值
                form.setFieldsValue({ others_file_url: file?.response?.url })
              }}
            />
        },
        "relative_person_code",
        "contract_income_id",
      ])
      .setFormColumnToSelect([
        {
          value: 'contract_type',
          name: 'dict_name',
          valueType: 'select',
          data: configData?.CONTRACT_TYPE || [],
          valueAlias: 'id',
        },
        {
          value: 'pur_way',
          name: 'dict_name',
          valueType: 'select',
          data: configData?.PUR_WAY || [],
          valueAlias: 'id',
        },
        {
          value: 'materials_type',
          name: 'dict_name',
          valueType: 'select',
          data: configData?.MATERIALS_TYPE || [],
          valueAlias: 'id',
        }
      ])
      .setFormColumnToInputNumber([
        { value: 'contract_say_price', valueType: 'digit', max: record ? record.contract_say_price : undefined },
        { value: 'contract_un_say_price', valueType: 'digit', max: record ? record.contract_un_say_price : undefined }
      ])
      .setFormColumnToDatePicker([
        {
          value: 'contract_start_date',
          valueType: "date",
          format: 'Timestamp',
          needValueType: "timestamp"
        },
        {
          value: 'contract_end_date',
          valueType: "date",
          format: 'Timestamp',
          needValueType: "timestamp"
        },
        {
          value: 'contract_sign_date',
          valueType: "date",
          format: 'Timestamp',
          needValueType: "timestamp"
        },
      ])
      .setFormColumnToInputTextArea([
        {
          value: 'contract_scope'
        }
      ])
      .setSplitGroupFormColumns([
        {
          title: '承办信息',
          order: 2,
          columns: [
            "obs_code",
            "user_code"
          ]
        },
        {
          title: '支出合同信息',
          order: 3,
          columns: [
            "contract_no",
            'contract_out_name',
            "subletting_enroll_code",
            "y_signatory_user",
            "y_site_user",
            'contract_scope',
            'contract_type',
            'pur_way',
            'contract_start_date',
            'contract_end_date',
            'contract_say_price',
            'contract_un_say_price',
            'contract_sign_date',
            "relative_person_code",
          ]
        },
        {
          title: '其他',
          order: 4,
          columns: [
            'materials_type',
            "contract_scope",
            'remark',
          ]
        },
        {
          title: '附件',
          order: 5,
          columns: ["file_url", "others_file_url"]
        }
      ])
      .needToDisabled([
        "contract_name"
      ])
      .needToHide(['contract_name', "contract_income_id"])
      .setFormColumnToSelfColSpan([
        {
          colSpan: 24,
          value: 'income_info_wbs_code',
          labelCol: {
            span: 24
          },
          wrapperCol: {
            span: 24
          }
        }
      ])
      .needToRules([
        "contract_no",
        "obs_code",
        "user_code",
        // 'contract_name',
        "subletting_enroll_code",
        'y_signatory_user',
        isContractType ? "y_site_user" : "", //根据合同类型判断乙方负责人是否必填
        "contract_out_name",
        'contract_scope',
        'contract_type',
        'pur_way',
        'contract_start_date',
        'contract_end_date',
        'contract_say_price',
        'contract_un_say_price',
        'contract_sign_date',
        'file_url',
        // 'materials_type',
        // 'remark',
        // "relative_person_code",
        {
          value: 'relative_person_code',
          rules: [{
            required: true,
            validator: (_: any, value: any) => {
              if (!value) {
                return Promise.reject(new Error("这是必填项"));
              }
              if (!/^[A-Za-z0-9]{10}$/.test(value)) {
                return Promise.reject(new Error('编码格式不正确，请输入10位数字或字母组合'));
              }
              return Promise.resolve();
            }
          }]
        },
      ])
      .getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };

  return (
    <>
      <CrudEditModal
        form={form}
        title={'编辑支出合同台账'}
        visible={visible}
        onCancel={onCancel}
        initialValue={{
          ...selectedRecord
        }}
        columns={getFormColumns()}
        onCommit={(values: any) => {
          return new Promise((resolve) => {
            const payload = {
              ...selectedRecord,
              ...values,
            }

            if (String(selectedRecord.contract_income_id) !== String(record?.id)) {
              Object.assign(payload, {
                contract_income_id: record?.id
              })
            }

            dispatch({
              type: 'expenditure/updateContract',
              payload,
              callback: (res: any) => {
                resolve(true);
                if (res.errCode === ErrorCode.ErrOk) {
                  message.success('编辑成功');
                  setTimeout(() => {
                    callbackAddSuccess();
                  }, 1000);
                }
              },
            });
          });
        }}
      />
    </>
  );
};

export default connect(({ steelmembercategory }: ConnectState) => ({
  steelmembercategoryTypeList: steelmembercategory.steelmembercategoryTypeList,
}))(ExpenditureEdit);
