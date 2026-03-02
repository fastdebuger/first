import React, { useEffect, useState } from 'react';
import { BasicFormColumns, SingleTable } from 'yayang-ui';
import { Dispatch, useIntl } from 'umi';
import { connect } from 'umi';
import { CONTRACT_TYPE, ErrorCode, HUA_WEI_OBS_CONFIG } from '@/common/const';
import { Form, message } from 'antd';
import type { ConnectState } from '@/models/connect';
import useSysDict from '@/utils/useSysDict';
import { configColumns } from '../columns';
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';
import moment from 'moment';
import PopulateCardWithData from '../PopulateCardWithData';
import ContractDatePicker from '../ContractDatePicker';

const { CrudAddModal } = SingleTable;

interface Expenditure { // 定义组件 Props 接口
  dispatch: Dispatch,
  visible: boolean, // 控制模态框可见性
  onCancel: () => void, // 关闭回调
  callbackAddSuccess: () => void, // 新增成功后的回调
}

const ExpenditureAdd: React.FC<Expenditure> = (props) => {
  const { dispatch, visible, onCancel, callbackAddSuccess } = props;
  const style = { width: "100%" }
  const [form] = Form.useForm()
  const { formatMessage } = useIntl()
  const [record, setRecord] = useState(null) // 存储选中的主合同记录
  const [isContractType, setIsContractType] = useState<boolean>(false) // 存储负责人是否必填
  const contract_type = Form.useWatch('contract_type', form)
  const { configData } = useSysDict({ // 调用系统字典 Hook 获取数据
    filter: [ // 过滤条件，获取合同类型、采购方式、物资类型
      {
        "Key": "sys_type_code",
        "Val": "'CONTRACT_TYPE','PUR_WAY','MATERIALS_TYPE'",
        "Operator": "in"
      }
    ]
  })

  // 根据选择的合同模块类型判断负责人是否必填
  useEffect(() => {
    const contractTypeObj = configData?.CONTRACT_TYPE.find(item => String(item.id) === String(contract_type))
    if (contractTypeObj && contractTypeObj.dict_name) {
      setIsContractType(CONTRACT_TYPE.includes(contractTypeObj.dict_name))
    } else {
      setIsContractType(false)
    }
  }, [contract_type])

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        // 'branch_comp_code', // 备用字段
        // 'dep_code', // 备用字段
        "contract_no",
        "obs_code",
        "user_code",
        {
          title: 'income_info_wbs_name', // 对应的主合同 ERP 项目编号
          subTitle: "对应的主合同WBS项目定义", // 副标题
          dataIndex: "income_info_wbs_name", // 数据索引
          width: 160, // 列宽
          align: 'center', // 对齐方式
          renderSelfForm: (form: any) => { // 自定义表单渲染
            return (
              <PopulateCardWithData
                onSelect={(values) => {
                  setRecord(values)
                  form.setFieldsValue({ // 设置表单字段值
                    income_info_wbs_name: values.wbs_code, // 设置 ERP 编号
                    contract_name: values.contract_name, // 设置主合同名称
                    contract_income_id: values?.id, // 主合同 ID
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
        'contract_type', // 合同类型
        'contract_name', // 主合同名称
        'contract_out_name', // 支出合同名称
        "subletting_enroll_code",// 乙方单位名称
        'y_signatory_user',// 乙方签约人
        'y_site_user',// 乙方现场负责人
        'contract_scope', // 合同范围
        'pur_way', // 采购方式
        {
          title: 'contract.contract_start_date',
          subTitle: "合同起始日期",
          dataIndex: "contract_start_date",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <ContractDatePicker
                startDateLimit={record?.contract_start_date}
                endDateLimit={record?.contract_end_date}
                style={style}
                value={form.getFieldValue('contract_start_date')}
                onChange={(val) => form.setFieldsValue({ contract_start_date: val })}
              />
            )
          }
        },
        {
          title: 'contract.contract_end_date',
          subTitle: "合同结束日期",
          dataIndex: "contract_end_date",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <ContractDatePicker
                startDateLimit={record?.contract_start_date}
                endDateLimit={record?.contract_end_date}
                style={style}
                value={form.getFieldValue('contract_end_date')}
                onChange={(val) => form.setFieldsValue({ contract_end_date: val })}
              />
            )
          }
        },
        'contract_say_price',
        'contract_un_say_price',
        {
          title: 'contract.contract_sign_date',
          subTitle: "合同签订日期",
          dataIndex: "contract_sign_date",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <ContractDatePicker
                startDateLimit={record?.contract_sign_date}
                style={style}
                value={form.getFieldValue('contract_sign_date')}
                onChange={(val) => form.setFieldsValue({ contract_sign_date: val })}
              />
            )
          }
        },
        'materials_type', // 物资类型
        'remark', // 备注
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
          title: 'contract.others_file_url',
          subTitle: "其他附件",
          dataIndex: "others_file_url",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) =>
            <HuaWeiOBSUploadSingleFile
              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
              limitSize={100}
              folderPath="/Contract/Income"
              accept=".doc,.docx,.xls,.xlsx,.pdf"
              handleRemove={() => form.setFieldsValue({ others_file_url: null })}
              onChange={(file) => {
                form.setFieldsValue({ others_file_url: file?.response?.url })
              }}
            />
        },
        "relative_person_code",
        "contract_income_id",
      ])
      .setFormColumnToSelect([ // 设置为 Select 选择框的列
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
      .setFormColumnToInputNumber([ // 设置为数字输入框的列
        { value: 'contract_say_price', valueType: 'digit', max: record ? record.contract_say_price : undefined },
        { value: 'contract_un_say_price', valueType: 'digit', max: record ? record.contract_un_say_price : undefined }
      ])
      .setFormColumnToInputTextArea([ // 设置为文本域的列
        {
          value: 'contract_scope'
        },
        {
          value: 'remark',
        }
      ])
      .needToHide(['contract_name', "contract_income_id",]) // 需要隐藏的列
      .setFormColumnToSelfColSpan([ // 设置自定义列跨度的列
        {
          colSpan: 24,
          value: 'income_info_wbs_name',
          labelCol: {
            span: 24
          },
          wrapperCol: {
            span: 24
          }
        }
      ])
      .setSplitGroupFormColumns([ // 设置分组表单列
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
            'contract_type',
            'contract_out_name',
            "subletting_enroll_code",
            "y_signatory_user",
            "y_site_user",
            'contract_scope',
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
      .needToDisabled([ // 需要禁用的列
        "contract_name"
      ])
      .needToRules([ // 需要添加校验规则的列
        "contract_no",
        "obs_code",
        "user_code",
        // 'contract_name',
        "subletting_enroll_code",
        'y_signatory_user',
        isContractType ? "y_site_user" : "",//根据合同类型判断乙方负责人是否必填
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
      <CrudAddModal
        form={form}
        title={'新增支出合同台账'}
        visible={visible}
        onCancel={onCancel}
        initialValue={{}}
        columns={getFormColumns()}
        onCommit={(values: any) => {
          // 处理 moment 对象 转换成秒时间戳
          for (const key in values) {
            if (!Object.hasOwn(values, key)) continue;
            const element = values[key];
            if (moment.isMoment(element)) {
              // 将东八区的时间换成零时区
              values[key] = element.unix() - 28800;
            }
          }
          return new Promise((resolve) => {
            dispatch({
              type: 'expenditure/addContract',
              payload: {
                ...values
              },
              callback: (res: any) => {
                resolve(true);
                if (res.errCode === ErrorCode.ErrOk) {
                  message.success('新增成功');
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
}))(ExpenditureAdd);