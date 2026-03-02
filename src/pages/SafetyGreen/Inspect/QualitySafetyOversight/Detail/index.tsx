import React, { ReactNode, useState } from "react";
import { Button, message, Modal, Space, Image } from "antd";
import { connect } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { ErrorCode } from "@/common/const";
import { hasPermission } from "@/utils/authority";

import QualitySafetyInspectionEdit from "../Edit";
import { configColumns } from "../columns";
import { getUrlCrypto } from "@/components/HuaWeiOBSUploadSingleFile";


const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 质量安全监督检查问题清单详情
 * @param props
 * @constructor
 */
const QualitySafetyInspectionDetail: React.FC<any> = (props) => {
  const { open, onClose, authority, selectedRecord, callbackSuccess, dispatch } = props;
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "problem_name",
      "examine_wbs_name",
      "upload_date_str",
      "branch_comp_name",
      "wbs_name",
      "project_name",
      "check_date_str",
      "problem_description",
      {
        title: "compinfo.problem_image_url",
        subTitle: "问题图片1",
        dataIndex: "problem_image_url",
        width: 160,
        align: "center",
        render: (text: ReactNode) => {
          if (text) {
            return (
              <Image
                src={getUrlCrypto(text as string)}
                alt="问题图片1"
                width={80}
                height={80}
                style={{ objectFit: 'cover', cursor: 'pointer' }}
                preview={{
                  mask: '查看大图'
                }}
              />
            )
          }
          return '暂无图片';
        },
      },
      {
        title: "compinfo.problem_image_url2",
        subTitle: "问题图片2",
        dataIndex: "problem_image_url2",
        width: 160,
        align: "center",
        render: (text: ReactNode) => {
          if (text) {
            return (
              <Image
                src={getUrlCrypto(text as string)}
                alt="问题图片2"
                width={80}
                height={80}
                style={{ objectFit: 'cover', cursor: 'pointer' }}
                preview={{
                  mask: '查看大图'
                }}
              />
            )
          }
          return '暂无图片';
        },
      },
      {
        title: "compinfo.problem_image_url3",
        subTitle: "问题图片3",
        dataIndex: "problem_image_url3",
        width: 160,
        align: "center",
        render: (text: ReactNode) => {
          if (text) {
            return (
              <Image
                src={getUrlCrypto(text as string)}
                alt="问题图片3"
                width={80}
                height={80}
                style={{ objectFit: 'cover', cursor: 'pointer' }}
                preview={{
                  mask: '查看大图'
                }}
              />
            )
          }
          return '暂无图片';
        },
      },
      "problem_category_str",
      "question_category_str",
      "quality_factor1",
      "quality_factor2",
      "entity_quality_str",
      "operation_behavior_str",
      "safety_factor1",
      "safety_factor2",
      "responsible_unit_str",
      "violation_unit_str",
      "severity_level_str",
      "system_belong_str",
      "verify_user_name",
      "remark",
      "form_maker_name",
      "form_make_time",
    ])
      .setTableColumnToDatePicker([
        { value: 'upload_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'check_date', valueType: 'dateTs', format: 'YYYY-MM-DD' },
        { value: 'form_make_time', valueType: 'dateTs', format: 'YYYY-MM-DD' },
      ]);
    return cols.getNeedColumns();
  };
  const renderButtonToolbar = () => {
    return [
      <Button style={{ display: hasPermission(authority, '编辑') ? 'inline' : 'none' }} type={"primary"} onClick={() => setEditVisible(true)}>
        编辑
      </Button>,
      <Button style={{ display: hasPermission(authority, '删除') ? 'inline' : 'none' }} danger type={"primary"} onClick={() => setDelVisible(true)}>
        删除
      </Button>,
    ];
  };

  const handleDel = () => {
    dispatch({
      type: "qualitySafetyInspection/deleteQualitySafetyInspection",
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
        rowKey="problem_name"
        title="质量安全监督检查问题清单"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
        {/* <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="关联业务清单" key="1">
            自行追加与设备计费科目相关的业务清单
          </Tabs.TabPane>
        </Tabs> */}
      </CrudQueryDetailDrawer>
      {editVisible && (
        <QualitySafetyInspectionEdit
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

export default connect()(QualitySafetyInspectionDetail);
