import React, { useState } from "react";
import { Button, message, Modal, Space } from "antd";
import { connect, useIntl } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { ErrorCode } from "@/common/const";
import { hasPermission } from "@/utils/authority";
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
import { getDisplayHierarchy } from "@/utils/utils";

import QualityProjectQualityOverviewEdit from "../Edit";
import { configColumns } from "../columns";


const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 焊工业绩详情
 * @param props
 * @constructor
 */
const MonitoringMeasuringDetail: React.FC<any> = (props) => {
  const { open, onClose, authority, selectedRecord, callbackSuccess, dispatch } = props;
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);
  const { formatMessage } = useIntl();


  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      ...getDisplayHierarchy(),
      'year',
      'month',
      'name',
      'spec_model',
      'factory_no',
      'manufacturer',
      'accuracy_grade',
      'measurement_range',
      'is_disposable',
      'verification_cycle',
      'verification_date',
      'valid_date',
      'verification_result',
      'verification_unit',
      'use_unit',
      'keeper',
      'professional_class',
      'category',
      'status',
      'transfer_to',
      'affiliated_unit',
      'safety_protection',
      "create_ts_str",
      "create_user_name",
      "modify_ts_str",
      'modify_user_name',

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
              >{formatMessage({ id: 'wrokLicenseRegister.download' })}</Button>
            )
          }
          return '/'
        }
      },
    ])
      .setTableColumnToDatePicker([
        { value: 'form_make_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ]);
    return cols.getNeedColumns();
  };
  const renderButtonToolbar = () => {
    return [];
  };

  const handleDel = () => {
    dispatch({
      type: "workLicenseRegister/deleteWelderPerformance",
      payload: {
        id: selectedRecord.id,
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          message.success("删除成功");
          setTimeout(() => {
            if (onClose) onClose();
            if (callbackSuccess) callbackSuccess();
          }, 1000);
        }
      },
    });
  };

  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="id"
        title={'焊工业绩详情'}
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >

      </CrudQueryDetailDrawer>
      {editVisible && (
        <QualityProjectQualityOverviewEdit
          visible={editVisible}
          selectedRecord={selectedRecord}
          onCancel={() => setEditVisible(false)}
          callbackSuccess={() => {
            setEditVisible(false);
            if (onClose) onClose();
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
        <p>是否删除当前的数据: {selectedRecord["id"]}</p>
      </Modal>
    </>
  );
};

export default connect()(MonitoringMeasuringDetail);
