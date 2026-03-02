import React from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode, HUA_WEI_OBS_CONFIG, GENDER_TYPE_OPTIONS,FULLORPART_STATUS_OPTIONS,QUALITY_CHECK_STATUS_OPTIONS,FORENSIC_STATUS_OPTIONS } from "@/common/const";
import { message,Select } from "antd";
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';

const { CrudEditModal } = SingleTable;

/**
 * 编辑质量检查员办证台账
 * @param props
 * @constructor
 */
const InspectorCerateLedgerEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
  const { formatMessage } = useIntl();

  /**
   * 获取表单列配置的函数
   * @returns 返回表单列的配置数组
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'name', // 姓名
        {
          title: "InspectorSeniorityApply.gender",
          dataIndex: "gender",
          subTitle: "性别",
          width: 160,
          align: "center",
          renderSelfForm: (form: any) => {
            /**
             * 处理性别选择框选择值的变化
             */
            const handleChange = (value: any) => {
              form.setFieldsValue({ gender: value });
            };
            return (
              <Select
                placeholder="请选择性别"
                disabled
                onChange={handleChange}
                style={{ width: '100%' }}
                options={GENDER_TYPE_OPTIONS || []}
              />
            )
          }
        },
        'birth_date', // 出生日期
        'work_date', // 参加工作时间
        'education', // 文化程度
        'major', // 所学专业
        'job_title', // 职称
        'issue_date', // 取证时间
        'annual_audit_date', // 年审时间
        {
          title: "InspectorSeniorityApply.apply_major",
          dataIndex: "apply_major",
          subTitle: "申请检查专业",
          width: 160,
          align: "center",
          renderSelfForm: (form: any) => {
            /**
             * 处理多选框选择值变化
             */
            const handleChange = (value: any) => {
              console.log(`selected ${value}`);
              form.setFieldsValue({ apply_major: value })

            };
            return (
              <Select
                mode="multiple"
                disabled
                placeholder="请选择申请检查专业"
                onChange={handleChange}
                style={{ width: '100%' }}
                options={FORENSIC_STATUS_OPTIONS || []}
              />
            )
          }
        },
        'certificate_number', // 证号
        {
          title: "InspectorSeniorityApply.job_nature",
          dataIndex: "job_nature",
          subTitle: "专职/兼职",
          width: 160,
          align: "center",
          renderSelfForm: (form: any) => {
            /**
             * 处理专职/兼职 选择框选择值的变化
             */
            const handleChange = (value: any) => {
              form.setFieldsValue({ job_nature: value });
            };
            return (
              <Select
                placeholder="请选择专职/兼职"
                onChange={handleChange}
                style={{ width: '100%' }}
                options={FULLORPART_STATUS_OPTIONS || []}
              />
            )
          }
        },
        {
          title: "InspectorSeniorityApply.is_on_duty",
          dataIndex: "is_on_duty",
          subTitle: "是否在岗",
          width: 160,
          align: "center",
          renderSelfForm: (form: any) => {
            /**
             * 处理专职/兼职 选择框选择值的变化
             */
            const handleChange = (value: any) => {
              form.setFieldsValue({ is_on_duty: value });
            };
            return (
              <Select
                placeholder="请选择是否在岗"
                onChange={handleChange}
                style={{ width: '100%' }}
                options={QUALITY_CHECK_STATUS_OPTIONS || []}
              />
            )
          }
        },
        {
          title: "contract.file_url",
          dataIndex: "url",
          subTitle: "附件",
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
                  form.setFieldsValue({ url: null })
                }}
                /**
                 * 文件上传变更处理函数
                 * @param file - 上传的文件的信息
                 */
                onChange={(file: any) => {
                  form.setFieldsValue({ url: file?.response?.url })
                }}
              />
            )
          }
        },
      ])

      .setSplitGroupFormColumns([
        {
          title: '工作简历',
          columns: ['job_resume']
        },
        {
          title: '附件',
          columns: ['url'],
        }
      ])
      .needToDisabled([
        'name',
        'gender',
        'birth_date', // 出生日期
        'work_date', // 参加工作时间
        'education', // 文化程度
        'major', // 所学专业
        'job_title', // 职称
        'is_on_duty',
        'apply_major',
        'issue_date', // 取证时间
        'annual_audit_date', // 年审时间
      ])
      .setFormColumnToDatePicker([
        { value: 'birth_date', valueType: 'dateTs', needValueType: 'date' },
        { value: 'work_date', valueType: 'dateTs', needValueType: 'date' },
        // { value: 'related_work_date', valueType: 'dateTs', needValueType: 'timestamp' },
      ])
      .needToRules([
        'name', // 姓名
        'gender', // 性别
        'birth_date', // 出生日期
        'job', // 职务,
        'job_title', // 职称,
        'work_date', // 参加工作时间,
        'education', // 文化程度,
        'graduation_school', // 毕业院校,
        'major', // 所学专业,
        'related_work_date', // 从事质检或相关工作时间,
        'apply_major', // 申请检查专业(土建/安装/ 电气/仪表/材料检验),
        'job_resume', // 工作简历,
        'certificate_number', // 证号
        'issue_date', // 取证时间
        'annual_audit_date', // 年审时间
        'job_nature',
        'is_on_duty',
      ])
      .getNeedColumns();
      cols.forEach((item: any) => {
        if(item.title) {
          item.title = formatMessage({ id: item.title })

        }
      });
    return cols;
  };

  return (
    <CrudEditModal
      title={'补充证书信息'}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord,
        is_on_duty: selectedRecord?.is_on_duty + '',
        job_nature: selectedRecord.job_nature ? selectedRecord?.job_nature + '' : null,
        apply_major: selectedRecord?.apply_major?.split(','),
      }}
      columns={getFormColumns()}
      onCommit={async (values: any) => {
        const payload = {
          ...selectedRecord,
          ...values,
        };
        /**
         * 创建一个Promise实例
         */
        return new Promise((resolve) => {
          dispatch({
            type: "workLicenseRegister/updateInspector",
            payload,
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("修改成功");
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

export default connect()(InspectorCerateLedgerEdit);
