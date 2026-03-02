import React from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";


const { CrudEditModal } = SingleTable;

/**
 * 编辑特种设备每月质量安全调度会议纪要信息
 * @param props
 * @constructor
 */
const DispatchMeetingEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord, title, special_equip_type } = props;
  const { formatMessage } = useIntl();


  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'meeting_place',
        'meeting_date',
        'meeting_moderator',
        'meeting_recorder',
        'conferee',
        'remark',
        'meeting_content1',
        'meeting_content2',
        'meeting_content3',
        'meeting_content4',
        'meeting_content5',
        'meeting_content6',
      ])
      .needToRules([
        'meeting_place',
        'meeting_date',
        'meeting_moderator',
        'meeting_recorder',
        'conferee',
        // 'remark',
        'meeting_content1',
        'meeting_content2',
        'meeting_content3',
        'meeting_content4',
        'meeting_content5',
        'meeting_content6',
      ])
      .setSplitGroupFormColumns([
        {
          title: '基础信息',
          columns: [
            'meeting_date',
            'meeting_place',
            'meeting_moderator',
            'meeting_recorder'
          ],
          order: 1,
        },
        {
          title: '参会人员',
          columns: ['conferee'],
          order: 2,
        },
        {
          title: '会议内容',
          columns: [
            'meeting_content1',
            'meeting_content2',
            'meeting_content3',
            'meeting_content4',
            'meeting_content5',
            'meeting_content6'
          ],
          order: 3,
        },
        {
          title: '备注信息',
          columns: ['remark'],
          order: 4,
        }
      ])
      .setFormColumnToDatePicker([
        { value: 'meeting_date', valueType: 'dateTs', needValueType: 'timestamp' },
      ])
      .setFormColumnToInputTextArea([
        {
          value: 'meeting_content1',
        },
        {
          value: 'meeting_content2',
        },
        {
          value: 'meeting_content3',
        },
        {
          value: 'meeting_content4',
        },
        {
          value: 'meeting_content5',
        },
        {
          value: 'meeting_content6',
        },
        {
          value: 'remark',
        },
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudEditModal
      title={"编辑" + title}
      visible={visible}
      onCancel={onCancel}
      initialValue={selectedRecord}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "dispatchMeeting/updateInfo",
            payload: {
              ...selectedRecord,
              ...values,
              special_equip_type
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

export default connect()(DispatchMeetingEdit);
