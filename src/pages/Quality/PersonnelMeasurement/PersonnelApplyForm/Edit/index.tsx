import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode, HUA_WEI_OBS_CONFIG } from "@/common/const";
import { message, Space, Form, Button, Input, } from "antd";
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';
import MultiDynamicForms from "@/components/MultiDynamicForms";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";


const { CrudEditModal } = SingleTable;

/**
 * 编辑计量人员资格申请表
 * @param props
 * @constructor
 */
const PersonnelApplyFormEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
  const { formatMessage } = useIntl();

  /**
   * 表单列配置引用columns文件
   * @returns 返回一个数组
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'name',
        'gender',
        'birth_date',
        'education',
        'employee_no',
        'job_title',
        'graduation_school',
        'major',
        'department',
        'post',
        'train_date',
        'train_grade',
        'phone',
        // 'application_project',
        {
          title: "", // InspectorSeniorityApply.application_project
          dataIndex: "application_project",
          subTitle: "申请操作项目",
          width: 1500,
          align: "center",
          renderSelfForm: (form: any) => {
            return (
              <Form.List name='application_project'>
                {(fields, { add, remove }) => (
                  <div>
                    <Form.Item>
                      {
                        fields.length < 5 && (
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            icon={<PlusOutlined />}
                          >
                            添加申请操作项目
                          </Button>
                        )
                      }
                    </Form.Item>

                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        style={{ display: 'block' }}
                      >
                        <Form.Item
                          {...restField}
                          name={name}
                          label="申请操作项目"
                          rules={[{ required: true, message: '请添加申请操作项目' }]}
                        >
                          <Input
                            placeholder='请添加申请操作项目'
                            style={{ width: '90%' }}
                          />

                        </Form.Item>
                        {fields.length > 1 && (
                          <MinusCircleOutlined
                            onClick={() => remove(name)}
                            style={{ fontSize: '16px', marginLeft: '16px', color: '#ff4d4f' }}
                          />
                        )}
                      </Space>
                    ))}
                  </div>
                )}
              </Form.List>
            )
          }
        },
        {
          title: "", // InspectorSeniorityApply.job_resume
          dataIndex: "job_resume",
          subTitle: "工作简历",
          width: 1500,
          align: "center",
          renderSelfForm: (_form: any) => {
            return (
              <MultiDynamicForms
                name="job_resume"
                required={true}
                // initialValue={initialResume}
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
      .setFormColumnToSelect([
        {value: 'gender', name: 'gender', valueType: 'select', data: []},
      ])
      .setFormColumnToSelect([
        {value: 'gender', name: 'gender', valueType: 'select', data: [
          { gender: '男', label: '男' },
          { gender: '女', label: '女' },
        ]},
      ])
      .setSplitGroupFormColumns([
        {
          title: '申请操作项目',
          columns: ['application_project']
        },
        {
          title: '工作简历',
          columns: ['job_resume']
        },
        {
          title: '附件',
          columns: ['url'],
        }
      ])
      .setFormColumnToSelfColSpan([
        {value: 'job_resume', colSpan: 24},
        { value: 'application_project', colSpan: 20, labelCol: { span: 8 }, wrapperCol: { span: 16 } },

      ])
      .setFormColumnToDatePicker([
        {value: 'birth_date', valueType: 'dateTs', needValueType: 'date'},
        {value: 'train_date', valueType: 'dateTs', needValueType: 'date'},
      ])
      .setFormColumnToInputNumber([
        {value: 'phone', valueType: 'digit', min: 0},
      ])
      .needToRules([
        "name",
        "gender",
        "birth_date",
        "education",
        "employee_no",
        "job_title",
        "graduation_school",
        "major",
        "department",
        "post",
        "train_date",
        "train_grade",
        "phone",
        "application_project",
        "url",
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
      title={"编辑计量人员资格申请表"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord,
        job_resume: selectedRecord.job_resume ? JSON.parse(selectedRecord.job_resume) : [],
        application_project: selectedRecord.application_project ? JSON.parse(selectedRecord.application_project) : []
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "workLicenseRegister/updateMeasurePersonnelApplication",
            payload: {
              ...selectedRecord,
              ...values,
              job_resume: JSON.stringify(values.job_resume),
              application_project: JSON.stringify(values.application_project),

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
