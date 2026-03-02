import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import {ErrorCode, HUA_WEI_OBS_CONFIG} from "@/common/const";
import { message } from "antd";
import WangEditor from "@/components/WangEditor";
import HuaWeiOBSUploadSingleFile from "@/components/HuaWeiOBSUploadSingleFile";


const { CrudAddModal } = SingleTable;

/**
 * 新增单据号配置
 * @param props
 * @constructor
 */
const MessageAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (dispatch) {
      // dispatch({
      //   type: '',
      //   payload: {
      //
      //   }
      // })
    }
  }, []);

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'title',
        'message_type',
        'send_range_type',
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
        {
          title: "compinfo.content",
          subTitle: "公告内容",
          dataIndex: "content",
          width: 160,
          align: "center",
          renderSelfForm: form => {
            const onChange= (value: any) => {
              form.setFieldsValue({
                content: value,
              })
            }
            return (
              <WangEditor onChange={onChange}/>
            )
          }
        },
      ])
      .setFormColumnToInputTextArea([{
        value: 'title',
      }])
      .setFormColumnToSelfColSpan([
        {value: 'content', colSpan: 24, labelCol: {
            span: 24
          },
          wrapperCol: {
            span: 24
          }},
      ])
      .setSplitGroupFormColumns([
        {
          title: '标题',
          columns: ['title', 'file_url'],
          order: 0,
        },
        {
          title: '内容',
          columns: ['content'],
          order: 1
        }
      ])
      .needToHide([
        'message_type',
        'send_range_type'
      ])
      .needToRules([
        "title",
        "content",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={"新增系统公告"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        message_type: '1',
        send_range_type: '1'
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "message/sendAnnouncement",
            payload: values,
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

export default connect()(MessageAdd);
