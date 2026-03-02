import React, { useState } from "react";
import { Button, message, Modal, Space } from "antd";
import { connect, useIntl } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { ErrorCode } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';

import Edit from "../Edit";
import { configColumns } from "../columns";

const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 作业许可证登记表详情
 * @param props
 * @constructor
 */
const WorkLicenseRegisterDetail: React.FC<any> = (props) => {
  const { visible, onCancel, selectedRecord, callbackSuccess, dispatch, authority } = props;
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);
  const { formatMessage } = useIntl();

  /**
   * 获取表单列配置的函数
   * @returns 返回表单列的配置数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      'work_permit_code',
      "wbs_name",
      "work_content_name",
      "work_location",
      "contract_name",
      "start_time_str",
      "end_time_str",
      "approver",
      "guardian",
      'recorder',
      "remark",
      {
        title: "contract.file_url",
        subTitle: "附件",
        dataIndex: "url",
        width: 160,
        align: "center",
        render: (text: any, _record: any) => {
          if (text) {
            return (
              <Button
                onClick={() => window.open(getUrlCrypto(text))}
                size='small'
                type='link'
              >{formatMessage({id: 'wrokLicenseRegister.download'})}</Button>
            )
          }
          return '/'
        }
      },
      "create_ts_str",
      "create_user_name",
      "modify_ts_str",
      'modify_user_name'
    ])
    return cols.getNeedColumns();
  }

  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = () => {
    return [
      <Button
        style={{ display: hasPermission(authority, '编辑') ? 'inline' : 'none' }}
        type={"primary"}
        onClick={() => setEditVisible(true)}
      >
        编辑
      </Button>,
      <Button
        style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }}
        danger
        type={"primary"}
        onClick={() => setDelVisible(true)}
      >
        删除
      </Button>,
    ];
  };

  /**
   * 处理详情删除操作
   * @description 该函数用于删除工作许可证记录，通过dispatch触发删除操作
   * 删除成功后显示提示信息并执行回调函数
   */
  const handleDel = () => {
    // 触发删除工作许可证接口
    dispatch({
      type: "workLicenseRegister/deleteWorkPermit",
      payload: {
        id: selectedRecord.id,
      },
      callback: (res: any) => {
        // 检查删除操作是否成功
        if (res.errCode === ErrorCode.ErrOk) {
          message.success("删除成功");
          // 延迟执行关闭和成功回调函数
          setTimeout(() => {
            if (onCancel) onCancel();
            if (callbackSuccess) callbackSuccess();
          }, 1000);
        }
      },
    });
  };

  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="work_permit_code"
        title={formatMessage({ id: 'wrokLicenseRegister' }) + formatMessage({ id: 'base.user.list.detail' })}
        columns={getTableColumns()}
        open={visible}
        onClose={onCancel}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      />
      {editVisible && (
        <Edit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackSuccess={() => {
            setEditVisible(false);
            if (onCancel) onCancel();
            if (callbackSuccess) callbackSuccess();
          }}
        />
      )}
      <Modal
        title="删除数据"
        footer={
          <Space>
            <Button onClick={() => setDelVisible(false)}>我再想想</Button>
            <Button type={"primary"} danger onClick={() => handleDel()}>
              确认删除
            </Button>
          </Space>
        }
        open={delVisible}
        onOk={handleDel}
        onCancel={() => setDelVisible(false)}
      >
        <p>是否删除当前的数据: {selectedRecord["work_permit_code"]}</p>
      </Modal>
    </>
  );
};

export default connect()(WorkLicenseRegisterDetail);
