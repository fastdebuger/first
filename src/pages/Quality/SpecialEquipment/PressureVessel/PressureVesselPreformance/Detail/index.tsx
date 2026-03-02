import React, { useEffect, useState } from "react";
import { Button, message, Modal, Space, Tabs } from "antd";
import { connect } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { ErrorCode } from "@/common/const";
import { hasPermission } from "@/utils/authority";

import PressureVesselPreformanceEdit from "../Edit";
import { configColumns } from "../columns";
import { getUrlCrypto } from "@/components/HuaWeiOBSUploadSingleFile";


const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 压力容器制造(组焊、安装改造修理)施工业绩表详情
 * @param props
 * @constructor
 */
const PressureVesselPreformanceDetail: React.FC<any> = (props) => {
  const { open, onClose, authority, selectedRecord, callbackSuccess, dispatch } = props;
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);


  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      'branch_comp_name', // 分公司名称
      'wbs_name', // 项目部名称
      'project_name', // 工程项目名称
      'completion_date_str', // 出厂/竣工日期
      'product_device_no', // 产品编号/设备位号
      'equipment_name', // 设备名称
      'equipment_type', // 设备类别
      'design_pressure', // 设计压力(MPa)
      'design_temperature', // 设计温度(℃)
      'work_medium', // 工作介质
      'equipment_specification', // 设备规格(HDL mm/m³)
      'equipment_material', // 设备材质
      'single_weight', // 设备单体重量(kg)
      'quantity', // 数量
      'user_unit_name', // 使用单位名称
      'inspection_unit_name', // 监检单位名称
      // 'inspection_report_file', // 上传监检报告
      {
        title: 'pressureVesselPreformance.inspection_report_file',
        dataIndex: 'inspection_report_file',
        subTitle: '上传监检报告',
        align: 'center',
        width: 160,
        render: (text: any) => {
          if (text) {
            return (
              <Button
                onClick={() => window.open(getUrlCrypto(text))}
                size='small'
                type='link'
              >下载文件</Button>
            )
          }
          return '-'
        }
      },
    ])
      .noNeedToFilterIcon([
        "RowNumber",
      ])
      .noNeedToSorterIcon([
        "RowNumber",
      ])
      .needToExport([
        "RowNumber",
        'branch_comp_name', // 分公司名称
        'wbs_name', // 项目部名称
        'project_name', // 工程项目名称
        'completion_date_str', // 出厂/竣工日期
        'product_device_no', // 产品编号/设备位号
        'equipment_name', // 设备名称
        'equipment_type', // 设备类别
        'design_pressure', // 设计压力(MPa)
        'design_temperature', // 设计温度(℃)
        'work_medium', // 工作介质
        'equipment_specification', // 设备规格(HDL mm/m³)
        'equipment_material', // 设备材质
        'single_weight', // 设备单体重量(kg)
        'quantity', // 数量
        'user_unit_name', // 使用单位名称
        'inspection_unit_name', // 监检单位名称
        'inspection_report_file', // 上传监检报告
      ])
    return cols.getNeedColumns();
  }



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
      type: "pressureVesselPreformance/delInfo",
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
        title="压力容器制造(组焊、安装改造修理)施工业绩表"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
      </CrudQueryDetailDrawer>
      {editVisible && (
        <PressureVesselPreformanceEdit
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

export default connect()(PressureVesselPreformanceDetail);
