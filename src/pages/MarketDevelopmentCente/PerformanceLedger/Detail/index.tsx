import React, { useState } from "react";
import { Button, message, Modal, Space } from "antd";
import { connect, useIntl } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { ErrorCode, PROP_KEY } from "@/common/const";
import { hasPermission } from "@/utils/authority";

import PerformanceLedgerEdit from "../Edit";
import { configColumns } from "../columns";
import { getUrlCrypto } from "@/components/HuaWeiOBSUploadSingleFile";
import PreViewFile from "../PreViewFile";


const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 公司业绩台账详情
 * @param props
 * @constructor
 */
const PerformanceLedgerDetail: React.FC<any> = (props) => {
  const { open, onClose, authority, selectedRecord, callbackSuccess, dispatch } = props;
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);
  const { formatMessage } = useIntl();
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      'performance_type',
      "performance_detail_name",
      "project_name",
      "construction_unit",
      "branch_company",
      "contract_mode",
      "contract_type",
      "start_date_str",
      "end_date_str",
      "contract_amount",
      "work_scope",
      "contract_year",
      "main_engineering",
      ...[
        "contract_key_pages",
        "handover_report",
      ].map(item => {
        return {
          title: 'PerformanceLedger.' + item,
          dataIndex: item,
          subTitle: formatMessage({ id: 'PerformanceLedger.' + item }),
          align: 'center',
          width: 240,
          render: (text: any) => {
            if (text) {
              const previewUrl = text;
              // 公司级下载
              if (PROP_KEY === "branchComp") {
                return (
                  <Button
                    onClick={() => window.open(getUrlCrypto(text))}
                    size='small'
                    type='link'
                  >下载文件</Button>
                )
              }
              // 项目部和分公司只支持预览
              return (
                <PreViewFile previewUrl={previewUrl} />
              );
            }
            return ''
          }
        }
      }),
    ])
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
      type: "performanceLedger/delInfo",
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
        rowKey="performance_type"
        title="公司业绩台账"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={renderButtonToolbar}
      >
      </CrudQueryDetailDrawer>
      {editVisible && (
        <PerformanceLedgerEdit
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

export default connect()(PerformanceLedgerDetail);
