import React, { useEffect, useRef, useState } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message, Spin, Select, Divider, Space, Input, Button,DatePicker,InputNumber,Form  } from "antd";
import AddExpenditureContract, { SelectedExpenditureContract } from '@/components/AddExpenditureContract';
import DynamicTableForm, { DynamicFormColumn } from '@/components/DynamicTableForm';
import useSysDict from '@/utils/useSysDict';
import { transformFormDataWithGroupFields } from '@/utils/formDataTransform';
import type { InputRef } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { CrudAddModal } = SingleTable;

/**
 * 新增承包商施工作业过程中监督检查表信息
 * @param props
 * @constructor
 */
const MonthlyOutputAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, getInterfaceData } = props;
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  const [contractorNameItems, setContractorNameItems] = useState<any>([]);
  const [contractorInputName, setContractorInputName] = useState<string | number | null>(null);
  const inputRef = useRef<InputRef>(null);
  const [examinationData, setExaminationData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedContract, setSelectedContract] = useState<SelectedExpenditureContract | null>(null)
  const [contractorPhoneItems, setContractorPhoneItems] = useState<any>([]);
  const [contractorInputPhone, setContractorInputPhone] = useState<string | number | null>(null);
  const examinationRef: any = useRef();
  const monthlyOutputValue = Form.useWatch('monthly_output_value', form);
  
  // 获取承包商编码以及电话号码的数据（因为这个是可以让用户自己加的所以需要先查出之前加的） 
  const fetchSelectOptions = () => {
    dispatch({
      type: 'appraiseInfo/getContractorBasicInfo',
      payload: {
        contractor_name: selectedContract?.subletting_enroll_code,
        group_by: 0
      },
      callback: (res: any) => {
        if(res.errCode === ErrorCode.ErrOk){
          const newRes = res.result.map((item: any) => item.register_number) 
          setContractorNameItems(newRes);
        }
      }
    })
    dispatch({
      type: 'appraiseInfo/getContractorBasicInfo',
      payload: {
        contractor_name: selectedContract?.subletting_enroll_code,
        group_by: 1
      },
      callback: (res: any) => {
        if(res.errCode === ErrorCode.ErrOk){
          const newRes = res.result.map((item: any) => item.contact_phone) 
          setContractorPhoneItems(newRes);
        }
      }
      
    })
  }

  useEffect(() => {
    if(selectedContract){
      fetchSelectOptions();
    }
  },[selectedContract])

  const { configData } = useSysDict({
    dispatch,
    filter: [
      {
        "Key": "sys_type_code",
        "Val": "'PROJECT_TYPE'",
        "Operator": "in"
      }
    ]
  })
  // 监督检查配置列
  const examinationCols: DynamicFormColumn[] = [
    { title: '序号', dataIndex: 'RowNumber', width: 80 },
    { title: '监督检查内容', dataIndex: 'examination_content', width: 400 },
    {
      title: '检查结果',
      formField: {
        name: (row: any) => `exam_${row.id}_result`,
        type: 'input',
        rules: [{ required: true, message: '请输入检查结果' }],
      },
    },
    {
      title: '检查人',
      formField: {
        name: (row: any) => `exam_${row.id}_person`,
        type: 'input',
        rules: [{ required: true, message: '请输入检查人' }],
      },
    },
    {
      title: '检查部门',
      formField: {
        name: (row: any) => `exam_${row.id}_dept`,
        type: 'input',
        rules: [{ required: true, message: '请输入检查结果' }],
      },
    },
  ];



  useEffect(() => {
    if (dispatch) {
      getInterfaceData('monthlyOutput/getExaminationConfig')
        .then((configRes: any) => {
          // 配置数据就是监督检查表的数据
          setExaminationData(configRes || [])
          setLoading(false)
        }).catch(() => {
          setLoading(false)
        })
    }
  }, []);

  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        {
          title: '合同信息',
          subTitle: "合同信息",
          dataIndex: "contract_name",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <AddExpenditureContract
                record={selectedContract}
                isNeedFilter={true}
                onChange={(data: SelectedExpenditureContract | null) => {
                  setSelectedContract(data);
                  if (data) {
                    form.setFieldsValue({
                      contract_name: data.contract_out_name,
                      branch_comp_code: data.branch_comp_code,
                      branch_comp_name: data.branch_comp_name,
                      dep_code: data.dep_code,
                      dep_name: data.dep_name,
                      contractor_name: data.subletting_enroll_code,
                      register_number: data.register_number,
                      contractor_manager: data.y_site_user,
                      contract_amount: data.contract_say_price,
                      contract_out_id: data.id,
                      contract_start_date: data.contract_start_date,
                      contract_end_date: data.contract_end_date,
                      pre_total_output_value: data.pre_total_output_value,
                      actual_start_date: data.actual_start_date,
                    });
                  }
                }}
                onClear={() => {
                  setSelectedContract(null);
                  form.setFieldsValue({
                    contract_name: '',
                    branch_comp_code: '',
                    branch_comp_name: '',
                    dep_code: '',
                    dep_name: '',
                    contractor_name: '',
                    register_number: '',
                    contractor_manager: '',
                    contract_amount: '',
                    contract_out_id: '',
                    contract_start_date: '',
                    contract_end_date: '',
                    pre_total_output_value: '',
                    actual_start_date: '',

                  });
                }}
                width={300}
              />
            )
          }
        },
        'pre_total_output_value',
        'contract_out_id',
        "branch_comp_code",
        "branch_comp_name",
        "dep_code",
        "dep_name",
        "contractor_name",
        "contractor_manager",
        // "register_number",
        {
          title: "compinfo.register_number",
          subTitle: "承包商编码",
          dataIndex: "register_number",
          width: 160,
          align: "center",
          renderSelfForm : (form: any) => {
            const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
              setContractorInputName(event.target.value);
            };
            const addItem = (e: React.MouseEvent<HTMLAnchorElement>) => {
              if(!contractorInputName) return
              e.preventDefault();
              setContractorNameItems([...contractorNameItems, contractorInputName || `New item ${1}`]);
              setContractorInputName(null);
              setTimeout(() => {
                inputRef.current?.focus();
              }, 0);
            };
            return (
              <Select
                style={{ width: '100%' }}
                placeholder="自定义承包商编码"
                dropdownRender={menu => (
                  <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <Space style={{ padding: '0 8px 4px' }}>
                      <Input
                        placeholder="请输入承包商编码"
                        ref={inputRef}
                        value={contractorInputName || undefined}
                        onChange={onNameChange}
                      />
                      <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                        新增承包商编码
                      </Button>
                    </Space>
                  </>
                )}
                options={contractorNameItems.map(o => ({ label: o, value: o }))}
              />
            )
          }
        },
        {
          title: "compinfo.contact_phone",
          subTitle: "联系方式",
          dataIndex: "contact_phone",
          width: 160,
          align: "center",
          renderSelfForm : (form: any) => {
            const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
              setContractorInputPhone(event.target.value);
            };
            const addItem = (e: React.MouseEvent<HTMLAnchorElement>) => {
              if(!contractorInputPhone) return
              e.preventDefault();
              setContractorPhoneItems([...contractorPhoneItems, contractorInputPhone || `New item ${1}`]);
              setContractorInputPhone(null);
              setTimeout(() => {
                inputRef.current?.focus();
              }, 0);
            };
            return (
              <Select
                style={{ width: '100%' }}
                placeholder="自定义联系方式"
                dropdownRender={menu => (
                  <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <Space style={{ padding: '0 8px 4px' }}>
                      <Input
                        placeholder="请输入联系方式"
                        ref={inputRef}
                        value={contractorInputPhone || undefined}
                        onChange={onNameChange}
                      />
                      <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                        新增联系方式
                      </Button>
                    </Space>
                  </>
                )}
                options={contractorPhoneItems.map((o: any) => ({ label: o, value: o }))}
              />
            )
          }
        },
        {
          title: "compinfo.belong_month",
          subTitle: "所属月份",
          dataIndex: "belong_month",
          width: 160,
          align: "center",
          renderSelfForm: (form: any) => {
            const onChange = (date:any, _dateString: any) => {
              form.setFieldsValue({
                belong_month: date
              })
            };
            return (
              <DatePicker style={{ width: '100%' }} format='YYYY-MM' onChange={onChange} picker="month" />
            )
          }
        },
        "monthly_person_count",
        "monthly_output_value",
        {
          title: "compinfo.cumulative_output_value",
          subTitle: "累计完成产值（万元）",
          dataIndex: "cumulative_output_value",
          width: 160,
          align: "center",
          renderSelfForm: (form: any) => {
            // 当monthlyOutputValue变化时，自动计算累计值
            const preTotal = Number(selectedContract?.pre_total_output_value) || 0;
            const cumulativeValue = monthlyOutputValue + preTotal;
            form.setFieldsValue({
              cumulative_output_value: cumulativeValue
            });

            return (
              <InputNumber disabled placeholder="累计完成产值（万元）" style={{ width: "100%"}} />
            )
          },
        },
        "actual_start_date",
        "actual_end_date",
        'remark',
        "project_principal",
      ])
      .needToHide([
        'pre_total_output_value',
        'contract_out_id',
        "branch_comp_code",
        "branch_comp_name",
        "dep_code",
        "dep_name",
        "contractor_name",
        "contractor_manager",
        "contract_amount",
        "contract_start_date",
        "contract_end_date",
      ])
      .needToDisabled(selectedContract?.actual_start_date ? [
        'contract_out_name',
        'branch_comp_code',
        'dep_code',
        'contractor_name',
        'contractor_manager',
        'contract_amount',
        "dep_name",
        'branch_comp_name',
        "contract_start_date",
        "contract_end_date",
        // 控制是否需要禁用 实际开工日期
        'actual_start_date',
      ] : [
        'contract_out_name',
        'branch_comp_code',
        'dep_code',
        'contractor_name',
        'contractor_manager',
        'contract_amount',
        "dep_name",
        'branch_comp_name',
        "contract_start_date",
        "contract_end_date",
      ])
      .setFormColumnToDatePicker([
        { value: 'report_date', valueType: 'dateTs', needValueType: 'timestamp' },
        { value: 'contract_start_date', valueType: 'dateTs', needValueType: 'timestamp' },
        { value: 'contract_end_date', valueType: 'dateTs', needValueType: 'timestamp' },
        { value: 'actual_start_date', valueType: 'dateTs', needValueType: 'timestamp' },
        { value: 'actual_end_date', valueType: 'dateTs', needValueType: 'timestamp' },
      ])
      .setFormColumnToInputNumber([
        { value: 'monthly_person_count', valueType: 'digit' },
        { value: 'monthly_output_value', valueType: 'digit' },
      ])
      .setFormColumnToSelect([
        { value: 'project_category', valueAlias: 'id', name: 'dict_name', valueType: 'select', data: (configData?.PROJECT_TYPE as any) || [] },
      ])
      .setFormColumnToInputTextArea([
        { value: 'remark'},
      ])
      .setFormColumnToSelfColSpan([
        {
          colSpan: 24,
          value: 'contract_name',
          labelCol: {
            span: 24
          },
          wrapperCol: {
            span: 24
          }
        }
      ])
      .setSplitGroupFormColumns([
        {
          title: '合同信息',
          columns: ['contract_name', 'contract_say_price'],
        },
      ])
      .needToRules([
        "dep_name",
        'branch_comp_name',
        'contact_phone',
        'belong_month',
        'cumulative_output_value',
        "branch_comp_code",
        "dep_code",
        "contractor_name",
        "contractor_manager",
        "register_number",
        "contract_name",
        "monthly_person_count",
        "monthly_output_value",
        "actual_start_date",
        "project_principal",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={"新增承包商施工作业过程中监督检查表信息"}
      visible={visible}
      onCancel={onCancel}
      form={form}
      initialValue={{}}
      columns={getFormColumns()}
      onCommit={async (values: any) => {
        try {
          await examinationRef.current?.validateFields?.();
        } catch (error) {
          return Promise.resolve(true);
        }

        const examVals = examinationRef.current?.getFieldsValue?.() || {};

        // 转换监督检查表单数据（自动合并分组字段）
        const examinationList = transformFormDataWithGroupFields(examVals, {
          prefix: 'exam_',
          idFieldName: 'examination_config_id',
          fieldMapping: {
            'result': 'examination_result',
            'person': 'examination_person',
            'dept': 'examination_dept',
          },
          rows: examinationData,
          groupBy: (row: any) => row.examination_item,
          groupFields: [],
        });
        const payload = {
          ...values,
          belong_month: values.belong_month.format('YYYY-MM'),
          Items: JSON.stringify(examinationList),
          code: 'YJ/ZH/PD/GC-005-2025R06',
          wbs_code: localStorage.getItem('auth-default-wbsCode')
        };
        return new Promise((resolve) => {
          dispatch({
            type: "monthlyOutput/addMonthlyOutput",
            payload,
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
    >
      <Spin spinning={loading}>
        {/* 动态表单：监督检查表 */}
        <DynamicTableForm
          rows={examinationData || []}
          columns={examinationCols}
          cRef={examinationRef}
          title="监督检查表"
          groupBy={(r: any) => r.examination_item}
          showGroupAsLeft
          groupTitleHeader="检查项目"
        />
      </Spin>
    </CrudAddModal>
  );
};

export default connect()(MonthlyOutputAdd);
