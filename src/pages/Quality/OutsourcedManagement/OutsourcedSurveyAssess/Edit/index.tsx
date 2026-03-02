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
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
  const { formatMessage } = useIntl();
  // 获取省份列表
  const [provinceList, setProvinceList] = useState<any>([]);
  // 获取城市列表
  const [cityList, setCityList] = useState<any>([]);

  const fecthCityList = (provinceCode: string) => {
    dispatch({
      type: 'workLicenseRegister/getAllAreaDict',
      payload: {
        sort: 'id',
        order: 'asc',
        filter: JSON.stringify([
          { Key: 'parent_id', Val: provinceCode, Operator: '=' },
        ]),
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          const newRes = res.rows.map((item: any) => {
            return {
              value: item.id,
              label: item.dict_name
            }
          })
          setCityList(newRes || []);
        }
      },
    });
  };

  useEffect(() => {
    dispatch({
      type: 'workLicenseRegister/getAllAreaDict',
      payload: {
        sort: 'id',
        order: 'asc',
        filter: JSON.stringify([
          { Key: 'level', Val: '2', Operator: '=' },
          { Key: 'parent_id', Val: '10', Operator: '<' },
        ]),
      },
      callback: (res: any) => {
        if (res.rows && res.rows.length > 0) {
          const newRes = res.rows.map((item: any) => {
            return {
              value: item.id,
              label: item.dict_name
            }
          })
          setProvinceList(newRes || []);
        }
      }
    });
    fecthCityList(selectedRecord?.province);

  }, [])


  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'lab_full_name',
        "lab_nature",

        "qualification_scope",
        "business_license_no",
        "lab_responsible_person",
        // "province",
        {
          title: "wrokLicenseRegister.province", //
          subTitle: '省份',
          dataIndex: "province",
          width: 160,
          align: "center",
          // 使用封装好的组件 - 组件内部会处理数据请求
          renderSelfForm: (form: any) => {
            return (
              <Select
                options={provinceList || []}
                placeholder="请选择省份"
                showSearch
                onChange={(value) => {
                  fecthCityList(value);
                  form.setFieldsValue({
                    province: value,
                    city: null
                  });
                }}
                filterOption={(input, opt) => {
                  // @ts-ignore
                  return (opt?.label || '').toLowerCase().includes(input.toLowerCase());
                }}

              />
            )
          }
        },
        {
          title: "wrokLicenseRegister.city",
          subTitle: "地市",
          dataIndex: "city",
          width: 160,
          align: "center",
          renderSelfForm: (form: any) => {
            return <Select
              options={cityList || []}
              placeholder="请选择地市"
              showSearch
              onChange={(value) => {
                form.setFieldsValue({
                  city: value,
                });
              }}
              filterOption={(input, opt) => {
                // @ts-ignore
                return opt.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}

            />;
          },
        },
        "address",
        "lab_phone",
        "geo_traffic",
        "entrusted_projects",
        {
          title: "", // wrokLicenseRegister.application_project
          dataIndex: "qualifications",
          subTitle: "资质证名称及相应有效期",
          width: 160,
          align: "center",
          renderSelfForm: (form: any) => {
            return (
              <Form.List name='qualifications'>
                {(fields, { add, remove }) => (
                  <div>
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        icon={<PlusOutlined />}
                      >
                        资质证名称及有效期
                      </Button>
                    </Form.Item>

                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                      >
                        <Form.Item
                          {...restField}
                          name={[name, 'qualification']}
                          label="资质证名称"
                          rules={[{ required: true, message: '请添加资质证名称' }]}
                        >
                          <Input placeholder='请添加资质证名称' />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'qualification_date']}
                          label="有效期"
                          rules={[{ required: true, message: '请添加有效期' }]}
                          getValueFromEvent={(_date, dateString) => {
                            // 直接返回日期字符串，不返回 moment 对象
                            return dateString;
                          }}
                          getValueProps={(value) => {
                            // 将字符串转换为 moment 对象用于显示
                            return { value: value ? moment(value) : null };
                          }}
                        >
                          <DatePicker
                            placeholder='请选择有效期'
                            format="YYYY-MM-DD"
                          />

                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'qualification_url']}
                          label="资质附件"
                          rules={[{ required: true, message: '请添加附件' }]}
                        >
                          <HuaWeiOBSUploadSingleFile
                            accept=".doc,.docx,.xls,.xlsx,.pdf,.7z,.zip,.rar"
                            sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
                            limitSize={100}
                            folderPath="/Engineering/WorkLicenseRegister"
                            handleRemove={() => {
                              form.setFieldsValue({ qualification_url: null })
                            }}
                            /**
                             * 文件上传变更处理函数
                             * @param file - 上传的文件的信息
                             */
                            onChange={(file: any) => {
                              const allValues = form.getFieldValue('qualifications') || [];

                              // 如果没有当前项，初始化
                              if (!allValues[name]) {
                                allValues[name] = {};
                              }

                              // 更新当前项的附件URL
                              allValues[name] = {
                                ...allValues[name],
                                qualification_url: file?.response?.url
                              };

                              // 设置整个数组
                              form.setFieldsValue({ qualifications: allValues });
                            }}
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
        // {
        //   value: 'gender', name: 'gender', valueType: 'select', data: [
        //     { gender: '男', label: '男' },
        //     { gender: '女', label: '女' },
        //   ]
        // },
      ])
      .setFormColumnToSelfColSpan([
        { value: 'qualifications', colSpan: 24 }
      ])
      .setSplitGroupFormColumns([
        {
          title: '资质',
          columns: ['qualifications'],
        },
        {
          title: '附件',
          columns: ['url'],
        }
      ])
      .setFormColumnToInputNumber([
        { value: 'lab_phone', valueType: 'digit', min: 0 },
      ])
      .needToRules([
        'lab_full_name',
        "lab_nature",
        "qualifications",
        "qualification_scope",
        "business_license_no",
        "lab_responsible_person",
        "province",
        "city",
        "lab_phone",
        "geo_traffic",
        "entrusted_projects",
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
      title={"编辑外委实验室调查评价"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord,
        province: selectedRecord.province ? Number(selectedRecord.province) : '',
        city: selectedRecord.city ? Number(selectedRecord.city) : '',
        qualifications: selectedRecord.qualifications ? JSON.parse(selectedRecord.qualifications) : []

      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "workLicenseRegister/updateExternalLaboratoryEvaluation",
            payload: {
              ...selectedRecord,
              ...values,
              qualifications: JSON.stringify(values.qualifications),

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
