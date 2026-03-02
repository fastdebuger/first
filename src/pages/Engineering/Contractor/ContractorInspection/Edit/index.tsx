import React, { useEffect, useRef, useState } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message, Spin,Select, Divider, Space, Input, Button,DatePicker,Form,InputNumber  } from "antd";
import AddExpenditureContract, { SelectedExpenditureContract } from '@/components/AddExpenditureContract';
import DynamicTableForm, { DynamicFormColumn } from '@/components/DynamicTableForm';
import useSysDict from '@/utils/useSysDict';
import { transformFormDataWithGroupFields } from '@/utils/formDataTransform';
import type { InputRef } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from "moment"

const { CrudEditModal } = SingleTable;

/**
 * 编辑承包商施工作业过程中监督检查表信息
 * @param props
 * @constructor
 */
const MonthlyOutputEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord, getInterfaceData } = props;
  const { formatMessage } = useIntl();
  
  const [contractorNameItems, setContractorNameItems] = useState<any>([]);
  const [contractorInputName, setContractorInputName] = useState<string | number | null>(null);
  const inputRef = useRef<InputRef>(null);
  const [examinationItems, setExaminationItems] = useState<any[]>([])
  const [form] = Form.useForm();
  const [examinationData, setExaminationData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedContract, setSelectedContract] = useState<SelectedExpenditureContract | null>(null)
  const [contractorPhoneItems, setContractorPhoneItems] = useState<any>([]);
  const [contractorInputPhone, setContractorInputPhone] = useState<string | number | null>(null);
  const examinationRef: any = useRef();
  const monthlyOutputValue = Form.useWatch('monthly_output_value', form);

    /**
   * 获取下拉选项数据、承包商以及手机号码的数据
   */
  const fetchSelectOptions = () => {
      // 获取承包商注册号信息
      dispatch({
        type: 'appraiseInfo/getContractorBasicInfo',
        payload: {
          contractor_name: selectedRecord?.contractor_name || selectedContract?.subletting_enroll_code,
          group_by: 0
        },
        callback: (res: any) => {
          if(res.errCode === ErrorCode.ErrOk){
            const newRes = res.result.map((item: any) => item.register_number) 
            setContractorNameItems(newRes);
          }
        }
      })
      
      // 获取承包商联系电话信息
      dispatch({
        type: 'appraiseInfo/getContractorBasicInfo',
        payload: {
          contractor_name: selectedRecord?.contractor_name || selectedContract?.subletting_enroll_code,
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
    if(selectedRecord || selectedContract){
      fetchSelectOptions();
    }
  },[selectedContract,selectedRecord])

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
        rules: [{ required: true, message: '请输入检查部门' }],
      },
    },
  ];


  useEffect(() => {
    if (dispatch) {
      Promise.all([
        getInterfaceData('monthlyOutput/getExaminationConfig'),
        getInterfaceData('monthlyOutput/queryMonthlyOutputDetail', { monthly_output_id: selectedRecord.monthly_output_id })
      ]).then((res: any[]) => {
        const configRes = res[0];
        const detailRes = res[1];
        // 配置数据就是监督检查表的数据
        setExaminationData(configRes || [])
        // 详情数据中的监督检查项
        setExaminationItems(detailRes || [])
        setLoading(false)
      }).catch(() => {
        setLoading(false)
      })
    }
    // 如果有 contract_out_id，加载合同信息
    if (selectedRecord?.contract_out_id && dispatch) {
      console.log(selectedRecord.contract_out_id, 'selectedRecord.contract_out_id');
      
      dispatch({
        type: "expenditure/queryContract",
        payload: {
          filter: JSON.stringify([
            { Key: 'id', Val: selectedRecord.contract_out_id, Operator: '=' }
          ]),
          order: 'desc',
          sort: 'id',
          queryAlternativeInfo: '1',
          belong_month: selectedRecord?.belong_month || null
        },
        callback: (res: { errCode: number; rows: any }) => {
          if (res.errCode === ErrorCode.ErrOk && res.rows && res.rows.length > 0) {
            setSelectedContract(res.rows[0]);
            console.log(res.rows[0], 'res.rows[0]');
          }
        },
      });
    }
  }, [selectedRecord?.monthly_output_id]);
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
                      contractor_manager: data.y_site_user,
                      register_number: data.register_number,
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
                    contractor_manager: '',
                    register_number: '',
                    contract_amount: '',
                    contract_out_id: '',
                    contract_start_date: '',
                    contract_end_date: '',
                    pre_total_output_value: '',
                    actual_start_date: '',
                  });
                }}
                width={300}
                isReadonly={false}
                selectedRows={{
                  out_info_id: selectedRecord?.contract_out_id || '',
                  form_no: ''
                }}
              />
            )
          }
        },
        'contract_out_id',
        "branch_comp_code",
        "branch_comp_name",
        "dep_code",
        "dep_name",
        "contractor_name",
        "contractor_manager",
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
              <DatePicker disabled style={{ width: '100%' }} format='YYYY-MM' onChange={onChange} picker="month" />
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
        "actual_start_date",
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
      .setFormColumnToInputTextArea([
        { value: 'remark' },
      ])
      .setFormColumnToSelect([
        { value: 'project_category', valueAlias: 'id', name: 'dict_name', valueType: 'select', data: (configData?.PROJECT_TYPE as any) || [] },
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
        "branch_comp_code",
        "dep_code",
        "contractor_name",
        "contractor_manager",
        "register_number",
        'contact_phone',
        'belong_month',
        "contract_name",
        "monthly_person_count",
        "monthly_output_value",
        'cumulative_output_value',
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
    <CrudEditModal
      title={"编辑承包商施工作业过程中监督检查表信息"}
      visible={visible}
      onCancel={onCancel}
      form={form}
      initialValue={{
        ...selectedRecord,
        belong_month: moment(selectedRecord?.belong_month)
      }}
      columns={getFormColumns()}
      onCommit={async (values: any) => {
        try {
          await examinationRef.current?.validateFields?.();
        } catch (error) {
          return Promise.resolve(false);
        }

        const examVals = examinationRef.current?.getFieldsValue?.() || {};
        console.log(examVals, 'examVals');

        // 转换监督检查表单数据
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
          preserveFieldsFromItems: {
            items: examinationItems,
            idFieldName: 'examination_config_id',
            fields: ['record_id'],
            targetFieldMapping: { record_id: 'id' },  // 将 record_id 映射为 id
          },
        }).map((item: any) => ({
          ...item,
          monthly_output_id: selectedRecord.monthly_output_id
        }));

        const payload = {
          ...selectedRecord,
          ...values,
          belong_month: values.belong_month.format('YYYY-MM'),
          UpdateItems: JSON.stringify(examinationList),
          code: 'YJ/ZH/PD/GC-005-2025R06',
          wbs_code: localStorage.getItem('auth-default-wbsCode'),
          monthly_output_id: selectedRecord.monthly_output_id
        };
        console.log(payload, 'submit payload');
        // return
        return new Promise((resolve) => {
          dispatch({
            type: "monthlyOutput/updateMonthlyOutput",
            payload,
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
          dataMerge={{
            items: examinationItems,
            idFieldName: 'examination_config_id',
            mergeFields: {
              record_id: 'record_id',  // 合并 record_id 到行数据中，但不显示（因为没有对应的列）
            },
            buildInitialValues: {
              row: {
                prefix: 'exam_',
                idFieldName: 'examination_config_id',
                sourceToSuffix: {
                  examination_result: 'result',
                  examination_person: 'person',
                  examination_dept: 'dept',
                },
              },
            },
          }}
        />
      </Spin>
    </CrudEditModal>
  );
};

export default connect()(MonthlyOutputEdit);
