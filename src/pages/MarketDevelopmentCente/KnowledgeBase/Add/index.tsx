import React, { useEffect, useState } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode, HUA_WEI_OBS_CONFIG } from "@/common/const";
import { Button, Form, Input, message } from "antd";
import HuaWeiOBSUploadSingleFile from "@/components/HuaWeiOBSUploadSingleFile";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { CrudAddModal } = SingleTable;

/**
 * 新增知识库文件管理
 * @param props
 * @constructor
 */
const KnowledgeBaseAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
  const { formatMessage } = useIntl();
  const [fileListForm] = Form.useForm();
  // 数据类型配置配置
  const [dataTypeConfig, setDataTypeConfig] = useState([]);
  /**
   * 请求数据类型配置配置
   */
  useEffect(() => {
    dispatch({
      type: 'dataTypeConfig/getInfo',
      payload: {
        sort: 'id',
        order: 'asc'
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          const result = res.rows.map((item: any) => ({ ...item, id: String(item.id) }))
          setDataTypeConfig(result)
        }
      },
    })
  }, [])
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'data_type',
        {
          title: 'knowledgeBase.file_path',
          dataIndex: 'file_list',
          subTitle: '',
          width: 160,
          align: 'center',
          renderSelfForm() {
            return (
              <Form name={'file_list'} form={fileListForm}>
                <Form.List name='list'>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <div
                          key={key}
                          style={{
                            position: 'relative',
                            padding: '16px 40px 8px 16px',
                            borderRadius: '8px',
                            marginBottom: 16,
                            border: '1px solid #d9d9d9'
                          }}
                        >
                          <Form.Item
                            {...restField}
                            label="附件文件"
                            name={[name, 'file_path']}
                            rules={[{ required: true, message: '请上传文件' }]}
                            style={{ marginBottom: 12 }}
                          >
                            <HuaWeiOBSUploadSingleFile
                              accept={".doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.pdf,.PDF,.zip,.rar,.mp4"}
                              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
                              folderPath="/KnowledgeBase"
                              limitSize={100}
                              onChange={(value) => {
                                const currentList = fileListForm.getFieldValue('list') || [];
                                const newList = [...currentList];

                                if (value?.response?.url) {
                                  // 如果名称为空，则自动回填文件名
                                  if (!newList[name]?.file_belong) {
                                    newList[name].file_belong = value.name;
                                  }
                                  newList[name].file_path = value.response.url;
                                } else {
                                  newList[name].file_path = '';
                                }

                                fileListForm.setFieldsValue({ list: newList });
                              }}
                            />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            label="文件名称"
                            name={[name, 'file_belong']}
                            rules={[{ required: true, message: '请输入文件名' }]}
                            style={{ marginBottom: 8 }}
                          >
                            <Input placeholder='请输入文件名' />
                          </Form.Item>

                          <MinusCircleOutlined
                            style={{
                              position: 'absolute',
                              right: 12,
                              top: 12,
                              fontSize: 20,
                              color: '#ff4d4f'
                            }}
                            onClick={() => remove(name)}
                          />
                        </div>
                      ))}

                      <Form.Item>
                        <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
                          添加新的附件
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Form>
            );
          },
        },
        'remark',
      ])
      .setFormColumnToInputTextArea([
        {
          "value": "remark"
        }
      ])
      .setFormColumnToSelect([
        {
          value: 'data_type',
          name: 'data_name',
          valueType: 'select',
          valueAlias: 'id',
          data: dataTypeConfig || []
        },
      ])
      .setFormColumnToSelfColSpan([
        {
          colSpan: 24,
          value: 'file_list',
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
          title: "类型",
          order: 1,
          columns: [
            'data_type',
          ]
        },
        {
          title: "其他",
          order: 2,
          columns: [
            'remark',
          ]
        }
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={"新增知识库文件管理"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{}}
      columns={getFormColumns()}
      onCommit={async (values: any) => {
        // 处理批量文件格式
        const file = await fileListForm.validateFields();
        delete values.file_list;
        Object.assign(values, {
          Items: JSON.stringify(file.list || []),
        });
        return new Promise((resolve) => {
          resolve(true);
          dispatch({
            type: "knowledgeBase/saveInfo",
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

export default connect()(KnowledgeBaseAdd);
